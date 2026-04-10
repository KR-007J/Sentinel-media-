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
  { value: '98.5%', label: 'Forensic Accuracy' },
  { value: '3.8s', label: 'Detection Latency' },
  { value: '$4.2B', label: 'Revenue Protected' },
  { value: '1.2M+', label: 'Takedowns Automated' },
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
    <div className="min-h-screen bg-[#202124] text-white selection:bg-[#1a73e8]/30 overflow-x-hidden font-sans">
      <GridBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[#1a73e8]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-[#ea4335]/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#3c4043] bg-[#2d2e31] text-[10px] font-black uppercase tracking-[0.3em] font-mono text-[#8ab4f8]">
            <Radar size={14} className="animate-spin-slow text-[#4285f4]" />
            Sentinel Network Protection v3.0
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
            SECURE YOUR <br /> <span className="text-[#8ab4f8]">DIGITAL LEGACY</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[#9aa0a6] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            The enterprise-grade AI security console for global sports media. Monitor, detect, and enforce copyright integrity with millisecond precision.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button onClick={() => navigate('/login')}
              className="group relative px-10 py-5 bg-[#1a73e8] text-white font-bold text-sm uppercase tracking-widest rounded-2xl overflow-hidden active:scale-95 transition-all shadow-xl">
              <span className="relative z-10 flex items-center gap-2">Initialize Console <ArrowRight size={18} /></span>
            </button>
            <button className="px-10 py-5 bg-[#2d2e31] border border-[#3c4043] text-white font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-[#3c4043] transition-all flex items-center gap-2">
              <Play size={18} className="text-[#ea4335]" fill="currentColor" /> System Brief
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-20 border-t border-[#3c4043] mt-20">
            {STATS.map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl font-black tracking-tighter text-white font-mono">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8ab4f8]">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section ref={featRef} className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-4">
          <p className="text-[10px] font-black text-[#8ab4f8] uppercase tracking-[0.4em]">Core Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">MISSION CRITICAL PROTECTION</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={featInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-[#2d2e31] border border-[#3c4043] hover:border-[#8ab4f8]/50 transition-all duration-300 relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-[#202124] border border-[#3c4043] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon size={24} className="text-[#1a73e8]" />
              </div>
              <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">{f.title}</h3>
              <p className="text-sm text-[#9aa0a6] leading-relaxed font-medium">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cinematic Showcase Section */}
      <section className="py-32 bg-[#2d2e31] border-y border-[#3c4043] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="p-3 rounded-2xl bg-[#1a73e8]/10 border border-[#1a73e8]/20 w-fit">
              <Cpu size={32} className="text-[#1a73e8]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1]">AUGMENTED VISION ENFORCEMENT</h2>
            <p className="text-[#9aa0a6] text-lg leading-relaxed">
              Leveraging the Google Gemini multimodal engine, Sentinel-Zero identifies piracy patterns that bypass standard hashing. Our system understands camera angles, jersey logos, and broadcast watermarks to verify asset infinity in real-time.
            </p>
            <ul className="space-y-4">
              {[
                "AI-Generated Evidence Dossiers",
                "Automated Takedown Injunctions",
                "Global IP Propagation Tracking"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                  <div className="w-5 h-5 rounded-full bg-[#34a853]/20 flex items-center justify-center">
                    <Check size={12} className="text-[#34a853]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative group">
            <div className="relative aspect-video rounded-3xl bg-[#202124] border border-[#3c4043] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1a73e8]/10 to-transparent opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield size={80} className="text-[#1a73e8] opacity-20 animate-pulse" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#202124]/90 backdrop-blur-md border border-[#3c4043]">
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-[#34a853]" />
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">System Status: Optimal Surveillance Level 5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-[#3c4043] text-center">
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">First place is the only rank that matters.</h2>
          <button onClick={() => navigate('/login')}
            className="px-16 py-5 bg-[#3c4043] text-white font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-[#1a73e8] transition-all">
            Secure Your Assets
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-[#1a73e8]" />
            <span className="font-black text-sm uppercase tracking-widest">Sentinel-Zero AI</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
            <span className="cursor-pointer hover:text-white transition-colors">Network Status</span>
          </div>
          <p className="text-[10px] font-mono tracking-tighter">BUILD v3.0.12a-DEBUG</p>
        </div>
      </footer>
    </div>
  );
}
