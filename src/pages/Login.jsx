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
      login({ name: 'Google User', email: 'user@gmail.com', photoURL: null, isGuest: false });
      toast.success('Authenticated via Google');
      setLoading(false);
    }, 1200);
  };

  const handleGuestLogin = () => {
    login({ name: 'Guest Operative', email: 'guest@sentinel-zero.ai', photoURL: null, isGuest: true });
    toast('Logged in as Guest Access', { icon: '👤' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202124] overflow-hidden font-sans">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#1a73e8]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ea4335]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md px-6"
      >
        <div className="bg-[#2d2e31] border border-[#3c4043] rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-16 h-16 bg-[#1a73e8]/10 border border-[#1a73e8]/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner"
          >
            <Shield size={32} className="text-[#8ab4f8]" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Sentinel-Zero</h1>
          <p className="text-[#9aa0a6] text-sm mb-10 leading-relaxed font-medium">
            Next-Generation AI Security Operating System for Digital Asset Integrity
          </p>

          <div className="w-full space-y-4">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white text-[#202124] hover:bg-[#f1f3f4] transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.85 2.21c1.67-1.53 2.63-3.79 2.63-6.56z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.85-2.21c-.79.53-1.8.85-3.11.85-2.39 0-4.41-1.61-5.14-3.77l-2.94 2.22C2.39 15.4 5.48 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.86 10.74c-.18-.53-.29-1.1-.29-1.74s.11-1.21.29-1.74L.92 4.98C.33 6.18 0 7.56 0 9s.33 2.82.92 4.02l2.94-2.28z"/>
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0 5.48 0 2.39 2.6 1.41 5.92l2.94 2.28c.73-2.16 2.75-3.77 5.14-3.77z"/>
                </svg>
              )}
              {loading ? 'Consulting Google Accounts...' : 'Sign in with Google'}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#3c4043] border border-[#5f6368]/30 text-white hover:bg-[#4d5156] transition-all font-semibold text-sm shadow-sm"
            >
              Access as Guest Operative
              <ArrowRight size={16} className="opacity-50" />
            </motion.button>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <Lock size={12} className="text-[#8ab4f8]" />
              </div>
              <span className="text-[10px] text-[#9aa0a6] font-mono tracking-widest font-black">ENCRYPTED</span>
            </div>
            <div className="w-[1px] h-10 bg-[#3c4043]" />
            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <Globe size={12} className="text-[#34a853]" />
              </div>
              <span className="text-[10px] text-[#9aa0a6] font-mono tracking-widest font-black">GLOBAL</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-[11px] text-[#5f6368] font-mono uppercase tracking-[0.2em]">
          Internal Production Build · Authorized Use Only
        </p>
      </motion.div>
    </div>
  );
}
