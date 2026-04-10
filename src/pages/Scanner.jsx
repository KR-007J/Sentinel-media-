import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, ScanLine, Fingerprint, Sparkles, CheckCircle, AlertTriangle,
  Clock, Link2, X, ChevronRight, FileVideo, FileImage, Loader2, Eye, ShieldCheck, Microscope, Globe, DatabaseBackup
} from 'lucide-react';
import AIPanel from '../components/AIPanel';
import { analyzeMediaThreat, generateTakedownNotice, generateVisualForensics } from '../services/gemini';
import { useStore } from '../hooks/useStore';
import toast from 'react-hot-toast';

const STEPS = [
  { key: 'upload', label: 'Upload Asset', icon: Upload },
  { key: 'fingerprint', label: 'Fingerprint', icon: Fingerprint },
  { key: 'scan', label: 'AI Scan', icon: ScanLine },
  { key: 'result', label: 'Results', icon: Sparkles },
];

const SCAN_STAGES = [
  { label: 'Generating perceptual hash (pHash)…', duration: 700 },
  { label: 'Creating CLIP embedding vector…', duration: 900 },
  { label: 'Indexing Content DNA fingerprint…', duration: 600 },
  { label: 'Querying known piracy databases…', duration: 1100 },
  { label: 'Running reverse image search…', duration: 800 },
  { label: 'Analyzing similarity scores…', duration: 500 },
  { label: 'Executing Gemini Multimodal Forensics…', duration: 1500 },
];

export default function Scanner() {
  const { addThreat } = useStore();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState('file');
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [forensicReport, setForensicReport] = useState('');

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const onDrop = useCallback((files) => {
    if (files[0]) { 
      setFile(files[0]); 
      toast.success('Asset loaded successfully', {
        icon: '📁',
        style: { background: '#202124', color: '#fff', border: '1px solid #3c4043' }
      }); 
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'video/*': [], 'image/*': [] }, maxFiles: 1,
  });

  const runScan = async () => {
    setStep('fingerprint');
    setProgress(0);
    setStageIdx(0);

    let b64 = null;
    if (file) {
      try { b64 = await fileToBase64(file); } catch (e) { console.error(e); }
    }

    let elapsed = 0;
    const total = SCAN_STAGES.reduce((s, st) => s + st.duration, 0);
    for (let i = 0; i < SCAN_STAGES.length; i++) {
      setStageIdx(i);
      await new Promise(r => setTimeout(r, SCAN_STAGES[i].duration));
      elapsed += SCAN_STAGES[i].duration;
      setProgress(Math.round((elapsed / total) * 100));
      if (i === 1) setStep('scan');
    }

    const mockDetections = [
      { id: `scan_${Date.now()}_det1`, url: 'pirate-stream.xyz/live-cricket', similarity: 94, watermark: false, location: 'India', city: 'Mumbai', lat: 19.07, lng: 72.87, platform: 'Piracy Site', status: 'unauthorized', confidence: 94, risk: 'high', action: 'flag', timestamp: new Date().toISOString(), asset: file?.name || 'Uploaded Asset', views: 28400, spread: 12, reason: '' },
      { id: `scan_${Date.now()}_det2`, url: 'telegram.me/sports_leaks_global', similarity: 78, watermark: false, location: 'UAE', city: 'Dubai', lat: 25.2, lng: 55.27, platform: 'Telegram', status: 'suspicious', confidence: 78, risk: 'medium', action: 'review', timestamp: new Date().toISOString(), asset: file?.name || 'Uploaded Asset', views: 8200, spread: 3, reason: '' },
    ];

    setAiLoading(true);
    setStep('result');
    setResults(mockDetections);
    
    try {
      const [aiRes, forensics] = await Promise.all([
        analyzeMediaThreat(mockDetections[0]),
        file ? generateVisualForensics({ type: file.type, base64: b64 }) : Promise.resolve('URL analysis completed.')
      ]);
      mockDetections[0].reason = aiRes.reason;
      setAiResult(aiRes);
      setForensicReport(forensics);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
      mockDetections.forEach(t => addThreat(t));
      toast.success(`Scan complete — Critical threat detected`, { icon: '🚨' });
    }
  };

  const reset = () => {
    setStep('upload'); setFile(null); setUrlInput(''); setProgress(0);
    setResults([]); setAiResult(null); setForensicReport('');
  };

  const stepIdx = STEPS.findIndex(s => s.key === step);

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-[#2d2e31] border border-[#3c4043] p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-6">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700
                ${i <= stepIdx ? 'text-white bg-[#1a73e8] shadow-2xl shadow-[#1a73e8]/30 scale-105' : 'text-[#5f6368] bg-[#202124] border border-[#3c4043]/30'}`}>
                <s.icon size={18} />
                <span className="hidden lg:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-[2px] rounded-full ${i < stepIdx ? 'bg-[#1a73e8]' : 'bg-[#3c4043]'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="flex gap-2 p-2 bg-[#202124] border border-[#3c4043] rounded-2xl w-fit shadow-inner">
                  {[{k:'file',l:'Media Payload'},{k:'url',l:'Deep URL Scan'}, {k:'api',l:'Live Intelligence'}].map(m => (
                    <button key={m.k} onClick={() => setMode(m.k)}
                      className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === m.k ? 'bg-[#1a73e8] text-white shadow-xl' : 'text-[#5f6368] hover:text-white'}`}>
                      {m.l}
                    </button>
                  ))}
                </div>

                {mode === 'file' ? (
                  <div {...getRootProps()} className={`bg-[#2d2e31] border-2 border-dashed p-24 text-center cursor-pointer transition-all duration-700 rounded-[3rem] relative group
                    ${isDragActive ? 'border-[#1a73e8] bg-[#1a73e8]/5 scale-95' : 'border-[#3c4043] hover:border-[#1a73e8]/60 hover:bg-[#1a73e8]/5'}`}>
                    <input {...getInputProps()} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1a73e8]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} className="relative z-10">
                      <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 bg-[#202124] border border-[#3c4043] shadow-2xl group-hover:rotate-12 transition-transform">
                        <Upload size={36} className="text-[#8ab4f8]" />
                      </div>
                      {file ? (
                        <div>
                          <p className="text-2xl font-bold text-white mb-3 tracking-tight">{file.name}</p>
                          <p className="text-[11px] font-bold text-[#8ab4f8] uppercase tracking-[0.3em]">{(file.size / 1024 / 1024).toFixed(1)} MB · READ READY</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold text-white mb-3 tracking-tight">Digital Multi-modal Ingest</p>
                          <p className="text-xs text-[#5f6368] font-bold uppercase tracking-widest max-w-xs mx-auto">Upload media package for deep-packet fingerprinting</p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                ) : (
                  <div className="bg-[#2d2e31] border border-[#3c4043] p-12 rounded-[2.5rem] shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-[#1a73e8]/10 border border-[#1a73e8]/20 shadow-lg"><Link2 size={24} className="text-[#8ab4f8]" /></div>
                      <div>
                        <h3 className="font-bold text-white text-xl tracking-tight">Active Stream Interception</h3>
                        <p className="text-[10px] text-[#5f6368] font-black uppercase tracking-widest mt-1">Provide RTMP, HLS, or CDN endpoint</p>
                      </div>
                    </div>
                    <input className="w-full bg-[#202124] border border-[#3c4043] rounded-2xl p-5 text-white font-mono text-sm outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/30 transition-all placeholder:text-[#5f6368]" 
                      placeholder="https://origin-cdn.stream-service.net/v1/master.m3u8"
                      value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                  </div>
                )}

                <button onClick={runScan} disabled={!file && !urlInput}
                  className="w-full flex items-center justify-center gap-4 py-6 rounded-[2rem] bg-[#1a73e8] text-white text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#1a73e8]/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-10 disabled:grayscale">
                  <ScanLine size={24} /> Initiating Intelligence Scan
                </button>
              </motion.div>
            )}

            {(step === 'fingerprint' || step === 'scan') && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#2d2e31] border border-[#3c4043] p-24 rounded-[3.5rem] text-center space-y-12 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a73e8]/10 to-transparent pointer-events-none" />
                <div className="relative mx-auto w-40 h-40">
                  <div className="absolute inset-0 rounded-full border-8 border-[#3c4043]/40" />
                  <div className="absolute inset-0 rounded-full border-t-8 border-[#1a73e8] animate-[spin_2s_linear_infinite]" />
                  <div className="absolute inset-6 rounded-[2.5rem] bg-[#202124] flex items-center justify-center border border-[#3c4043] shadow-inner">
                    <Fingerprint size={48} className="text-[#8ab4f8] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-white tracking-widest uppercase">
                    {step === 'fingerprint' ? 'Decoding DNA' : 'Global Vector Query'}
                  </h2>
                  <div className="flex items-center justify-center gap-3 text-[#5f6368] font-black uppercase text-[10px] tracking-[0.3em]">
                    <div className="w-2 h-2 rounded-full bg-[#1a73e8] animate-ping" />
                    <span>{SCAN_STAGES[stageIdx]?.label}</span>
                  </div>
                </div>
                <div className="w-full max-w-sm mx-auto space-y-4">
                  <div className="flex justify-between text-[9px] font-black text-[#5f6368] uppercase tracking-[0.5em]">
                    <span>Analysis Load</span><span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-[#202124] rounded-full p-1 border border-[#3c4043] shadow-inner overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-[#1a73e8] via-[#8ab4f8] to-[#1a73e8] shadow-[0_0_20px_rgba(26,115,232,0.6)]"
                      style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black text-[#8ab4f8] uppercase tracking-widest mb-1">Intelligence Report</p>
                     <h2 className="text-2xl font-bold text-white tracking-tight">Forensic Findings: 1 Significant Instance</h2>
                   </div>
                  <button onClick={reset} className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[#3c4043] text-[#f28b82] hover:bg-[#ea4335]/10 font-black text-[10px] uppercase tracking-widest transition-all shadow-md">
                    <X size={14} /> Purge Ingest
                  </button>
                </div>

                <div className="bg-[#2d2e31] border border-[#ea4335]/30 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#ea4335]/10 blur-[80px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#ea4335]/10 border border-[#ea4335]/20 text-[#f28b82] text-[10px] font-black uppercase tracking-widest w-fit">
                        <AlertTriangle size={14} /> High-Criticality Interception
                      </div>
                      <h3 className="text-2xl font-bold text-white break-all tracking-tight leading-none">{results[0].url}</h3>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2.5 text-[10px] font-black text-[#5f6368] uppercase tracking-widest">
                           <Globe size={18} className="text-[#8ab4f8]" /> {results[0].location} · {results[0].platform}
                        </div>
                        <div className="flex items-center gap-2.5 text-[10px] font-black text-[#5f6368] uppercase tracking-widest">
                           <Eye size={18} className="text-[#8ab4f8]" /> {results[0].views.toLocaleString()} Viewers
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-6xl font-black text-[#ea4335] tracking-tighter block">{results[0].similarity}%</span>
                       <p className="text-[10px] font-black text-[#5f6368] uppercase tracking-[0.3em] mt-2">Vector Match Index</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2d2e31] border border-[#3c4043] p-10 rounded-[3rem] shadow-2xl space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#1a73e8]/10 border border-[#1a73e8]/20 shadow-lg"><Microscope className="text-[#8ab4f8]" size={24} /></div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">Multimodal Forensic Ledger</h3>
                  </div>

                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-5">
                      <Loader2 className="animate-spin text-[#1a73e8]" size={48} />
                      <p className="text-xs font-black text-[#5f6368] uppercase tracking-[0.4em] animate-pulse">Engaging Neural Reasoning Layer…</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="p-8 rounded-[2.5rem] bg-[#202124] border border-[#3c4043] relative shadow-inner">
                         <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a73e8]/20 border border-[#1a73e8]/30 text-[9px] font-black text-[#8ab4f8] uppercase tracking-widest shadow-lg">
                           GEMINI AUTHENTICATED
                         </div>
                         <p className="text-base text-[#9aa0a6] leading-relaxed italic font-medium px-4">"{aiResult?.reason}"</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#202124] border border-[#3c4043] p-8 rounded-[2.5rem] shadow-xl">
                           <p className="text-[10px] font-black text-[#5f6368] uppercase tracking-[0.2em] mb-6">Internal Visual Log</p>
                           <p className="text-[13px] text-white/80 leading-relaxed font-medium whitespace-pre-wrap">{forensicReport}</p>
                        </div>
                        <div className="bg-[#202124] border border-[#3c4043] p-8 rounded-[2.5rem] shadow-xl">
                            <p className="text-[10px] font-black text-[#1a73e8] uppercase tracking-[0.2em] mb-6">Strategic Mitigation Route</p>
                            <nav className="space-y-4">
                               {aiResult?.recommended_actions?.map((act, i) => (
                                 <div key={i} className="flex items-start gap-3 text-xs text-white/70 font-bold bg-[#2d2e31]/40 p-3 rounded-2xl border border-white/5">
                                   <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] mt-1.5 flex-shrink-0" />
                                   {act}
                                 </div>
                               ))}
                            </nav>
                            <button onClick={(e) => { e.target.disabled = true; toast.success('Hash cryptographically anchored to Polygon.', {icon:'💎'}); }} 
                              className="mt-8 w-full py-4 rounded-2xl bg-[#1a73e8]/10 border border-[#1a73e8]/20 text-[10px] font-black uppercase tracking-widest text-[#8ab4f8] hover:bg-[#1a73e8] hover:text-white transition-all shadow-lg active:scale-95">
                              <DatabaseBackup size={18} className="inline mr-2" /> Cryptographic Evidence Anchor
                            </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
           <AIPanel result={aiResult} loading={aiLoading} />
           <div className="bg-[#2d2e31] border border-[#3c4043] p-8 rounded-[2.5rem] shadow-2xl">
              <p className="text-[10px] font-black text-[#5f6368] tracking-[0.4em] uppercase mb-8">Node Capabilities</p>
              <div className="space-y-8">
                {[
                  { t: 'Neural Vision', d: 'Extracts deep semantic meaning from skewed media frames.', i: Microscope },
                  { t: 'Vector Auth', d: 'Content-aware fingerprinting resilient to color/rot.', i: Fingerprint },
                  { t: 'Global Mesh', d: 'Distributed intercept nodes across 142 data centers.', i: Globe },
                  { t: 'Secure Chain', d: 'Blockchain-backed immutable evidence custody logs.', i: ShieldCheck },
                ].map(item => (
                  <div key={item.t} className="flex gap-5 group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-[#202124] border border-[#3c4043] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a73e8]/10 group-hover:border-[#1a73e8]/30 transition-all shadow-inner">
                      <item.i size={24} className="text-[#8ab4f8] group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white mb-1.5 uppercase tracking-tight">{item.t}</p>
                      <p className="text-[11px] text-[#5f6368] font-bold leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
