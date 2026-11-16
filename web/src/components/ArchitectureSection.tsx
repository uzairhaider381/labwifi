import React from 'react';
import { Layers, Monitor, Cloud, ArrowRight, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            System Design & Topology
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dual-Tier Decoupled Architecture
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Why WiFi Guardian strictly separates the hosted cloud landing dashboard from the local Windows kernel networking agent.
          </p>
        </div>

        {/* Dual Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Cloud Tier (Vercel) */}
          <div className="glass-panel rounded-2xl p-8 border border-cyan-500/20 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Cloud className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  HOSTED: VERCEL EDGE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Cloud Web Dashboard & Landing Hub</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deployed globally on Vercel's serverless edge infrastructure. Provides the public software distribution repository, release verification checksums, user documentation, and interactive UI sandbox.
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Public static asset & binary distribution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Zero local machine privilege or kernel access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Security policy and changelog documentation</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Role: Static Portal & Interactive UI Simulator
            </div>
          </div>

          {/* Local Windows Tier */}
          <div className="glass-panel-glow rounded-2xl p-8 border border-cyan-400/40 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <Monitor className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
                  LOCAL: WIN32 DESKTOP
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Local Windows Networking Agent</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Installed directly on the user's Windows machine via the standalone NSIS installer. Interacts directly with native Windows networking APIs to perform actual telemetry, system tray persistence, and adapter auditing.
              </p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Direct Win32 WLAN API & Netsh hardware interrogation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Windows System Tray persistence & startup hook</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Encrypted SQLite forensic audit logging on local disk</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
              Role: Real Win-API Heuristic Engine & System Tray Service
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
