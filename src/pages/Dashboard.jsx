import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, Filter, SortDesc } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ThreatRow from '../components/ThreatRow';
import AIPanel from '../components/AIPanel';
import Globe from '../components/Globe';
import { useStore } from '../hooks/useStore';
import { analyzeMediaThreat } from '../services/gemini';
import { ANALYTICS_DATA } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2d2e31] border border-[#3c4043] px-3 py-2 text-xs font-mono rounded-lg shadow-xl">
      <p className="text-[#9aa0a6] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { threats, stats, addThreat, userRole } = useStore();
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('time');

  const filtered = threats
    .filter(t => filter === 'all' ? true : t.status === filter)
    .sort((a, b) => sort === 'time'
      ? new Date(b.timestamp) - new Date(a.timestamp)
      : b.similarity - a.similarity);

  const handleAnalyze = async (threat) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const result = await analyzeMediaThreat(threat);
      setAiResult(result);
    } catch {
      toast.error('Gemini analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleTakedown = (threat) => {
    if (userRole !== 'senior') {
      toast.error('Access Denied: Administrative privileges required.', { 
        style: { background: '#202124', color: '#fff', border: '1px solid #3c4043' }
      });
      return;
    }
    toast.success(`Legal protocol anchored for ${threat.url}`, { 
      icon: '🏛️',
      style: { background: '#202124', color: '#fff', border: '1px solid #3c4043' }
    });
  };

  useEffect(() => {
    toast.success('Intelligence Engine Active', { 
      icon: '🛡️',
      style: { background: '#202124', color: '#fff', border: '1px solid #3c4043' }
    });
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const isHigh = Math.random() > 0.6;
      const newThreat = {
        id: `live_${Date.now()}`,
        url: `node-${Math.floor(Math.random() * 9999)}.global-cache.net`,
        similarity: Math.floor(Math.random() * 45) + 50,
        watermark: Math.random() > 0.5,
        location: ['Germany', 'Brazil', 'Japan', 'Canada', 'India'][Math.floor(Math.random() * 5)],
        city: 'Cloud Node',
        lat: -20 + Math.random() * 60,
        lng: -100 + Math.random() * 180,
        status: isHigh ? 'unauthorized' : 'suspicious',
        confidence: Math.floor(Math.random() * 20) + 75,
        risk: isHigh ? 'high' : 'medium',
        action: 'flag',
        timestamp: new Date().toISOString(),
        asset: 'Live Premium Feed',
        platform: 'Edge CDN',
        reason: 'Signature mismatch identified in encrypted packet headers.',
        views: Math.floor(Math.random() * 15000) + 1200,
        spread: Math.floor(Math.random() * 8) + 1,
      };
      addThreat(newThreat);
      toast(`Unauthorized Node Detected: ${newThreat.location}`, { 
        icon: '🛰️', 
        style: { background: '#202124', color: '#fff', border: `1px solid ${isHigh ? '#ea4335' : '#fbbc05'}` } 
      });
    }, 20000);
    return () => clearInterval(iv);
  }, []);

  const unauthorized = threats.filter(t => t.status === 'unauthorized').length;
  const suspicious = threats.filter(t => t.status === 'suspicious').length;

  return (
    <div className="space-y-8 pb-12">
      {/* KPI Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Shield} label="Assets Protected" value={stats.assetsProtected} color="indigo" delay={0} trend="+3 this week" />
        <StatsCard icon={AlertTriangle} label="Unauthorized" value={unauthorized} color="rose" delay={0.05} trend="+12%" trendUp />
        <StatsCard icon={Clock} label="Suspicious" value={suspicious} color="amber" delay={0.1} />
        <StatsCard icon={CheckCircle} label="Takedowns Sent" value={stats.takedownsSent} color="indigo" delay={0.15} trend="+8 today" />
      </div>

      {/* Hero Interactivity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#2d2e31] border border-[#3c4043] rounded-3xl p-1 relative shadow-2xl overflow-hidden" style={{ height: 360 }}>
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <p className="text-[10px] font-black text-[#8ab4f8] tracking-widest uppercase mb-1">Geospatial Surveillance Matrix</p>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ea4335] inline-block shadow-[0_0_8px_rgba(234,67,53,0.4)]" /> Unauthorized</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#fbbc05] inline-block shadow-[0_0_8px_rgba(251,188,5,0.4)]" /> Suspicious</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1a73e8] inline-block shadow-[0_0_8px_rgba(26,115,232,0.4)]" /> Verified</span>
            </div>
          </div>
          <Globe threats={threats} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ height: 360 }}>
          <AIPanel result={aiResult} loading={aiLoading} />
        </motion.div>
      </div>

      {/* Analytical Telemetry */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[#2d2e31] border border-[#3c4043] rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-black text-[#8ab4f8] tracking-widest uppercase mb-1">Temporal Detection Velocity</p>
            <p className="text-2xl font-bold text-white tracking-tight">System Performance Metrics</p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black text-[#5f6368] uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#ea4335] inline-block" /> High-Risk</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] inline-block" /> Neutral Signal</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={ANALYTICS_DATA.weekly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fill: '#5f6368', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5f6368', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="threats" stroke="#ea4335" strokeWidth={3} fillOpacity={0.1} fill="#ea4335" name="Threats" dot={false} />
            <Area type="monotone" dataKey="safe" stroke="#1a73e8" strokeWidth={3} fillOpacity={0.05} fill="#1a73e8" name="Neutral" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Interaction Feed */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#1a73e8]/10 border border-[#1a73e8]/20 shadow-lg">
              <Activity size={22} className="text-[#8ab4f8]" />
            </div>
            <div>
              <p className="text-xl font-bold text-white tracking-tight">Active Intelligence Registry</p>
              <div className="flex items-center gap-2.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse shadow-[0_0_8px_rgba(26,115,232,0.6)]" />
                <span className="text-[10px] text-[#5f6368] uppercase font-black tracking-widest leading-none">Global Interception Node: ONLINE</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#202124] border border-[#3c4043] rounded-2xl p-1 shadow-inner">
              {['all', 'unauthorized', 'suspicious'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${filter === f ? 'bg-[#1a73e8] text-white shadow-xl' : 'text-[#5f6368] hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button onClick={() => setSort(s => s === 'time' ? 'similarity' : 'time')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3c4043] border border-[#5f6368]/30 text-[10px] font-black uppercase tracking-widest text-[#9aa0a6] hover:text-white transition-all shadow-md">
              <SortDesc size={16} /> {sort === 'time' ? 'By Temporal Recency' : 'By Risk Magnitude'}
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.slice(0, 10).map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <ThreatRow threat={t} onAnalyze={handleAnalyze} onTakedown={handleTakedown} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
