import React from 'react';
import { Shield, Info, CheckCircle2, Award, Terminal, Code2, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Info className="w-5 h-5 text-cyan-400" />
          <span>About WiFi Guardian</span>
        </h2>
        <p className="text-xs text-slate-400">
          Commercial-grade Windows Wi-Fi Protection & Monitoring Software specification
        </p>
      </div>

      {/* Hero Badge Card */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/40 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.35)] shrink-0">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-white tracking-wider">WIFI GUARDIAN</h1>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                PRO EDITION v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Premium Windows Wi-Fi Protection & Monitoring Software designed to deliver one-click wireless defense, persistent background system tray monitoring, and real-time hardware telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Architecture & Stack */}
        <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase text-[11px]">
            <Code2 className="w-4 h-4" />
            <span>Architecture & Technology Stack</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Application Framework</span>
              <span className="text-white font-mono font-semibold">Electron 31 + Node.js 24</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">User Interface</span>
              <span className="text-white font-mono font-semibold">React 18 + Vite + Tailwind CSS</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Animation Engine</span>
              <span className="text-white font-mono font-semibold">Framer Motion</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Persistent Local Storage</span>
              <span className="text-white font-mono font-semibold">SQLite (WebAssembly & Local Disk)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Windows Integration</span>
              <span className="text-white font-mono font-semibold">Win32 WLAN API, Netsh & Native Tray</span>
            </div>
          </div>
        </div>

        {/* Security & Commercial Badges */}
        <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase text-[11px]">
            <Award className="w-4 h-4" />
            <span>Certified Security Standard</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full Background Operation: Window close minimizes to System Tray</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No Faked Network Data: All readings pulled directly from real OS</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PBKDF2 Administrator Authentication for Settings Lock</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Context Isolation & Sandboxed IPC Communication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer & Semester Project Notice */}
      <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
          <Terminal className="w-4 h-4" />
          <span>Project Information & Academic Provenance</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Developed as a Capstone Computer Science & Cybersecurity Semester Project. Engineered to commercial software standards to demonstrate desktop systems programming, Windows networking internals, and cryptographic security UI design.
        </p>
      </div>
    </div>
  );
};
