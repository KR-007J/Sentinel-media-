import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, ArrowRight, Chrome } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    // Simulate Google Login
    setTimeout(() => {
      login({ name: 'User', email: 'user@example.com', photoURL: null, isGuest: false });
      toast.success('Authenticated via Google');
      setLoading(false);
    }, 1500);
  };

  const handleGuestLogin = () => {
    login({ name: 'Guest Agent', email: 'guest@sentinel.io', photoURL: null, isGuest: true });
    toast('Logged in as Guest', { icon: '👤' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07080f] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md p-8 mx-4"
      >
        <div className="aurora-card p-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/5"
          >
            <Shield size={40} className="text-indigo-400" />
          </motion.div>

          <h1 className="text-3xl font-display font-bold text-white mb-2">Sentinel-Zero</h1>
          <p className="text-aurora-muted text-sm mb-10 max-w-[280px]">
            AI-Powered Digital Asset Guardian & Security Operating System
          </p>

          <div className="w-full space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white text-black hover:bg-white/90 transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
              {loading ? 'Authenticating...' : 'Sign in with Google'}
            </button>

            <button 
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-semibold text-sm"
            >
              Continue as Guest
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <Lock size={14} className="text-aurora-muted" />
              <span className="text-[10px] text-aurora-muted font-mono uppercase tracking-widest">Secure</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <Globe size={14} className="text-aurora-muted" />
              <span className="text-[10px] text-aurora-muted font-mono uppercase tracking-widest">Global</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-[11px] text-aurora-muted font-mono uppercase tracking-tighter opacity-50">
          Encrypted Access · Version 2.5a · Experimental Preview
        </p>
      </motion.div>
    </div>
  );
}
