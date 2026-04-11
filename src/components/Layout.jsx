import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ThreeBackground from './ThreeBackground';
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const sidebarOpen = useStore(s => s.sidebarOpen);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-black overflow-hidden text-white font-tech selection:bg-primary/30">
      {/* Live wallpaper background layer */}
      <div className="live-wallpaper" />
      
      {/* 3D Particle Layer */}
      <ThreeBackground />

      {/* Holographic scanning overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-20">
        <div className="w-full h-[2px] bg-primary/20 absolute top-0 left-0 animate-[scan_8s_linear_infinite]" />
      </div>

      <div className="flex flex-1 w-full relative z-[10]">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 h-full relative">
          <TopBar />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative z-[20]">
            <div className="max-w-[1600px] mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Internal CSS for scanning animation only if not in index.css */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: -10% }
          100% { top: 110% }
        }
      `}} />
    </div>
  );
}
