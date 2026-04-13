import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, BarChart3, ArrowRight, Play, Check, ChevronRight, Eye, Lock, Cpu, Radar, Activity, Fingerprint, X, Info, Target, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: Eye, title: 'Vision-AI Analysis', desc: 'Multimodal Gemini models analyze media context, detecting unauthorized logos even under heavy blurring.' },
  { icon: Globe, title: 'Global Injunctions', desc: 'Instant enforcement across 140+ countries. Automated legal routing for rapid platform compliance.' },
  { icon: Cpu, title: 'Prophetic Risk Engine', desc: 'Predictive analytics forecast piracy spikes before they happen, allowing proactive counter-measures.' },
  { icon: Fingerprint, title: 'Content DNA Synthesis', desc: 'Cryptographic fingerprinting that remains unbroken by cropping, color-grading, or resolution shifts.' },
  { icon: Lock, title: 'Digital War Room', desc: 'A secure, collaborative command center for live sports rights holders and legal interventions.' },
  { icon: Activity, title: 'Real-time Telemetry', desc: 'Stream-level monitoring detects piracy the moment it starts, syncing data globally under 4s.' },
];

const STATS = [
  { value: '98.5%', label: 'Forensic Accuracy' },
  { value: '3.8s', label: 'Detection Latency' },
  { value: '$4.2B', label: 'Revenue Protected' },
  { value: '1.2M+', label: 'Takedowns Automated' },
];

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
      style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const featRef = useRef(null);
  const featInView = useInView(featRef, { once: true, margin: '-100px' });
  const [showBrief, setShowBrief] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    { title: "Deep-Packet Ingest", desc: "Every media asset is processed through a multimodal transformer to extract semantic descriptors.", icon: Cpu },
    { title: "Universal Mesh", desc: "Assets are compared against billions of fingerprints across our distributed global intercept nodes.", icon: Globe },
    { title: "Active Governance", desc: "Automated legal dossiers are compiled and anchored for platform-wide enforcement.", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      <GridBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-800 bg-slate-900/60 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.4em] font-tech text-cyan-400">
            <Radar size={14} className="animate-spin-slow text-cyan-500" />
            Sentinel Zero | Y-Combinator W26 Finalist
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="text-7xl md:text-9xl font-black tracking-tight leading-[0.85] text-white uppercase font-tech">
            THE ZERO TRUST<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-500">OPERATING SYSTEM</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-semibold italic">
            AI-powered security for modern developers and scaling applications. We monitor, detect, and mitigate brute-force and scraping attacks with predictive global telemetry.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button onClick={() => navigate('/login')}
              className="group relative px-12 py-6 bg-cyan-500 text-slate-950 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl overflow-hidden active:scale-95 transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-cyan-500/50">
              <span className="relative z-10 flex items-center gap-3">Install Sentinel Free <ArrowRight size={18} /></span>
              <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-100%]" />
            </button>
            <button 
              onClick={() => {
                // Instantly navigate to demo mode dashboard
                localStorage.setItem('sentinel_auth', 'true');
                localStorage.setItem('sentinel_user', JSON.stringify({ name: 'Guest Developer', role: 'admin' }));
                navigate('/dashboard');
              }}
              className="px-12 py-6 bg-red-500/10 border border-red-500/50 text-red-400 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-red-500/20 transition-all flex items-center gap-3 active:scale-95 group">
              <Shield size={18} className="text-red-400 group-hover:scale-110 transition-transform animate-pulse" /> Simulate Attack Demo
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-12 pt-24 border-t border-slate-900 mt-24">
            {STATS.map((s, i) => (
              <div key={i} className="space-y-2 group">
                <p className="text-4xl font-black tracking-tighter text-white font-tech group-hover:text-cyan-400 transition-colors">{s.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section ref={featRef} className="py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-32 space-y-6">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
            <ShieldCheck size={32} className="text-cyan-400" />
          </div>
          <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em]">Core Protocol Capabilities</p>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight uppercase font-tech">MISSION CRITICAL PROTECTION</h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={featInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group p-10 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all duration-500 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all duration-500">
                <f.icon size={28} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight font-tech">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-semibold italic">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cinematic Showcase Section */}
      <section className="py-40 bg-slate-900/20 border-y border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.01] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-4 p-4 rounded-3xl bg-slate-950 border border-slate-800">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <Cpu size={32} className="text-purple-400" />
              </div>
              <div className="pr-4">
                 <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Neural Layer</p>
                 <p className="text-sm font-bold text-white uppercase italic">Gemini 1.5 Ultra Core</p>
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] uppercase font-tech">AUGMENTED VISION <br /><span className="text-cyan-500">ENFORCEMENT</span></h2>
            <p className="text-slate-500 text-xl leading-relaxed font-semibold italic">
              Leveraging the Google Gemini multimodal engine, Sentinel-Zero identifies piracy patterns that bypass standard hashing. Our system understands camera angles, jersey logos, and broadcast watermarks to verify asset integrity in sub-second cycles.
            </p>
            <ul className="space-y-6 bg-slate-950/40 p-10 rounded-[2.5rem] border border-slate-800">
              {[
                "AI-Generated Evidence Dossiers",
                "Automated Takedown Injunctions",
                "Global IP Propagation Tracking"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-black text-white uppercase tracking-widest italic group">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Check size={16} className="text-cyan-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative group">
            <motion.div initial={{ rotateY: 20 }} whileInView={{ rotateY: 0 }} transition={{ duration: 1 }}
              className="relative aspect-square md:aspect-video rounded-[3rem] bg-slate-950 border border-slate-800 overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Shield size={180} className="text-cyan-400" />
              </div>
              
              {/* Target HUD Overlay */}
              <div className="absolute top-12 left-12 right-12 bottom-12 border-2 border-cyan-500/20 rounded-2xl">
                 <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-cyan-500" />
                 <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-cyan-500" />
                 <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-cyan-500" />
                 <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-cyan-500" />
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/30 rounded-full animate-ping-slow" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <Target size={48} className="text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] font-tech text-center">Threat Locked<br/>Mitigation Pending</span>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Activity size={20} className="text-cyan-400" />
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-widest font-tech">Defense Status: Level 5 Secure</p>
                     <p className="text-[8px] text-slate-500 font-black uppercase">Nodes: 14/14 Reporting Normal</p>
                  </div>
                </div>
                <div className="w-12 h-[2px] bg-slate-800 rounded-full overflow-hidden">
                   <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity }}
                     className="w-1/2 h-full bg-cyan-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 border-t border-slate-900 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto mb-20 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-10 uppercase tracking-tighter italic font-tech leading-tight">First place is the<br/>only rank that matters.</h2>
          <button onClick={() => navigate('/login')}
            className="px-20 py-6 bg-slate-900 border border-slate-800 text-cyan-400 font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-cyan-500 hover:text-slate-950 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/20 active:scale-95">
            Secure Your Assets // Enter Protocol
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 pt-10 border-t border-slate-900 relative z-10">
          <div className="flex items-center gap-4">
            <Shield size={24} className="text-cyan-500" />
            <div className="text-left">
               <span className="block font-black text-sm uppercase tracking-[0.4em] text-white">Sentinel-Zero AI</span>
               <span className="block text-[8px] font-black uppercase tracking-widest text-slate-500">Autonomous Rights Defense v3.0</span>
            </div>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] font-tech">
            <span className="cursor-pointer hover:text-cyan-400 transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-cyan-400 transition-colors">Terms</span>
            <span className="cursor-pointer hover:text-cyan-400 transition-colors">Nodes</span>
          </div>
          <p className="text-[10px] font-tech text-slate-600">BUILD v3.0 // SHIELD_ACTIVE</p>
        </div>
      </footer>

      {/* System Brief / Tutorial Modal */}
      <AnimatePresence>
        {showBrief && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-12">
            
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-7xl aspect-video bg-slate-900/60 border border-slate-800 rounded-[3rem] shadow-[0_0_100px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col lg:flex-row backdrop-blur-3xl">
              
              <button 
                onClick={() => setShowBrief(false)}
                className="absolute top-8 right-8 w-14 h-14 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-white hover:text-cyan-400 transition-all z-20 shadow-2xl active:scale-90">
                <X size={24} />
              </button>

              <div className="lg:w-[480px] border-r border-slate-800 p-14 flex flex-col justify-between relative z-10 bg-slate-950/40">
                <div className="space-y-12">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                       <Info size={24} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Intelligence Briefing</p>
                      <h4 className="text-3xl font-black text-white tracking-tighter uppercase font-tech">Registry Cycle</h4>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {tutorialSteps.map((step, i) => (
                      <motion.div key={i} animate={{ opacity: currentStep === i ? 1 : 0.4 }}
                        className={`p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer 
                          ${currentStep === i ? 'bg-cyan-500/5 border-cyan-500/20 shadow-2xl scale-[1.02]' : 'border-transparent'}`}
                        onClick={() => setCurrentStep(i)}>
                        <div className="flex items-center gap-4 mb-4">
                          <step.icon size={20} className={currentStep === i ? 'text-cyan-400' : 'text-slate-600'} />
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white font-tech">{step.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold italic">{step.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-3">
                     {tutorialSteps.map((_, i) => (
                       <div key={i} className={`h-1 rounded-full transition-all duration-500 ${currentStep === i ? 'w-16 bg-cyan-500' : 'w-4 bg-slate-800'}`} />
                     ))}
                  </div>
                  <button onClick={() => navigate('/login')} className="group w-full py-6 bg-cyan-500 text-slate-950 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3">
                    Initiate Network Control <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 relative bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80" />
                <div className="absolute inset-0 opacity-20">
                   <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                      {[...Array(100)].map((_, i) => (
                        <div key={i} className="border border-cyan-500/10" />
                      ))}
                   </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                   <motion.div key={currentStep} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                     className="w-2/3 aspect-square border-4 border-cyan-500/20 rounded-full flex items-center justify-center relative">
                      <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-ping-slow" />
                      <div className="text-center space-y-4">
                         <div className="text-6xl font-black text-cyan-400 font-tech">0{currentStep + 1}</div>
                         <div className="text-[10px] font-black text-slate-500 uppercase tracking-[1em]">Tactical Step</div>
                      </div>
                   </motion.div>
                </div>
                <div className="absolute bottom-16 left-16 right-16 z-20 space-y-4">
                  <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-3">
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.8em] bg-cyan-500/10 border border-cyan-500/20 px-6 py-2.5 rounded-full w-fit font-tech">Network Authorization Required</span>
                    <h5 className="text-6xl font-black text-white italic tracking-tighter uppercase font-tech leading-none">{tutorialSteps[currentStep].title}</h5>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
