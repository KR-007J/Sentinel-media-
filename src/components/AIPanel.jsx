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
    unauthorized: <AlertTriangle size={16} className="text-aurora-rose" />,
    suspicious:   <Clock size={16} className="text-aurora-amber" />,
    safe:         <CheckCircle size={16} className="text-aurora-emerald" />,
  };

  const statusColor = {
    unauthorized: 'border-aurora-rose/30 bg-aurora-rose/5',
    suspicious:   'border-aurora-amber/30 bg-aurora-amber/5',
    safe:         'border-aurora-emerald/30 bg-aurora-emerald/5',
  };

  return (
    <div className="aurora-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Sparkles size={14} className="text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-aurora-text">Gemini AI Analysis</span>
        </div>
        <button onClick={copy} className="w-7 h-7 rounded-lg border border-aurora-border flex items-center justify-center text-aurora-muted hover:text-aurora-text transition-all">
          {copied ? <CheckCheck size={13} className="text-aurora-emerald" /> : <Copy size={13} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-40 gap-3">
              <Loader2 size={24} className="text-indigo-400 animate-spin" />
              <p className="text-sm text-aurora-muted">Gemini analyzing threat...</p>
              <div className="w-48 h-1 bg-aurora-border rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
              </div>
            </motion.div>
          )}

          {!loading && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {/* Status */}
              <div className={`rounded-xl border p-3.5 ${statusColor[result.status] || statusColor.safe}`}>
                <div className="flex items-center gap-2 mb-1">
                  {statusIcon[result.status]}
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-aurora-text">
                    {result.status}
                  </span>
                  <span className="ml-auto font-mono text-xs text-aurora-muted">
                    {result.confidence}% confidence
                  </span>
                </div>
                <p className="text-xs text-aurora-text leading-relaxed">{result.reason}</p>
              </div>

              {/* Risk + Action */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-aurora-border bg-aurora-subtle p-3">
                  <p className="text-[10px] font-mono text-aurora-muted mb-1 tracking-widest">RISK LEVEL</p>
                  <p className="text-sm font-bold font-mono uppercase"
                    style={{ color: result.risk_level === 'high' ? '#fb7185' : result.risk_level === 'medium' ? '#fbbf24' : '#34d399' }}>
                    {result.risk_level}
                  </p>
                </div>
                <div className="rounded-xl border border-aurora-border bg-aurora-subtle p-3">
                  <p className="text-[10px] font-mono text-aurora-muted mb-1 tracking-widest">ACTION</p>
                  <p className="text-sm font-bold font-mono uppercase text-aurora-text">{result.action}</p>
                </div>
              </div>

              {/* Recommended actions */}
              {result.recommended_actions?.length > 0 && (
                <div className="rounded-xl border border-aurora-border p-3">
                  <p className="text-[10px] font-mono text-aurora-muted mb-2 tracking-widest">RECOMMENDED ACTIONS</p>
                  <ul className="space-y-1.5">
                    {result.recommended_actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-aurora-text">
                        <span className="text-indigo-400 font-mono mt-0.5">→</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal basis */}
              {result.legal_basis && (
                <div className="rounded-xl border border-aurora-border bg-aurora-subtle p-3">
                  <p className="text-[10px] font-mono text-aurora-muted mb-1 tracking-widest">LEGAL BASIS</p>
                  <p className="text-xs text-aurora-text font-mono">{result.legal_basis}</p>
                </div>
              )}
            </motion.div>
          )}

          {!loading && !result && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-40 gap-2 text-aurora-muted">
              <Sparkles size={20} className="opacity-30" />
              <p className="text-sm">Select a threat to analyze</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
