import React from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ThreeBackground from './ThreeBackground';
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const sidebarOpen = useStore(s => s.sidebarOpen);
  const location = useLocation();
  const element = useOutlet();

  return (
    <div className="flex h-screen bg-[#0a0c18] overflow-hidden text-aurora-text">
      {/* 3D Animated Background */}
      <ThreeBackground />
      
      {/* Subtle overlay to ensure readability */}
      <div className="fixed inset-0 bg-gradient-to-tr from-[#0a0c18] via-transparent to-[#0a0c18]/20 pointer-events-none z-[1]" />

      <Sidebar />

      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-500 ease-in-out relative z-10"
        style={{ marginLeft: sidebarOpen ? '240px' : '72px' }}
      >
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
