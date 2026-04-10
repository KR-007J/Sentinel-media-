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
  const { threats, userRole, toggleRole } = useStore();
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const page = PAGE_TITLES[location.pathname] || { title: 'Sentinel-Media', sub: '' };
  const newThreats = threats.filter(t => t.status === 'unauthorized').slice(0, 3);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-aurora-border flex-shrink-0 relative z-20"
      style={{ background: 'rgba(7,8,15,0.85)', backdropFilter: 'blur(12px)' }}>
      <div>
        <h1 className="font-display font-bold text-aurora-text text-lg leading-none">{page.title}</h1>
        <p className="text-xs text-aurora-muted mt-0.5">{page.sub}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Live time */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-aurora-border text-xs font-mono text-aurora-muted">
          <Wifi size={11} className="text-aurora-emerald" />
          <span>{format(time, 'HH:mm:ss')}</span>
          <span className="text-aurora-border">·</span>
          <span>{format(time, 'dd MMM yyyy')}</span>
        </div>

        {/* Search */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-aurora-border text-aurora-muted hover:text-aurora-text hover:border-aurora-indigo transition-all">
          <Search size={15} />
        </button>

        {/* Refresh */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-aurora-border text-aurora-muted hover:text-aurora-text transition-all">
          <RefreshCw size={14} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(v => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-aurora-border text-aurora-muted hover:text-aurora-text transition-all relative">
            <Bell size={15} />
            {newThreats.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-aurora-rose text-[9px] font-bold text-white flex items-center justify-center">
                {newThreats.length}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-11 w-80 aurora-card p-2 z-50">
                <p className="text-xs font-mono text-aurora-muted px-3 py-2 border-b border-aurora-border mb-1">RECENT THREATS</p>
                {newThreats.map(t => (
                  <div key={t.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-aurora-subtle transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-aurora-rose mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-aurora-text font-medium truncate">{t.url}</p>
                      <p className="text-[11px] text-aurora-muted">{t.similarity}% match · {t.location}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Role Toggle */}
        <button onClick={toggleRole} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all group-hover:scale-105"
            style={{ background: userRole === 'senior' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #64748b, #475569)' }}>
            {userRole === 'senior' ? 'SP' : 'JA'}
          </div>
          <div className="hidden md:block text-left mr-2">
            <p className="text-xs font-bold text-aurora-text leading-tight">{userRole === 'senior' ? 'Senior Partner' : 'Junior Analyst'}</p>
            <p className="text-[10px] text-aurora-muted font-mono">{userRole === 'senior' ? 'Full Access' : 'Read-Only'}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
