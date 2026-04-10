import { create } from 'zustand';
import { MOCK_THREATS, MOCK_ASSETS, STATS } from '../data/mockData';

export const useStore = create((set, get) => ({
  // Threats
  threats: MOCK_THREATS,
  addThreat: (t) => set(s => ({ threats: [t, ...s.threats] })),
  updateThreat: (id, data) => set(s => ({ threats: s.threats.map(t => t.id === id ? { ...t, ...data } : t) })),
  removeThreat: (id) => set(s => ({ threats: s.threats.filter(t => t.id !== id) })),

  // Assets
  assets: MOCK_ASSETS,
  addAsset: (a) => set(s => ({ assets: [a, ...s.assets] })),

  // Scan state
  isScanning: false,
  scanProgress: 0,
  scanResult: null,
  startScan: () => set({ isScanning: true, scanProgress: 0, scanResult: null }),
  setScanProgress: (p) => set({ scanProgress: p }),
  finishScan: (result) => set({ isScanning: false, scanProgress: 100, scanResult: result }),
  clearScan: () => set({ isScanning: false, scanProgress: 0, scanResult: null }),

  // Stats
  stats: STATS,

  // UI
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  // Live feed
  liveFeedPaused: false,
  toggleLiveFeed: () => set(s => ({ liveFeedPaused: !s.liveFeedPaused })),
}));
