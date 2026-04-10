import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, RefreshCw, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import { format } from 'date-fns';

const PAGE_TITLES = {
  '/dashboard':  { title: 'Operations Dashboard', sub: 'Real-time threat intelligence overview' },
  '/scanner':    { title: 'Asset Scanner',         sub: 'AI-powered media fingerprint detection' },
  '/threat-map': { title: 'Threat Propagation Map', sub: 'Global unauthorized content spread' },
  '/analytics':  { title: 'Analytics & Insights',   sub: 'Trends, patterns, and performance metrics' },
  '/reports':    { title: 'Intelligence Reports',    sub: 'AI-generated threat documentation' },
  '/settings':   { title: 'Configuration',           sub: 'API keys, integrations, and preferences' },
};

export default function TopBar() {
  const location = useLocation();
  const { threats, userRole, toggleRole, user } = useStore();
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const page = PAGE_TITLES[location.pathname] || { title: 'Sentinel-Media', sub: '' };
  const newThreats = threats.filter(t => t.status === 'unauthorized').slice(0, 3);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-[#3c4043] flex-shrink-0 relative z-20 bg-[#202124]/80 backdrop-blur-xl">
      <div>
        <h1 className="text-white text-xl font-bold tracking-tight">{page.title}</h1>
        <p className="text-[10px] text-[#8ab4f8] uppercase tracking-[0.3em] font-black mt-1">Institutional Node: {page.sub}</p>
      </div>

      <div className="flex items-center gap-5">
        {/* Live Status Indicator */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#2d2e31] border border-[#3c4043] text-[10px] font-black font-mono text-[#9aa0a6] uppercase tracking-widest shadow-inner">
          <div className="relative">
            <Wifi size={14} className="text-[#1a73e8]" />
            <motion.div initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#1a73e8] rounded-full" />
          </div>
          <span className="text-white">{format(time, 'HH:mm:ss')}</span>
          <span className="opacity-20 mx-1">/</span>
          <span className="text-[#8ab4f8]">Verified Baseline</span>
        </div>

        {/* Notifications Hub */}
        <div className="relative">
          <button onClick={() => setShowNotifs(v => !v)}
            className="w-12 h-12 flex items-center justify-center rounded-[1rem] border border-[#3c4043] text-[#9aa0a6] hover:text-white hover:bg-white/5 transition-all relative shadow-lg active:scale-95">
            <Bell size={20} />
            {newThreats.length > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#ea4335] shadow-[0_0_12px_rgba(234,67,53,0.8)] border-2 border-[#202124]" />
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.95 }}
                className="absolute right-0 top-16 w-80 bg-[#2d2e31] border border-[#3c4043] rounded-[2rem] shadow-2xl p-3 z-50 overflow-hidden">
                <p className="text-[9px] font-black text-[#5f6368] px-4 py-3 border-b border-[#3c4043] mb-2 uppercase tracking-[0.4em]">Critical Surveillance Intercepts</p>
                <div className="space-y-1">
                  {newThreats.map(t => (
                    <div key={t.id} className="flex items-start gap-4 px-4 py-3.5 rounded-2xl hover:bg-[#3c4043] transition-all cursor-pointer group">
                      <div className="w-2 h-2 rounded-full bg-[#ea4335] mt-1.5 flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="text-[13px] text-white font-bold truncate tracking-tight">{t.url}</p>
                        <p className="text-[10px] text-[#5f6368] font-bold uppercase tracking-tight mt-0.5 group-hover:text-[#8ab4f8] transition-colors">{t.similarity}% match · {t.location}</p>
                      </div>
                    </div>
                  ))}
                  {newThreats.length === 0 && (
                    <div className="p-8 text-center text-[#5f6368]">
                      <RefreshCw size={24} className="mx-auto mb-3 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No Active Threat Signal</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic User Role Authentication */}
        <button onClick={toggleRole} className="flex items-center gap-4 pl-5 border-l border-[#3c4043] group active:scale-95 transition-transform">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white leading-tight tracking-tight">{userRole === 'senior' ? 'Lead Operative' : 'Analyst Node'}</p>
            <p className="text-[9px] text-[#8ab4f8] font-black tracking-widest uppercase mt-0.5">{userRole === 'senior' ? 'Auth Level 4' : 'Read Only'}</p>
          </div>
          <div className="w-11 h-11 rounded-[1.2rem] flex items-center justify-center text-sm font-black text-white transition-all shadow-xl group-hover:rotate-12"
            style={{ background: `linear-gradient(135deg, ${userRole === 'senior' ? '#1a73e8, #8ab4f8' : '#3c4043, #202124'})` }}>
            {user?.name?.[0] || 'G'}
          </div>
        </button>
      </div>
    </header>
  );
}
