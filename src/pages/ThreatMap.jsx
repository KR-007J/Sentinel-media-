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
           <p className="text-[10px] font-black text-[#8ab4f8] tracking-widest uppercase mb-1">Geospatial Distribution Overview</p>
           <h2 className="text-2xl font-bold text-white tracking-tight">Threat Propagation Map</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-[#202124] border border-[#3c4043] rounded-2xl shadow-inner">
            {['all','unauthorized','suspicious','safe'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${filter === f ? 'bg-[#1a73e8] text-white shadow-lg' : 'text-[#5f6368] hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#2d2e31] border border-[#3c4043] text-[10px] font-black text-[#5f6368] uppercase tracking-widest">
            <div className="live-dot" />
            <span>Telemetry Stream: Active</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3 bg-[#202124] border border-[#3c4043] rounded-[2.5rem] relative overflow-hidden shadow-2xl" style={{ height: 600 }}>
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <div className="flex items-center gap-2 mb-4 bg-[#2d2e31]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#3c4043]">
              <GlobeIcon size={14} className="text-[#8ab4f8]" />
              <span className="text-[10px] font-black text-white tracking-widest uppercase">Global Surveillance Node</span>
            </div>
            <div className="flex flex-col gap-2">
              <LegendItem color="bg-[#ea4335]" label={`${unauthorized.length} High Risk Interceptions`} />
              <LegendItem color="bg-[#fbbc05]" label={`${suspicious.length} Suspicious Signals`} />
              <LegendItem color="bg-[#1a73e8]" label={`${threats.filter(t=>t.status==='safe').length} Verified Assets`} />
            </div>
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 z-10 pointer-events-none">
            <div className="flex gap-2 flex-wrap">
              {filtered.slice(0, 8).map(t => (
                <div key={t.id} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-xl border border-white/5 bg-black/40 text-white flex items-center gap-2">
                  <span className={t.status === 'unauthorized' ? 'text-[#ea4335]' : t.status === 'suspicious' ? 'text-[#fbbc05]' : 'text-[#1a73e8]'}>●</span>
                  {t.city || t.location}
                </div>
              ))}
            </div>
          </div>
          <Globe threats={filtered} />
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#2d2e31] border border-[#3c4043] p-6 rounded-[2rem] shadow-xl">
            <p className="text-[10px] font-black text-[#5f6368] tracking-widest uppercase mb-4">Regional Criticality</p>
            <div className="space-y-5">
              {topRegions.map(([region, count], i) => (
                <div key={region}>
                  <div className="flex justify-between text-[11px] font-black mb-2 uppercase tracking-tight">
                    <span className="text-white">{region}</span>
                    <span className="text-[#8ab4f8]">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#202124] rounded-full overflow-hidden shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / topRegions[0][1]) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full shadow-lg"
                      style={{ background: i === 0 ? '#ea4335' : i === 1 ? '#fbbc05' : '#1a73e8' }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#2d2e31] border border-[#3c4043] p-6 rounded-[2rem] shadow-xl flex-1 overflow-hidden">
            <p className="text-[10px] font-black text-[#5f6368] tracking-widest uppercase mb-4">Signal Logs</p>
            <div className="space-y-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '300px' }}>
              {threats.filter(t => t.status !== 'safe').slice(0, 10).map(t => (
                <div key={t.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#3c4043] transition-all cursor-pointer border border-transparent hover:border-[#5f6368]/30 group"
                  onClick={() => setSelected(t === selected ? null : t)}>
                  <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 shadow-lg ${t.status === 'unauthorized' ? 'bg-[#ea4335] shadow-[#ea4335]/20' : 'bg-[#fbbc05] shadow-[#fbbc05]/20'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate group-hover:text-[#8ab4f8] transition-colors">{t.url}</p>
                    <p className="text-[10px] text-[#5f6368] font-bold uppercase tracking-tight mt-1">{t.location} · {formatDistanceToNow(new Date(t.created_at))} ago</p>
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
