import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, BarChart3, ArrowRight, Play, Check, ChevronRight, Eye, Lock, Cpu, Radar, Activity, Fingerprint } from 'lucide-react';

const FEATURES = [
  { icon: Eye, title: 'Vision-AI Analysis', desc: 'Multimodal Gemini models analyze media context, detecting unauthorized logos even under heavy blurring.' },
  { icon: Globe, title: 'Global Injunctions', desc: 'Instant enforcement across 140+ countries. Automated legal routing for rapid platform compliance.' },
  { icon: Cpu, title: 'Prophetic Risk Engine', desc: 'Predictive analytics forecast piracy spikes before they happen, allowing proactive counter-measures.' },
  { icon: Fingerprint, title: 'Content DNA Synthesis', desc: 'Cryptographic fingerprinting that remains unbroken by cropping, color-grading, or resolution shifts.' },
  { icon: Lock, title: 'Digital War Room', desc: 'A secure, collaborative command center for live sports rights holders and legal interventions.' },
  { icon: Activity, title: 'Real-time Telemetry', desc: 'Stream-level monitoring detects piracy the moment it starts, syncing data globally under 4s.' },
];

const STATS = [
  { value: '97.3%', label: 'Forensic Accuracy' },
  { value: '4.2s', label: 'E2E Detection' },
  { value: '$4.2B', label: 'Revenue Protected' },
  { value: '287k+', label: 'Takedowns Automated' },
];

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const featRef = useRef(null);
  const featInView = useInView(featRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-[#06080f] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <GridBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] font-mono text-indigo-400">
            <Radar size={14} className="animate-spin-slow" />
            Active Surveillance Matrix v4.2
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            THE GUARDIAN OF <br /> <span className="text-white">DIGITAL ASSETS</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Sentinel-Zero is an elite AI-OS for sports media conglomerates. Detect unauthorized redistribution, generate legal dossiers, and execute takedowns in sub-5 seconds.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button onClick={() => navigate('/dashboard')}
              className="group relative px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl overflow-hidden active:scale-95 transition-all">
              <span className="relative z-10 flex items-center gap-2">Enter the Matrix <ArrowRight size={18} /></span>
              <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2">
              <Play size={18} fill="currentColor" /> Watch Intelligence Brief
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-20 border-t border-white/5 mt-20">
            {STATS.map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl font-black tracking-tighter text-white font-mono">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section ref={featRef} className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-4">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Integrated Intelligence</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">MISSION CRITICAL SYSTEMS</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={featInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <f.icon size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cinematic Showcase Section */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 w-fit">
              <Cpu size={32} className="text-indigo-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1]">REASONING WITH VISION-AI</h2>
            <p className="text-white/40 text-lg leading-relaxed">
              Our proprietary Gemini implementation doesn't just look for pixels. It understands visual context. It can identify a pirate stream by analyzing jersey patterns, stadium geometry, and broadcast typography—even when standard fingerprints fail.
            </p>
            <ul className="space-y-4">
              {[
                "Multimodal Threat Detection",
                "Automated Court-Ready Evidence",
                "Sub-Second Asset Recognition"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check size={12} className="text-emerald-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-indigo-500/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative aspect-video rounded-3xl bg-black border border-white/10 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover opacity-20 grayscale" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 animate-pulse">
                  <Shield size={64} className="text-indigo-400" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-emerald-400" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">System Check: Optimal Performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 text-center relative px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">SECURE YOUR LEGACY</h2>
          <p className="text-white/40 text-xl max-w-xl mx-auto">First place isn't just a rank, it's a standard of excellence. Start your operations today.</p>
          <button onClick={() => navigate('/dashboard')}
            className="px-16 py-6 bg-white text-black font-black text-lg uppercase tracking-widest rounded-3xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95 transition-all">
            Initialize Sentinel-Zero
          </button>
        </div>
      </section>

      <footer className="py-12 px-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-indigo-400" />
          <span className="font-black text-sm uppercase tracking-widest">Sentinel-Zero AI</span>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Neural Assets</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Intelligence Network</a>
        </div>
        <p className="text-[10px] font-mono">Build ID: SG-772-BETA</p>
      </footer>
    </div>
  );
}
