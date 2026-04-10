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
    green:  { bg: 'rgba(26,115,232,0.12)',  border: 'rgba(26,115,232,0.3)',  icon: '#8ab4f8', glow: 'rgba(26,115,232,0.1)' }, // Redirected to Blue
    yellow: { bg: 'rgba(249,171,0,0.12)',  border: 'rgba(249,171,0,0.3)',   icon: '#fdd663', glow: 'rgba(249,171,0,0.1)' },
    indigo: { bg: 'rgba(26,115,232,0.12)', border: 'rgba(26,115,232,0.3)',  icon: '#8ab4f8', glow: 'rgba(26,115,232,0.15)' },
    rose:   { bg: 'rgba(217,48,37,0.12)',  border: 'rgba(217,48,37,0.3)',   icon: '#f28b82', glow: 'rgba(217,48,37,0.12)' },
    emerald:{ bg: 'rgba(26,115,232,0.12)',  border: 'rgba(26,115,232,0.3)',  icon: '#8ab4f8', glow: 'rgba(26,115,232,0.1)' }, // Redirected to Blue
    amber:  { bg: 'rgba(249,171,0,0.12)',  border: 'rgba(249,171,0,0.3)',   icon: '#fdd663', glow: 'rgba(249,171,0,0.1)' },
  };
  const c = colors[color] || colors.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#2d2e31] border border-[#3c4043] p-8 rounded-[2rem] flex flex-col gap-6 group relative overflow-hidden shadow-xl"
    >
      {/* Background glow effect */}
      <div 
        className="absolute -right-4 -top-4 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-10 transition-opacity duration-700"
        style={{ background: c.icon }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:rotate-6 bg-[#202124] border border-[#3c4043] shadow-inner"
        >
          <Icon size={24} style={{ color: c.icon }} />
        </div>
        {trend && (
          <div className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black font-mono tracking-widest uppercase border', 
            trendUp ? 'bg-[#ea4335]/10 text-[#f28b82] border-[#ea4335]/20' : 'bg-[#1a73e8]/10 text-[#8ab4f8] border-[#1a73e8]/20'
          )}>
            {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-4xl font-bold text-white tracking-tighter">
          {typeof value === 'number' || !isNaN(parseInt(value)) ? <AnimatedNumber value={value} /> : value}
        </h3>
        <p className="text-[11px] font-black text-[#5f6368] mt-3 tracking-[0.2em] uppercase">
          {label}
        </p>
        {sub && <p className="text-[10px] text-[#5f6368] mt-1.5 font-bold italic opacity-60">{sub}</p>}
      </div>
    </motion.div>
  );
}
