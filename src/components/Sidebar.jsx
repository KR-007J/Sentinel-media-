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
      className="fixed left-0 top-0 h-full z-50 flex flex-col overflow-hidden"
      style={{
        background: 'rgba(7,8,15,0.95)',
        borderRight: '1px solid rgba(26,31,58,0.8)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-aurora-border">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Shield size={18} className="text-white" />
          {highThreats > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-aurora-rose flex items-center justify-center text-[9px] font-bold text-white">
              {highThreats}
            </span>
          )}
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <p className="font-display font-bold text-aurora-text text-base leading-none">Sentinel</p>
              <p className="text-[11px] text-aurora-muted font-mono mt-0.5">Media Guardian</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div className={clsx('nav-link', isActive && 'active')} style={isActive ? { border: '1px solid rgba(99,102,241,0.25)' } : {}}>
                <div className="relative flex-shrink-0">
                  <Icon size={18} className={isActive ? 'text-indigo-400' : ''} />
                </div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="truncate">{label}</span>
                      {badge && (
                        <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                          {badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Live indicator */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-xl border border-aurora-border"
            style={{ background: 'rgba(16,185,129,0.05)' }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="live-dot" />
              <span className="text-xs font-mono text-aurora-emerald font-medium">LIVE MONITORING</span>
            </div>
            <p className="text-[11px] text-aurora-muted">Scanning 4 asset streams</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout button */}
      <button onClick={logout}
        className={clsx('mx-3 mb-2 flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent text-aurora-muted hover:text-aurora-rose hover:bg-rose-500/5 hover:border-rose-500/20 transition-all overflow-hidden', !sidebarOpen && 'justify-center')}>
        <LogOut size={16} />
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-semibold whitespace-nowrap">
              Log Out System
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Collapse button */}
      <button onClick={toggleSidebar}
        className="flex items-center justify-center mx-auto mb-4 w-7 h-7 rounded-lg border border-aurora-border text-aurora-muted hover:text-aurora-text hover:border-aurora-indigo transition-all">
        <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronLeft size={14} />
        </motion.div>
      </button>
    </motion.aside>
  );
}
