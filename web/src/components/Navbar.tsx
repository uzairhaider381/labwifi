import React from 'react';
import { Shield, Download, ExternalLink, Terminal, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#070b14]/85 backdrop-blur-md border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent block">
              WIFI GUARDIAN
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest block -mt-0.5">
              WINDOWS PRO SECURITY
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
          <button onClick={() => onNavigate('features')} className="hover:text-cyan-400 transition-colors">
            Features
          </button>
          <button onClick={() => onNavigate('demo')} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
            <span>Web Simulator</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>
          <button onClick={() => onNavigate('architecture')} className="hover:text-cyan-400 transition-colors">
            Architecture
          </button>
          <button onClick={() => onNavigate('docs')} className="hover:text-cyan-400 transition-colors">
            Documentation
          </button>
          <button onClick={() => onNavigate('contact')} className="hover:text-cyan-400 transition-colors">
            Project & Team
          </button>
        </nav>

        {/* CTA */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('download')}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] border border-cyan-400/40 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Installer</span>
          </button>
        </div>
      </div>
    </header>
  );
};
