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
    <div className="max-w-3xl space-y-6">
      {/* API Keys */}
      <SettingSection title="API Keys & Integrations" icon={Key} delay={0}>
        <ApiKeyField label="GEMINI API KEY" placeholder="AIza••••••••••••••••••••••••••" envKey="VITE_GEMINI_API_KEY"
          link="https://aistudio.google.com/app/apikey" />
        <ApiKeyField label="FIREBASE API KEY" placeholder="AIza••••••••••••••••••••••••••" envKey="VITE_FIREBASE_API_KEY"
          link="https://console.firebase.google.com" />
        <div className="mt-2 p-3 rounded-xl border border-[#f9ab00]/20 bg-[#f9ab00]/5">
          <p className="text-xs text-[#fdd663] font-mono leading-relaxed">
            ⚠️ Store API keys in your <code>.env</code> file. Never commit them to git.
            For production, use Firebase environment config or Render secret env vars.
          </p>
        </div>
      </SettingSection>

      {/* Chrome Extension */}
      <SettingSection title="Chrome Extension Delivery" icon={Globe} delay={0.05}>
        <div className="space-y-4">
          <p className="text-xs text-[#9aa0a6] leading-relaxed">
            To share Sentinel-Zero as a Chrome Extension with your teammate:
          </p>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-[#1a73e8]/20 text-[#8ab4f8] flex items-center justify-center text-[10px] font-bold">1</div>
              <p className="text-[11px] text-white">Run <code className="text-[#8ab4f8]">npm run build</code> to generate the <code className="text-white">dist</code> folder.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-[#1a73e8]/20 text-[#8ab4f8] flex items-center justify-center text-[10px] font-bold">2</div>
              <p className="text-[11px] text-white">Zip the <code className="text-white">dist</code> folder and send it to your friend.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-[#1a73e8]/20 text-[#8ab4f8] flex items-center justify-center text-[10px] font-bold">3</div>
              <p className="text-[11px] text-white">Ask them to go to <code className="text-[#8ab4f8]">chrome://extensions</code>, enable "Developer mode", and click "Load unpacked".</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-xl bg-[#1a73e8]/10 border border-[#1a73e8]/30 text-[10px] font-bold uppercase tracking-widest text-[#8ab4f8] hover:bg-[#1a73e8]/20 transition-all flex items-center justify-center gap-2">
            <Download size={12} /> Download Extension Bundle (.zip)
          </motion.button>
        </div>
      </SettingSection>

      {/* Detection thresholds */}
      <SettingSection title="Detection Engine" icon={Cpu} delay={0.1}>
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <label className="text-xs font-mono text-[#9aa0a6]">UNAUTHORIZED THRESHOLD</label>
            <span className="text-xs font-mono font-bold text-white">{threshold}%</span>
          </div>
          <input type="range" min={60} max={99} value={threshold} onChange={e => setThreshold(+e.target.value)}
            className="w-full accent-[#1a73e8]" />
          <div className="flex justify-between text-[10px] font-mono text-[#9aa0a6] mt-1">
            <span>60% (lenient)</span><span>99% (strict)</span>
          </div>
        </div>
        <Toggle label="Enable live monitoring" desc="Simulate real-time threat detection in the dashboard" defaultOn={true} />
        <Toggle label="Auto-generate DMCA notices" desc="Automatically draft takedown notices for high-confidence threats" defaultOn={false} />
        <Toggle label="Gemini AI explanations" desc="Use Gemini API to provide reasoning for each detection" defaultOn={true} />
        <Toggle label="pHash fingerprinting" desc="Generate perceptual hash for uploaded assets" defaultOn={true} />
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="Notifications & Alerts" icon={Bell} delay={0.15}>
        <Toggle label="Browser notifications" desc="Get notified when new threats are detected" defaultOn={true} />
        <Toggle label="Email alerts for high-risk threats" desc="Send email when similarity > threshold" defaultOn={false} />
        <Toggle label="Slack webhook integration" desc="Post threat alerts to your Slack channel" defaultOn={false} />
      </SettingSection>

      <button onClick={save} className="btn-primary flex items-center gap-2">
        {saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
