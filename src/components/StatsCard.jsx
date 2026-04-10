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
    blue:   { bg: 'rgba(26,115,232,0.12)', border: 'rgba(26,115,232,0.3)',  icon: '#8ab4f8', glow: 'rgba(26,115,232,0.15)' },
    red:    { bg: 'rgba(217,48,37,0.12)',  border: 'rgba(217,48,37,0.3)',   icon: '#f28b82', glow: 'rgba(217,48,37,0.12)' },
    green:  { bg: 'rgba(30,142,62,0.12)',  border: 'rgba(30,142,62,0.3)',   icon: '#81c995', glow: 'rgba(30,142,62,0.1)' },
    yellow: { bg: 'rgba(249,171,0,0.12)',  border: 'rgba(249,171,0,0.3)',   icon: '#fdd663', glow: 'rgba(249,171,0,0.1)' },
    indigo: { bg: 'rgba(26,115,232,0.12)', border: 'rgba(26,115,232,0.3)',  icon: '#8ab4f8', glow: 'rgba(26,115,232,0.15)' },
    rose:   { bg: 'rgba(217,48,37,0.12)',  border: 'rgba(217,48,37,0.3)',   icon: '#f28b82', glow: 'rgba(217,48,37,0.12)' },
    emerald:{ bg: 'rgba(30,142,62,0.12)',  border: 'rgba(30,142,62,0.3)',   icon: '#81c995', glow: 'rgba(30,142,62,0.1)' },
    amber:  { bg: 'rgba(249,171,0,0.12)',  border: 'rgba(249,171,0,0.3)',   icon: '#fdd663', glow: 'rgba(249,171,0,0.1)' },
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
            trendUp ? 'bg-[#ea4335]/10 text-[#f28b82] border border-[#ea4335]/20' : 'bg-[#34a853]/10 text-[#81c995] border border-[#34a853]/20'
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
