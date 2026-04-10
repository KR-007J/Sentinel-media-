import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ScanLine, Globe, BarChart3,
  FileText, Settings, ChevronLeft, Shield, Zap, LogOut
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
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col flex-shrink-0 bg-[#2d2e31] border-r border-[#3c4043] relative z-[50]"
    >
      {/* Institutional Brand Header */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-[#3c4043]">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 relative bg-[#1a73e8] shadow-lg shadow-[#1a73e8]/20">
          <Shield size={20} className="text-white" />
          {highThreats > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 rounded-full bg-[#ea4335] flex items-center justify-center text-[10px] font-black text-white border-2 border-[#2d2e31] px-1">
              {highThreats}
            </span>
          )}
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <h2 className="font-bold text-white text-xl tracking-tight leading-none">SENTINEL</h2>
              <p className="text-[10px] text-[#8ab4f8] font-black tracking-[0.2em] mt-1.5 uppercase leading-none">Zero intelligence</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Registry Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
        {NAV.map(({ to, icon: Icon, label, badge }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({ isActive }) => clsx(
              'flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative group overflow-hidden',
              isActive ? 'bg-[#1a73e8] text-white shadow-xl shadow-[#1a73e8]/20 active-nav-glow' : 'text-[#9aa0a6] hover:text-white hover:bg-[#3c4043]'
            )}
          >
            <div className="relative flex-shrink-0 z-10">
              <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 flex-1 min-w-0 z-10">
                  <span className="text-[13px] font-bold tracking-tight truncate">{label}</span>
                  {badge && (
                    <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded border border-white/20 bg-white/10 uppercase">
                      {badge}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Hover subtle glow layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Intelligence Hearth - Replaced Green with Blue/Neutral Institutional Status */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="mx-4 mb-4 p-4 rounded-3xl bg-[#202124] border border-[#3c4043] shadow-inner">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
              <span className="text-[10px] font-black text-[#8ab4f8] uppercase tracking-widest leading-none">Intelligence Hub</span>
            </div>
            <p className="text-[10px] text-[#5f6368] font-bold uppercase tracking-tighter leading-relaxed">
              Global Interception: <span className="text-[#9aa0a6]">[ACTIVE]</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Action Set */}
      <div className="px-4 pb-6 space-y-3">
        <button 
          onClick={logout}
          className={clsx(
            'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-transparent text-[#9aa0a6] hover:text-[#f28b82] hover:bg-[#ea4335]/10 hover:border-[#ea4335]/20 transition-all overflow-hidden',
            !sidebarOpen && 'justify-center'
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[11px] font-black whitespace-nowrap uppercase tracking-widest">
                Logout Protocol
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Dynamic Expansion Toggle */}
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center mx-auto rounded-full bg-[#202124] border border-[#3c4043] text-[#9aa0a6] hover:text-white hover:border-[#8ab4f8] transition-all group shadow-md"
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.4 }}>
            <ChevronLeft size={16} />
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
}
