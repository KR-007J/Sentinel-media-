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
    <div className="aurora-card px-3 py-2 text-xs font-mono">
      <p className="text-aurora-muted mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { threats, stats, addThreat } = useStore();
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
    toast.success(`DMCA takedown queued for ${threat.url}`, { icon: '⚡' });
  };

  // Simulate live incoming threat every 20s
  useEffect(() => {
    const iv = setInterval(() => {
      const newThreat = {
        id: `live_${Date.now()}`,
        url: `live-stream-${Math.floor(Math.random() * 999)}.io/clip`,
        similarity: Math.floor(Math.random() * 40) + 55,
        watermark: Math.random() > 0.6,
        location: ['India', 'Pakistan', 'UAE', 'UK'][Math.floor(Math.random() * 4)],
        city: 'Unknown',
        lat: 20 + Math.random() * 30,
        lng: 70 + Math.random() * 40,
        status: Math.random() > 0.5 ? 'unauthorized' : 'suspicious',
        confidence: Math.floor(Math.random() * 30) + 65,
        risk: Math.random() > 0.5 ? 'high' : 'medium',
        action: 'flag',
        timestamp: new Date().toISOString(),
        asset: 'Live Broadcast',
        platform: 'Unknown Stream',
        reason: 'Auto-detected by live monitoring agent.',
        views: Math.floor(Math.random() * 8000) + 500,
        spread: Math.floor(Math.random() * 5) + 1,
      };
      addThreat(newThreat);
      toast(`New threat detected: ${newThreat.url.substring(0, 28)}…`, { icon: '🚨', style: { borderColor: 'rgba(244,63,94,0.4)' } });
    }, 20000);
    return () => clearInterval(iv);
  }, []);

  const unauthorized = threats.filter(t => t.status === 'unauthorized').length;
  const suspicious = threats.filter(t => t.status === 'suspicious').length;
  const safe = threats.filter(t => t.status === 'safe').length;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Shield} label="Assets Protected" value={stats.assetsProtected} color="indigo" delay={0} trend="+3 this week" />
        <StatsCard icon={AlertTriangle} label="Active Threats" value={unauthorized} color="rose" delay={0.05} trend="+12%" trendUp />
        <StatsCard icon={Clock} label="Under Review" value={suspicious} color="amber" delay={0.1} />
        <StatsCard icon={CheckCircle} label="Takedowns Sent" value={stats.takedownsSent} color="emerald" delay={0.15} trend="+8 today" />
      </div>

      {/* Globe + AI Panel */}
      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 aurora-card p-1 relative" style={{ height: 320 }}>
          <div className="absolute top-4 left-4 z-10">
            <p className="text-xs font-mono text-aurora-muted tracking-widest">GLOBAL THREAT MAP</p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Unauthorized</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Suspicious</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Safe</span>
            </div>
          </div>
          <Globe threats={threats} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ height: 320 }}>
          <AIPanel result={aiResult} loading={aiLoading} />
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="aurora-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label">WEEKLY ACTIVITY</p>
            <p className="text-sm font-semibold text-aurora-text mt-1">Threat detection trend</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-aurora-muted">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-400 inline-block" /> Threats</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block" /> Suspicious</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Safe</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={ANALYTICS_DATA.weekly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSafe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Fira Code' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={1.5} fill="url(#gThreats)" name="Threats" dot={false} />
            <Area type="monotone" dataKey="suspicious" stroke="#f59e0b" strokeWidth={1.5} fill="none" strokeDasharray="3 3" name="Suspicious" dot={false} />
            <Area type="monotone" dataKey="safe" stroke="#10b981" strokeWidth={1.5} fill="url(#gSafe)" name="Safe" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Threat feed */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-indigo-400" />
            <span className="font-display font-semibold text-aurora-text">Live Threat Feed</span>
            <div className="live-dot scale-75" />
          </div>
          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="flex items-center gap-1 border border-aurora-border rounded-xl overflow-hidden">
              {['all', 'unauthorized', 'suspicious', 'safe'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-mono transition-all ${filter === f ? 'bg-indigo-500/15 text-indigo-300' : 'text-aurora-muted hover:text-aurora-text'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button onClick={() => setSort(s => s === 'time' ? 'similarity' : 'time')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-aurora-border text-xs font-mono text-aurora-muted hover:text-aurora-text transition-all">
              <SortDesc size={12} /> {sort === 'time' ? 'Time' : 'Similarity'}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          {filtered.slice(0, 8).map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <ThreatRow threat={t} onAnalyze={handleAnalyze} onTakedown={handleTakedown} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
