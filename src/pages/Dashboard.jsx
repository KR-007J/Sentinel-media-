import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Radio, Activity, Globe2, 
  Terminal, Zap, ChevronRight, Share2, Eye
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { useStore } from '../hooks/useStore';

export default function Dashboard() {
  const { threats, stats } = useStore();
  const [slideIndex, setSlideIndex] = useState(0);
  const criticalThreats = threats.filter(t => t.risk === 'high').slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % (criticalThreats.length || 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [criticalThreats.length]);

  return (
    <div className="space-y-8 pb-12">
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-3xl font-bold tracking-widest font-tech uppercase">NEXUS STATUS</h2>
          </div>
          <p className="telemetry-label !text-primary/60">INTELLIGENCE NODE 7-ALPHA • RECV: OK</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 border-primary/20 bg-primary/5">
            <p className="telemetry-label font-bold text-primary">Threat Level: <span className="text-secondary">ELEVATED</span></p>
          </div>
          <button className="tech-button">
            <span>RUN DEEP SCAN</span>
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Metrics */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard 
              icon={ShieldAlert} 
              label="TOTAL THREATS DETECTED" 
              value={stats.totalIntercepts} 
              trend="+12.4%" 
              trendUp={true}
              sub="Last 24 hours of surveillance"
            />
            <StatsCard 
              icon={Radio} 
              label="ACTIVE SCAN NODES" 
              value="1,492" 
              trend="OPTIMAL" 
              color="secondary"
              sub="Global distributed network status"
            />
            <StatsCard 
              icon={Zap} 
              label="NEURAL ACCURACY" 
              value="99.8%" 
              trend="STABLE" 
              sub="Binary fingerprinting confidence"
            />
            <StatsCard 
              icon={Globe2} 
              label="REGIONS MONITORED" 
              value="184" 
              trend="EXPANDING" 
              sub="International jurisdiction nodes"
            />
          </div>

          {/* Critical Alerts Slideshow (The "WOW" Element) */}
          <div className="glass-card min-h-[400px] relative overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-secondary animate-pulse" />
                <h3 className="text-sm font-bold tracking-widest font-tech uppercase">ACTIVE CRITICAL INTERCEPTS</h3>
              </div>
              <div className="flex gap-1.5">
                {criticalThreats.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 transition-all duration-500 rounded-full ${i === slideIndex ? 'w-8 bg-primary shadow-[0_0_10px_rgba(0,243,255,1)]' : 'w-2 bg-white/10'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 relative p-8">
              <AnimatePresence mode="wait">
                {criticalThreats.length > 0 && (
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full grid md:grid-cols-2 gap-8 items-center"
                  >
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-secondary">
                          <ShieldAlert size={16} />
                          <span className="text-[10px] font-bold tracking-widest uppercase">SIGNATURE MATCH WARNING</span>
                        </div>
                        <h4 className="text-3xl font-black text-white leading-tight font-tech uppercase line-clamp-2">
                          {criticalThreats[slideIndex].url.split('/').pop()}
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="glass-card p-3 bg-white/5 border-white/10">
                            <p className="telemetry-label !text-[8px] mb-1">ORIGIN POINT</p>
                            <p className="text-xs font-bold text-primary">{criticalThreats[slideIndex].location}</p>
                          </div>
                          <div className="glass-card p-3 bg-white/5 border-white/10">
                            <p className="telemetry-label !text-[8px] mb-1">AI CONFIDENCE</p>
                            <p className="text-xs font-bold text-secondary">{criticalThreats[slideIndex].similarity}%</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                          Detected unauthorized publication on platform {criticalThreats[slideIndex].platform}. 
                          Fingerprint matches proprietary metadata of high-value internal assets.
                        </p>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button className="tech-button border-secondary/50 text-white hover:bg-secondary/10">
                          <span>ISSUE TAKEDOWN</span>
                        </button>
                        <button className="p-3 glass-card hover:border-primary/50 transition-colors text-primary">
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="relative group perspective-1000 hidden md:block">
                      <motion.div 
                         initial={{ rotateY: 20, rotateX: 10 }}
                         animate={{ rotateY: [20, -20, 20], rotateX: [10, -10, 10] }}
                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                         className="aspect-video glass-card border-primary/30 p-2 transform-gpu shadow-2xl relative overflow-hidden"
                      >
                         <img 
                            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${criticalThreats[slideIndex].id}&backgroundColor=050505&fontFamily=monospace`} 
                            alt="Visual Signature"
                            className="w-full h-full object-cover opacity-80"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                         <div className="absolute top-2 left-2 text-[8px] font-mono text-primary/50">ENCRYPTED_STREAM_V42.0</div>
                         <div className="absolute bottom-2 right-2 flex gap-1 items-center">
                            <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                            <span className="text-[8px] font-mono text-secondary">DECRYPTING...</span>
                         </div>
                         <div className="hologram-glitch absolute inset-0 pointer-events-none" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Background scanner line effect for the slideshow specifically */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
              <div className="w-[1px] h-full bg-primary absolute top-0 left-0 animate-[dashboard-scan_10s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Feed */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-primary" />
                <h3 className="text-sm font-bold tracking-widest font-tech uppercase">SURVEILLANCE LOG</h3>
              </div>
              <Share2 size={16} className="text-text-secondary cursor-pointer hover:text-white transition-colors" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
              {threats.map((threat, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={threat.id} 
                  className="p-4 bg-white/2 border border-white/5 rounded-sm hover:border-primary/30 transition-all group relative cursor-pointer overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 mb-2 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${threat.risk === 'high' ? 'bg-secondary' : 'bg-primary'} animate-pulse`} />
                      <p className="text-[11px] font-bold text-white uppercase font-tech tracking-wider">{threat.platform}</p>
                    </div>
                    <span className="text-[10px] font-mono text-text-secondary opacity-50">#X-LOG-{threat.id.slice(0,4)}</span>
                  </div>
                  
                  <div className="text-xs text-text-secondary mb-3 leading-relaxed relative z-10">
                    Interception at <span className="text-white font-bold">{threat.location}</span>. 
                    Signature overlap detected at <span className={threat.risk === 'high' ? 'text-secondary' : 'text-primary'}>{threat.similarity}%</span> variance.
                  </div>
                  
                  <div className="flex items-center justify-between gap-1 relative z-10">
                    <div className="flex gap-2">
                       <span className="px-2 py-0.5 border border-white/10 rounded-sm text-[8px] font-bold text-primary bg-primary/5 uppercase">Neural Scan</span>
                       <span className="px-2 py-0.5 border border-white/10 rounded-sm text-[8px] font-bold text-secondary bg-secondary/5 uppercase">{threat.risk} risk</span>
                    </div>
                    <ChevronRight size={14} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  {/* Subtle Background HUD elements */}
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 border-t border-r border-primary/50" />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button className="tech-button m-4 mt-2 justify-center py-4 bg-primary/10 border-primary/20 hover:bg-primary/20">
              <span className="text-[10px]">EXPORT FULL NODELOG</span>
            </button>
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dashboard-scan {
          0% { left: 0% }
          100% { left: 100% }
        }
        .perspective-1000 { perspective: 1000px; }
      `}} />
    </div>
  );
}
