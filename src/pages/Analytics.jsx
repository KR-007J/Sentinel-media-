import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, Zap, Clock } from 'lucide-react';
import { ANALYTICS_DATA } from '../data/mockData';
import { useStore } from '../hooks/useStore';

const COLORS = ['#6366f1', '#8b5cf6', '#14b8a6', '#38bdf8', '#64748b'];

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="aurora-card px-3 py-2 text-xs font-mono border border-aurora-border">
      <p className="text-aurora-muted mb-1.5">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

function MetricCard({ title, value, change, up, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="aurora-card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-mono text-aurora-muted tracking-widest">{title}</p>
        <div className={`flex items-center gap-1 text-xs font-mono ${up ? 'text-rose-400' : 'text-emerald-400'}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <p className="text-3xl font-display font-extrabold text-aurora-text">{value}</p>
      {sub && <p className="text-xs text-aurora-muted mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function Analytics() {
  const { threats } = useStore();
  const [period, setPeriod] = useState('weekly');

  const takedownRate = Math.round((287 / 312) * 100);
  const totalViews = threats.reduce((s, t) => s + (t.views || 0), 0);

  return (
    <div className="space-y-6">
      {/* Prophetic Risk Forecaster — Hackathon Feature */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="aurora-card p-6 border-indigo-500/20 bg-indigo-500/[0.02] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Zap size={32} className="text-indigo-400" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-black text-indigo-300 uppercase tracking-tighter">Prophetic AI™</span>
              <h2 className="text-xl font-bold text-white tracking-tight">Active Risk Forecaster</h2>
            </div>
            <p className="text-sm text-white/40 max-w-2xl italic">Gemini is analyzing historical piracy spikes and social signals to predict the next 48 hours of asset risk.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
             <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Next Peak</p>
                <p className="text-lg font-black text-white font-mono">22:00 <small className="text-[10px] font-normal opacity-40">UTC</small></p>
             </div>
             <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Risk Surge</p>
                <p className="text-lg font-black text-rose-500 font-mono">+42%</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="DETECTION ACCURACY" value="97.3%" change="+1.2%" up={false} sub="vs last month" delay={0} />
        <MetricCard title="AVG RESPONSE TIME" value="4.2s" change="-0.8s" up={false} sub="industry avg: 6.1h" delay={0.05} />
        <MetricCard title="TAKEDOWN SUCCESS" value={`${takedownRate}%`} change="+3%" up={false} sub="287 / 312 sent" delay={0.1} />
        <MetricCard title="ESTIMATED REACH BLOCKED" value={`${(totalViews / 1000).toFixed(0)}K`} change="+22%" up={true} sub="views prevented" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Main Chart */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 p-1 aurora-card rounded-xl w-fit">
              {['weekly', 'monthly'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono capitalize transition-all
                    ${period === p ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25' : 'text-aurora-muted hover:text-aurora-text'}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
              <Clock size={12} /> Live Telemetry
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="aurora-card p-6">
            <p className="section-label mb-1">THREAT VOLUME TREND</p>
            <p className="text-sm font-semibold text-aurora-text mb-6">Detection breakdown by {period} period</p>
            <ResponsiveContainer width="100%" height={280}>
              {period === 'weekly' ? (
                <AreaChart data={ANALYTICS_DATA.weekly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Area type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={2} fill="url(#gT)" name="Threats" dot={{ fill: '#f43f5e', r: 3 }} />
                  <Area type="monotone" dataKey="suspicious" stroke="#f59e0b" strokeWidth={1.5} fill="none" strokeDasharray="4 3" name="Suspicious" dot={false} />
                  <Area type="monotone" dataKey="safe" stroke="#10b981" strokeWidth={2} fill="url(#gS)" name="Safe" dot={false} />
                </AreaChart>
              ) : (
                <LineChart data={ANALYTICS_DATA.monthly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Line type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={2} dot={{ fill: '#f43f5e', r: 4 }} name="Detected" />
                  <Line type="monotone" dataKey="takedowns" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Takedowns" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="aurora-card p-6 h-full">
            <p className="section-label mb-1">PLATFORM BREAKDOWN</p>
            <p className="text-sm font-semibold text-aurora-text mb-6">Where threats originate</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={ANALYTICS_DATA.platforms} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  dataKey="value" paddingAngle={5} stroke="none">
                  {ANALYTICS_DATA.platforms.map((e, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CT />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-6">
              {ANALYTICS_DATA.platforms.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125" style={{ background: COLORS[i] }} />
                    <span className="text-xs font-medium text-aurora-muted group-hover:text-white transition-colors">{p.name}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-aurora-text">{p.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="aurora-card p-6">
          <p className="section-label mb-1">REGIONAL DISTRIBUTION</p>
          <p className="text-sm font-semibold text-aurora-text mb-6">Threat origin hotspots</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ANALYTICS_DATA.regions} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="region" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Bar dataKey="threats" name="Threats" radius={[6, 6, 0, 0]} barSize={24}>
                {ANALYTICS_DATA.regions.map((_, i) => (
                  <Cell key={i} fill={`hsl(${240 - i * 15}, 70%, 55%)`} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="aurora-card p-6">
          <p className="section-label mb-4">PERFORMANCE BENCHMARKS</p>
          <div className="space-y-5">
            {[
              { label: 'Detection Rate', value: 97.3, icon: Target, color: '#6366f1' },
              { label: 'Takedown Rate', value: 91.9, icon: Award, color: '#10b981' },
              { label: 'False Positive Rate', value: 2.7, icon: Zap, color: '#f59e0b' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/[0.05]">
                      <m.icon size={14} style={{ color: m.color }} />
                    </div>
                    <span className="text-xs font-bold text-aurora-text tracking-tight">{m.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-white">{m.value}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                    className="h-full rounded-full" style={{ background: m.color, boxShadow: `0 0 10px ${m.color}66` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
