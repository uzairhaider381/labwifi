import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070b14] border-t border-cyan-500/15 py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider uppercase text-white block">
              WIFI GUARDIAN
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Windows Desktop Wi-Fi Protection Software
            </span>
          </div>
        </div>

        <p className="text-center text-slate-500 text-[11px]">
          Copyright © 2026 WiFi Guardian Team. Built for Windows 10 & 11 64-bit.
        </p>

        <div className="flex items-center space-x-4 text-[11px] font-mono text-cyan-400/80">
          <span>v1.0.0 PRO</span>
          <span>•</span>
          <span>WIN32 WLAN API</span>
          <span>•</span>
          <span>VERCEL EDGE</span>
        </div>
      </div>
    </footer>
  );
};
