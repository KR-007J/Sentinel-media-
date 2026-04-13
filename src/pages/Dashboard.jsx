import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Radio, Activity, Globe2, 
  Terminal, Zap, ChevronRight, Share2, Eye,
  Lock, Cpu, Network, ShieldCheck, Play, Square, Info
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
    activeSimulationProfile,
    triggerSimulation, 
    stopSimulation 
  } = useStore();

  const [metrics, setMetrics] = useState({ cpu: 42, network: 120, memory: 68 });
  const [slideIndex, setSlideIndex] = useState(0);
  const [explainingId, setExplainingId] = useState(null);
  const [explanation, setExplanation] = useState(null);

  // Auto-scroll critical alerts
  const criticalThreats = threats.filter(t => t.severity === 'CRITICAL' || t.severity === 'Critical' || t.severity === 'High');
  
  useEffect(() => {
    if (criticalThreats.length > 0) {
      const timer = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % criticalThreats.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [criticalThreats.length]);

  // Simulated background drift for visual flair
  useEffect(() => {
    const metricInterval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 5)),
        network: Math.max(50, prev.network + (Math.random() - 0.5) * 20),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() - 0.5) * 2)),
      }));
    }, 2000);
    return () => clearInterval(metricInterval);
  }, []);

  const handleExplain = async (threat) => {
    setExplainingId(threat.id);
    setExplanation(null);
    try {
      const respObj = await getThreatExplanation(threat);
      setExplanation(respObj);
    } catch (e) {
      setExplanation({
        threatType: "Local Heuristics Fallback",
        reason: "FAILED TO REACH AI CLUSTER. LOCAL HEURISTICS SUGGEST ABNORMAL VELOCITY.",
        confidence: "??%",
        fix: "- Disconnect immediately\n- Verify API keys"
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* SOC HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSimulationActive ? 'bg-red-500 animate-ping' : 'bg-cyan-400 p-indicator'}`} />
            <h2 className="text-4xl font-black tracking-tighter font-tech uppercase grad-text">
              {isSimulationActive ? 'SIMULATION ACTIVE' : 'SENTINEL PRIME'}
            </h2>
          </div>
          <p className="telemetry-label !text-cyan-400/60 flex items-center gap-2">
            <Cpu size={12} /> SYSTEM UPTIME: 342:12:09 • LATENCY: {isSimulationActive ? '184MS' : '24MS'} • ENCRYPTION: AES-256
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isSimulationActive ? (
            <button 
              onClick={stopSimulation}
              className="tech-button border-red-500/50 hover:bg-red-500/10 text-red-500"
            >
              <Square size={14} className="mr-2" /> STOP SIMULATION
            </button>
          ) : (
            <div className="flex gap-2">
              {Object.keys(ATTACK_PROFILES).map(key => (
                <button 
                  key={key}
                  onClick={() => triggerSimulation(key)}
                  className="tech-button border-cyan-500/20 hover:border-cyan-400 text-[10px]"
                >
                  <Play size={10} className="mr-1" /> TEST {key.split('_')[0]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TIER 1: GLOBAL SITUATIONAL AWARENESS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WORLD VIEW & RISK METER */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card min-h-[550px] relative overflow-hidden group">
            <div className="absolute top-6 left-6 z-10 space-y-4">
              <div className="glass-card p-4 bg-slate-900/40 border-cyan-500/20 backdrop-blur-md">
                <p className="telemetry-label mb-1 uppercase tracking-widest">Global Risk Distribution</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-white">{threats.length}</span>
                  <span className="text-[10px] text-cyan-400/60 pb-1 uppercase font-mono">Monitored Ident</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-40">
               <Globe threats={threats} />
            </div>

            {/* Central Risk Visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <RiskMeter score={globalRiskScore} />
            </div>

            {/* HUD OVERLAYS */}
            <div className="absolute bottom-6 right-6 z-10 glass-card p-4 bg-slate-900/80 border-cyan-500/10 w-72">
              <p className="telemetry-label mb-4">Neural Engine Telemetry</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                    <span>Inference Load</span>
                    <span>{metrics.cpu.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.8)]"
                      animate={{ width: `${metrics.cpu}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                    <span>Ingress Velocity</span>
                    <span>{metrics.network.toFixed(0)} E/SEC</span>
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
          <div className="glass-card overflow-hidden border-red-500/10">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-red-950/10">
              <div className="flex items-center gap-3">
                <Activity size={16} className={isSimulationActive ? "text-red-500 animate-pulse" : "text-cyan-400"} />
                <h3 className="text-xs font-bold tracking-[0.2em] font-tech uppercase">Priority Intelligence Feed</h3>
              </div>
              <div className="flex gap-1">
                {criticalThreats.slice(0, 5).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-0.5 transition-all duration-500 ${i === slideIndex ? 'w-8 bg-red-500 shadow-[0_0_8px_red]' : 'w-2 bg-slate-800'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="p-8 h-[240px] relative bg-gradient-to-r from-red-500/5 to-transparent">
              <AnimatePresence mode="wait">
                {criticalThreats.length > 0 ? (
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full flex flex-col justify-center gap-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase flex items-center gap-2">
                           <ShieldAlert size={12} className="animate-pulse" /> TARGET INFRASTRUCTURE UNDER ATTACK
                        </span>
                        <h4 className="text-3xl font-black text-white font-tech uppercase tracking-tighter">
                          {criticalThreats[slideIndex]?.type || 'UNKNOWN VECTOR'}
                        </h4>
                      </div>
                      <div className="px-4 py-1 bg-red-500/20 border border-red-500/40 rounded-sm text-[10px] font-black text-red-400 tracking-tighter">
                        {Math.round(criticalThreats[slideIndex]?.risk_score || 85)}% RISK
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 line-clamp-2 max-w-3xl font-medium leading-relaxed">
                      {criticalThreats[slideIndex]?.description}
                    </p>

                    <div className="flex gap-4 mt-2">
                       <button className="tech-button border-red-500/40 text-red-500 hover:bg-red-500/10">
                         <span>REVOKE ACCESS</span>
                       </button>
                       <button 
                        onClick={() => handleExplain(criticalThreats[slideIndex])}
                        className="tech-button !bg-white/5 border-white/10 hover:border-cyan-400"
                      >
                         <Zap size={14} className="mr-2 text-yellow-400" /> EXPLAIN WITH AI
                       </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                    <ShieldCheck size={48} className="opacity-10" />
                    <span className="font-mono text-xs uppercase tracking-[0.4em]">All Vectors Secure</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: TACTICAL FEED & AI ANALYSIS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card flex-1 flex flex-col min-h-[550px] border-cyan-500/10">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/20">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-cyan-400" />
                <h3 className="text-sm font-bold tracking-widest font-tech uppercase">Neural Core Log</h3>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                 <span className="text-[8px] font-mono text-cyan-500/60 uppercase">Live</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
              {threats.map((threat, idx) => (
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
                  <p className="text-xs font-bold text-slate-100 uppercase mb-1 font-tech tracking-tight">{threat.type}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1 italic mb-2 tracking-tight">"{threat.description}"</p>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleExplain(threat)}
                      className="text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:underline"
                    >
                      Audit Payload
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI EXPLANATION BOX */}
          <AnimatePresence>
            {explainingId && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-6 border-yellow-500/30 bg-yellow-500/5 relative overflow-hidden"
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


