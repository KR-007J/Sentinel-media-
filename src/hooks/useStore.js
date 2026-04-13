import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { seedDatabase } from '../lib/dbSeed';
import { generateLiveThreat } from '../services/gemini';
import { AttackSimulator } from '../services/simulator';
import { SentinelEngine } from '../services/sentinelEngine';

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
  
  // CYBERSECURITY STATE
  globalRiskScore: 12,
  isSimulationActive: false,
  activeSimulationProfile: null,
  simulator: null,

  // STATS (Calculated or cached)
  stats: {
    totalIntercepts: 0,
    activeNodes: 1492,
    accuracy: 99.8,
    regions: 184
  },

  // INITIALIZATION & SYNC
  initialize: async () => {
    // 0. Seed if empty
    await seedDatabase();

    // 1. Initial Fetch
    const { data: threats } = await supabase.from('threats').select('*').order('created_at', { ascending: false });
    const { data: assets } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
    
    set({ 
      threats: threats || [], 
      assets: assets || [],
      stats: {
        ...get().stats,
        totalIntercepts: threats?.length || 0
      }
    });

    // 2. Initialize Simulator
    const simulator = new AttackSimulator((event) => {
      if (event.type === 'THREAT_DETECTED') {
        set(state => ({
          threats: [event.threat, ...state.threats],
          globalRiskScore: Math.min(100, state.globalRiskScore + (event.threat.risk_score / 2))
        }));
        // Push to DB for persistence if needed, but for proto, local state is faster for UI response
        supabase.from('threats').insert([event.threat]).then();
      }
      if (event.type === 'SIM_STOP') {
        set({ isSimulationActive: false, activeSimulationProfile: null });
        // Gradually Cool down risk
        const cooldown = setInterval(() => {
          const currentRisk = get().globalRiskScore;
          if (currentRisk <= 12) {
            clearInterval(cooldown);
            set({ globalRiskScore: 12 });
          } else {
            set({ globalRiskScore: currentRisk - 2 });
          }
        }, 1000);
      }
    });
    set({ simulator });

    // 3. Realtime Subscription
    supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'threats' }, (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        const currentThreats = get().threats;

        if (eventType === 'INSERT') {
          set({ threats: [newRow, ...currentThreats], stats: { ...get().stats, totalIntercepts: currentThreats.length + 1 } });
        } else if (eventType === 'UPDATE') {
          set({ threats: currentThreats.map(t => t.id === newRow.id ? newRow : t) });
        } else if (eventType === 'DELETE') {
          set({ threats: currentThreats.filter(t => t.id !== oldRow.id), stats: { ...get().stats, totalIntercepts: Math.max(0, currentThreats.length - 1) } });
        }
      })
      .subscribe();
  },

  // SIMULATION ACTIONS
  triggerSimulation: (profileKey) => {
    const { simulator } = get();
    if (simulator) {
      set({ isSimulationActive: true, activeSimulationProfile: profileKey });
      simulator.start(profileKey);
    }
  },

  stopSimulation: () => {
    const { simulator } = get();
    if (simulator) simulator.stop();
  },

  // THREAT ACTIONS
  addThreat: async (t) => {
    const { data, error } = await supabase.from('threats').insert([t]).select();
    return handleResponse(data, error);
  },
  
  updateThreat: async (id, updates) => {
    const { data, error } = await supabase.from('threats').update(updates).eq('id', id).select();
    return handleResponse(data, error);
  },
  
  removeThreat: async (id) => {
    const { error } = await supabase.from('threats').delete().eq('id', id);
    if (error) console.error(error.message);
  },

  // LOGGING
  addLog: async (log) => {
    await supabase.from('system_logs').insert([log]);
  },

  // AUTHENTICATION
  isAuthenticated: !!localStorage.getItem('sentinel_auth'),
  user: JSON.parse(localStorage.getItem('sentinel_user') || 'null'),
  
  login: (userData) => {
    localStorage.setItem('sentinel_auth', 'true');
    localStorage.setItem('sentinel_user', JSON.stringify(userData));
    set({ isAuthenticated: true, user: userData });
  },
  
  logout: () => {
    localStorage.removeItem('sentinel_auth');
    localStorage.removeItem('sentinel_user');
    set({ isAuthenticated: false, user: null });
  },

  // SESSIONAL UI STATE
  isScanning: false,
  scanProgress: 0,
  scanResult: null,
  sidebarOpen: true,
  userRole: 'senior',

  startScan: () => set({ isScanning: true, scanProgress: 0, scanResult: null }),
  setScanProgress: (p) => set({ scanProgress: p }),
  finishScan: (result) => set({ isScanning: false, scanProgress: 100, scanResult: result }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  toggleRole: () => set(s => ({ userRole: s.userRole === 'senior' ? 'junior' : 'senior' })),
}));

