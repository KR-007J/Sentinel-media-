import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe as GlobeIcon, Filter, Maximize2, Info } from 'lucide-react';
import Globe from '../components/Globe';
import { useStore } from '../hooks/useStore';
import { formatDistanceToNow } from 'date-fns';

export default function ThreatMap() {
  const { threats } = useStore();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'all' ? threats : threats.filter(t => t.status === filter);
  const unauthorized = threats.filter(t => t.status === 'unauthorized');
  const suspicious = threats.filter(t => t.status === 'suspicious');

  const regionCounts = threats.reduce((acc, t) => {
    acc[t.location] = (acc[t.location] || 0) + 1;
    return acc;
  }, {});
  const topRegions = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <p className="text-[10px] font-black text-cyan-500 tracking-[0.4em] uppercase mb-1 italic">Geospatial Distribution Overview</p>
           <h2 className="text-3xl font-black text-white tracking-tight font-tech">THREAT PROPAGATION MAP</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
            {['all','unauthorized','suspicious','safe'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                  ${filter === f ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-[10px] font-black text-cyan-500 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span>Telemetry Stream: Active</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3 glass-card relative overflow-hidden h-[650px]">
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <div className="flex items-center gap-2 mb-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <GlobeIcon size={14} className="text-cyan-500" />
              <span className="text-[10px] font-black text-white tracking-widest uppercase">Global Surveillance Node [NEXUS-01]</span>
            </div>
            <div className="flex flex-col gap-2">
              <LegendItem color="bg-purple-500" label={`${unauthorized.length} High Risk Interceptions`} />
              <LegendItem color="bg-amber-500" label={`${suspicious.length} Suspicious Signals`} />
              <LegendItem color="bg-cyan-500" label={`${threats.filter(t=>t.status==='safe').length} Verified Assets`} />
            </div>
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 z-10 pointer-events-none">
            <div className="flex gap-2 flex-wrap">
              {filtered.slice(0, 12).map(t => (
                <div key={t.id} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg backdrop-blur-xl border border-white/10 bg-black/60 text-white flex items-center gap-2">
                  <span className={t.status === 'unauthorized' ? 'text-purple-500' : t.status === 'suspicious' ? 'text-amber-500' : 'text-cyan-500'}>●</span>
                  {t.city || t.location}
                </div>
              ))}
            </div>
          </div>
          <Globe threats={filtered} />
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6">
            <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-4 italic">Regional Criticality</p>
            <div className="space-y-6">
              {topRegions.map(([region, count], i) => (
                <div key={region}>
                  <div className="flex justify-between text-[11px] font-black mb-2 uppercase tracking-tight">
                    <span className="text-white">{region}</span>
                    <span className="text-cyan-500 font-tech">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / topRegions[0][1]) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                      style={{ background: i === 0 ? 'var(--secondary)' : 'var(--primary)', color: i === 0 ? 'rgba(168,85,247,0.4)' : 'rgba(6,182,212,0.4)' }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6 h-[290px] overflow-hidden flex flex-col">
            <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-4 italic">Recent Signal Logs</p>
            <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1">
              {threats.filter(t => t.status !== 'safe').slice(0, 10).map(t => (
                <div key={t.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                  onClick={() => setSelected(t === selected ? null : t)}>
                  <div className={`w-2 h-2 rounded-sm mt-1 flex-shrink-0 ${t.status === 'unauthorized' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-white truncate group-hover:text-cyan-500 transition-colors uppercase font-tech">{t.url}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-1 truncate">{t.location} · {formatDistanceToNow(new Date(t.created_at))} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2.5 text-[10px] font-black text-white bg-[#202124]/80 backdrop-blur-md px-4 py-2 rounded-2xl w-fit border border-[#3c4043] shadow-lg uppercase tracking-widest">
      <span className={`w-2.5 h-2.5 rounded-full ${color} shadow-lg`} />
      {label}
    </div>
  );
}
