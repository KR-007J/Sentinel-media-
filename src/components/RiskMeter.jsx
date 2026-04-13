import React from 'react';
import { motion } from 'framer-motion';

export default function RiskMeter({ score }) {
  const getLevel = (s) => {
    if (s > 75) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' };
    if (s > 40) return { label: 'WARNING', color: 'text-yellow-500', bg: 'bg-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]' };
    return { label: 'SECURE', color: 'text-cyan-500', bg: 'bg-cyan-500', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]' };
  };

  const level = getLevel(score);

  return (
    <div className="relative flex items-center justify-center p-8">
      {/* Outer Glow Ring */}
      <div className={`absolute inset-0 rounded-full opacity-20 transition-all duration-1000 ${level.bg}`} style={{ filter: 'blur(40px)' }} />
      
      {/* Circular Progress */}
      <div className="relative w-48 h-48 rounded-full border border-white/5 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-xl">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/5"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className={level.color}
            initial={{ strokeDasharray: "0 553" }}
            animate={{ strokeDasharray: `${(score / 100) * 553} 553` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        <span className="telemetry-label !text-[10px] opacity-60">NETWORK RISK</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-black font-tech ${level.color}`}>{Math.round(score)}</span>
          <span className="text-xs text-slate-500 font-mono">%</span>
        </div>
        <div className={`mt-2 px-3 py-0.5 rounded text-[9px] font-black tracking-widest border border-current ${level.color} ${level.glow}`}>
          {level.label}
        </div>
      </div>

      {/* Hexagon Pattern Accents */}
      <div className="absolute top-0 right-0 p-2 opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-cyan-500">
           <path d="M20 0L37.32 10V30L20 40L2.68 30V10L20 0Z" stroke="currentColor" fill="none" />
        </svg>
      </div>
    </div>
  );
}
