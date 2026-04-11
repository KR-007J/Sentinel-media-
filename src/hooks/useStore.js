import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { seedDatabase } from '../lib/dbSeed';

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

    // 2. Realtime Subscription
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        const currentAssets = get().assets;
        if (eventType === 'INSERT') set({ assets: [newRow, ...currentAssets] });
        if (eventType === 'DELETE') set({ assets: currentAssets.filter(a => a.id !== oldRow.id) });
      })
      .subscribe();
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

  // ASSET ACTIONS
  addAsset: async (a) => {
    const { data, error } = await supabase.from('assets').insert([a]).select();
    return handleResponse(data, error);
  },

  // LOGGING
  addLog: async (log) => {
    await supabase.from('system_logs').insert([log]);
  },

  // AUTHENTICATION (Simulated with persistence potential)
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
