import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ScanLine, Globe, BarChart3,
  FileText, Settings, ChevronLeft, Shield, LogOut
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import clsx from 'clsx';


const NAV = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',   badge: null },
  { to: '/scanner',     icon: ScanLine,         label: 'Scanner',     badge: 'AI' },
  { to: '/threat-map',  icon: Globe,            label: 'Threat Map',  badge: null },
  { to: '/analytics',   icon: BarChart3,        label: 'Analytics',   badge: null },
  { to: '/reports',     icon: FileText,         label: 'Reports',     badge: null },
  { to: '/settings',    icon: Settings,         label: 'Settings',    badge: null },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, threats, logout } = useStore();
  const highThreats = threats.filter(t => t.risk === 'high').length;

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 260 : 80 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col flex-shrink-0 bg-black/40 backdrop-blur-2xl border-r border-white/10 relative z-[50]"
    >
      {/* HUD Header */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
          <Shield size={20} className="text-cyan-400" />
          {highThreats > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-black text-white border-2 border-black px-1">
              {highThreats}
            </span>
          )}
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="overflow-hidden">
              <h2 className="font-black text-white text-lg tracking-wider leading-none font-tech uppercase italic">SENTINEL<span className="text-cyan-500">ZERO</span></h2>
              <p className="text-[8px] font-black text-cyan-500 mt-1 uppercase tracking-[0.2em] italic">Tactical OS v3.0</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Registry Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {NAV.map(({ to, icon: Icon, label, badge }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({ isActive }) => clsx(
              'flex items-center gap-4 px-4 py-3.5 rounded-sm transition-all duration-300 relative group overflow-hidden border',
              isActive 
                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,243,255,0.1)]' 
                : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'
            )}
          >
            <div className="relative flex-shrink-0 z-10 transition-transform duration-300 group-hover:scale-110">
              <Icon size={20} className={clsx("transition-all", badge && "animate-pulse")} />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 flex-1 min-w-0 z-10">
                  <span className="text-xs font-semibold tracking-widest uppercase">{label}</span>
                  {badge && (
                    <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-sm border border-primary/40 bg-primary/20 text-primary">
                      {badge}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Active Glow Bar */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div 
                   layoutId="activeNav"
                   className="absolute left-0 w-1 h-2/3 bg-primary rounded-r-full" 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                />
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* System Status HUD */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mx-3 mb-4 p-4 glass-card border-primary/20"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="pulse-indicator" />
              <span className="telemetry-label text-primary">System Integrity</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] uppercase tracking-tighter">
                <span className="opacity-50 font-mono">Core Efficiency</span>
                <span className="text-primary font-mono">98.4%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '98.4%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="px-3 pb-6 space-y-2">
        <button 
          onClick={logout}
          className={clsx(
            'w-full flex items-center gap-4 px-4 py-3.5 rounded-sm border border-transparent text-text-secondary hover:text-secondary hover:bg-secondary/10 hover:border-secondary/30 transition-all group',
            !sidebarOpen && 'justify-center'
          )}
        >
          <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-bold uppercase tracking-widest">
                Disconnect
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button 
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center h-10 rounded-sm bg-white/5 border border-white/10 text-text-secondary hover:text-primary hover:border-primary/50 transition-all shadow-lg active:scale-95"
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.5 }}>
            <ChevronLeft size={16} />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
