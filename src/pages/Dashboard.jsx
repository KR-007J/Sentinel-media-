import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Radio, Activity, Globe2, 
  Terminal, Zap, Lock, Cpu, Network, ShieldCheck, Play, Square
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Globe from '../components/Globe';
import RiskMeter from '../components/RiskMeter';
import { useStore } from '../hooks/useStore';
import { ATTACK_PROFILES } from '../services/simulator';
import { getThreatExplanation } from '../services/gemini';

export default function Dashboard() {
  const { 
    threats, 
    globalRiskScore, 
    isSimulationActive, 
    triggerSimulation, 
    stopSimulation,
    protectedSystem,
    applyDefense,
    resolveThreat,
    systemLogs,
    activeDefenses,
    user
  } = useStore();

  const [metrics, setMetrics] = useState({ cpu: 42, network: 120, memory: 68 });
  const [slideIndex, setSlideIndex] = useState(0);
  const [sidebarTab, setSidebarTab] = useState('threats');
  const [explainingId, setExplainingId] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const logEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (sidebarTab === 'logs' && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [systemLogs, sidebarTab]);

  // Optimized threat filtering
  const criticalThreats = useMemo(() => 
    threats.filter(t => {
      const sev = (t.severity || "").toUpperCase();
      return sev === 'CRITICAL' || sev === 'HIGH';
    }), 
    [threats]
  );
  
  // Safe slide index management
  useEffect(() => {
    if (slideIndex >= criticalThreats.length && criticalThreats.length > 0) {
      setSlideIndex(0);
    }
  }, [criticalThreats.length]);

  useEffect(() => {
    if (criticalThreats.length > 1) {
      const timer = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % criticalThreats.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [criticalThreats.length]);

  // Simulated background telemetry
  useEffect(() => {
    const metricInterval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() - 0.5) * 5)),
        network: Math.max(50, prev.network + (Math.random() - 0.5) * 20),
        memory: Math.min(90, Math.max(20, prev.memory + (Math.random() - 0.5) * 2)),
      }));
    }, 2000);
    return () => clearInterval(metricInterval);
  }, []);

  const handleExplain = async (threat) => {
    if (explainingId === threat.id && explanation) return;
    setExplainingId(threat.id);
    setExplanation(null);
    try {
      const respObj = await getThreatExplanation(threat);
      setExplanation(respObj);
    } catch (e) {
      setExplanation({
        threatType: "Engine Sync Failure",
        reason: "NEURAL CLUSTER UNREACHABLE. LOCAL HEURISTICS SUGGEST DATA ANOMALY.",
        confidence: "??%",
        fix: "Check Sentinel Link status."
      });
    }
  };

  return (
    <div className={`space-y-8 pb-12 min-h-screen transition-colors duration-1000 ${isSimulationActive ? 'animate-critical' : ''}`}>
      {isSimulationActive && <div className="scanner-line" />}
      
      {/* SOC HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSimulationActive ? 'bg-red-500 animate-ping shadow-[0_0_15px_red]' : threats.length > 0 ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`} />
            <h2 className="text-4xl font-black tracking-tighter font-tech uppercase grad-text">
              {threats.length === 0 ? 'SYSTEM SECURED' : isSimulationActive ? 'THREAT SIMULATION ACTIVE' : 'SENTINEL PRIME'}
            </h2>
          </div>
          <div className="flex flex-col gap-1">
            <p className="telemetry-label !text-cyan-400/60 flex items-center gap-2">
              <Cpu size={12} /> PROTECTING: <span className="text-white bg-white/10 px-2 py-0.5 rounded italic border border-white/5">{protectedSystem}</span>
            </p>
            <p className="telemetry-label !text-cyan-400/40 flex items-center gap-2 text-[10px]">
              OPERATOR: {user?.email || 'ANONYMOUS'} • NODES: 1492 • LATENCY: {isSimulationActive ? '184MS' : '24MS'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-1.5 rounded-xl">
          {isSimulationActive ? (
            <button 
              onClick={stopSimulation}
              className="tech-button border-red-500/50 hover:bg-red-500/10 text-red-500 !py-2 !px-4"
            >
              <Square size={14} className="mr-2" /> STOP SIMULATION
            </button>
          ) : (
            <>
              {Object.keys(ATTACK_PROFILES).map(key => (
                <button 
                  key={key}
                  onClick={() => triggerSimulation(key)}
                  className="px-4 py-2 bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 rounded-lg text-[10px] font-black tracking-widest transition-all uppercase"
                >
                  {key.split('_')[0]}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* TIER 1: GLOBAL SITUATIONAL AWARENESS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WORLD VIEW & RISK METER */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card min-h-[550px] relative overflow-hidden group border-slate-800 shadow-2xl">
            <div className="absolute top-6 left-6 z-10 space-y-4">
              <div className="glass-card p-4 bg-slate-950/60 border-cyan-500/20 backdrop-blur-xl">
                <p className="telemetry-label mb-1 uppercase tracking-widest text-[9px]">Global Risk Distribution</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-white">{threats.length}</span>
                  <span className="text-[10px] text-cyan-400/60 pb-1 uppercase font-mono">Monitored Alerts</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-60">
               <Globe threats={threats} />
            </div>

            {/* Central Risk Visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <RiskMeter score={globalRiskScore} />
            </div>

            {/* HUD OVERLAYS */}
            <div className="absolute bottom-6 right-6 z-10 glass-card p-5 bg-slate-950/80 border-slate-800 w-72 backdrop-blur-xl">
              <p className="telemetry-label mb-4 text-[9px] flex items-center gap-2">
                <Activity size={10} className="text-cyan-400" /> Neural Engine Telemetry
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                    <span>Inference Load</span>
                    <span className="text-cyan-400">{metrics.cpu.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      animate={{ width: `${metrics.cpu}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                    <span>Ingress Peak</span>
                    <span className="text-purple-400">{metrics.network.toFixed(0)} PPS</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500"
                      animate={{ width: `${Math.min(100, (metrics.network / 200) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CRITICAL ALERTS SLIDESHOW */}
          <div className="glass-card overflow-hidden border-red-500/10 bg-slate-950/40">
            <div className="p-3 border-b border-white/5 flex items-center justify-between bg-red-950/10">
              <div className="flex items-center gap-3">
                <ShieldAlert size={14} className={isSimulationActive ? "text-red-500 animate-pulse" : "text-cyan-400"} />
                <h3 className="text-[10px] font-black tracking-[0.3em] font-tech uppercase text-white/80">Priority Intelligence Feed</h3>
              </div>
              <div className="flex gap-1.5">
                {criticalThreats.slice(0, 5).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSlideIndex(i)}
                    className={`h-0.5 transition-all duration-500 ${i === slideIndex ? 'w-8 bg-red-500 shadow-[0_0_8px_red]' : 'w-2 bg-slate-800'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="p-8 h-[220px] relative bg-gradient-to-r from-red-500/5 to-transparent flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {criticalThreats.length > 0 ? (
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] text-red-500 font-black tracking-[0.3em] uppercase flex items-center gap-2">
                           <Zap size={10} /> CRITICAL VECTOR DETECTED
                        </span>
                        <h4 className="text-4xl font-black text-white font-tech uppercase tracking-tighter grad-text">
                          {criticalThreats[slideIndex]?.type || 'ANOMALOUS DATA'}
                        </h4>
                      </div>
                      <div className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-[10px] font-black text-red-400 tracking-widest shadow-lg">
                        {Math.round(criticalThreats[slideIndex]?.risk_score || 85)}% RISK
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 max-w-4xl font-bold leading-relaxed tracking-tight uppercase">
                      {criticalThreats[slideIndex]?.description}
                    </p>

                    <div className="flex gap-4 pt-2">
                       <button 
                         onClick={() => resolveThreat(criticalThreats[slideIndex].id)}
                         className="px-6 py-2.5 bg-red-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                       >
                         NEUTRALIZE
                       </button>
                       <button 
                        onClick={() => handleExplain(criticalThreats[slideIndex])}
                        className="px-6 py-2.5 bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-cyan-500/40 transition-all"
                      >
                         AUDIT PAYLOAD
                       </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center gap-4"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl"
                      />
                      <ShieldCheck size={56} className="text-cyan-400 relative z-10" />
                    </div>
                    <div className="text-center space-y-1">
                      <span className="font-tech text-xs uppercase tracking-[0.5em] text-cyan-400 font-black block">System Nominal</span>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Continuous intelligence loop active</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: TACTICAL FEED & AI ANALYSIS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card flex-1 flex flex-col min-h-[550px] border-cyan-500/10">
            <div className="p-6 border-b border-white/5 bg-slate-900/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-cyan-400" />
                  <h3 className="text-sm font-bold tracking-widest font-tech uppercase">Neural Core Log</h3>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                   <span className="text-[8px] font-mono text-cyan-500/60 uppercase">Live</span>
                </div>
              </div>
              <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-white/5">
                <button 
                  onClick={() => setSidebarTab('threats')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded transition-all ${sidebarTab === 'threats' ? 'bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-slate-500 hover:text-cyan-400'}`}
                >
                  Active Threats ({threats.length})
                </button>
                <button 
                  onClick={() => setSidebarTab('logs')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded transition-all ${sidebarTab === 'logs' ? 'bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-slate-500 hover:text-cyan-400'}`}
                >
                  System Logs ({systemLogs.length})
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
              {sidebarTab === 'threats' ? (
                threats.length > 0 ? (
                  threats.map((threat, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={threat.id} 
                      className={`p-4 rounded-sm border transition-all group relative overflow-hidden ${
                        threat.severity === 'CRITICAL' || threat.severity === 'Critical'
                        ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/50' 
                        : 'bg-slate-900/40 border-white/5 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black p-1 px-2 rounded-sm ${
                          threat.severity === 'CRITICAL' || threat.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          {threat.severity?.toUpperCase()}
                        </span>
                        <span className="text-[8px] font-mono text-slate-600 uppercase">Hash: {threat.id.slice(0, 8)}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-100 uppercase mb-1 font-tech tracking-tight">{threat.type || threat.platform || 'SECURITY_ALERT'}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 italic mb-2 tracking-tight">"{threat.description || threat.reason || 'No detailed analysis available'}"</p>
                      
                      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleExplain(threat)}
                          className="text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          <Zap size={10} /> Audit Payload
                        </button>
                        <button 
                          onClick={() => resolveThreat(threat.id)}
                          className="text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          <ShieldCheck size={10} /> Secure Node
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-30 mt-10">
                    <ShieldCheck size={32} />
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Zero Threats detected</span>
                  </div>
                )
              ) : (
                systemLogs.map((log, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className="flex gap-4 text-[10px] font-mono border-b border-white/5 pb-2 last:border-0"
                  >
                    <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                    <span className={`${
                      log.type === 'alert' ? 'text-red-500' :
                      log.type === 'success' ? 'text-emerald-500' :
                      'text-cyan-500/70'
                    }`}>
                      {log.message}
                    </span>
                  </motion.div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* DEFENSE MATRIX PANEL */}
          <div className="glass-card flex-none border-cyan-500/10 bg-slate-900/40 mb-6">
            <div className="p-4 border-b border-white/5 bg-cyan-500/5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-400" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] font-tech uppercase">Active Defense Matrix</h3>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <button 
                onClick={() => applyDefense('FIREWALL')}
                className={`p-3 border rounded transition-all text-left group ${
                  activeDefenses.includes('FIREWALL') 
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                }`}
              >
                <Lock size={14} className={`${activeDefenses.includes('FIREWALL') ? 'text-slate-900' : 'text-cyan-400'} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="block text-[10px] font-black uppercase tracking-tighter">Enable Firewall</span>
                <span className={`text-[8px] uppercase font-mono ${activeDefenses.includes('FIREWALL') ? 'text-slate-800' : 'text-slate-500'}`}>Blocks SQLi/XSS</span>
              </button>
              
              <button 
                onClick={() => applyDefense('2FA')}
                className={`p-3 border rounded transition-all text-left group ${
                  activeDefenses.includes('2FA') 
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                }`}
              >
                <Radio size={14} className={`${activeDefenses.includes('2FA') ? 'text-slate-900' : 'text-cyan-400'} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="block text-[10px] font-black uppercase tracking-tighter">Enforce 2FA</span>
                <span className={`text-[8px] uppercase font-mono ${activeDefenses.includes('2FA') ? 'text-slate-800' : 'text-slate-500'}`}>Stops Brute Force</span>
              </button>

              <button 
                onClick={() => applyDefense('BLOCK_IP')}
                className={`p-3 border rounded transition-all text-left group ${
                  activeDefenses.includes('BLOCK_IP') 
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                }`}
              >
                <ShieldAlert size={14} className={`${activeDefenses.includes('BLOCK_IP') ? 'text-slate-900' : 'text-cyan-400'} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="block text-[10px] font-black uppercase tracking-tighter">Block Identity</span>
                <span className={`text-[8px] uppercase font-mono ${activeDefenses.includes('BLOCK_IP') ? 'text-slate-800' : 'text-slate-500'}`}>IPS/ASN Filtering</span>
              </button>

              <button 
                onClick={() => applyDefense('RATE_LIMIT')}
                className={`p-3 border rounded transition-all text-left group ${
                  activeDefenses.includes('RATE_LIMIT') 
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                }`}
              >
                <Activity size={14} className={`${activeDefenses.includes('RATE_LIMIT') ? 'text-slate-900' : 'text-cyan-400'} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="block text-[10px] font-black uppercase tracking-tighter">Rate Limiting</span>
                <span className={`text-[8px] uppercase font-mono ${activeDefenses.includes('RATE_LIMIT') ? 'text-slate-800' : 'text-slate-500'}`}>Mitigates Bots</span>
              </button>
            </div>
          </div>

          {/* AI EXPLANATION BOX */}
          <AnimatePresence>
            {explainingId && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-6 border-yellow-500/30 bg-yellow-500/5 relative overflow-hidden mb-6"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" />
                    <h4 className="text-xs font-black font-tech uppercase tracking-widest text-yellow-400">Explainable AI</h4>
                  </div>
                  <button onClick={() => setExplainingId(null)} className="text-slate-500 hover:text-white">
                    <Square size={12} />
                  </button>
                </div>
                
                {!explanation ? (
                  <div className="font-mono text-xs leading-relaxed text-yellow-500/80 uppercase animate-pulse">
                    ... Neural Core Analyzing Payload ...
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Threat Classification</span>
                        <h5 className="text-sm font-bold text-slate-100 uppercase tracking-tight">{explanation.threatType}</h5>
                      </div>
                      <div className="text-[10px] font-mono text-yellow-400 uppercase border border-yellow-500/30 px-2 py-0.5 rounded-sm bg-yellow-500/10">
                        CONFIDENCE: {explanation.confidence}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400/60 uppercase block mb-1">Reason Detected</span>
                      <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-slate-700 pl-3">
                        {explanation.reason}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-cyan-400/60 uppercase block mb-1">Recommended Fix</span>
                      <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-black/20 p-3 rounded-sm border border-white/5">
                        {explanation.fix}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* TIER 2: REAL-TIME TRAFFIC DYNAMICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* NETWORK THROUGHPUT */}
        <div className="glass-card p-6 border-cyan-500/10 bg-slate-900/40 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Network size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold tracking-widest font-tech uppercase">Neural Core Throughput</h3>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-500" /> Ingress</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /> Egress</div>
            </div>
          </div>
          
          <div className="h-48 flex items-end gap-1.5 px-2">
            {[...Array(60)].map((_, i) => {
              const height1 = 20 + Math.random() * (isSimulationActive ? 80 : 30);
              const height2 = 10 + Math.random() * (isSimulationActive ? 60 : 20);
              return (
                <div key={i} className="flex-1 flex flex-col justify-end gap-0.5 group relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height1}%` }}
                    className="w-full bg-cyan-500/30 group-hover:bg-cyan-500 transition-colors rounded-t-[1px]" 
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height2}%` }}
                    className="w-full bg-purple-500/20 group-hover:bg-purple-500 transition-colors rounded-t-[1px]" 
                  />
                  {i % 10 === 0 && (
                     <span className="absolute -bottom-6 left-0 text-[8px] font-mono text-slate-600">T-{60-i}S</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* THREAT HEATMAP GRID */}
        <div className="glass-card p-6 border-red-500/10 bg-slate-900/40">
           <div className="flex items-center gap-3 mb-8">
              <Globe2 size={18} className="text-red-500" />
              <h3 className="text-sm font-bold tracking-widest font-tech uppercase">Neural Anomaly Grid</h3>
           </div>
           <div className="grid grid-cols-10 gap-1.5 h-48">
              {[...Array(100)].map((_, i) => {
                const isActive = Math.random() > 0.95 || (isSimulationActive && Math.random() > 0.8);
                return (
                  <motion.div 
                    key={i}
                    animate={{ 
                      backgroundColor: isActive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(15, 23, 42, 0.8)',
                      borderColor: isActive ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.05)'
                    }}
                    className="w-full h-full rounded-[2px] border flex items-center justify-center"
                  >
                    {isActive && <div className="w-1 h-1 bg-red-400 rounded-full animate-ping" />}
                  </motion.div>
                );
              })}
           </div>
           <div className="mt-6 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
              <span>Sector Alpha-7</span>
              <span className="text-red-500 animate-pulse">Scanning Vulnerable Targets</span>
           </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .grad-text {
          background: linear-gradient(135deg, #fff 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
        .p-indicator {
          box-shadow: 0 0 10px #22d3ee;
        }
      `}} />
    </div>
  );
}


