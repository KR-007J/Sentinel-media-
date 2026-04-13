import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Copy, CheckCheck, AlertTriangle, 
  CheckCircle, Clock, Loader2, Zap, Shield, Target
} from 'lucide-react';

export default function AIPanel({ result, loading, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusColor = {
    unauthorized: 'border-red-500/30 bg-red-500/5 text-red-400',
    suspicious:   'border-amber-500/30 bg-amber-500/5 text-amber-400',
    safe:         'border-cyan-500/30 bg-cyan-500/5 text-cyan-400',
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full relative overflow-hidden group border-slate-800 bg-slate-900/40">
      {/* Decorative HUD Elements */}
      <div className="absolute top-0 right-0 p-2 opacity-20">
        <Target size={40} className="text-cyan-500/20 rotate-45" />
      </div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Zap size={18} className="text-cyan-400 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-black text-white block uppercase tracking-widest font-tech">Quantum Intelligence</span>
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">Neural Thread Analysis Active</span>
          </div>
        </div>
        <button onClick={copy} className="p-2 rounded-lg border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-all">
          {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-6">
              <div className="relative">
                <Loader2 size={40} className="text-cyan-500 animate-spin" />
                <div className="absolute inset-0 rounded-full border-b-2 border-purple-500 animate-[spin_1.5s_linear_infinite]" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Running Inference...</p>
                <div className="flex gap-1 justify-center">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : result ? (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* STATUS SUMMARY */}
              <div className={`rounded-xl border p-4 ${statusColor[result.status] || statusColor.safe}`}>
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <Shield size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Classification</span>
                   </div>
                   <span className="text-[10px] font-mono opacity-60">Confidence: {result.confidence}%</span>
                </div>
                <p className="font-tech font-bold text-lg uppercase tracking-tight text-white mb-3">
                  {result.status} {result.risk_level === 'high' ? 'DETECTION' : 'STATUS'}
                </p>
                <div className="p-3 bg-black/30 border border-white/5 rounded-lg">
                  <p className="text-xs text-slate-400 leading-relaxed italic font-medium">"{result.reason}"</p>
                </div>
              </div>

              {/* METRIC GRID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4 !bg-slate-900 border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 mb-2 tracking-widest uppercase">Risk Vector</p>
                  <p className={`text-base font-bold font-tech uppercase ${result.risk_level === 'high' ? 'text-red-400' : 'text-cyan-400'}`}>
                    {result.risk_level}
                  </p>
                </div>
                <div className="glass-card p-4 !bg-slate-900 border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 mb-2 tracking-widest uppercase">Target Action</p>
                  <p className="text-base font-bold font-tech uppercase text-white">{result.action}</p>
                </div>
              </div>

              {/* RECOMMENDATIONS */}
              {result.recommended_actions?.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-[9px] font-black text-cyan-500 tracking-[0.2em] uppercase">Tactical Recommendations</p>
                  <div className="space-y-2">
                    {result.recommended_actions.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 text-[11px] text-slate-300 font-medium p-3 bg-slate-800/20 border border-white/5 rounded-lg group hover:border-cyan-500/30 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DATA ANCHOR */}
              <div className="p-4 bg-cyan-900/10 border border-cyan-500/10 rounded-xl">
                 <div className="flex justify-between items-center text-[9px] font-mono text-cyan-400/60 uppercase mb-2">
                   <span>Neural Anchor ID</span>
                   <span>SHA-256</span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-mono truncate">0xbf21...ae938221004cd821a</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 gap-6 text-slate-600">
              <div className="w-20 h-20 rounded-2xl bg-slate-900/60 flex items-center justify-center border border-slate-800 shadow-inner group-hover:border-cyan-500/20 transition-all">
                <Sparkles size={32} className="opacity-10 group-hover:opacity-40 transition-opacity" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Tactical Idle</p>
                <p className="text-[9px] font-bold uppercase opacity-60">Awaiting Signal for Deep Analysis</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-[2px] animate-[scan_4s_linear_infinite]" />
    </div>
  );
}

