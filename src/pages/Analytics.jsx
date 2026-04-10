import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, Zap, Clock } from 'lucide-react';
import { ANALYTICS_DATA } from '../data/mockData';
import { useStore } from '../hooks/useStore';

const COLORS = ['#1a73e8', '#8ab4f8', '#34a853', '#fbbc05', '#5f6368'];

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2d2e31] border border-[#3c4043] px-3 py-2 text-xs font-mono rounded-lg shadow-xl">
      <p className="text-[#9aa0a6] mb-1.5">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

function MetricCard({ title, value, change, up, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-[#2d2e31] border border-[#3c4043] p-6 rounded-2xl shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-black text-[#9aa0a6] tracking-widest uppercase">{title}</p>
        <div className={`flex items-center gap-1 text-[10px] font-black font-mono ${up ? 'text-[#f28b82]' : 'text-[#81c995]'}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-[#5f6368] mt-1.5 font-bold uppercase tracking-wider">{sub}</p>}
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
      {/* Prophetic Risk Forecaster */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#202124] border border-[#1a73e8]/30 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1a73e8]/5 blur-[100px] -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#1a73e8]/10 border border-[#1a73e8]/20 flex items-center justify-center flex-shrink-0">
            <Zap size={32} className="text-[#8ab4f8] animate-pulse" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#1a73e8]/20 border border-[#1a73e8]/30 text-[9px] font-black text-[#8ab4f8] uppercase tracking-widest">Active Intelligence</span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Active Risk Forecaster</h2>
            </div>
            <p className="text-sm text-[#9aa0a6] max-w-2xl leading-relaxed italic">Proprietary logic analyzing historical piracy spikes and social signals to predict the next 48 hours of asset risk surface.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
             <div className="p-4 rounded-2xl bg-[#2d2e31] border border-[#3c4043] min-w-[120px]">
                <p className="text-[10px] font-bold text-[#8ab4f8] uppercase mb-2">Next Peak</p>
                <p className="text-xl font-bold text-white font-mono">22:00 <small className="text-[10px] font-normal opacity-40 italic">UTC</small></p>
             </div>
             <div className="p-4 rounded-2xl bg-[#ea4335]/10 border border-[#ea4335]/20 min-w-[120px]">
                <p className="text-[10px] font-bold text-[#f28b82] uppercase mb-2">Risk Surge</p>
                <p className="text-xl font-bold text-[#ea4335] font-mono">+42%</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Detection Accuracy" value="97.3%" change="+1.2%" up={false} sub="Institutional Standard" delay={0} />
        <MetricCard title="Avg Latency" value="3.8s" change="-0.4s" up={false} sub="vs 2.1h Industry Avg" delay={0.05} />
        <MetricCard title="Takedown Success" value={`${takedownRate}%`} change="+3%" up={false} sub="287 Verified Dossiers" delay={0.1} />
        <MetricCard title="Reach Mitigated" value={`${(totalViews / 1000).toFixed(0)}K`} change="+22%" up={true} sub="Prev. Viral Events" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-[#2d2e31] border border-[#3c4043] rounded-xl w-fit shadow-md">
              {['weekly', 'monthly'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all
                    ${period === p ? 'bg-[#1a73e8] text-white shadow-lg' : 'text-[#9aa0a6] hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#5f6368] uppercase tracking-widest">
              <Clock size={14} /> Telemetry Sync: [ACTIVE]
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#2d2e31] border border-[#3c4043] p-8 rounded-3xl shadow-xl">
            <p className="text-[10px] font-black text-[#8ab4f8] tracking-widest uppercase mb-1">Threat Propagation</p>
            <p className="text-sm font-bold text-white mb-8">Detection volume breakdown by temporal period</p>
            <ResponsiveContainer width="100%" height={280}>
              {period === 'weekly' ? (
                <AreaChart data={ANALYTICS_DATA.weekly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ea4335" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#ea4335" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34a853" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#34a853" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: '#5f6368', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5f6368', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Area type="monotone" dataKey="threats" stroke="#ea4335" strokeWidth={2.5} fill="url(#gT)" name="Threats" dot={{ fill: '#ea4335', r: 3 }} />
                  <Area type="monotone" dataKey="suspicious" stroke="#fbbc05" strokeWidth={1.5} fill="none" strokeDasharray="4 3" name="Suspicious" dot={false} />
                  <Area type="monotone" dataKey="safe" stroke="#34a853" strokeWidth={2.5} fill="url(#gS)" name="Safe" dot={false} />
                </AreaChart>
              ) : (
                <LineChart data={ANALYTICS_DATA.monthly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <XAxis dataKey="month" tick={{ fill: '#5f6368', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5f6368', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Line type="monotone" dataKey="threats" stroke="#ea4335" strokeWidth={2.5} dot={{ fill: '#ea4335', r: 4 }} name="Detected" />
                  <Line type="monotone" dataKey="takedowns" stroke="#34a853" strokeWidth={2.5} dot={{ fill: '#34a853', r: 4 }} name="Takedowns" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="lg:col-span-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-[#2d2e31] border border-[#3c4043] p-8 rounded-3xl shadow-xl h-full">
            <p className="text-[10px] font-black text-[#8ab4f8] tracking-widest uppercase mb-1">Origin Analysis</p>
            <p className="text-sm font-bold text-white mb-8">Platform distribution matrix</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={ANALYTICS_DATA.platforms} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  dataKey="value" paddingAngle={4} stroke="none">
                  {ANALYTICS_DATA.platforms.map((e, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CT />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 mt-8">
              {ANALYTICS_DATA.platforms.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-[11px] font-bold text-[#9aa0a6] uppercase tracking-wider">{p.name}</span>
                  </div>
                  <span className="text-[11px] font-black font-mono text-white">{p.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#2d2e31] border border-[#3c4043] p-8 rounded-3xl shadow-xl">
          <p className="text-[10px] font-black text-[#8ab4f8] tracking-widest uppercase mb-1">Regional Hotspots</p>
          <p className="text-sm font-bold text-white mb-8">Geo-spatial threat distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ANALYTICS_DATA.regions} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="region" tick={{ fill: '#5f6368', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5f6368', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Bar dataKey="threats" name="Threats" radius={[4, 4, 0, 0]} barSize={28}>
                {ANALYTICS_DATA.regions.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#ea4335' : i === 1 ? '#fbbc05' : '#1a73e8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-[#2d2e31] border border-[#3c4043] p-8 rounded-3xl shadow-xl">
          <p className="text-[10px] font-black text-[#8ab4f8] tracking-widest uppercase mb-1">Efficiency Metrics</p>
          <p className="text-sm font-bold text-white mb-8">Operational performance benchmarks</p>
          <div className="space-y-6">
            {[
              { label: 'Overall Detection', value: 97.3, icon: Target, color: '#1a73e8' },
              { label: 'Verified Takedowns', value: 91.9, icon: Award, color: '#34a853' },
              { label: 'Signal Accuracy', value: 98.2, icon: Zap, color: '#fbbc05' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#202124] border border-[#3c4043]">
                      <m.icon size={16} style={{ color: m.color }} />
                    </div>
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">{m.label}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-white">{m.value}%</span>
                </div>
                <div className="h-1.5 bg-[#202124] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                    transition={{ delay: 0.5, duration: 1.2 }}
                    className="h-full rounded-full" style={{ background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
