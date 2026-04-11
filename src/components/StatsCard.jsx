import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, Terminal } from 'lucide-react';
import clsx from 'clsx';

function AnimatedNumber({ value }) {
  const num = parseInt(value?.toString().replace(/,/g, '')) || 0;
  const spring = useSpring(0, { stiffness: 45, damping: 25 });
  const display = useTransform(spring, (current) => 
    Math.floor(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(num);
  }, [num, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function StatsCard({ icon: Icon, label, value, sub, trend, trendUp, color = 'primary', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card p-6 flex flex-col gap-5 group relative overflow-hidden bg-black/40"
    >
      {/* HUD Corner Elements */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-primary" />
        <div className="absolute top-0 right-0 w-full h-[1px] bg-primary" />
      </div>

      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-sm border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-primary/50 transition-colors shadow-inner relative overflow-hidden">
          <Icon size={20} className="text-primary group-hover:scale-110 transition-transform relative z-10" />
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {trend && (
          <div className={clsx(
            'flex items-center gap-1.5 px-2 py-1 rounded-sm text-[9px] font-bold font-tech uppercase tracking-tighter border', 
            trendUp ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-primary/10 text-primary border-primary/30'
          )}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-bold text-white tracking-widest font-tech">
            {typeof value === 'number' || !isNaN(parseInt(value)) ? <AnimatedNumber value={value} /> : value}
          </h3>
          <span className="text-[10px] text-primary/50 font-mono animate-pulse">_REF</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Terminal size={10} className="text-secondary/50" />
          <p className="telemetry-label !text-primary/70">{label}</p>
        </div>
        
        {sub && (
          <p className="text-[9px] text-white/30 font-mono mt-2 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
            {sub}
          </p>
        )}
      </div>
      
      {/* Glitch bar scan on hover */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/40 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.div>
  );
}
