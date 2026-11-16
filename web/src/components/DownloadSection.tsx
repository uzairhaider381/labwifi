import React from 'react';
import { Download, ShieldCheck, CheckCircle2, Monitor, FileCode2, HardDrive, Terminal } from 'lucide-react';

export const DownloadSection: React.FC = () => {
  return (
    <section id="download" className="py-20 relative bg-gradient-to-b from-[#070b14] via-[#090e1a] to-[#070b14]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Download className="w-3.5 h-3.5" />
            <span>Windows Official Release</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Download WiFi Guardian for Windows
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Standalone NSIS Windows Installer with complete system tray service, Start Menu shortcut, and automatic updates.
          </p>
        </div>

        {/* Master Download Box */}
        <div className="glass-panel-glow rounded-3xl p-8 border border-cyan-400/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">WiFiGuardian-Setup.exe</h3>
                  <p className="text-xs text-slate-400 font-mono">v1.0.0-release • x64 Architecture</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Desktop & Start Menu Shortcuts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Background Tray Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Windows 11 / 10 64-bit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Clean Windows Uninstaller</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col items-center space-y-3">
              <a
                href="/WiFiGuardian-Setup.exe"
                download="WiFiGuardian-Setup.exe"
                className="w-full md:w-64 h-14 rounded-2xl font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(0,240,255,0.45)] border border-cyan-400/50 flex items-center justify-center space-x-3 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 text-cyan-200" />
                <span>DOWNLOAD INSTALLER</span>
              </a>
              <span className="text-[11px] font-mono text-slate-400">
                Setup Package • Standalone Executable
              </span>
            </div>
          </div>

          {/* Verification Hash Card */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">SYSTEM PREREQUISITES</span>
              <span className="text-slate-300">Windows 10 / Windows 11 (64-bit)</span>
              <span className="text-slate-500 text-[10px] block">WLAN adapter 802.11n/ac/ax supported</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">EXECUTION MODE</span>
              <span className="text-slate-300">Self-Contained Desktop Application</span>
              <span className="text-slate-500 text-[10px] block">Runs independently without npm run dev</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
