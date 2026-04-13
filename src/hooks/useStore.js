import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { seedDatabase } from '../lib/dbSeed';
import { MOCK_THREATS } from '../data/mockData';
import { AttackSimulator } from '../services/simulator';

// Helper to handle Supabase responses
const handleResponse = (data, error) => {
  if (error) {
    console.error('Supabase Error:', error.message);
    return null;
  }
  return data;
};

export const useStore = create((set, get) => ({
  // PERSISTENT DATA
  threats: [],
  assets: [],
  systemLogs: [],
  
  // LIMITS
  MAX_LOGS: 50,
  MAX_THREATS: 20,

  // CYBERSECURITY STATE
  globalRiskScore: 12,
  isSimulationActive: false,
  activeSimulationProfile: null,
  simulator: null,

  // UI STATE
  activeDefenses: [],
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('sentinel_auth'),
  user: JSON.parse(localStorage.getItem('sentinel_user') || 'null'),
  role: localStorage.getItem('sentinel_role') || 'VIEWER', // 'ADMIN' | 'ANALYST' | 'VIEWER'
  isScanning: false,
  scanProgress: 0,
  scanResult: null,
  sidebarOpen: true,
  isRoleTransitioning: false,
  
  // ENTERPRISE EXTENSIONS
  isLockdownActive: false,
  sessionInfo: {
    authMethod: 'OIDC/Google',
    sessionRisk: 'LOW',
    deviceTrust: 'VERIFIED',
    location: 'US-EAST-1 (SECURE)'
  },
  activeOperators: [
    { id: 1, name: 'Operative_Delta', role: 'ANALYST', status: 'ACTIVE', lastAction: 'NEURAL_LINK_ESTABLISHED' },
    { id: 2, name: 'Operative_Sigma', role: 'VIEWER', status: 'MONITORING', lastAction: 'AUDITING_LOGS' }
  ],

  // RBAC HELPER
  checkPermission: (action) => {
    const { role } = get();
    const permissions = {
      'RESOLVE_THREAT': ['ADMIN'],
      'APPLY_DEFENSE': ['ADMIN'],
      'MANAGE_SIMULATION': ['ADMIN'],
      'RUN_SCAN': ['ADMIN', 'ANALYST'],
      'VIEW_DASHBOARD': ['ADMIN', 'ANALYST', 'VIEWER']
    };
    return permissions[action]?.includes(role) || false;
  },

  // GLOBAL STATUS
  systemStatus: 'SECURE', // 'SECURE' | 'UNDER_ATTACK' | 'CRITICAL'
  isBooting: false,
  bootProgress: 0,

  // STATS
  stats: {
    totalIntercepts: 0,
    activeNodes: 1492,
    accuracy: 99.8,
    regions: 184
  },

  // PERSONALIZATION
  protectedSystem: "Sentinel Core Network",
  setProtectedSystem: (name) => set({ protectedSystem: name }),

  // HELPERS
  addLog: (message, type = 'neutral') => set(state => ({
    systemLogs: [{
      id: Date.now() + Math.random(),
      message: `[${state.role}] ${message}`,
      timestamp: new Date().toISOString(),
      type
    }, ...state.systemLogs].slice(0, state.MAX_LOGS)
  })),

  addThreat: (threat) => set(state => {
    // Check if any active defense would have blocked this
    const { activeDefenses } = state;
    const type = (threat.type || "").toUpperCase();
    const desc = (threat.description || "").toUpperCase();

    const isBlocked = activeDefenses.some(d => {
      if (d === 'FIREWALL' && (type.includes('SQL') || type.includes('XSS'))) return true;
      if (d === '2FA' && (type.includes('BRUTE FORCE') || type.includes('LOGIN'))) return true;
      if (d === 'BLOCK_IP' && (type.includes('VPN') || type.includes('GEO') || desc.includes('IP'))) return true;
      if (d === 'RATE_LIMIT' && (type.includes('BOT') || type.includes('SCRAPING'))) return true;
      return false;
    });

    if (isBlocked) {
      const srcIP = `${10+Math.floor(Math.random()*240)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
      state.addLog(`[WAF] BLOCKED ${threat.type} | src:${srcIP} → tgt:/api/v1/auth | defense:${activeDefenses.find(d => true)} | status:DROPPED`, 'success');
      return { stats: { ...state.stats, totalIntercepts: state.stats.totalIntercepts + 1 } };
    }

    const updatedThreats = [threat, ...state.threats].slice(0, state.MAX_THREATS);
    
    // Recalculate System Status
    let newStatus = 'SECURE';
    if (updatedThreats.length > 5 || state.globalRiskScore > 60) newStatus = 'CRITICAL';
    else if (updatedThreats.length > 0 || state.isSimulationActive) newStatus = 'UNDER_ATTACK';

    return {
      threats: updatedThreats,
      systemStatus: newStatus,
      stats: { ...state.stats, totalIntercepts: state.stats.totalIntercepts + 1 }
    };
  }),

  // DEFENSE ACTIONS
  applyDefense: (actionType) => {
    if (!get().checkPermission('APPLY_DEFENSE')) {
      get().addLog(`[RBAC] DENY modifyDefense() | operator:${get().user?.name || 'UNKNOWN'} | role:${get().role} | required:ADMIN`, 'alert');
      return;
    }

    const { threats, globalRiskScore, addLog, activeDefenses } = get();
    
    if (activeDefenses.includes(actionType)) {
      set({ activeDefenses: activeDefenses.filter(d => d !== actionType) });
      addLog(`[DEFENSE] DISENGAGE ${actionType} | operator:${get().user?.name || 'SYS'} | scope:GLOBAL | status:INACTIVE`, 'neutral');
      return;
    }

    let newThreats = [...threats];
    let scoreReduction = 10;
    let defenseMsg = "";
    
    switch(actionType) {
      case 'FIREWALL':
        newThreats = newThreats.filter(t => {
          const type = (t.type || t.platform || "").toUpperCase();
          return !type.includes('SQL') && !type.includes('XSS');
        });
        scoreReduction = 25;
        defenseMsg = "FIREWALL engaged | filtering:SQLi,XSS | target:/api/* | mode:STRICT";
        break;
      case '2FA':
        newThreats = newThreats.filter(t => {
          const type = (t.type || t.platform || "").toUpperCase();
          return !type.includes('BRUTE FORCE') && !type.includes('LOGIN');
        });
        scoreReduction = 20;
        defenseMsg = "2FA enforced | scope:all-endpoints | auth:TOTP+SMS | brute-force:BLOCKED";
        break;
      case 'BLOCK_IP':
        newThreats = newThreats.filter(t => {
          const type = (t.type || t.platform || "").toUpperCase();
          const desc = (t.description || t.reason || "").toUpperCase();
          return !type.includes('VPN') && !type.includes('GEO') && !desc.includes('IP');
        });
        scoreReduction = 15;
        defenseMsg = "IP_BLOCK active | blacklist:TOR,VPN,PROXY | geo-fence:ENABLED | ASN:filtered";
        break;
      case 'RATE_LIMIT':
        newThreats = newThreats.filter(t => {
          const type = (t.type || t.platform || "").toUpperCase();
          return !type.includes('BOT') && !type.includes('SCRAPING');
        });
        scoreReduction = 30;
        defenseMsg = "RATE_LIMIT active | threshold:100req/min | bots:DROPPED | captcha:ENABLED";
        break;
      default:
        break;
    }

    const isSecure = newThreats.length === 0;
    addLog(`[DEFENSE] ENGAGE | ${defenseMsg}`, 'success');
    
    set({ 
      activeDefenses: [...activeDefenses, actionType],
      threats: newThreats, 
      globalRiskScore: isSecure ? 5 : Math.max(5, globalRiskScore - scoreReduction),
      isSimulationActive: !isSecure && get().isSimulationActive
    });
  },

  // INTERNAL STATE
  _initialized: false,

  // ACTIONS
  initialize: async () => {
    const { addLog, MAX_LOGS, MAX_THREATS, _initialized } = get();
    if (_initialized) return;

    try {
      set({ loading: true, error: null, _initialized: true });
      
      // 1. Authenticate (Check internal storage first)
      const storedUser = localStorage.getItem('sentinel_user');
      if (storedUser) {
        set({ user: JSON.parse(storedUser), isAuthenticated: true });
      }

      // 2. Database Sync
      try {
        const { data: threats, error: tErr } = await supabase
          .from('threats')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(MAX_THREATS);
        
        if (tErr) throw tErr;

        if (!threats || threats.length === 0) {
          await seedDatabase();
          const { data: seededThreats } = await supabase
            .from('threats')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(MAX_THREATS);
          if (seededThreats) set({ threats: seededThreats });
        } else {
          set({ threats });
        }
      } catch (dbError) {
        console.error('Initial DB Sync Failed:', dbError);
        set({ threats: MOCK_THREATS.slice(0, MAX_THREATS) });
      }

      // 3. Setup Simulator
      const simulator = new AttackSimulator((event) => {
        const { addThreat, addLog } = get();
        const randPort = [443, 8080, 3306, 5432, 22, 80][Math.floor(Math.random()*6)];
        const srcIP = `${10+Math.floor(Math.random()*240)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        
        switch(event.type) {
          case 'SIM_START':
            addLog(`[SIM] INIT | profile:${event.message.split(':')[1]?.trim() || 'UNKNOWN'} | mode:ADVERSARIAL | src:${srcIP}`, 'neutral');
            break;
          case 'STATUS_UPDATE':
            addLog(`[IDS] SCAN | ${event.message} | port:${randPort} | proto:TCP`, 'neutral');
            break;
          case 'ANOMALY_DETECTED':
            addLog(`[IDS] ALERT | ${event.message} | src:${srcIP}:${randPort} | confidence:HIGH`, 'suspicious');
            set(state => ({ globalRiskScore: Math.min(100, state.globalRiskScore + 5) }));
            break;
          case 'THREAT_DETECTED': {
            const flags = (event.threat.flags || []).join(',');
            addThreat(event.threat);
            addLog(`[SIEM] CRITICAL | type:${event.threat.type} | src:${srcIP} → tgt:0.0.0.0:${randPort} | flags:[${flags}] | risk:${event.threat.risk_score}%`, 'alert');
            set(state => ({ 
              globalRiskScore: Math.min(100, state.globalRiskScore + (event.threat.risk_score || 10) / 2)
            }));
            break;
          }
          case 'SIM_STOP':
            addLog(`[SIM] TERMINATE | all vectors neutralized | system:BASELINE | risk:NOMINAL`, 'success');
            set({ isSimulationActive: false, activeSimulationProfile: null });
            break;
        }
      });
      set({ simulator });

      // 4. Real-time Subscription (Ensure unique channel and correct sequence)
      const channelId = `sentinel-realtime-${Math.random().toString(36).substr(2, 9)}`;
      const channel = supabase
        .channel(channelId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'threats' }, (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          const currentThreats = get().threats;

          if (eventType === 'INSERT') {
            get().addThreat(newRow);
            addLog(`[FEED] INGEST | type:${newRow.type || 'Anomaly'} | src:supabase-realtime | severity:${newRow.severity || 'UNKNOWN'} | status:ACTIVE`, 'neutral');
          } else if (eventType === 'UPDATE') {
            set({ threats: currentThreats.map(t => t.id === newRow.id ? newRow : t).slice(0, MAX_THREATS) });
          } else if (eventType === 'DELETE') {
            set({ 
              threats: currentThreats.filter(t => t.id !== oldRow.id), 
              stats: { ...get().stats, totalIntercepts: Math.max(0, get().stats.totalIntercepts - 1) } 
            });
          }
        });

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to threats realtime channel');
        }
      });

      set({ loading: false });
      
      // Store channel for cleanup
      set({ realtimeChannel: channel });

    } catch (globalError) {
      console.error('Initialization Failed:', globalError);
      set({ loading: false, error: globalError.message });
    }
  },

  cleanup: () => {
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      set({ realtimeChannel: null, _initialized: false });
    }
  },

  resolveThreat: (threatId) => {
    if (!get().checkPermission('RESOLVE_THREAT')) {
      get().addLog(`[RBAC] DENY resolveThreat() | operator:${get().user?.name || 'UNKNOWN'} | role:${get().role} | required:ADMIN`, 'alert');
      return;
    }

    const { threats, globalRiskScore, isSimulationActive, addLog, MAX_THREATS } = get();
    const threat = threats.find(t => t.id === threatId);
    if (!threat) return;

    addLog(`[SOAR] RESOLVE | type:${threat.type} | hash:${threatId.slice(0,8)} | operator:${get().user?.name || 'SYS'} | method:MANUAL | status:NEUTRALIZED`, 'success');
    const newThreats = threats.filter(t => t.id !== threatId);
    
    // Recalculate System Status and Score
    const newScore = Math.max(0, globalRiskScore - (threat.risk_score || 10) / 2);
    
    let newStatus = 'SECURE';
    if (newThreats.length > 5 || newScore > 60) newStatus = 'CRITICAL';
    else if (newThreats.length > 0 || isSimulationActive) newStatus = 'UNDER_ATTACK';

    set({ 
      threats: newThreats.slice(0, MAX_THREATS),
      globalRiskScore: newScore,
      systemStatus: newStatus
    });
  },

  triggerSimulation: (profileKey) => {
    if (!get().checkPermission('MANAGE_SIMULATION')) {
      get().addLog(`[RBAC] DENY triggerSimulation(${profileKey}) | operator:${get().user?.name || 'UNKNOWN'} | role:${get().role} | required:ADMIN`, 'alert');
      return;
    }

    const { simulator } = get();
    if (simulator) {
      set({ isSimulationActive: true, activeSimulationProfile: profileKey });
      simulator.start(profileKey);
    }
  },

  stopSimulation: () => {
    if (!get().checkPermission('MANAGE_SIMULATION')) return;

    const { simulator } = get();
    if (simulator) {
      simulator.stop();
      set({ isSimulationActive: false, activeSimulationProfile: null });
    }
  },

  login: (userData) => {
    set({ isBooting: true, bootProgress: 0 });
    
    // Determine Role based on email
    let role = 'VIEWER';
    const email = (userData.email || '').toLowerCase();
    if (email.includes('admin') || email === 'krishnakant785@gmail.com') role = 'ADMIN';
    else if (email.includes('analyst') || email.includes('security')) role = 'ANALYST';

    // Simulate boot sequence
    const interval = setInterval(() => {
      set(s => {
        if (s.bootProgress >= 100) {
          clearInterval(interval);
          localStorage.setItem('sentinel_auth', 'true');
          localStorage.setItem('sentinel_user', JSON.stringify(userData));
          localStorage.setItem('sentinel_role', role);
          return { isBooting: false, isAuthenticated: true, user: userData, role };
        }
        return { bootProgress: s.bootProgress + 5 };
      });
    }, 50);
  },
  
  logout: () => {
    localStorage.removeItem('sentinel_auth');
    localStorage.removeItem('sentinel_user');
    localStorage.removeItem('sentinel_role');
    set({ isAuthenticated: false, user: null, role: 'VIEWER' });
  },

  setRole: (rawRole) => {
    const currentRole = get().role;
    let newRole = rawRole;
    
    if (!['ADMIN', 'ANALYST', 'VIEWER'].includes(newRole)) {
      newRole = 'VIEWER';
      get().addLog('[ACCESS CONTROL] ⚠ Invalid role detected → defaulting to VIEWER', 'alert');
    }

    if (currentRole === newRole || get().isRoleTransitioning) return;
    
    set({ isRoleTransitioning: true, roleTransitionTarget: newRole });
    get().addLog('[ACCESS CONTROL ENGINE] → Validating Operator Credentials...', 'neutral');

    setTimeout(() => {
      get().addLog('[ACCESS CONTROL ENGINE] → Synchronizing Permission Matrix...', 'neutral');
    }, 200);

    setTimeout(() => {
      const oldScore = get().globalRiskScore;
      localStorage.setItem('sentinel_role', newRole);
      set({ role: newRole, isRoleTransitioning: false, roleTransitionTarget: null });
      // Risk score flicker on role change
      set({ globalRiskScore: Math.min(100, oldScore + 15) });
      setTimeout(() => set({ globalRiskScore: oldScore }), 1200);
      const action = newRole === 'ADMIN' ? 'Privilege Escalation Granted' : newRole === 'ANALYST' ? 'Standard Access Configured' : 'Read-Only Access Applied';
      get().addLog(`[ACCESS CONTROL ENGINE] → ${action}: ${newRole}`, 'alert');
      if (newRole === 'ADMIN') {
        get().addLog('[SYSTEM] ⚠ Elevated privileges may impact system stability', 'alert');
      }
    }, 700);
  },

  startScan: () => {
    if (!get().checkPermission('RUN_SCAN')) {
      get().addLog(`[RBAC] DENY startScan() | operator:${get().user?.name || 'UNKNOWN'} | role:${get().role} | required:ADMIN|ANALYST`, 'alert');
      return;
    }
    set({ isScanning: true, scanProgress: 0, scanResult: null });
  },
  setScanProgress: (p) => set({ scanProgress: p }),
  finishScan: (result) => set({ isScanning: false, scanProgress: 100, scanResult: result }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  // ENTERPRISE ACTIONS
  toggleLockdown: () => {
    if (!get().checkPermission('APPLY_DEFENSE')) return;
    const newState = !get().isLockdownActive;
    set({ isLockdownActive: newState });

    if (newState) {
      get().addLog('[LOCKDOWN] → Initiating System Lockdown...', 'alert');
      setTimeout(() => get().addLog('[LOCKDOWN] → Terminating active threat vectors...', 'alert'), 300);
      setTimeout(() => get().addLog('[LOCKDOWN] → Securing network perimeter...', 'alert'), 600);
      setTimeout(() => {
        set({ systemStatus: 'CRITICAL', globalRiskScore: Math.max(80, get().globalRiskScore) });
        get().addLog('[LOCKDOWN] → System Status: LOCKED — All external access denied', 'alert');
      }, 900);
    } else {
      get().addLog('[LOCKDOWN] → Releasing system lockdown...', 'success');
      setTimeout(() => {
        set({ systemStatus: 'SECURE', globalRiskScore: 10 });
        get().addLog('[LOCKDOWN] → Perimeter restored. Status: SECURE', 'success');
      }, 400);
    }
  },

  updateSessionRisk: (risk) => set({ sessionInfo: { ...get().sessionInfo, sessionRisk: risk.toUpperCase() } }),
  
  simulateOperatorActivity: () => {
    const operators = get().activeOperators;
    const opIdx = Math.floor(Math.random() * operators.length);
    const randomOp = operators[opIdx];
    const endpoints = ['/api/v1/auth', '/api/v1/users', '/api/v2/threats', '/admin/config', '/api/v1/logs', '/health'];
    const srcIPs = ['10.0.12.44', '172.16.8.101', '192.168.1.55', '10.0.3.200'];
    const activities = [
      { action: 'GET /api/v1/logs?severity=CRITICAL', label: 'AUDIT_LOG_REVIEW' },
      { action: `POST /api/v2/threats/verify | src:${srcIPs[Math.floor(Math.random()*4)]}`, label: 'THREAT_VERIFICATION' },
      { action: `PATCH ${endpoints[Math.floor(Math.random()*6)]} | scope:firewall-rules`, label: 'RULE_UPDATE' },
      { action: `GET /api/v1/telemetry | range:15m | node:us-east-1`, label: 'TELEMETRY_PULL' },
      { action: `PUT /admin/config | key:rate_limit | val:150req/m`, label: 'CONFIG_CHANGE' },
      { action: `DELETE /api/v1/sessions?expired=true | count:12`, label: 'SESSION_CLEANUP' }
    ];
    const chosen = activities[Math.floor(Math.random() * activities.length)];
    
    const newOperators = [...operators];
    newOperators[opIdx] = { ...randomOp, lastAction: chosen.label };
    
    set({ activeOperators: newOperators });
    get().addLog(`[OP:${randomOp.name}] ${chosen.action} | status:200`, 'neutral');
  }
}));
