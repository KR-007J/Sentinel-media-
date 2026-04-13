import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, ArrowRight, Radio, Scan, Zap } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    // Simulate Tactical Auth Sync
    setTimeout(() => {
      login({ name: 'Operative X', email: 'verified@sentinel-zero.ai', photoURL: null, isGuest: false });
      toast.success('NEURAL SYNC COMPLETE', {
        style: { background: '#020617', color: '#06b6d4', border: '1px solid #06b6d433' }
      });
      setLoading(false);
    }, 1500);
  };

  const handleGuestLogin = () => {
    login({ name: 'Guest Operative', email: 'guest@sentinel-zero.ai', photoURL: null, isGuest: true });
    toast('GUEST CLEARANCE GRANTED', { 
      icon: '👤',
      style: { background: '#020617', color: '#a855f7', border: '1px solid #a855f733' }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] overflow-hidden font-tech">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl px-6"
      >
        <div className="glass-card !bg-slate-950/40 p-12 border-cyan-500/20 backdrop-blur-3xl overflow-hidden group">
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan" />
          
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="w-24 h-24 bg-cyan-500/10 border border-cyan-500/30 rounded-3xl flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative"
            >
              <Shield size={44} className="text-cyan-400" />
              <div className="absolute -inset-2 border border-cyan-500/10 rounded-[2rem] animate-ping-slow" />
            </motion.div>

            <h1 className="text-5xl font-black text-white mb-3 tracking-tighter uppercase italic">
              SENTINEL<span className="text-cyan-500 italic-none">ZERO</span>
            </h1>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px w-8 bg-slate-800" />
              <p className="text-cyan-500/60 text-[10px] uppercase tracking-[0.6em] font-black">
                Tactical Intelligence v3.0
              </p>
              <div className="h-px w-8 bg-slate-800" />
            </div>

            <div className="w-full space-y-6">
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group relative w-full py-5 px-8 bg-white text-slate-950 font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="animate-spin" />
                    <span>Synchronizing Neurals...</span>
                  </div>
                ) : (
                  <>
                    <Globe size={18} />
                    <span>Neural Auth Sync</span>
                    <div className="absolute inset-0 bg-cyan-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  </>
                )}
              </button>

              <button 
                onClick={handleGuestLogin}
                className="w-full py-5 px-8 bg-slate-900/60 border border-slate-800 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-slate-800 hover:border-purple-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                <Radio size={18} className="text-purple-400 group-hover:animate-pulse" />
                Guest Intercept Clearance
              </button>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-800 w-full grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Lock size={16} className="text-cyan-400" />
                </div>
                <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase">AES-NODE</span>
              </div>
              <div className="flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Scan size={16} className="text-purple-400" />
                </div>
                <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase">DNA-MATCH</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between opacity-30 px-4">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">
            Build: SZ-B-103 // 256-BIT
          </p>
          <div className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
