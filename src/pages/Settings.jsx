import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Database, Bell, Shield, Save, Eye, EyeOff, CheckCircle, ExternalLink, Cpu, Globe, Download } from 'lucide-react';
import toast from 'react-hot-toast';

function SettingSection({ title, icon: Icon, children, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="aurora-card p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#3c4043]">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(26,115,232,0.1)', border: '1px solid rgba(26,115,232,0.2)' }}>
          <Icon size={15} className="text-[#8ab4f8]" />
        </div>
        <p className="font-display font-semibold text-white">{title}</p>
      </div>
      {children}
    </motion.div>
  );
}

function ApiKeyField({ label, placeholder, envKey, link }) {
  const [val, setVal] = useState('');
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-mono text-[#9aa0a6] tracking-wide">{label}</label>
        {link && <a href={link} target="_blank" rel="noopener noreferrer"
          className="text-[11px] text-[#8ab4f8] hover:text-[#1a73e8] flex items-center gap-1 transition-colors">
          Get key <ExternalLink size={10} />
        </a>}
      </div>
      <div className="relative">
        <input type={show ? 'text' : 'password'} className="input-field pr-10 font-mono text-xs"
          placeholder={placeholder} value={val} onChange={e => setVal(e.target.value)} />
        <button onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-white transition-colors">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      <p className="text-[11px] text-[#9aa0a6] mt-1 font-mono">Set via <code className="text-[#8ab4f8]">.env</code>: <code className="text-[#8ab4f8]">{envKey}</code></p>
    </div>
  );
}

function Toggle({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#3c4043] last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-[#9aa0a6] mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => setOn(v => !v)}
        className={`relative w-10 h-5 rounded-full transition-all duration-300 ${on ? 'bg-[#1a73e8]' : 'bg-[#3c4043]'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [threshold, setThreshold] = useState(85);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    toast.success('Settings saved');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black text-cyan-500 tracking-[0.4em] uppercase mb-1 italic">Core System Protocols</p>
          <h2 className="text-3xl font-black text-white tracking-tight font-tech uppercase italic">CONFIGURATION<span className="text-cyan-500">_SENTINEL ZERO</span></h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* API Keys */}
        <SettingSection title="Neural API Keys" icon={Key} delay={0}>
          <ApiKeyField label="GEMINI NEURAL ENGINE" placeholder="AIza••••••••••••••••••••••••••" envKey="VITE_GEMINI_API_KEY"
            link="https://aistudio.google.com/app/apikey" />
          <ApiKeyField label="FIREBASE DATA LAKE" placeholder="AIza••••••••••••••••••••••••••" envKey="VITE_FIREBASE_API_KEY"
            link="https://console.firebase.google.com" />
          <div className="mt-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
            <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest leading-relaxed">
              ⚠️ Warning: Cryptographic keys must remain in local .env registry. Public disclosure will compromise network integrity.
            </p>
          </div>
        </SettingSection>

        {/* Chrome Extension */}
        <SettingSection title="Network Propagation" icon={Globe} delay={0.05}>
          <div className="space-y-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic">
              Deploy Sentinel Zero node to remote environments:
            </p>
            <div className="space-y-3">
              {[
                { n: '1', t: 'Execute `npm run build` to compile binary assets.' },
                { n: '2', t: 'Compress static `dist` registry into encrypted ZIP.' },
                { n: '3', t: 'Load unpacked build via `chrome://extensions` protocols.' }
              ].map(step => (
                <div key={step.n} className="flex gap-4 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/30 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black">{step.n}</div>
                  <p className="text-[11px] text-slate-300 font-medium">{step.t}</p>
                </div>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 shadow-lg">
              <Download size={14} /> Download Extension Bundle
            </motion.button>
          </div>
        </SettingSection>

        {/* Detection thresholds */}
        <SettingSection title="Tactical Scan Engine" icon={Cpu} delay={0.1}>
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SENSITIVITY THRESHOLD</label>
              <span className="text-xs font-tech font-black text-cyan-500">{threshold}%</span>
            </div>
            <input type="range" min={60} max={99} value={threshold} onChange={e => setThreshold(+e.target.value)}
              className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer" />
            <div className="flex justify-between text-[9px] font-black text-slate-500 mt-2 uppercase">
              <span>Low Latency</span><span>High Fidelity</span>
            </div>
          </div>
          <Toggle label="Neural Surveillance" desc="Real-time heuristic threat detection tracking" defaultOn={true} />
          <Toggle label="Zero-Day Mitigation" desc="Automated takedown request drafting" defaultOn={false} />
          <Toggle label="Gemini Intelligence" desc="Multi-modal reasoning for signal classification" defaultOn={true} />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Alert Protocols" icon={Bell} delay={0.15}>
          <Toggle label="HUD Notifications" desc="Visual overlays for high-risk signal detection" defaultOn={true} />
          <Toggle label="Encrypted Email Relays" desc="SMTP transmission of weekly intel summaries" defaultOn={false} />
          <Toggle label="Neural Webhooks" desc="Direct synchronization with Slack/Discord nodes" defaultOn={false} />
        </SettingSection>
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={save} className="px-10 py-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[12px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-2xl shadow-cyan-500/30 active:scale-95">
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'SYNC COMPLETE' : 'SAVE PROTOCOLS'}
        </button>
      </div>
    </div>
  );
}
