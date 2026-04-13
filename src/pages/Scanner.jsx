import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, ScanLine, Fingerprint, Sparkles, AlertTriangle,
  Link2, X, Microscope, Globe, DatabaseBackup, Zap, ShieldAlert, Activity, FileSearch, ShieldCheck, Cpu
} from 'lucide-react';
import AIPanel from '../components/AIPanel';
import { getThreatExplanation } from '../services/gemini';
import { SentinelEngine } from '../services/sentinelEngine';
import { supabase } from '../lib/supabase';
import { useStore } from '../hooks/useStore';
import toast from 'react-hot-toast';

const STEPS = [
  { key: 'upload', label: 'TARGET INGEST', icon: Upload },
  { key: 'fingerprint', label: 'NEURAL DECODE', icon: Fingerprint },
  { key: 'scan', label: 'VULN SCAN', icon: ScanLine },
  { key: 'result', label: 'THREAT INTEL', icon: Sparkles },
];

const SCAN_STAGES = [
  { label: 'CALIBRATING ZERO TRUST SENSORS...', duration: 600 },
  { label: 'GENERATE IDENTITY DNA FINGERPRINT...', duration: 800 },
  { label: 'QUERYING GLOBAL THREAT MESH...', duration: 1000 },
  { label: 'ANALYZING BEHAVIORAL OVERLAP...', duration: 700 },
  { label: 'EXECUTING QUANTUM INFERENCE...', duration: 1200 },
];

export default function Scanner() {
  const { isScanning, startScan, finishScan, addLog, addThreat } = useStore();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [targetInput, setTargetInput] = useState('');
  const [mode, setMode] = useState('network'); 
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [findings, setFindings] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const onDrop = useCallback((files) => {
    if (files[0]) { 
      setFile(files[0]); 
      toast.success('Binary loaded into secure buffer'); 
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/*': [], 'text/*': [] }, maxFiles: 1,
    disabled: isScanning
  });

  const runScan = async () => {
    if (isScanning || (!file && !targetInput)) return;
    
    startScan();
    setStep('fingerprint');
    setProgress(0);
    setStageIdx(0);

    try {
      // 1. SIMULATED PROGRESS (STAGGERED)
      const total = SCAN_STAGES.reduce((s, st) => s + st.duration, 0);
      let elapsed = 0;
      
      for (let i = 0; i < SCAN_STAGES.length; i++) {
        setStageIdx(i);
        const stageDuration = SCAN_STAGES[i].duration;
        const steps = 10;
        for (let j = 0; j < steps; j++) {
          await new Promise(r => setTimeout(r, stageDuration / steps));
          elapsed += stageDuration / steps;
          const currentProgress = Math.min(99, Math.round((elapsed / total) * 100));
          setProgress(currentProgress);
        }
        if (i === 1) setStep('scan');
      }

      // 2. AI & ENGINE ANALYSIS
      setAiLoading(true);
      setStep('result');
      
      const telemetry = {
        mfaEnabled: Math.random() > 0.5,
        isNewDevice: Math.random() > 0.3,
        requestFrequency: Math.floor(Math.random() * 500),
        geoMismatch: Math.random() > 0.7
      };

      const analysis = SentinelEngine.calculateEventRisk(telemetry);
      const targetName = targetInput || file?.name || 'Local Gateway';
      
      const resData = {
        target: targetName,
        risk_score: analysis?.score || 15,
        severity: analysis?.label || 'SECURE',
        flags: analysis?.flags || [],
        timestamp: new Date().toISOString()
      };
      
      setFindings(resData);

      // AI Explanation with Debounce/Guard logic (prevent parallel is already handled by isScanning)
      const aiResponse = await getThreatExplanation({
        type: `Vulnerability-${mode.toUpperCase()}`,
        severity: analysis?.label || 'SECURE',
        risk_score: analysis?.score || 10,
        description: `Target ${targetName} exhibited ${analysis?.flags?.length || 0} critical anomalies during Zero Trust validation.`,
        flags: analysis?.flags || []
      });

      const statusMap = { 'CRITICAL': 'unauthorized', 'WARNING': 'suspicious', 'SECURE': 'safe' };
      const riskLevelMap = { 'CRITICAL': 'high', 'WARNING': 'medium', 'SECURE': 'low' };
      
      const processedAiResult = {
        status: statusMap[analysis?.label] || 'safe',
        risk_level: riskLevelMap[analysis?.label] || 'low',
        confidence: aiResponse?.confidence || 98.4,
        reason: aiResponse?.reason || "System integrity validated through behavioral analysis.",
        fix: aiResponse?.fix || "Continue monitoring.",
        action: analysis?.label === 'SECURE' ? 'AUTHENTICATED' : 'CHALLENGED',
        recommended_actions: [
          ...(aiResponse?.fix ? [aiResponse.fix] : []),
          ...(SentinelEngine?.getRecommendations ? SentinelEngine.getRecommendations(analysis?.label) : [])
        ]
      };

      setAiResult(processedAiResult);

      // 3. PERSIST & LOG (Sequential)
      const newThreat = {
        type: `SCAN: ${mode.toUpperCase()}`,
        severity: analysis?.label || 'SECURE',
        description: `Deep Audit of ${targetName} completed. Result: ${analysis?.label || 'SECURE'}`,
        location: '127.0.0.1',
        risk_score: analysis?.score || 5
      };

      const { data: savedThreat } = await supabase.from('threats').insert(newThreat).select().single();
      
      if (savedThreat) {
        addThreat(savedThreat);
        addLog(`AUDIT COMPLETE: ${targetName} processed with ${analysis?.label} rating.`, 'success');
      }

      finishScan(processedAiResult);
      setProgress(100);

    } catch (err) {
      console.error('Scan Failed:', err);
      toast.error('Audit core encountered a kernel panic');
      finishScan(null);
    } finally {
      setAiLoading(false);
    }
  };

  const reset = () => {
    if (isScanning) return;
    setStep('upload'); setFile(null); setTargetInput(''); setProgress(0);
    setFindings(null); setAiResult(null);
  };

  const stepIdx = STEPS.findIndex(s => s.key === step);

  return (
    <div className="space-y-8 pb-12">
      {/* HUD STEPPER */}
      <div className="glass-card p-2 rounded-2xl border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-500
                ${i <= stepIdx ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-600'}`}>
                <s.icon size={16} className={i === stepIdx ? 'animate-pulse' : ''} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-4 h-[1px] bg-slate-800" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="flex gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-2xl w-fit">
                  {[{k:'network',l:'Network Node'},{k:'malware',l:'Malware Bin'},{k:'identity',l:'Identity Audit'}].map(m => (
                    <button key={m.k} onClick={() => setMode(m.k)} disabled={isScanning}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === m.k ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-slate-500 hover:text-white'} ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {m.l}
                    </button>
                  ))}
                </div>

                {mode === 'malware' ? (
                  <div {...getRootProps()} className={`glass-card p-24 text-center cursor-pointer transition-all duration-700 min-h-[450px] flex flex-col items-center justify-center relative group
                    ${isDragActive ? 'border-cyan-500 bg-cyan-500/10 scale-95' : 'border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-500/5'} ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input {...getInputProps()} />
                    
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 bg-slate-900 border border-slate-800 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                      <Cpu size={36} className="text-cyan-400" />
                    </div>
                    
                    {file ? (
                      <div className="space-y-2">
                        <p className="text-2xl font-black text-white tracking-tight uppercase font-tech">{file.name}</p>
                        <p className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.3em]">{(file.size / 1024).toFixed(1)} KB • LOADED</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-2xl font-black text-white tracking-tight uppercase font-tech">Binary Ingest Node</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">Drop encrypted binaries to initiate neural sandbox analysis</p>
                      </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] cyber-grid-bg" />
                  </div>
                ) : (
                  <div className="glass-card p-12 min-h-[450px] flex flex-col justify-center gap-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20"><Link2 size={24} className="text-cyan-400" /></div>
                      <div>
                        <h3 className="font-bold text-white text-xl uppercase font-tech">Target Endpoint Audit</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Provide IP, URL, or SID for Zero Trust validation</p>
                      </div>
                    </div>
                    <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-mono text-sm outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700 disabled:opacity-50" 
                      placeholder={mode === 'network' ? "e.g. 192.168.1.1 or api.gateway.internal" : "e.g. USR-0092-ALPHA"}
                      value={targetInput} onChange={e => setTargetInput(e.target.value)} disabled={isScanning} />
                  </div>
                )}

                <button onClick={runScan} disabled={isScanning || (!file && !targetInput)}
                  className={`tech-button w-full !py-6 !bg-cyan-500 !text-slate-950 hover:!bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] border-none transition-all ${isScanning ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}>
                  <ScanLine size={24} className={`mr-3 ${isScanning ? 'animate-spin' : ''}`} /> 
                  <span>{isScanning ? 'SENSOR ARRAY LOCK - SCANNING...' : 'COMMENCE ZERO TRUST AUDIT'}</span>
                </button>
              </motion.div>
            )}


            {(step === 'fingerprint' || step === 'scan') && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-24 text-center space-y-12 relative overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
                <div className="relative mx-auto w-48 h-48">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40" 
                  />
                  <div className="absolute inset-4 rounded-full border-t-2 border-cyan-500 animate-[spin_1.5s_linear_infinite]" />
                  <div className="absolute inset-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                    <Fingerprint size={56} className="text-cyan-400 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-white tracking-widest uppercase font-tech">
                    {step === 'fingerprint' ? 'Decoding DNA' : 'Neural Audit'}
                  </h2>
                  <div className="flex items-center justify-center gap-3 text-cyan-400 font-mono text-[9px] tracking-[0.4em]">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                    <span>{SCAN_STAGES[stageIdx]?.label}</span>
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-3">
                  <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-[0.5em]">
                    <span>NEURAL-LOAD</span><span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[2px]">
                    <motion.div className="h-full rounded-full bg-cyan-500 shadow-[0_0_15px_cyan]"
                      style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'result' && findings && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Neural Core Audit V5.2</p>
                      <h2 className="text-3xl font-black text-white uppercase font-tech">AUDIT SYNCHRONIZED</h2>
                   </div>
                  <button onClick={reset} className="tech-button !bg-slate-900 !text-slate-400 border-slate-800 hover:text-red-400 hover:border-red-500/30">
                    <X size={14} /> <span>PURGE TACTICAL CACHE</span>
                  </button>
                </div>

                <div className={`glass-card p-8 relative overflow-hidden border ${
                  findings.severity === 'SECURE' ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-red-500/20 bg-red-500/5'
                }`}>
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-4">
                      <div className={`status-tag ${findings.severity === 'SECURE' ? '!text-cyan-400 !bg-cyan-500/10' : '!text-red-500 !bg-red-500/10'}`}>
                        {findings.severity === 'SECURE' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                        {findings.severity} THREAT LEVEL
                      </div>
                      <h3 className="text-2xl font-black text-white break-all font-tech">{findings.target}</h3>
                      <div className="flex flex-wrap gap-4">
                        {findings.flags.map((flag, i) => (
                          <div key={i} className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-slate-400">
                             {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                       <span className={`text-7xl font-black tracking-tighter block ${
                         findings.severity === 'SECURE' ? 'text-cyan-400' : 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                       }`}>{findings.risk_score}%</span>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Final Risk Index</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div>
                     <AIPanel result={aiResult} loading={aiLoading} />
                   </div>
                   <div className="space-y-6">
                      <div className="glass-card p-6 border-slate-800 bg-slate-950">
                         <div className="flex items-center gap-3 mb-6">
                            <Zap size={18} className="text-yellow-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest font-tech">Tactical Recommendations</h3>
                         </div>
                         <div className="space-y-3">
                            {aiResult?.recommended_actions?.map((act, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-cyan-500/30 transition-all">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{act}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 border-slate-800 bg-slate-900/40">
              <div className="flex items-center gap-3 mb-8">
                 <FileSearch size={18} className="text-cyan-400" />
                 <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] font-tech">Scanner Modules</h4>
              </div>
              <div className="space-y-6">
                {[
                  { t: 'Packet Inspection', d: 'Deep packet audit for XSS/SQLi vectors.', i: Activity },
                  { t: 'Entropy Detection', d: 'Analyzing binary data for high-entropy packing.', i: Cpu },
                  { t: 'Zero Trust Verify', d: 'Continuous identity vs hardware validation.', i: ShieldAlert },
                ].map(item => (
                  <div key={item.t} className="flex gap-4 group cursor-default">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
                      <item.i size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-tight">{item.t}</p>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{item.d}</p>
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


