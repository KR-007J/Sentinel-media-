import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, Zap, Clock } from 'lucide-react';
import { ANALYTICS_DATA } from '../data/mockData';
import { useStore } from '../hooks/useStore';

const COLORS = ['#1a73e8', '#8ab4f8', '#4285f4', '#c6dafc', '#5f6368'];

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2d2e31] border border-[#3c4043] px-4 py-3 text-xs font-mono rounded-2xl shadow-2xl">
      <p className="text-[#9aa0a6] mb-2 font-black uppercase tracking-widest">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-4"><span>{p.name}:</span> <b>{p.value}</b></p>)}
    </div>
  );
};

function MetricCard({ title, value, change, up, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-[#2d2e31] border border-[#3c4043] p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <p className="text-[10px] font-black text-[#5f6368] tracking-widest uppercase">{title}</p>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black font-mono border ${up ? 'text-[#f28b82] border-[#ea4335]/20 bg-[#ea4335]/5' : 'text-[#8ab4f8] border-[#1a73e8]/20 bg-[#1a73e8]/5'}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <p className="text-4xl font-bold text-white tracking-tighter relative z-10">{value}</p>
      {sub && <p className="text-[10px] text-[#5f6368] mt-2 font-black uppercase tracking-[0.2em] relative z-10">{sub}</p>}
    </motion.div>
  );
}

export default function Analytics() {
  const { threats } = useStore();
  const [period, setPeriod] = useState('weekly');

  const takedownRate = Math.round((287 / 312) * 100);
  const totalViews = threats.reduce((s, t) => s + (t.views || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Prophetic Risk Forecaster */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#202124] border border-[#1a73e8]/30 p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a73e8]/5 blur-[120px] -mr-64 -mt-64" />
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-20 h-20 rounded-[1.5rem] bg-[#1a73e8] shadow-2xl shadow-[#1a73e8]/30 flex items-center justify-center flex-shrink-0">
            <Zap size={36} className="text-white animate-pulse" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1.5 rounded-full bg-[#1a73e8]/10 border border-[#1a73e8]/20 text-[10px] font-black text-[#8ab4f8] uppercase tracking-widest">Neural Forecaster active</span>
              <h2 className="text-3xl font-bold text-white tracking-tight">Active Predictive Intelligence</h2>
            </div>
            <p className="text-base text-[#5f6368] max-w-2xl leading-relaxed italic font-medium">Proprietary risk modeling engine processing historical interception logs to predict future signal surges within 48-hour windows.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
             <div className="p-6 rounded-3xl bg-[#2d2e31] border border-[#3c4043] min-w-[140px] shadow-lg">
                <p className="text-[10px] font-black text-[#8ab4f8] uppercase mb-2 tracking-widest">Next Critical Node</p>
                <p className="text-2xl font-bold text-white font-mono tracking-tighter">22:00 <small className="text-[10px] font-bold opacity-30 italic">UTC</small></p>
             </div>
             <div className="p-6 rounded-3xl bg-[#ea4335]/10 border border-[#ea4335]/20 min-w-[140px] shadow-lg">
                <p className="text-[10px] font-black text-[#f28b82] uppercase mb-2 tracking-widest">Predictive Surge</p>
                <p className="text-2xl font-bold text-[#ea4335] font-mono tracking-tighter">+42% <small className="text-[10px] font-bold opacity-30 italic">High</small></p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Detection Magnitude" value="97.3%" change="+1.2%" up={false} sub="Institutional Standard" delay={0} />
        <MetricCard title="Temporal Latency" value="3.8s" change="-0.4s" up={false} sub="Institutional Lead" delay={0.05} />
        <MetricCard title="Interception Flow" value={`${takedownRate}%`} change="+3%" up={false} sub="287 Anchored Dossiers" delay={0.1} />
        <MetricCard title="Mitigation Reach" value={`${(totalViews / 1000).toFixed(0)}K`} change="+22%" up={true} sub="Neutralized Signals" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1.5 bg-[#202124] border border-[#3c4043] rounded-2xl w-fit shadow-inner">
              {['weekly', 'monthly'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${period === p ? 'bg-[#1a73e8] text-white shadow-xl' : 'text-[#5f6368] hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#2d2e31] border border-[#3c4043] text-[10px] font-black text-[#5f6368] uppercase tracking-widest shadow-md">
              <Clock size={16} /> Telemetry Sync: ONLINE
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="bg-[#2d2e31] border border-[#3c4043] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <p className="text-[10px] font-black text-[#8ab4f8] tracking-[0.3em] uppercase mb-1">Propagation Thresholds</p>
                  <p className="text-xl font-bold text-white tracking-tight">Temporal Registry Performance</p>
               </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              {period === 'weekly' ? (
                <AreaChart data={ANALYTICS_DATA.weekly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <XAxis dataKey="day" tick={{ fill: '#5f6368', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5f6368', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Area type="monotone" dataKey="threats" stroke="#ea4335" strokeWidth={3} fillOpacity={0.15} fill="#ea4335" name="Threats" dot={{ fill: '#ea4335', r: 4 }} />
                  <Area type="monotone" dataKey="suspicious" stroke="#fbbc05" strokeWidth={2} fill="none" strokeDasharray="6 4" name="Suspicious" dot={false} />
                  <Area type="monotone" dataKey="safe" stroke="#1a73e8" strokeWidth={3} fillOpacity={0.05} fill="#1a73e8" name="Neutral" dot={false} />
                </AreaChart>
              ) : (
                <LineChart data={ANALYTICS_DATA.monthly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <XAxis dataKey="month" tick={{ fill: '#5f6368', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5f6368', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Line type="monotone" dataKey="threats" stroke="#ea4335" strokeWidth={3} dot={{ fill: '#ea4335', r: 5 }} name="Detected" />
                  <Line type="monotone" dataKey="takedowns" stroke="#1a73e8" strokeWidth={3} dot={{ fill: '#1a73e8', r: 5 }} name="Mitigated" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="lg:col-span-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="bg-[#2d2e31] border border-[#3c4043] p-10 rounded-[3rem] shadow-2xl h-full flex flex-col">
            <p className="text-[10px] font-black text-[#8ab4f8] tracking-[0.3em] uppercase mb-1">Intelligence Origins</p>
            <p className="text-sm font-bold text-white mb-10">Platform Distribution Ledger</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={ANALYTICS_DATA.platforms} cx="50%" cy="50%" innerRadius={70} outerRadius={100}
                  dataKey="value" paddingAngle={6} stroke="none">
                  {ANALYTICS_DATA.platforms.map((e, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CT />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-5 mt-10">
              {ANALYTICS_DATA.platforms.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between p-3 rounded-2xl bg-[#202124] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ background: COLORS[i] }} />
                    <span className="text-[11px] font-black text-[#9aa0a6] uppercase tracking-widest">{p.name}</span>
                  </div>
                  <span className="text-[11px] font-black font-mono text-white">{p.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#2d2e31] border border-[#3c4043] p-10 rounded-[3rem] shadow-2xl">
          <p className="text-[10px] font-black text-[#8ab4f8] tracking-[0.3em] uppercase mb-1">Geospatial hotspots</p>
          <p className="text-sm font-bold text-white mb-10">Regional Interception Matrix</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ANALYTICS_DATA.regions} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="region" tick={{ fill: '#5f6368', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5f6368', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Bar dataKey="threats" name="Threats" radius={[8, 8, 0, 0]} barSize={36}>
                {ANALYTICS_DATA.regions.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#ea4335' : i === 1 ? '#fbbc05' : '#1a73e8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-[#2d2e31] border border-[#3c4043] p-10 rounded-[3rem] shadow-2xl">
          <p className="text-[10px] font-black text-[#8ab4f8] tracking-[0.3em] uppercase mb-1">Institutional Benchmarks</p>
          <p className="text-sm font-bold text-white mb-10">Operational Signal Accuracy</p>
          <div className="space-y-8">
            {[
              { label: 'Overall Detection', value: 97.3, icon: Target, color: '#1a73e8' },
              { label: 'Interception Flow', value: 91.9, icon: Award, color: '#8ab4f8' },
              { label: 'Signal Stability', value: 98.2, icon: Zap, color: '#fbbc05' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#202124] border border-[#3c4043] shadow-inner transition-transform group-hover:scale-110">
                      <m.icon size={20} style={{ color: m.color }} />
                    </div>
                    <div>
                        <span className="text-[11px] font-black text-white uppercase tracking-tighter">{m.label}</span>
                        <p className="text-[9px] text-[#5f6368] font-bold uppercase tracking-widest mt-0.5">Verified Intelligence</p>
                    </div>
                  </div>
                  <span className="text-sm font-black font-mono text-white tracking-tighter">{m.value}%</span>
                </div>
                <div className="h-2 bg-[#202124] rounded-full overflow-hidden p-[2px] border border-[#3c4043] shadow-inner">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                    transition={{ delay: 0.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full shadow-[0_0_15px_rgba(26,115,232,0.4)]" style={{ background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
