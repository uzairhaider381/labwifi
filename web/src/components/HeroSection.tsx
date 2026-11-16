import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download, Play, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>Commercial-Grade Windows Wi-Fi Utility • Pro Edition v1.0.0</span>
        </div>

        {/* Master Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Next-Generation <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">Wi-Fi Protection</span> & Stealth Background Monitoring
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            One-click active wireless defense for Windows. Protects Wi-Fi configurations with administrator authorization, runs persistently in the Windows system tray, and performs real-time radio telemetry auditing.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('download')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(0,240,255,0.4)] border border-cyan-400/50 flex items-center justify-center space-x-3 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5 text-cyan-200" />
            <span>Download for Windows (64-bit)</span>
          </button>

          <button
            onClick={() => onNavigate('demo')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-400 flex items-center justify-center space-x-3 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>Launch Interactive Simulator</span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Windows 11 & 10 Certified</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Minimizes to System Tray</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero Fake Network Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic Admin Settings Lock</span>
          </div>
        </div>
      </div>
    </section>
  );
};
