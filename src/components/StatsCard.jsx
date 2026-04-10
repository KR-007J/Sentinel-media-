import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

function AnimatedNumber({ value }) {
  const num = parseInt(value.toString().replace(/,/g, '')) || 0;
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, (current) => 
    Math.floor(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(num);
  }, [num, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function StatsCard({ icon: Icon, label, value, sub, trend, trendUp, color = 'indigo', delay = 0 }) {
  const colors = {
    indigo: { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', icon: '#a5b4fc', glow: 'rgba(99,102,241,0.15)' },
    rose:   { bg: 'rgba(244,63,94,0.06)',  border: 'rgba(244,63,94,0.2)',  icon: '#fb7185', glow: 'rgba(244,63,94,0.12)' },
    emerald:{ bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', icon: '#34d399', glow: 'rgba(16,185,129,0.1)' },
    amber:  { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', icon: '#fbbf24', glow: 'rgba(245,158,11,0.1)' },
    teal:   { bg: 'rgba(20,184,166,0.06)', border: 'rgba(20,184,166,0.2)', icon: '#2dd4bf', glow: 'rgba(20,184,166,0.1)' },
    violet: { bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)', icon: '#c4b5fd', glow: 'rgba(139,92,246,0.12)' },
  };
  const c = colors[color] || colors.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="aurora-card p-6 flex flex-col gap-5 group relative overflow-hidden"
    >
      {/* Background glow effect */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: c.icon }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <div 
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
          style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 8px 16px -4px ${c.glow}` }}
        >
          <Icon size={20} style={{ color: c.icon }} />
        </div>
        {trend && (
          <div className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-tighter uppercase', 
            trendUp ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          )}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-display font-bold text-white tracking-tight">
          {typeof value === 'number' || !isNaN(parseInt(value)) ? <AnimatedNumber value={value} /> : value}
        </h3>
        <p className="text-xs font-mono font-bold text-aurora-muted mt-2 tracking-widest uppercase opacity-60">
          {label}
        </p>
        {sub && <p className="text-[10px] text-aurora-muted mt-1 font-medium opacity-40">{sub}</p>}
      </div>
    </motion.div>
  );
}
