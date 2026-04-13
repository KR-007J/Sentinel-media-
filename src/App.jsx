import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import ThreatMap from './pages/ThreatMap';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { useStore } from './hooks/useStore';

export default function App() {
  const { isAuthenticated, initialize, loading, error } = useStore();

  useEffect(() => {
    const unsub = initialize();
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin" />
          <div className="absolute inset-4 rounded-full border-4 border-purple-500/10 border-b-purple-500 animate-spin-reverse" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-white font-black uppercase tracking-[0.4em] text-xs font-tech animate-pulse">Initializing Sentinel Zero</h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold font-tech">Synchronizing Global Defense Nodes</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-red-500 font-bold text-xl">System Error</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      
      {/* Internal Protected Routes - Wrapped in Layout */}
      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard"  element={<Dashboard key="dashboard" />} />
        <Route path="/scanner"    element={<Scanner key="scanner" />} />
        <Route path="/threat-map" element={<ThreatMap key="threatmap" />} />
        <Route path="/analytics"  element={<Analytics key="analytics" />} />
        <Route path="/reports"    element={<Reports key="reports" />} />
        <Route path="/settings"   element={<Settings key="settings" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
