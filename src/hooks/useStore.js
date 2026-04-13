import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { seedDatabase } from '../lib/dbSeed';
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
  
  // CYBERSECURITY STATE
  globalRiskScore: 12,
  isSimulationActive: false,
  activeSimulationProfile: null,
  simulator: null,

  // UI STATE
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('sentinel_auth'),
  user: JSON.parse(localStorage.getItem('sentinel_user') || 'null'),
  isScanning: false,
  scanProgress: 0,
  scanResult: null,
  sidebarOpen: true,
  userRole: 'senior',

  // STATS
  stats: {
    totalIntercepts: 0,
    activeNodes: 1492,
    accuracy: 99.8,
    regions: 184
  },

  // ACTIONS
  initialize: async () => {
    try {
      set({ loading: true, error: null });
      
      // 1. Authenticate (Handle session failure gracefully)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          set({ user, isAuthenticated: true });
        }
      } catch (e) {
        console.warn('Auth check failed - continuing in restricted mode');
      }

      // 2. Database Sync
      try {
        const { data: threats, error: tErr } = await supabase
          .from('threats')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (tErr) throw tErr;

        if (!threats || threats.length === 0) {
          await seedDatabase();
          const { data: seededThreats } = await supabase
            .from('threats')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
          if (seededThreats) set({ threats: seededThreats });
        } else {
          set({ threats });
        }
      } catch (dbError) {
        console.error('Supabase Sync Error:', dbError);
        const { MOCK_THREATS } = await import('../data/mockData');
        set({ threats: MOCK_THREATS });
      }

      // 3. Setup Simulator
      const simulator = new AttackSimulator((event) => {
        if (event.type === 'THREAT_DETECTED') {
          const currentThreats = get().threats;
          set({ 
            threats: [event.threat, ...currentThreats],
            globalRiskScore: Math.min(100, get().globalRiskScore + (event.threat.risk_score || 5) / 2)
          });
        }
        if (event.type === 'SIM_STOP') {
          set({ isSimulationActive: false, activeSimulationProfile: null });
        }
      });
      set({ simulator });

      // 4. Real-time Subscription
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'threats' }, (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          const currentThreats = get().threats;

          if (eventType === 'INSERT') {
            set({ 
              threats: [newRow, ...currentThreats], 
              stats: { ...get().stats, totalIntercepts: currentThreats.length + 1 } 
            });
          } else if (eventType === 'UPDATE') {
            set({ threats: currentThreats.map(t => t.id === newRow.id ? newRow : t) });
          } else if (eventType === 'DELETE') {
            set({ 
              threats: currentThreats.filter(t => t.id !== oldRow.id), 
              stats: { ...get().stats, totalIntercepts: Math.max(0, currentThreats.length - 1) } 
            });
          }
        })
        .subscribe();

      set({ loading: false });
      return () => supabase.removeChannel(channel);
    } catch (globalError) {
      console.error('Fatal initialization error:', globalError);
      set({ loading: false, error: globalError.message });
    }
  },

  triggerSimulation: (profileKey) => {
    const { simulator } = get();
    if (simulator) {
      set({ isSimulationActive: true, activeSimulationProfile: profileKey });
      simulator.start(profileKey);
    }
  },

  stopSimulation: () => {
    const { simulator } = get();
    if (simulator) {
      simulator.stop();
      set({ isSimulationActive: false, activeSimulationProfile: null });
    }
  },

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

  startScan: () => set({ isScanning: true, scanProgress: 0, scanResult: null }),
  setScanProgress: (p) => set({ scanProgress: p }),
  finishScan: (result) => set({ isScanning: false, scanProgress: 100, scanResult: result }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  toggleRole: () => set(s => ({ userRole: s.userRole === 'senior' ? 'senior' : 'junior' })),
}));
