import React from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ScanLine, Globe, BarChart3,
  FileText, Settings, ChevronLeft, Shield, LogOut
} from 'lucide-react';
import { useStore } from '../hooks/useStore';


const NAV = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',   badge: null },
  { to: '/scanner',     icon: ScanLine,         label: 'Scanner',     badge: 'AI' },
  { to: '/threat-map',  icon: Globe,            label: 'Threat Map',  badge: null },
  { to: '/analytics',   icon: BarChart3,        label: 'Analytics',   badge: null },
  { to: '/reports',     icon: FileText,         label: 'Reports',     badge: null },
  { to: '/settings',    icon: Settings,         label: 'Settings',    badge: null },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, threats, logout, user, role, setRole, isRoleTransitioning } = useStore();
  const highThreats = threats.filter(t => (t.severity || '').toUpperCase() === 'CRITICAL').length;

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 260 : 80 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col flex-shrink-0 bg-black/40 backdrop-blur-2xl border-r border-white/10 relative z-[50]"
    >
      {/* SIMULATION BANNER */}
      <div className="w-full bg-yellow-500/10 border-b border-yellow-500/20 py-1.5 px-3 flex items-center justify-center">
        <span className="text-[7px] text-yellow-500 font-black uppercase tracking-[0.2em] blink-slow">SIMULATION MODE: ROLE OVERRIDE ENABLED</span>
      </div>

      {/* HUD Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
          <Shield size={20} className="text-cyan-400" />
          {highThreats > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-black text-white border-2 border-black px-1">
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
                  <span className="text-[10px] font-black tracking-[0.15em] uppercase font-tech">{label}</span>
                  {badge && (
                    <span className="ml-auto text-[8px] font-black px-1.5 py-0.5 rounded-sm border border-cyan-500/40 bg-cyan-500/20 text-cyan-400 font-tech animate-pulse">
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

      {/* User Section */}
      <div className="px-3 mb-4 space-y-4">
        <AnimatePresence>
          {sidebarOpen && user && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-10 h-10 rounded-lg overflow-hidden border",
                  role === 'ADMIN' ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]" :
                  role === 'ANALYST' ? "border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]" :
                  "border-slate-500/50"
                )}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-cyan-500 font-bold">
                      {user.name?.[0] || 'O'}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{user.name}</p>
                  <p className={clsx(
                    "text-[8px] font-black uppercase tracking-[0.2em]",
                    role === 'ADMIN' ? 'text-red-500' : 
                    role === 'ANALYST' ? 'text-blue-500' : 
                    'text-slate-500'
                  )}>
                    {role} AUTHORITY
                  </p>
                </div>
              </div>

              {/* Session Intelligence Dashboard */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">METHOD</span>
                  <span className="text-[7px] text-cyan-400 font-black uppercase tracking-widest">{useStore.getState().sessionInfo.authMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">SESSION RISK</span>
                  <span className={clsx(
                    "text-[7px] font-black uppercase tracking-widest px-1 rounded-sm",
                    useStore.getState().sessionInfo.sessionRisk === 'LOW' ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {useStore.getState().sessionInfo.sessionRisk}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">TRUST LVL</span>
                  <span className="text-[7px] text-purple-400 font-black uppercase tracking-widest">{useStore.getState().sessionInfo.deviceTrust}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-white/5 mx-3 mb-4 rounded-sm border border-white/5 overflow-hidden">
              <div className="text-[10px] font-black uppercase text-text-secondary/50 mb-2 tracking-widest">Op Override</div>
              <div className="flex flex-col gap-1.5">
                {['ADMIN', 'ANALYST', 'VIEWER'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    disabled={isRoleTransitioning}
                    title={isRoleTransitioning ? "Reconfiguring Access Control..." : `Apply ${r} Override`}
                    className={clsx(
                      "text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all border",
                      isRoleTransitioning ? "opacity-50 cursor-not-allowed grayscale" : "active:scale-95",
                      role === r 
                        ? (r === 'ADMIN' ? 'bg-red-500/20 text-red-500 border-red-500/50' : r === 'ANALYST' ? 'bg-blue-500/20 text-blue-500 border-blue-500/50' : 'bg-gray-500/20 text-gray-300 border-gray-500/50')
                        : "bg-black/50 text-white/40 border-transparent hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {isRoleTransitioning && role !== r ? 'WAIT...' : r + ' ACCESS'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-black uppercase tracking-[0.2em] font-tech text-secondary/80">
                DISCONNECT
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
