import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Wifi, Activity, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { format } from 'date-fns';

const PAGE_TITLES = {
  '/dashboard':  { title: 'Operations Dashboard', sub: 'Neural Threat Analysis [Active]' },
  '/scanner':    { title: 'Asset Fingerprinting',  sub: 'Multimodal Forensic Scanner' },
  '/threat-map': { title: 'Global Threat Map',     sub: 'Real-time Signal Interception' },
  '/analytics':  { title: 'Intelligence Matrix',   sub: 'Algorithmic Data Aggregation' },
  '/reports':    { title: 'Classified Dossiers',   sub: 'Executive Intelligence Reports' },
  '/settings':   { title: 'System Protocols',      sub: 'Encryption & Neural Config' },
};

export default function TopBar() {
  const location = useLocation();
  const { threats, userRole, toggleRole, user } = useStore();
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const page = PAGE_TITLES[location.pathname] || { title: 'Sentinel-Media', sub: 'Nexus Point' };
  const newThreats = threats.filter(t => t.status === 'unauthorized').slice(0, 3);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-white/10 flex-shrink-0 relative z-20 bg-black/30 backdrop-blur-3xl">
      <div className="flex flex-col">
        <h1 className="text-white text-lg font-bold tracking-[0.05em] uppercase font-tech">{page.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Terminal size={10} className="text-primary animate-pulse" />
          <p className="telemetry-label text-primary">{page.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Dynamic Global Status HUD */}
        <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 glass-card rounded-sm border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-primary" />
            <span className="font-mono text-[10px] text-primary">{format(time, 'HH:mm:ss')}</span>
          </div>
          <div className="h-4 w-[1px] bg-primary/20" />
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-secondary" />
            <span className="telemetry-label">Signal Clear</span>
          </div>
        </div>

        {/* Intelligence Alerts */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(v => !v)}
            className="w-12 h-12 flex items-center justify-center rounded-sm glass-card border-white/10 text-text-secondary hover:text-white hover:border-primary/50 transition-all relative overflow-hidden"
          >
            <Bell size={20} className={clsx(newThreats.length > 0 && "animate-[bounce_2s_infinite]")} />
            {newThreats.length > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(188,19,254,1)] animate-pulse" />
            )}
            <div className="absolute inset-0 bg-primary/2 opacity-0 hover:opacity-100 transition-opacity" />
          </button>
          
          <AnimatePresence>
            {showNotifs && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 top-14 w-80 glass-card p-4 z-50 shadow-2xl overflow-hidden min-h-[100px]"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <p className="telemetry-label font-bold text-white">Threat Feed</p>
                  <span className="text-[9px] font-mono text-primary animate-pulse">LIVE TRANSMISSION</span>
                </div>
                
                <div className="space-y-3">
                  {newThreats.map(t => (
                    <div key={t.id} className="p-3 bg-white/5 border border-white/10 rounded-sm hover:border-primary/40 transition-all group cursor-pointer relative overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] font-bold text-white truncate max-w-[180px] font-tech">{t.url}</p>
                        <span className="text-[8px] px-1.5 py-0.5 bg-secondary/10 border border-secondary/20 text-secondary font-bold uppercase">Critical</span>
                      </div>
                      <p className="telemetry-label !text-[8px] opacity-40">{t.location} • Signature {t.similarity}%</p>
                      
                      {/* Interactive glitch effect on hover */}
                      <div className="absolute inset-0 bg-primary/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  ))}
                  
                  {newThreats.length === 0 && (
                    <div className="py-6 text-center opacity-40">
                      <p className="telemetry-label">All Nodes Secure</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Identity Authorization */}
        <button 
          onClick={toggleRole} 
          className="flex items-center gap-4 pl-6 border-l border-white/10 group transition-all"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-tech leading-none">
              {userRole === 'senior' ? 'Arch-Operative' : 'Spectral Analyst'}
            </p>
            <p className="telemetry-label text-primary mt-1">Auth Level {userRole === 'senior' ? '007' : '001'}</p>
          </div>
          <div 
             className="w-11 h-11 rounded-sm flex items-center justify-center text-sm font-bold text-black border border-primary/50 relative overflow-hidden transition-all group-hover:scale-105"
             style={{ background: userRole === 'senior' ? 'var(--primary)' : 'var(--glass)' }}
          >
            <span className="relative z-10 transition-colors duration-300" style={{ color: userRole === 'senior' ? 'black' : 'white' }}>
              {user?.name?.[0] || 'S'}
            </span>
            {userRole === 'senior' && (
              <div className="absolute inset-0 bg-white/30 skew-x-[-20deg] animate-[shine_3s_infinite]" />
            )}
          </div>
        </button>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          0% { transform: translateX(-200%) skew(-20deg); }
          100% { transform: translateX(200%) skew(-20deg); }
        }
      `}} />
    </header>
  );
}

const clsx = (...classes) => classes.filter(Boolean).join(' ');
