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
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#2d2e31] border border-[#3c4043] rounded-xl">
            {['all','unauthorized','suspicious','safe'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all capitalize
                  ${filter === f ? 'bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/30' : 'text-[#9aa0a6] hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-[#9aa0a6]">{filtered.length} incidents shown</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="live-dot" />
          <span className="text-[#9aa0a6]">Live tracking active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Globe — main */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3 bg-[#202124] border border-[#3c4043] rounded-2xl relative overflow-hidden shadow-2xl" style={{ height: 520 }}>
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <GlobeIcon size={14} className="text-[#8ab4f8]" />
              <span className="text-xs font-mono text-[#9aa0a6] tracking-widest uppercase">Propagation Map</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <LegendItem color="bg-[#d93025]" label={`${unauthorized.length} Unauthorized`} />
              <LegendItem color="bg-[#f9ab00]" label={`${suspicious.length} Suspicious`} />
              <LegendItem color="bg-[#34a853]" label={`${threats.filter(t=>t.status==='safe').length} Safe`} />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
            <div className="flex gap-2 flex-wrap">
              {filtered.slice(0, 5).map(t => (
                <div key={t.id} className="text-[10px] font-mono px-2 py-1 rounded-lg backdrop-blur-sm"
                  style={{ background: 'rgba(32,33,36,0.8)', border: '1px solid rgba(60,64,67,0.6)' }}>
                  <span className={t.status === 'unauthorized' ? 'text-[#f28b82]' : t.status === 'suspicious' ? 'text-[#fdd663]' : 'text-[#81c995]'}>●</span>
                  {' '}{t.city || t.location}
                </div>
              ))}
            </div>
          </div>
          <Globe threats={filtered} />
        </motion.div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Top regions */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="aurora-card p-4">
            <p className="section-label mb-3">TOP THREAT REGIONS</p>
            <div className="space-y-2.5">
              {topRegions.map(([region, count], i) => (
                <div key={region}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-white">{region}</span>
                    <span className="text-[#9aa0a6]">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#3c4043] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / topRegions[0][1]) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: i === 0 ? '#d93025' : i === 1 ? '#f9ab00' : '#1a73e8' }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent incidents */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="aurora-card p-4">
            <p className="section-label mb-3">RECENT INCIDENTS</p>
            <div className="space-y-2">
              {threats.filter(t => t.status !== 'safe').slice(0, 5).map(t => (
                <div key={t.id} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#3c4043]/40 transition-colors cursor-pointer"
                  onClick={() => setSelected(t === selected ? null : t)}>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0
                    ${t.status === 'unauthorized' ? 'bg-[#ea4335]' : 'bg-[#fbbc05]'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-white truncate">{t.url}</p>
                    <p className="text-[11px] text-[#9aa0a6]">{t.location} · {formatDistanceToNow(new Date(t.timestamp), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats summary */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="aurora-card p-4">
            <p className="section-label mb-3">MAP SUMMARY</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Total Sites', value: threats.length, color: 'text-white' },
                { label: 'High Risk', value: threats.filter(t => t.risk === 'high').length, color: 'text-[#f28b82]' },
                { label: 'Countries', value: new Set(threats.map(t => t.location)).size, color: 'text-[#8ab4f8]' },
                { label: 'Est. Reach', value: `${(threats.reduce((s, t) => s + (t.views || 0), 0) / 1000).toFixed(0)}K`, color: 'text-[#fdd663]' },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded-xl bg-[#3c4043]/20 border border-[#3c4043] text-center">
                  <p className={`text-base font-display font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-[#9aa0a6]">{s.label}</p>
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
    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#9aa0a6] bg-[#202124]/70 backdrop-blur-sm px-2 py-1 rounded-lg w-fit border border-[#3c4043]">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
