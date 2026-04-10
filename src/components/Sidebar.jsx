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
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-full z-50 flex flex-col overflow-hidden bg-[#202124] border-r border-[#3c4043]"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#3c4043]">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 relative bg-[#1a73e8]">
          <Shield size={18} className="text-white" />
          {highThreats > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#d93025] flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#1e1e1e]">
              {highThreats}
            </span>
          )}
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <p className="font-display font-black text-white text-lg tracking-tight leading-none italic">SENTINEL</p>
              <p className="text-[10px] text-google-blue font-bold tracking-[0.2em] mt-1 uppercase">Media OS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to} className={({ isActive }) => clsx('nav-link group', isActive && 'active')}>
            <div className="relative flex-shrink-0">
              <Icon size={18} className="icon-state" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="truncate">{label}</span>
                  {badge && (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/30">
                      {badge}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Live indicator */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-lg bg-[#2d2e31] border border-[#3c4043]">
            <div className="flex items-center gap-2 mb-1">
              <div className="live-dot" />
              <span className="text-[10px] font-black text-[#81c995] uppercase tracking-widest">REAL-TIME FEED</span>
            </div>
            <p className="text-[10px] text-[#9aa0a6] font-medium italic">Scanning 4 content streams...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout button */}
      <button onClick={logout}
        className={clsx('mx-3 mb-2 flex items-center gap-3 px-3 py-3 rounded-lg border border-transparent text-[#9aa0a6] hover:text-[#f28b82] hover:bg-[#d93025]/10 hover:border-[#d93025]/20 transition-all overflow-hidden', !sidebarOpen && 'justify-center')}>
        <LogOut size={16} />
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-bold whitespace-nowrap uppercase tracking-tighter">
              LOG OUT SYSTEM
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Collapse button */}
      <button onClick={toggleSidebar}
        className="flex items-center justify-center mx-auto mb-4 w-8 h-8 rounded-full border border-[#3c4043] text-[#9aa0a6] hover:text-white hover:border-[#8ab4f8] transition-all bg-[#2d2e31]">
        <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronLeft size={14} />
        </motion.div>
      </button>
    </motion.aside>
  );
}
