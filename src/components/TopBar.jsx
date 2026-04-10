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
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#3c4043] flex-shrink-0 relative z-20 bg-[#202124]">
      <div>
        <h1 className="text-[#f1f3f4] text-lg font-bold tracking-tight">{page.title}</h1>
        <p className="text-[11px] text-[#9aa0a6] uppercase tracking-wider font-semibold">{page.sub}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Live time */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded bg-[#2d2e31] border border-[#3c4043] text-[10px] font-mono text-[#9aa0a6] uppercase tracking-widest">
          <Wifi size={11} className="text-[#34a853] animate-pulse" />
          <span>{format(time, 'HH:mm:ss')}</span>
          <span className="opacity-30">·</span>
          <span>SYSTEM ONLINE</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(v => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#3c4043] text-[#9aa0a6] hover:text-[#f1f3f4] hover:bg-white/5 transition-all relative">
            <Bell size={16} />
            {newThreats.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ea4335] shadow-[0_0_8px_rgba(234,67,53,0.4)]" />
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 top-12 w-80 bg-[#2d2e31] border border-[#3c4043] rounded-xl shadow-2xl p-2 z-50">
                <p className="text-[10px] font-bold text-[#9aa0a6] px-3 py-2 border-b border-[#3c4043] mb-1 uppercase tracking-widest">RECENT ACTIVITIES</p>
                {newThreats.map(t => (
                  <div key={t.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#3c4043] transition-colors cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ea4335] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#f1f3f4] font-medium truncate">{t.url}</p>
                      <p className="text-[10px] text-[#9aa0a6]">{t.similarity}% match · {t.location}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Role Toggle */}
        <button onClick={toggleRole} className="flex items-center gap-3 pl-3 border-l border-[#3c4043] group">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-white leading-tight">{userRole === 'senior' ? 'Senior Partner' : 'Junior Analyst'}</p>
            <p className="text-[10px] text-[#8ab4f8] font-mono font-bold tracking-tighter uppercase">{userRole === 'senior' ? 'Admin Access' : 'Observer'}</p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all group-hover:ring-4 group-hover:ring-google-blue/20"
            style={{ background: userRole === 'senior' ? '#1a73e8' : '#5f6368' }}>
            {user?.name?.[0] || 'S'}
          </div>
        </button>
      </div>
    </header>
  );
}
