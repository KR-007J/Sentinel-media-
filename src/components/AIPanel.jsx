import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, CheckCheck, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';

export default function AIPanel({ result, loading, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusIcon = {
    unauthorized: <AlertTriangle size={18} className="text-[#ea4335]" />,
    suspicious:   <Clock size={18} className="text-[#fbbc05]" />,
    safe:         <CheckCircle size={18} className="text-[#1a73e8]" />,
  };

  const statusColor = {
    unauthorized: 'border-[#ea4335]/30 bg-[#ea4335]/5',
    suspicious:   'border-[#fbbc05]/30 bg-[#fbbc05]/5',
    safe:         'border-[#1a73e8]/30 bg-[#1a73e8]/5',
  };

  return (
    <div className="bg-[#2d2e31] border border-[#3c4043] p-6 rounded-[2rem] h-full flex flex-col shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a73e8]/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1a73e8]/10 border border-[#1a73e8]/20 shadow-lg">
            <Sparkles size={18} className="text-[#8ab4f8]" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Gemini AI Analysis</span>
            <span className="text-[10px] text-[#5f6368] font-black uppercase tracking-widest">Inference Protocol active</span>
          </div>
        </div>
        <button onClick={copy} className="w-9 h-9 rounded-xl border border-[#3c4043] flex items-center justify-center text-[#9aa0a6] hover:text-white hover:bg-[#3c4043] transition-all shadow-md">
          {copied ? <CheckCheck size={14} className="text-[#1a73e8]" /> : <Copy size={14} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-5">
              <div className="relative">
                <Loader2 size={32} className="text-[#8ab4f8] animate-spin" />
                <div className="absolute inset-0 rounded-full border-b-2 border-[#1a73e8] animate-[spin_1s_linear_infinite]" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-widest">Processing Intelligence...</p>
                <p className="text-[10px] text-[#5f6368] uppercase font-bold tracking-tighter">Querying Multi-modal Neural Net</p>
              </div>
              <div className="w-48 h-1 bg-[#202124] rounded-full overflow-hidden border border-[#3c4043]">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#1a73e8] to-[#8ab4f8]"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              </div>
            </motion.div>
          )}

          {!loading && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Status Header */}
              <div className={`rounded-2xl border p-5 ${statusColor[result.status] || statusColor.safe} shadow-inner`}>
                <div className="flex items-center gap-3 mb-3">
                  {statusIcon[result.status]}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8ab4f8]">Classification</span>
                    <p className="font-bold text-sm text-white uppercase leading-none">
                      {result.status}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-[10px] font-black text-[#5f6368] uppercase block tracking-tighter">Confidence</span>
                    <p className="text-sm font-mono font-bold text-white">{result.confidence}%</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 shadow-inner">
                  <p className="text-xs text-[#9aa0a6] leading-relaxed italic">"{result.reason}"</p>
                </div>
              </div>

              {/* Risk Matrix */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#3c4043] bg-[#202124] p-4 shadow-md">
                  <p className="text-[9px] font-black text-[#5f6368] mb-2 tracking-widest uppercase">Risk Intensity</p>
                  <p className={`text-base font-bold font-mono uppercase tracking-tight ${result.risk_level === 'high' ? 'text-[#f28b82]' : result.risk_level === 'medium' ? 'text-[#fdd663]' : 'text-[#8ab4f8]'}`}>
                    {result.risk_level}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#3c4043] bg-[#202124] p-4 shadow-md">
                  <p className="text-[9px] font-black text-[#5f6368] mb-2 tracking-widest uppercase">Target Action</p>
                  <p className="text-base font-bold font-mono uppercase text-white tracking-tight">{result.action}</p>
                </div>
              </div>

              {/* Mitigation Protocols */}
              {result.recommended_actions?.length > 0 && (
                <div className="rounded-2xl border border-[#3c4043] bg-[#2d2e31] p-5 shadow-xl">
                  <p className="text-[9px] font-black text-[#8ab4f8] mb-4 tracking-[0.2em] uppercase">Recommended Mitigation Protocols</p>
                  <ul className="space-y-3">
                    {result.recommended_actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-white/70 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] mt-1.5 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Regulatory Anchor */}
              {result.legal_basis && (
                <div className="rounded-2xl border border-[#3c4043] bg-[#202124]/50 p-4">
                  <p className="text-[9px] font-black text-[#5f6368] mb-2 tracking-widest uppercase">Legal/Regulatory Basis</p>
                  <p className="text-[11px] text-[#9aa0a6] font-mono leading-relaxed">{result.legal_basis}</p>
                </div>
              )}
            </motion.div>
          )}

          {!loading && !result && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 gap-4 text-[#5f6368]">
              <div className="w-16 h-16 rounded-full bg-[#202124] flex items-center justify-center border border-[#3c4043] shadow-inner mb-2">
                <Sparkles size={24} className="opacity-20 translate-y-[-2px]" />
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest">Standing By</p>
                <p className="text-[10px] font-bold mt-1 uppercase opacity-60">Input Telemetry for Live Analysis</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
