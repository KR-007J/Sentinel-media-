import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, ShieldAlert, Zap, Search } from 'lucide-react';
import { callGemini } from '../services/gemini';
import { useStore } from '../hooks/useStore';

export default function AskSentinel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "I am Sentinel AI. How can I help secure your environment today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { globalRiskScore, threats, isSimulationActive, systemLogs } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const systemContext = `
      You are Ask Sentinel, a Senior Google Cybersecurity Architect & Zero Trust expert.
      Your tone is technical, commanding, precise, and authoritative. 
      You are monitoring the Sentinel-Zero interface.
      System Status: ${isSimulationActive ? 'UNDER ACTIVE CYBERATTACK' : 'SECURE BASELINE'}
      Global Risk Score: ${globalRiskScore}/100
      Active Threats (${threats.length}): ${threats.map(t => `${t.type} [${t.severity}]`).join(', ')}
      Recent System Events: ${systemLogs.slice(0, 5).map(l => l.message).join('; ')}
      Answer concisely and provide technical zero-trust mitigation steps. Include specific commands or configs if relevant.
    `;

    try {
      // Using generic legal prompt style just to fetch AI response, 
      // but feeding it the system context in the request
      const response = await callGemini(
        `Context: ${systemContext}. User asks: ${userMessage.text}. Provide a concise 2-3 sentence technical response.`
      );
      
      const aiResponse = { 
        id: Date.now() + 1, 
        text: response || "I'm currently unable to connect to the global neural network. Please check your API configuration.", 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Connection error logging into the defense matrix.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-cyan-600 border-2 border-cyan-400 text-white flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:bg-cyan-500 hover:scale-110 transition-all z-50 group"
      >
        <Bot size={28} className="group-hover:animate-pulse" />
        {isSimulationActive && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-ping" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[400px] h-[550px] bg-slate-950/90 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Bot size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white font-tech uppercase">Ask Sentinel</h3>
                  <p className="text-[10px] text-cyan-500 animate-pulse tracking-widest uppercase">Expert Analysis via Gemini 1.5 Flash</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm font-semibold tracking-wide ${
                    msg.sender === 'user' 
                      ? 'bg-slate-800 text-white rounded-br-none' 
                      : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl rounded-bl-none p-4 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about threats or mitigation..."
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-all placeholder:text-slate-500 font-tech"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 rounded-lg bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 transition-all font-black"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="flex gap-2 mt-3 overflow-x-auto custom-scrollbar pb-1">
                {isSimulationActive ? (
                  <button onClick={() => setInput("Execute immediate lockdown protocol.")} className="shrink-0 text-[10px] font-black uppercase bg-red-900/30 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/50 hover:bg-red-900/50">Emergency Lockdown</button>
                ) : (
                  <button onClick={() => setInput("Run deep forensic scan.")} className="shrink-0 text-[10px] font-black uppercase bg-cyan-900/30 text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-900/50 hover:bg-cyan-900/50">Forensic Scan</button>
                )}
                <button onClick={() => setInput("How to harden my Zero-Trust perimeter?")} className="shrink-0 text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-700">Perimeter Hardening</button>
                <button onClick={() => setInput("Explain current global risk profile.")} className="shrink-0 text-[10px] font-black uppercase bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-700">Risk Profile</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
