import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Flag, Eye, AlertTriangle, CheckCircle, Globe, ShieldAlert, FileText, Loader2, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { createLegalDossier } from '../services/gemini';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function ThreatRow({ threat, onAnalyze, onTakedown }) {
  const [expanded, setExpanded] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [loadingDossier, setLoadingDossier] = useState(false);

  const statusColors = {
    unauthorized: { badge: 'status-badge-threat', dot: 'bg-rose-500', label: 'UNAUTHORIZED', glow: 'shadow-[0_0_12px_rgba(244,63,94,0.4)]' },
    suspicious:   { badge: 'status-badge-warn',   dot: 'bg-amber-500', label: 'SUSPICIOUS',   glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]' },
    safe:         { badge: 'status-badge-safe',   dot: 'bg-emerald-500', label: 'SAFE',       glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]' },
  };
  const sc = statusColors[threat.status] || statusColors.safe;

  const similarityColor = threat.similarity > 85 ? '#fb7185' : threat.similarity > 60 ? '#fbbf24' : '#34d399';

  const handleGenerateDossier = async (e) => {
    e.stopPropagation();
    setLoadingDossier(true);
    setExpanded(true);
    try {
      const res = await createLegalDossier(threat);
      setDossier(res);
      toast.success('Legal Dossier generated successfully');
    } catch (error) {
      toast.error('Failed to generate dossier');
    } finally {
      setLoadingDossier(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="aurora-card mb-2 group border-white/[0.04] hover:border-white/[0.1]"
    >
      <div 
        className="flex items-center gap-4 px-6 py-4 cursor-pointer relative"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-2/3 bg-indigo-500/50 transition-all duration-300 rounded-full" />

        <div className="relative flex-shrink-0">
          <div className={clsx('w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-125', sc.dot, sc.glow)} />
          {threat.status === 'unauthorized' && (
            <div className={clsx('absolute inset-0 rounded-full animate-ping', sc.dot, 'opacity-30')} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-white/90 truncate tracking-tight">{threat.url}</p>
            {threat.risk === 'high' && (
              <ShieldAlert size={12} className="text-rose-400 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-indigo-400/70">{threat.platform}</span>
            <span className="text-[10px] text-white/20">•</span>
            <span className="text-[10px] font-medium text-white/40 truncate">{threat.asset}</span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center gap-1 w-28 flex-shrink-0">
          <div className="flex justify-between w-full text-[10px] font-mono font-bold">
            <span className="text-white/20 uppercase tracking-tighter">Match</span>
            <span style={{ color: similarityColor }}>{threat.similarity}%</span>
          </div>
          <div className="w-full h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${threat.similarity}%` }} 
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full" 
              style={{ background: similarityColor, boxShadow: `0 0 8px ${similarityColor}66` }} 
            />
          </div>
        </div>

        <div className="hidden sm:block flex-shrink-0 w-28 text-right">
          <span className={sc.badge}>
            {sc.label}
          </span>
        </div>

        <div className="hidden md:block flex-shrink-0 w-24 text-right">
          <p className="text-[10px] font-mono font-bold text-white/30 truncate">
            {formatDistanceToNow(new Date(threat.timestamp), { addSuffix: true })}
          </p>
        </div>

        <ChevronDown 
          size={14} 
          className={clsx('text-white/20 flex-shrink-0 transition-all duration-300 group-hover:text-white/50', expanded && 'rotate-180 text-white/60')} 
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }} 
            className="border-t border-white/[0.04] overflow-hidden bg-white/[0.01]"
          >
            <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                  <p className="text-[10px] font-mono font-bold text-indigo-400 tracking-[0.2em] uppercase">Intelligence Brief</p>
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-medium bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                  {threat.reason || "Analyzing specific forensic markers... match verified via Content DNA fingerprinting."}
                </p>
                
                {dossier && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                        <FileText size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Legal Evidence Dossier</span>
                       </div>
                       <button className="flex items-center gap-1.5 text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors">
                        <Download size={12} /> Export PDF
                       </button>
                    </div>
                    <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-white/50 bg-indigo-500/[0.03] p-5 rounded-2xl border border-indigo-500/10 max-h-64 overflow-y-auto aurora-scrollbar">
                      {dossier}
                    </pre>
                  </motion.div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Confidence', val: `${threat.confidence}%`, icon: CheckCircle },
                    { label: 'Est. Reach', val: threat.views?.toLocaleString() || '4.2K', icon: Eye },
                    { label: 'Geo Origin', val: threat.location, icon: Globe },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] group/item hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-2 mb-1.5 opacity-40">
                        <item.icon size={12} className="text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                      </div>
                      <p className="text-sm font-bold text-white/90">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center gap-3 border-l border-white/[0.04] pl-6">
                <p className="text-[10px] font-mono font-bold text-white/30 tracking-[0.2em] uppercase mb-1">Autonomous Liaison</p>
                
                {threat.status === 'unauthorized' && (
                  <>
                    <button 
                      onClick={() => onTakedown?.(threat)} 
                      className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Flag size={14} /> Formal Takedown
                    </button>
                    <button 
                      onClick={handleGenerateDossier}
                      disabled={loadingDossier}
                      className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loadingDossier ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                      {dossier ? "Dossier Ready" : "Generate Dossier"}
                    </button>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button 
                    onClick={() => onAnalyze?.(threat)} 
                    className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white/70 py-2.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Eye size={12} /> Rescan
                  </button>
                  <a 
                    href={`https://${threat.url}`} target="_blank" rel="noopener noreferrer"
                    className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white/70 py-2.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <ExternalLink size={12} /> Source
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
