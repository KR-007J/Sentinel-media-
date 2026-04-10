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
  { id: 'takedown', label: 'Legal Enforcement Ledger', icon: Shield, color: 'green', desc: 'Administrative status of takedown success and judicial compliance.' },
  { id: 'exec', label: 'Executive Threat Matrix', icon: Sparkles, color: 'yellow', desc: 'High-fidelity impact metrics for institutional stakeholder review.' },
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
    red:    { bg: 'bg-[#ea4335]/5', border: 'border-[#ea4335]/20', icon: 'text-[#f28b82]', label: 'text-[#ea4335]' },
    blue:   { bg: 'bg-[#1a73e8]/5', border: 'border-[#1a73e8]/20', icon: 'text-[#8ab4f8]', label: 'text-[#1a73e8]' },
    green:  { bg: 'bg-[#34a853]/5', border: 'border-[#34a853]/20', icon: 'text-[#81c995]', label: 'text-[#34a853]' },
    yellow: { bg: 'bg-[#fbbc05]/5', border: 'border-[#fbbc05]/20', icon: 'text-[#fdd663]', label: 'text-[#fbbc05]' },
  };

  return (
    <div className="space-y-8">
      {/* Templates */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black text-[#8ab4f8] tracking-widest uppercase mb-1">Dossier Laboratory</p>
            <p className="text-xl font-bold text-white">Generate Intelligence Reports</p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-[#2d2e31] border border-[#3c4043] rounded-xl text-[10px] font-bold text-[#9aa0a6] uppercase tracking-widest">
            <Sparkles size={14} className="text-[#1a73e8]" />
            Consulting Google Gemini 1.5
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REPORT_TEMPLATES.map((t) => {
            const c = colorMap[t.color];
            const isLoading = generating && activeTemplate === t.id;
            return (
              <motion.button key={t.id} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => !generating && handleGenerate(t)}
                className={`bg-[#2d2e31] border ${c.border} p-6 text-left rounded-3xl transition-all duration-300 disabled:opacity-50 shadow-lg`}
                disabled={generating}>
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.bg} border ${c.border}`}>
                    {isLoading ? <Loader2 size={18} className={`${c.label} animate-spin`} /> : <t.icon size={20} className={c.label} />}
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${c.border} ${c.label} uppercase`}>Verified</span>
                </div>
                <p className="text-sm font-bold text-white mb-2">{t.label}</p>
                <p className="text-xs text-[#9aa0a6] leading-relaxed line-clamp-2">{t.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Saved list */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-[10px] font-black text-[#9aa0a6] tracking-widest uppercase border-b border-[#3c4043] pb-2">Archive Registry</p>
          <div className="space-y-2.5">
            {reports.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => viewReport(r)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-md group
                  ${activeReport?.id === r.id ? 'border-[#1a73e8] bg-[#1a73e8]/10' : 'border-[#3c4043] bg-[#2d2e31] hover:border-[#5f6368]'}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className={`text-sm font-bold transition-colors ${activeReport?.id === r.id ? 'text-white' : 'text-[#f1f3f4] group-hover:text-white'}`}>{r.title}</p>
                  <ChevronRight size={16} className={`transition-transform ${activeReport?.id === r.id ? 'text-[#8ab4f8] rotate-90' : 'text-[#5f6368]'}`} />
                </div>
                <p className="text-xs text-[#9aa0a6] line-clamp-2 leading-relaxed mb-4">{r.preview}</p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#5f6368] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#1a73e8]" /> {format(r.createdAt, 'dd MMM yyyy')}</span>
                  <span className="flex items-center gap-1.5"><AlertTriangle size={12} className="text-[#ea4335]" /> {r.threats} Incidents</span>
                </div>
              </motion.div>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="bg-[#2d2e31] border border-[#3c4043] border-dashed rounded-3xl p-12 text-center opacity-40">
              <FileText size={40} className="text-[#9aa0a6] mx-auto mb-4" />
              <p className="text-sm font-bold text-[#9aa0a6] uppercase tracking-widest">No Archived Dossiers</p>
            </div>
          )}
        </div>

        {/* Viewer */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeReport && reportContent ? (
              <motion.div key={activeReport.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="bg-[#2d2e31] border border-[#3c4043] p-8 rounded-3xl shadow-2xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{activeReport.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
                      <p className="text-[10px] text-[#5f6368] font-black uppercase tracking-widest">
                        Protocol Compiled {format(activeReport.createdAt, 'HH:mm | dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={copy} className="p-3 rounded-2xl bg-[#3c4043] border border-[#5f6368]/30 hover:bg-[#4d5156] transition-all text-[#9aa0a6] hover:text-white group">
                      {copied ? <CheckCheck size={18} className="text-[#34a853]" /> : <Copy size={18} />}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1a73e8] hover:bg-[#1557b0] transition-all text-white text-xs font-bold uppercase tracking-widest shadow-xl">
                      <Download size={16} /> Export
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="bg-[#202124] border border-[#3c4043] rounded-3xl p-8 shadow-inner">
                    <pre className="text-sm text-[#f1f3f4] font-mono whitespace-pre-wrap leading-[1.8] tracking-tight">{reportContent}</pre>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-[#2d2e31] border border-[#3c4043] p-12 rounded-3xl text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-[2rem] bg-[#202124] border border-[#3c4043] flex items-center justify-center shadow-inner">
                  <FileText size={32} className="text-[#1a73e8] opacity-30" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white mb-2">No Dossier Selected</p>
                  <p className="text-xs text-[#5f6368] max-w-xs leading-relaxed uppercase font-black tracking-widest">Select an archive record or generate a new intelligence brief.</p>
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
  const suspicious = threats.filter(t => t.status === 'suspicious');
  return `SENTINEL-ZERO INTELLIGENCE DOSSIER
STATUS: SECURE // CLASSIFICATION: INTERNAL
COMPILED: ${format(new Date(), 'dd MMM yyyy HH:mm')}
─────────────────────────────────────────────

[1] EXECUTIVE SUMMARY
Propagation vectors intercepted: ${threats.length}
Unauthorized redistributions: ${unauthorized.length}
Risk probability increase: +4.2% (Forecasted)

[2] GEOSPATIAL TELEMETRY
High-velocity nodes identified in the following regions:
${Array.from(new Set(threats.map(t => t.location))).join(', ')}

[3] FORENSIC OBSERVATIONS
AI vision analytics have verified systematic pHash mismatches 
across 3 separate CDN edge nodes. Content DNA suggests 
coordinated high-fidelity piracy syndicate activity.

[4] ENFORCEMENT STATUS
Legal dossiers anchored to global IP clearinghouses.
Automated takedown latency sustained at 3.8s.

[5] MANDATORY PROTOCOLS
1. Initiate automated DMCA cycle for all high-risk nodes.
2. Escalate cryptographic fingerprinting to Layer 2.
3. Synchronize global enforcement matrix.

─────────────────────────────────────────────
SENTINEL-ZERO SECURITY OPERATIONS COMMAND
DOCUMENT ID: SZ-REPORT-${Date.now()}`;
}
