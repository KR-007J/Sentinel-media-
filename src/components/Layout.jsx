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

  return (
    <div className="flex h-screen bg-[#202124] overflow-hidden text-white font-body selection:bg-[#1a73e8]/30">
      {/* 3D Animated Background - Static layer behind */}
      <ThreeBackground />
      
      {/* Subtle institutional overlay - ensures high-fidelity text contrast */}
      <div className="fixed inset-0 bg-[#202124]/40 backdrop-blur-[2px] pointer-events-none z-[1]" />

      {/* Main Container - Using Flex row instead of fixed sidebar for perfect interactivity */}
      <div className="flex flex-1 w-full relative z-[10]">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 h-full relative">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-[20]">
             <div className="max-w-[1600px] mx-auto w-full">
                <Outlet />
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}
