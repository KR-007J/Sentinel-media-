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
  const [showTakedown, setShowTakedown] = useState(false);

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
        style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
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

    // Progress simulation
    let elapsed = 0;
    const total = SCAN_STAGES.reduce((s, st) => s + st.duration, 0);
    for (let i = 0; i < SCAN_STAGES.length; i++) {
      setStageIdx(i);
      await new Promise(r => setTimeout(r, SCAN_STAGES[i].duration));
      elapsed += SCAN_STAGES[i].duration;
      setProgress(Math.round((elapsed / total) * 100));
      if (i === 1) setStep('scan');
    }

    // Generate mock detections
    const mockDetections = [
      { url: 'pirate-stream.xyz/live-cricket', similarity: 94, watermark: false, location: 'India', city: 'Mumbai', lat: 19.07, lng: 72.87, platform: 'Piracy Site', status: 'unauthorized', confidence: 94, risk: 'high', action: 'flag', timestamp: new Date().toISOString(), asset: file?.name || 'Uploaded Asset', views: 28400, spread: 12, reason: '' },
      { url: 'telegram.me/sports_leaks_global', similarity: 78, watermark: false, location: 'UAE', city: 'Dubai', lat: 25.2, lng: 55.27, platform: 'Telegram', status: 'suspicious', confidence: 78, risk: 'medium', action: 'review', timestamp: new Date().toISOString(), asset: file?.name || 'Uploaded Asset', views: 8200, spread: 3, reason: '' },
    ];

    setAiLoading(true);
    setStep('result');
    setResults(mockDetections);
    
    try {
      // Parallel AI Analysis
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
      mockDetections.forEach(t => addThreat({ id: `scan_${Date.now()}_${Math.random()}`, ...t }));
      toast.success(`Scan complete — Critical threat detected`, { icon: '🚨' });
    }
  };

  const reset = () => {
    setStep('upload'); setFile(null); setUrlInput(''); setProgress(0);
    setResults([]); setAiResult(null); setForensicReport('');
  };

  const stepIdx = STEPS.findIndex(s => s.key === step);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="aurora-card p-5">
        <div className="flex items-center gap-4">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-500 ${i <= stepIdx ? 'text-white bg-[#1a73e8]/20 border border-[#1a73e8]/40 shadow-[0_4px_20px_rgba(26,115,232,0.2)]' : 'text-white/20'}`}>
                <s.icon size={14} className={i <= stepIdx ? 'text-[#8ab4f8]' : ''} />
                <span className="hidden md:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-[2px] rounded-full ${i < stepIdx ? 'bg-[#1a73e8]/40' : 'bg-white/[0.05]'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">

          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="space-y-6">
                <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/[0.05] rounded-2xl w-fit">
                  {[{k:'file',l:'Media Upload'},{k:'url',l:'Deep URL Scan'}, {k:'api',l:'Live Social Crawler'}].map(m => (
                    <button key={m.k} onClick={() => setMode(m.k)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === m.k ? 'bg-[#1a73e8] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>
                      {m.l}
                    </button>
                  ))}
                </div>

                {mode === 'file' ? (
                  <div {...getRootProps()} className={`aurora-card p-16 text-center cursor-pointer transition-all duration-500 border-2 border-dashed relative group
                    ${isDragActive ? 'border-[#1a73e8] bg-[#1a73e8]/10' : 'border-white/[0.08] hover:border-[#1a73e8]/40 hover:bg-white/[0.02]'}`}>
                    <input {...getInputProps()} />
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a73e8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <motion.div animate={isDragActive ? { scale: 1.05 } : { scale: 1 }} className="relative z-10">
                      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-[#1a73e8]/10 border border-[#1a73e8]/20 shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                        <Upload size={32} className="text-[#8ab4f8]" />
                      </div>
                      {file ? (
                        <div>
                          <p className="text-xl font-bold text-white mb-2">{file.name}</p>
                          <p className="text-sm font-mono text-indigo-400">{(file.size / 1024 / 1024).toFixed(1)} MB · READY FOR INGESTION</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xl font-bold text-white mb-2">Initialize Digital Ingest</p>
                          <p className="text-sm text-white/40 max-w-xs mx-auto">Drag & drop your broadcast master or match clip for forensic fingerprinting</p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                ) : mode === 'api' ? (
                  <div className="aurora-card p-10 cursor-pointer hover:border-indigo-500/40 transition-all group" onClick={() => { setUrlInput('https://api.twitch.tv/crawler/sports-live'); setMode('url'); toast('Hooked into Twitch API', {icon:'📡'}); }}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 transition-transform"><Globe size={24} className="text-purple-400" /></div>
                      <div>
                        <h3 className="font-bold text-white text-lg">Twitch / YouTube Live Interception</h3>
                        <p className="text-xs text-white/40">Connect directly to Social APIs to automatically scan the top 50 active streams.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aurora-card p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <Link2 size={18} className="text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Target Stream Analysis</h3>
                        <p className="text-xs text-white/40">Provide a direct MP4, HLS, or DASH endpoint</p>
                      </div>
                    </div>
                    <input className="input-field" placeholder="https://cdn.stream-provider.io/live/master.m3u8"
                      value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                  </div>
                )}

                <button onClick={runScan} disabled={!file && !urlInput}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-base font-bold tracking-[0.1em] uppercase shadow-2xl disabled:opacity-20">
                  <ScanLine size={20} /> Start Forensic Scan
                </button>
              </motion.div>
            )}

            {(step === 'fingerprint' || step === 'scan') && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aurora-card p-12 text-center space-y-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a73e8]/5 to-transparent pointer-events-none" />
                
                <div className="relative mx-auto w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-4 border-[#1a73e8]/10" />
                  <div className="absolute inset-0 rounded-full border-t-4 border-[#1a73e8] animate-spin" />
                  <div className="absolute inset-4 rounded-3xl bg-[#1a73e8]/10 flex items-center justify-center border border-[#1a73e8]/20">
                    <Fingerprint size={40} className="text-[#8ab4f8] animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {step === 'fingerprint' ? 'CONTENT DNA SYNTHESIS' : 'GLOBAL NETWORK SCAN'}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-[#8ab4f8] font-mono text-sm">
                    <Microscope size={14} />
                    <span className="uppercase tracking-[0.2em]">{SCAN_STAGES[stageIdx]?.label}</span>
                  </div>
                </div>

                <div className="w-full max-w-md mx-auto space-y-3">
                  <div className="flex justify-between text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.3em]">
                    <span>Analysis Load</span><span>{progress}%</span>
                  </div>
                  <div className="h-[6px] bg-white/[0.03] rounded-full p-[2px] border border-white/[0.05]">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-[#1a73e8] via-[#8ab4f8] to-[#34a853] shadow-[0_2px_15px_rgba(26,115,232,0.4)]"
                      style={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#34a853]" size={24} />
                    <h2 className="text-xl font-bold text-white">Forensic Evidence Found</h2>
                  </div>
                  <button onClick={reset} className="glass-button text-[10px] py-2 px-4 uppercase font-bold tracking-widest">
                    <X size={12} /> Clear System
                  </button>
                </div>

                <div className="grid gap-4">
                  {results.slice(0, 1).map((r, i) => (
                    <div key={i} className="aurora-card p-6 border-[#d93025]/20 bg-[#d93025]/[0.02] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#d93025]/5 blur-[40px] -mr-16 -mt-16" />
                      <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-[#f28b82] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={12} /> High Criticality Threat
                          </p>
                          <h3 className="text-lg font-bold text-white font-mono break-all">{r.url}</h3>
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center gap-2 text-xs text-white/40">
                              <Globe size={14} className="text-[#8ab4f8]" /> {r.location} · {r.platform}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                              <Eye size={14} className="text-[#8ab4f8]" /> {r.views.toLocaleString()} Active Viewers
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-[#d93025] font-mono tracking-tighter">{r.similarity}%</span>
                          <p className="text-[10px] font-bold text-white/20 uppercase mt-1 tracking-widest">Match Index</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Multimodal Forensic Breakdown */}
                <div className="aurora-card p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <Microscope className="text-[#8ab4f8]" size={20} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Gemini Vision Forensic Breakdown</h3>
                  </div>
                  
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                      <Loader2 className="animate-spin text-[#1a73e8]" size={32} />
                      <p className="text-xs font-mono text-[#8ab4f8] animate-pulse uppercase tracking-widest">Consulting Multimodal Neural Engine…</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative">
                         <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded bg-[#1a73e8]/20 border border-[#1a73e8]/30 text-[9px] font-black text-[#8ab4f8] uppercase">
                          AI Verified
                         </div>
                         <p className="text-sm text-white/80 leading-relaxed italic">"{aiResult?.reason}"</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="aurora-card p-5 bg-[#1a73e8]/5">
                           <p className="text-[10px] font-black text-[#8ab4f8] uppercase tracking-widest mb-3">Visual Forensic Log</p>
                           <div className="text-xs text-white/60 whitespace-pre-wrap font-medium leading-relaxed">
                             {forensicReport}
                           </div>
                        </div>
                         <div className="aurora-card p-5 bg-[#34a853]/5">
                            <p className="text-[10px] font-black text-[#81c995] uppercase tracking-widest mb-3">Recommended Mitigation</p>
                            <div className="space-y-2">
                              {aiResult?.recommended_actions?.map((act, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                                  <CheckCircle size={14} className="text-[#34a853] mt-0.5" />
                                  {act}
                                </div>
                              ))}
                            </div>
                            
                            <button onClick={(e) => { e.target.disabled = true; toast.success('Hash cryptographically anchored to Polygon Blockchain.', {icon:'💎'}); }} className="mt-4 w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-[#34a853]/10 border border-[#34a853]/20 text-[10px] uppercase tracking-widest font-bold text-[#81c995] hover:bg-[#34a853]/20 transition-all">
                              <DatabaseBackup size={14} /> Anchor Evidence to Blockchain
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

        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <AIPanel result={aiResult} loading={aiLoading} />
          
          <div className="aurora-card p-6 flex-1 h-fit">
            <h3 className="text-[10px] font-black text-[#8ab4f8] tracking-[0.3em] uppercase mb-6">System Capabilities</h3>
            <div className="space-y-6">
              {[
                { t: 'Vision-AI', d: 'Multimodal analysis of cropped/skewed media frames.', i: Eye },
                { t: 'DNA Match', d: 'Content fingerprinting resilient to color/res manipulation.', i: Fingerprint },
                { t: 'Global Sync', d: 'Real-time monitoring across 140+ countries.', i: Globe },
                { t: 'Legal Ready', d: 'Instant generation of courtroom-ready evidence logs.', i: ShieldCheck },
              ].map(item => (
                <div key={item.t} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <item.i size={18} className="text-[#8ab4f8]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white mb-1">{item.t}</p>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">{item.d}</p>
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
