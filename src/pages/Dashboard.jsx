import React, { useState, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
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
    role,
    checkPermission,
    user,
    threats,
    systemLogs,
    isSimulationActive,
    systemStatus,
    protectedSystem,
    globalRiskScore,
    activeDefenses,
    stopSimulation,
    triggerSimulation,
    resolveThreat,
    applyDefense,
    isLockdownActive,
    toggleLockdown,
    activeOperators,
    simulateOperatorActivity,
    isRoleTransitioning
  } = useStore();

  const roleColor = role === 'ADMIN' ? 'text-red-500' : role === 'ANALYST' ? 'text-blue-500' : 'text-gray-400';
  const roleBorder = role === 'ADMIN' ? 'border-red-500/40' : role === 'ANALYST' ? 'border-blue-500/40' : 'border-gray-500/40';
  const roleBg = role === 'ADMIN' ? 'bg-red-500/10' : role === 'ANALYST' ? 'bg-blue-500/10' : 'bg-gray-500/10';

  const statusColors = {
    'SECURE': 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    'UNDER_ATTACK': 'text-orange-400 border-orange-500/20 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
    'CRITICAL': 'text-red-500 border-red-500/30 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
  };

  const statusIcons = {
    'SECURE': <ShieldCheck size={14} />,
    'UNDER_ATTACK': <Activity size={14} className="animate-pulse" />,
    'CRITICAL': <ShieldAlert size={14} className="animate-bounce" />
  };

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

  // Periodic operator activity simulation
  useEffect(() => {
    const activityInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulateOperatorActivity();
      }
    }, 8000);
    return () => clearInterval(activityInterval);
  }, [simulateOperatorActivity]);

  const handleExplain = async (threat) => {
    if (explainingId === threat.id && explanation) return;
    setExplainingId(threat.id);
    setExplanation(null);
    try {
      const respObj = await getThreatExplanation(threat, role);
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

      {/* ROLE TRANSITION OVERLAY */}
      <AnimatePresence>
        {isRoleTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="role-transition-overlay"
          >
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6" />
            <span className="text-[11px] text-cyan-400 font-black uppercase tracking-[0.4em] mb-4">[ACCESS CONTROL ENGINE]</span>
            <div className="flex flex-col items-start gap-2 mt-2 font-mono">
              <span className="text-[9px] text-cyan-500/80 uppercase tracking-widest animate-pulse">&rarr; Validating Operator Credentials...</span>
              <span className="text-[9px] text-cyan-500/60 uppercase tracking-widest animate-pulse" style={{animationDelay:'200ms'}}>&rarr; Synchronizing Permission Matrix...</span>
              <span className="text-[9px] text-yellow-500 uppercase tracking-widest animate-pulse" style={{animationDelay:'400ms'}}>&rarr; Applying Role Override...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIMULATION MODE BANNER (Dashboard) */}
      <div className="w-full py-1.5 bg-yellow-500/5 border border-yellow-500/15 rounded-sm flex items-center justify-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 blink-slow" />
        <span className="text-[8px] text-yellow-500 font-black uppercase tracking-[0.25em] blink-slow">SIMULATION MODE: ROLE OVERRIDE ENABLED</span>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 blink-slow" />
      </div>
      
      {/* SOC HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`status-tag transition-all duration-500 uppercase tracking-[0.3em] font-black ${statusColors[systemStatus]}`}>
               {statusIcons[systemStatus]}
               SYS_STATUS: {systemStatus}
            </div>
            {threats.length === 0 && !isSimulationActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                System Fully Secured
              </motion.div>
            )}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tighter font-tech uppercase grad-text">
               {isSimulationActive ? 'THREAT SIMULATION ACTIVE' : 'SENTINEL PRIME COMMAND'}
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
              Protecting: <span className="text-cyan-500">{protectedSystem}</span>
            </p>
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {/* OPERATOR + ACCESS LEVEL */}
              <div className={`flex items-center gap-2 px-2.5 py-1 rounded border ${roleBorder} ${roleBg}`}>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Operator:</span>
                <span className="text-[8px] font-black text-white uppercase tracking-widest">{user?.name || 'UNKNOWN'}</span>
                <span className="text-[6px] text-slate-600">â”‚</span>
                <span className="text-[8px] font-black uppercase tracking-widest">Access Level:</span>
                <span className={`text-[8px] font-black uppercase tracking-widest ${roleColor}`}>{role}</span>
              </div>
              {role === 'ADMIN' && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/40 rounded text-[8px] font-black text-red-500 tracking-widest animate-pulse">
                  <Lock size={8} /> ADMIN OVERRIDE ACTIVE
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-1.5 rounded-xl">
          <button 
            onClick={toggleLockdown}
            disabled={!checkPermission('APPLY_DEFENSE') || isRoleTransitioning}
            title={!checkPermission('APPLY_DEFENSE') ? "Requires ADMIN privileges" : isRoleTransitioning ? "Role transition in progress" : "Toggle system lockdown"}
            className={clsx(
              "tech-button !py-2 !px-4 flex items-center gap-2 transition-all duration-500",
              isLockdownActive 
              ? "bg-red-500 text-slate-950 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
              : "bg-slate-800 text-red-500 border-red-500/30 hover:bg-red-500/10",
              (!checkPermission('APPLY_DEFENSE') || isRoleTransitioning) && "!opacity-30 !grayscale cursor-not-allowed"
            )}
          >
             <Lock size={14} className={isLockdownActive ? "animate-pulse" : ""} />
             {isLockdownActive ? "SYSTEM_LOCKED" : "ENGAGE_LOCKDOWN"}
          </button>

          <div className="h-4 w-px bg-white/5 mx-2" />

          {isSimulationActive ? (
            <button 
              onClick={stopSimulation}
              disabled={!checkPermission('MANAGE_SIMULATION') || isRoleTransitioning}
              title={!checkPermission('MANAGE_SIMULATION') ? "Requires ADMIN privileges" : isRoleTransitioning ? "Role transition in progress" : "Stop active simulation"}
              className="tech-button border-red-500/50 hover:bg-red-500/10 text-red-500 !py-2 !px-4 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
            >
              <Square size={14} className="mr-2" /> STOP SIMULATION
            </button>
          ) : (
            <div className="flex gap-2">
              {Object.keys(ATTACK_PROFILES).slice(0, 3).map(key => (
                <button 
                  key={key}
                  onClick={() => triggerSimulation(key)}
                  disabled={!checkPermission('MANAGE_SIMULATION') || isRoleTransitioning}
                  title={!checkPermission('MANAGE_SIMULATION') ? "Requires ADMIN privileges" : isRoleTransitioning ? "Role transition in progress" : `Trigger ${key} simulation`}
                  className="px-4 py-2 bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 rounded-lg text-[10px] font-black tracking-widest transition-all uppercase disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-500 disabled:cursor-not-allowed"
                >
                  {key.split('_')[0]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLockdownActive && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600/20 border border-red-600 p-3 rounded-xl flex items-center justify-between shadow-[0_0_50px_rgba(220,38,38,0.2)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center animate-pulse">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-widest uppercase">ADMIN OVERRIDE ACTIVE - SYSTEM LOCKDOWN</h3>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">All non-essential services suspended. External traffic throttled by 95%.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 px-4">
            <div className="text-right">
              <p className="text-[8px] text-slate-500 font-black uppercase">Authorized By</p>
              <p className="text-[10px] text-white font-black uppercase tracking-tighter">{user?.name}</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-[8px] text-slate-500 font-black uppercase">Lockdown Level</p>
              <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter">MAXIMUM_PARANOIA</p>
            </div>
          </div>
        </motion.div>
      )}

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
                          disabled={!checkPermission('RESOLVE_THREAT')}
                          className="px-6 py-2.5 bg-red-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:grayscale"
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
                   <button 
                    onClick={() => {
                      const blob = new Blob([JSON.stringify({ logs: systemLogs, reportDate: new Date().toISOString() }, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `sentinel-audit-${Date.now()}.json`;
                      a.click();
                    }}
                    className="text-[8px] font-black font-tech uppercase bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 hover:text-white hover:border-cyan-500/50 transition-all"
                   >
                     Export Audit
                   </button>
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
                <button 
                  onClick={() => setSidebarTab('operators')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded transition-all ${sidebarTab === 'operators' ? 'bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-slate-500 hover:text-cyan-400'}`}
                >
                  Operators ({activeOperators.length})
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
              {sidebarTab === 'threats' && (
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
                          disabled={!checkPermission('RESOLVE_THREAT') || isRoleTransitioning}
                          title={!checkPermission('RESOLVE_THREAT') ? "Requires ADMIN privileges" : isRoleTransitioning ? "Role transition in progress" : "Secure this node"}
                          className="text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:underline flex items-center gap-1 disabled:opacity-30 disabled:grayscale disabled:hover:no-underline disabled:cursor-not-allowed"
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
              )}

              {sidebarTab === 'logs' && (
                systemLogs.map((log, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className="flex gap-4 text-[10px] font-mono border-b border-white/5 pb-2 last:border-0"
                  >
                    <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                    <span className={clsx(
                      log.type === 'alert' ? 'text-red-500' :
                      log.type === 'success' ? 'text-emerald-500' :
                      'text-cyan-500/70'
                    )}>
                      {log.message}
                    </span>
                  </motion.div>
                ))
              )}

              {sidebarTab === 'operators' && (
                activeOperators.map((op, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={op.id}
                    className="p-3 bg-slate-900/60 border border-slate-800 rounded flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-2 h-2 rounded-full",
                        op.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
                      )} />
                      <div>
                        <p className="text-[10px] font-black text-white">{op.name}</p>
                        <p className={clsx(
                          "text-[7px] uppercase tracking-widest",
                          op.role === 'ADMIN' && "text-red-500",
                          op.role === 'ANALYST' && "text-blue-500",
                          op.role === 'VIEWER' && "text-gray-400"
                        )}>{op.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[7px] font-mono text-cyan-500/60 px-2 py-0.5 border border-cyan-500/20 rounded">
                        {op.status}
                      </span>
                      <span className="text-[6px] font-mono text-slate-500 max-w-[100px] truncate">
                        {op.lastAction}
                      </span>
                    </div>
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
                disabled={!checkPermission('APPLY_DEFENSE') || isRoleTransitioning}
                title={!checkPermission('APPLY_DEFENSE') ? "Requires ADMIN privileges" : isRoleTransitioning ? "Role transition in progress" : "Toggle Firewall"}
                className={`p-3 border rounded transition-all text-left group ${
                  activeDefenses.includes('FIREWALL') 
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                } disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
              >
                <Lock size={14} className={`${activeDefenses.includes('FIREWALL') ? 'text-slate-900' : 'text-cyan-400'} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="block text-[10px] font-black uppercase tracking-tighter">Enable Firewall</span>
                <span className={`text-[8px] uppercase font-mono ${activeDefenses.includes('FIREWALL') ? 'text-slate-800' : 'text-slate-500'}`}>Blocks SQLi/XSS</span>
              </button>
              
              <button 
                onClick={() => applyDefense('2FA')}
                disabled={!checkPermission('APPLY_DEFENSE') || isRoleTransitioning}
                title={!checkPermission('APPLY_DEFENSE') ? "Requires ADMIN privileges" : isRoleTransitioning ? "Role transition in progress" : "Toggle 2FA"}
                className={`p-3 border rounded transition-all text-left group ${
                  activeDefenses.includes('2FA') 
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                } disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
              >
                <Radio size={14} className={`${activeDefenses.includes('2FA') ? 'text-slate-900' : 'text-cyan-400'} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="block text-[10px] font-black uppercase tracking-tighter">Enforce 2FA</span>
                <span className={`text-[8px] uppercase font-mono ${activeDefenses.includes('2FA') ? 'text-slate-800' : 'text-slate-500'}`}>Stops Brute Force</span>
              </button>

              <button 
                onClick={() => applyDefense('BLOCK_IP')}
                disabled={!checkPermission('APPLY_DEFENSE') || isRoleTransitioning}
                title={!checkPermission('APPLY_DEFENSE') ? "Requires ADMIN privileges" : isRoleTransitioning ? "Role transition in progress" : "Toggle IP Blocking"}
                className={`p-3 border rounded transition-all text-left group ${
                  activeDefenses.includes('BLOCK_IP') 
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                } disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
              >
                <ShieldAlert size={14} className={`${activeDefenses.includes('BLOCK_IP') ? 'text-slate-900' : 'text-cyan-400'} mb-2 group-hover:scale-110 transition-transform`} />
                <span className="block text-[10px] font-black uppercase tracking-tighter">Block Identity</span>
                <span className={`text-[8px] uppercase font-mono ${activeDefenses.includes('BLOCK_IP') ? 'text-slate-800' : 'text-slate-500'}`}>IPS/ASN Filtering</span>
              </button>

              <button 
                onClick={() => applyDefense('RATE_LIMIT')}
                disabled={!checkPermission('APPLY_DEFENSE') || isRoleTransitioning}
                title={!checkPermission('APPLY_DEFENSE') ? "Requires ADMIN privileges" : isRoleTransitioning ? "Role transition in progress" : "Toggle Rate Limiting"}
                className={`p-3 border rounded transition-all text-left group ${
                  activeDefenses.includes('RATE_LIMIT') 
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                } disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
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


