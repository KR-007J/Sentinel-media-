import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, Zap, Clock, ShieldAlert, Globe, Server, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ANALYTICS_DATA } from '../data/mockData';

const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#1e293b', '#64748b'];

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-[10px] font-mono border-slate-700 bg-slate-900/95 shadow-2xl">
      <p className="text-slate-500 mb-2 font-black uppercase tracking-widest">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-6 py-1">
          <span className="uppercase">{p.name}:</span> 
          <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

function MetricCard({ title, value, change, up, sub, delay, icon: Icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="glass-card p-6 border-slate-800 bg-slate-900/40 relative overflow-hidden group">
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/30 transition-all">
          <Icon size={18} className="text-cyan-400" />
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-black font-tech border ${up ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' : 'text-purple-400 border-purple-500/20 bg-purple-500/5'}`}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {change}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">{title}</p>
      <p className="text-3xl font-black text-white tracking-tighter relative z-10 font-tech">{value}</p>
      {sub && <p className="text-[9px] text-slate-600 mt-2 font-bold uppercase tracking-[0.2em] relative z-10">{sub}</p>}
    </motion.div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState('weekly');
  const [dbThreats, setDbThreats] = useState([]);

  useEffect(() => {
    async function fetchThreats() {
      const { data } = await supabase.from('threats').select('*').order('created_at', { ascending: false }).limit(5);
      if (data) setDbThreats(data);
    }
    fetchThreats();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* HUD Header */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-1 bg-slate-900/60 border-slate-800 overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-gradient-to-br from-cyan-500/[0.03] to-transparent">
          <div className="w-24 h-24 rounded-2xl bg-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <Zap size={40} className="text-slate-950 z-10" />
            <motion.div animate={{ y: [-100, 100] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-white/20 w-full h-1/2" />
          </div>
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-3">
               <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
               <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">TACTICAL COMMAND ACTIVE</span>
             </div>
             <h2 className="text-4xl font-black text-white uppercase font-tech tracking-tight">Predictive Intelligence Dashboard</h2>
             <p className="text-xs text-slate-500 max-w-2xl leading-relaxed italic font-medium">Neural forecasting engine processing real-time telemetry from 14 global intercept nodes. Prophetic risk weighting active.</p>
          </div>
          
          <div className="flex gap-4">
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Global Health</p>
                <p className="text-2xl font-black text-cyan-400 font-tech">99.98%</p>
             </div>
             <div className="w-[1px] h-10 bg-slate-800" />
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">System Load</p>
                <p className="text-2xl font-black text-purple-400 font-tech">12.4ms</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Detection Magnitude" value="97.3%" change="+1.2%" up={true} sub="Institutional Lead" delay={0} icon={Target} />
        <MetricCard title="Intercept Latency" value="3.8s" change="-0.4s" up={true} sub="Sub-Atomic Response" delay={0.05} icon={Clock} />
        <MetricCard title="Node Resilience" value="High" change="No Jitter" up={true} sub="14 Nodes Reporting" delay={0.1} icon={Server} />
        <MetricCard title="Mitigation Reach" value="1.4M" change="+22%" up={true} sub="Active Neutralization" delay={0.15} icon={ShieldAlert} />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="glass-card p-10 border-slate-800 bg-slate-900/40 relative">
             <div className="flex items-center justify-between mb-12">
                <div>
                   <p className="text-[9px] font-black text-cyan-500 tracking-[0.3em] uppercase mb-1">Propagation Thresholds</p>
                   <h3 className="text-xl font-bold text-white uppercase font-tech">Neural Intercept Flow</h3>
                </div>
                <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                  {['weekly', 'monthly'].map(p => (
                    <button key={p} onClick={() => setPeriod(p)}
                      className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                        ${period === p ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}>
                      {p}
                    </button>
                  ))}
                </div>
             </div>
             
             <ResponsiveContainer width="100%" height={350}>
               {period === 'weekly' ? (
                 <AreaChart data={ANALYTICS_DATA.weekly} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                   <defs>
                     <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} dy={10} />
                   <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                   <Tooltip content={<CT />} />
                   <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={3} fill="url(#colorThreats)" name="Critical" />
                   <Area type="monotone" dataKey="safe" stroke="#06b6d4" strokeWidth={3} fill="url(#colorSafe)" name="Neutralized" />
                 </AreaChart>
               ) : (
                 <LineChart data={ANALYTICS_DATA.monthly} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                   <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} dy={10} />
                   <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                   <Tooltip content={<CT />} />
                   <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={4} dot={{ fill: '#ef4444', r: 6, strokeWidth: 0 }} name="Detected" />
                   <Line type="monotone" dataKey="takedowns" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: '#8b5cf6', r: 6, strokeWidth: 0 }} name="Mitigated" />
                 </LineChart>
               )}
             </ResponsiveContainer>
          </div>

          {/* Recent Live Threats from Supabase */}
          <div className="glass-card p-8 border-slate-800 bg-slate-900/40">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <Activity size={18} className="text-cyan-400" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-tech">Live Evidence Stream</h3>
               </div>
               <span className="text-[9px] font-mono text-slate-500 uppercase">Real-time DB Sync Active</span>
            </div>
            
            <div className="space-y-3">
               {dbThreats.length > 0 ? dbThreats.map((t, i) => (
                 <div key={t.id} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-xl group hover:border-cyan-500/20 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-2 rounded-full ${t.severity === 'Critical' ? 'bg-red-500' : 'bg-cyan-500'} animate-pulse`} />
                       <div>
                          <p className="text-[11px] font-black text-white uppercase tracking-tight">{t.type}</p>
                          <p className="text-[9px] text-slate-500 font-mono truncate max-w-[300px]">{t.description}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-white font-mono">{new Date(t.created_at).toLocaleTimeString()}</p>
                       <p className="text-[8px] text-slate-600 font-mono uppercase font-black uppercase tracking-widest">Locked</p>
                    </div>
                 </div>
               )) : (
                 <div className="p-12 text-center text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest">No recent tactical interceptions</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Sidebar Mini-Charts */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="glass-card p-10 border-slate-800 bg-slate-900/40 flex-1">
              <p className="text-[10px] font-black text-cyan-500 tracking-[0.3em] uppercase mb-1">Intelligence Origins</p>
              <h3 className="text-sm font-bold text-white mb-10 uppercase font-tech">Platform Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={ANALYTICS_DATA.platforms} cx="50%" cy="50%" innerRadius={70} outerRadius={100}
                    dataKey="value" paddingAngle={8} stroke="none">
                    {ANALYTICS_DATA.platforms.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CT />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4 mt-8">
                {ANALYTICS_DATA.platforms.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-white font-tech">{p.value}%</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="glass-card p-8 bg-gradient-to-tr from-purple-500/10 to-transparent border-purple-500/10">
              <Globe size={24} className="text-purple-400 mb-4" />
              <p className="text-xs font-bold text-white uppercase tracking-widest font-tech mb-2">Regional Heatmap</p>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Interception surge detected in Southeast Asia. Node 04 processing 4x normal volume. Auto-scaling protocols active.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
