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
  const { isAuthenticated, initialize } = useStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

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
