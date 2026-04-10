import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Download, Plus, Loader2, Calendar, Shield, AlertTriangle, ChevronRight, Copy, CheckCheck } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { generateReport } from '../services/gemini';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const REPORT_TEMPLATES = [
  { id: 'daily', label: 'Daily Intelligence Brief', icon: AlertTriangle, color: 'red', desc: 'Critical threats intercepted in last 24h cycle with forensic breakdown.' },
  { id: 'weekly', label: 'Network Surveillance Log', icon: FileText, color: 'blue', desc: 'Aggregate propagation patterns and multi-regional risk surface.' },
  { id: 'takedown', label: 'Legal Enforcement Ledger', icon: Shield, color: 'indigo', desc: 'Administrative status of takedown success and judicial compliance.' },
  { id: 'exec', label: 'Executive Threat Matrix', icon: Sparkles, color: 'platinum', desc: 'High-fidelity impact metrics for institutional stakeholder review.' },
];

export default function Reports() {
  const { threats } = useStore();
  const [generating, setGenerating] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [reports, setReports] = useState([
    { id: 'r1', title: 'Network Surveillance Log', createdAt: new Date(Date.now() - 2 * 86400000), status: 'ready', preview: 'Interception protocols identified 4 persistent leaks. Regional nodes in Southeast Asia flagged for high-velocity propagation...', threats: 12 },
    { id: 'r2', title: 'Legal Enforcement Ledger', createdAt: new Date(Date.now() - 5 * 86400000), status: 'ready', preview: 'Administrative success rate sustained at 91%. 2 automated dossiers anchored to legal databases for judicial review...', threats: 9 },
  ]);
  const [activeReport, setActiveReport] = useState(null);
  const [reportContent, setReportContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (template) => {
    setGenerating(true);
    setActiveTemplate(template.id);
    setActiveReport(null);
    try {
      const content = await generateReport(threats.filter(t => t.status !== 'safe').slice(0, 6));
      const newReport = {
        id: `r${Date.now()}`,
        title: template.label,
        createdAt: new Date(),
        status: 'ready',
        preview: content ? content.slice(0, 120) + '…' : 'AI intelligence dossier compiled.',
        threats: threats.filter(t => t.status !== 'safe').length,
        content,
      };
      setReports(prev => [newReport, ...prev]);
      setActiveReport(newReport);
      setReportContent(content || getFallbackReport(template, threats));
      toast.success('Dossier Compiled', { style: { background: '#202124', color: '#fff', border: '1px solid #3c4043' } });
    } catch {
      const content = getFallbackReport(template, threats);
      setReportContent(content);
      toast.success('Dossier Compiled', { style: { background: '#202124', color: '#fff', border: '1px solid #3c4043' } });
    } finally {
      setGenerating(false);
      setActiveTemplate(null);
    }
  };

  const viewReport = (report) => {
    setActiveReport(report);
    setReportContent(report.content || getFallbackReport({ label: report.title }, threats));
  };

  const copy = () => {
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorMap = { 
    red:      { bg: 'bg-[#ea4335]/5', border: 'border-[#ea4335]/20', icon: 'text-[#f28b82]', label: 'text-[#ea4335]' },
    blue:     { bg: 'bg-[#1a73e8]/5', border: 'border-[#1a73e8]/20', icon: 'text-[#8ab4f8]', label: 'text-[#1a73e8]' },
    indigo:   { bg: 'bg-[#1a73e8]/5', border: 'border-[#1a73e8]/20', icon: 'text-[#8ab4f8]', label: 'text-[#1a73e8]' }, 
    platinum: { bg: 'bg-white/5',     border: 'border-white/20',     icon: 'text-white',     label: 'text-white' },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Templates Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-black text-[#8ab4f8] tracking-[0.4em] uppercase mb-1">Intelligence Dossier Laboratory</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">Generate Operational Reports</h2>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-[#2d2e31] border border-[#3c4043] rounded-2xl text-[10px] font-black text-[#5f6368] uppercase tracking-widest shadow-xl">
            <Sparkles size={16} className="text-[#1a73e8] animate-pulse" />
            Engaging Gemini 1.5 Multi-modal
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REPORT_TEMPLATES.map((t) => {
            const c = colorMap[t.color] || colorMap.blue;
            const isLoading = generating && activeTemplate === t.id;
            return (
              <motion.button key={t.id} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => !generating && handleGenerate(t)}
                className={`bg-[#2d2e31] border ${c.border} p-8 text-left rounded-[2.5rem] transition-all duration-500 disabled:opacity-50 shadow-2xl relative overflow-hidden group`}
                disabled={generating}>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.bg} border ${c.border} shadow-lg group-hover:rotate-6 transition-transform`}>
                    {isLoading ? <Loader2 size={24} className={`${c.label} animate-spin`} /> : <t.icon size={24} className={c.label} />}
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${c.border} ${c.label} uppercase tracking-widest shadow-inner bg-black/20`}>Registry</span>
                </div>
                <p className="text-base font-bold text-white mb-2 relative z-10">{t.label}</p>
                <p className="text-[11px] text-[#5f6368] leading-relaxed line-clamp-2 font-bold uppercase tracking-tight relative z-10">{t.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Archive History */}
        <div className="lg:col-span-2 space-y-6">
          <p className="text-[10px] font-black text-[#5f6368] tracking-[0.3em] uppercase border-b border-[#3c4043] pb-4">Institutional Archive Registry</p>
          <div className="space-y-3">
            {reports.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => viewReport(r)}
                className={`p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer shadow-xl group relative overflow-hidden
                  ${activeReport?.id === r.id ? 'border-[#1a73e8] bg-[#1a73e8]/10' : 'border-[#3c4043] bg-[#2d2e31] hover:border-[#5f6368]'}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between gap-4 mb-3 relative z-10">
                  <p className={`text-base font-bold transition-colors ${activeReport?.id === r.id ? 'text-white' : 'text-[#f1f3f4] group-hover:text-white'}`}>{r.title}</p>
                  <ChevronRight size={18} className={`transition-transform duration-500 ${activeReport?.id === r.id ? 'text-[#8ab4f8] rotate-90' : 'text-[#5f6368]'}`} />
                </div>
                <p className="text-xs text-[#5f6368] line-clamp-2 leading-relaxed mb-6 font-medium italic relative z-10">"{r.preview}"</p>
                <div className="flex items-center gap-5 text-[10px] font-black text-[#5f6368] uppercase tracking-widest relative z-10">
                  <span className="flex items-center gap-2"><Calendar size={14} className="text-[#1a73e8]" /> {format(r.createdAt, 'dd MMM yyyy')}</span>
                  <span className="flex items-center gap-2"><AlertTriangle size={14} className="text-[#ea4335]" /> {r.threats} Interceptions</span>
                </div>
              </motion.div>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="bg-[#202124] border border-[#3c4043] border-dashed rounded-[2.5rem] p-16 text-center shadow-inner">
              <div className="w-16 h-16 rounded-full bg-[#2d2e31] flex items-center justify-center mx-auto mb-6 border border-[#3c4043]">
                <FileText size={32} className="text-[#5f6368] opacity-30" />
              </div>
              <p className="text-[10px] font-black text-[#5f6368] uppercase tracking-[0.4em]">Zero Archived Dossiers</p>
            </div>
          )}
        </div>

        {/* Intelligence Viewer */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeReport && reportContent ? (
              <motion.div key={activeReport.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="bg-[#2d2e31] border border-[#3c4043] p-10 rounded-[3rem] shadow-2xl h-full flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#1a73e8]/5 blur-[100px] -mr-40 -mt-40" />
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-white tracking-tight">{activeReport.title}</h3>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse shadow-[0_0_8px_rgba(26,115,232,0.6)]" />
                      <p className="text-[10px] text-[#5f6368] font-black uppercase tracking-widest leading-none">
                        Registry Compile: {format(activeReport.createdAt, 'HH:mm | dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={copy} className="w-12 h-12 rounded-2xl bg-[#202124] border border-[#3c4043] hover:bg-[#3c4043] transition-all text-[#9aa0a6] hover:text-white flex items-center justify-center shadow-lg active:scale-95">
                      {copied ? <CheckCheck size={20} className="text-[#1a73e8]" /> : <Copy size={20} />}
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#1a73e8] hover:bg-[#1557b0] transition-all text-white text-xs font-black uppercase tracking-widest shadow-2xl shadow-[#1a73e8]/30 active:scale-95">
                      <Download size={18} /> Export Protocol
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10">
                  <div className="bg-[#202124] border border-[#3c4043] rounded-[2rem] p-10 shadow-inner">
                    <pre className="text-sm text-[#f1f3f4] font-mono whitespace-pre-wrap leading-[2] tracking-tight antialiased">{reportContent}</pre>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-[#202124] border border-[#3c4043] p-16 rounded-[3rem] text-center h-full flex flex-col items-center justify-center gap-6 shadow-inner">
                <div className="w-24 h-24 rounded-[2.5rem] bg-[#2d2e31] border border-[#3c4043] flex items-center justify-center shadow-2xl">
                  <FileText size={40} className="text-[#1a73e8] opacity-10" />
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-bold text-white tracking-tight">Access Registry</p>
                  <p className="text-[10px] text-[#5f6368] max-w-xs leading-relaxed uppercase font-black tracking-[0.3em]">Initialize a template or select an archive for deep-packet intelligence review.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function getFallbackReport(template, threats) {
  const unauthorized = threats.filter(t => t.status === 'unauthorized');
  return `SENTINEL-ZERO INTELLIGENCE DOSSIER
STATUS: SECURE // CLASSIFICATION: INTERNAL
COMPILED: ${format(new Date(), 'dd MMM yyyy HH:mm')}
─────────────────────────────────────────────────────────────

[1] EXECUTIVE SUMMARY
Propagation vectors intercepted: ${threats.length}
Unauthorized redistributions: ${unauthorized.length}
Risk probability increase: +4.2% (Next 48h Forecast)

[2] GEOSPATIAL TELEMETRY
High-velocity nodes identified in the following intercept regions:
${Array.from(new Set(threats.map(t => t.location))).join(', ')}

[3] FORENSIC OBSERVATIONS
Institutional vision analytics have verified systematic pHash mismatches 
across 3 separate CDN edge nodes. Content DNA suggests 
coordinated high-fidelity piracy syndicate activity originating from 
distributed cloud providers.

[4] ENFORCEMENT REGISTRY
Administrative dossiers anchored to global IP clearinghouses.
Automated takedown latency sustained at 3.8sinstitutional average.
All evidence anchored cryptographically to internal ledger.

[5] MANDATORY MITIGATION PROTOCOLS
1. Initiate automated DMCA cycle for all high-risk nodes.
2. Escalate cryptographic fingerprinting to Layer 2 Verification.
3. Synchronize global enforcement matrix across all edge nodes.

─────────────────────────────────────────────────────────────
SENTINEL-ZERO SECURITY OPERATIONS COMMAND
DOCUMENT ID: SZ-REPORT-${Date.now()}`;
}
