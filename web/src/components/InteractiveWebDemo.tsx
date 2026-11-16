import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Power, 
  RefreshCw, 
  Wifi, 
  Signal, 
  Router, 
  Radio, 
  Lock, 
  Unlock, 
  ScrollText, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';

export const InteractiveWebDemo: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [signal, setSignal] = useState(94);
  const [isLocked, setIsLocked] = useState(false);
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: '19:42:10',
      event: 'Web Simulator Active',
      desc: 'Interactive preview loaded in web browser.',
      status: 'INFO'
    },
    {
      id: 2,
      time: '19:42:15',
      event: 'Wi-Fi Associated',
      desc: 'Connected to SSID: "Campus-Secure" (WPA2-Enterprise).',
      status: 'SUCCESS'
    }
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setUptime(u => u + 1);
        setSignal(s => Math.min(100, Math.max(85, s + (Math.random() > 0.5 ? 1 : -1))));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const handleToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsActive(!isActive);
      setIsTransitioning(false);
      if (!isActive) {
        setUptime(0);
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            event: 'Shield Activated (Demo)',
            desc: 'Active wireless defense engaged on "Campus-Secure".',
            status: 'SUCCESS'
          },
          ...prev
        ]);
      } else {
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            event: 'Shield Deactivated (Demo)',
            desc: 'Protection disengaged. Returned to standby mode.',
            status: 'INFO'
          },
          ...prev
        ]);
      }
    }, 800);
  };

  const formatUptime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <section id="demo" className="py-20 relative bg-[#090e1a]/80 border-y border-cyan-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Interactive Web Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Try the Desktop Experience in Your Browser
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Test the one-click activation system, status telemetry, and security state machine right now.
          </p>
        </div>

        {/* Technical Notice Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Browser Architecture Notice:</strong> Web browsers in cloud environments (Vercel) cannot directly interface with your local physical PC Wi-Fi radio. This interactive sandbox demonstrates the exact UI, telemetry, and logic. For real hardware monitoring, download the desktop application below.
          </span>
        </div>

        {/* Replicated Desktop Dashboard Interface */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-6">
          {/* Top Titlebar Strip */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-white">
                WIFI GUARDIAN DESKTOP SIMULATOR
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className="font-mono text-slate-300">{isActive ? 'PROTECTION ACTIVE' : 'PROTECTION OFF'}</span>
            </div>
          </div>

          {/* Hero Card */}
          <div className={`rounded-2xl p-6 transition-all duration-500 ${
            isActive ? 'bg-gradient-to-r from-cyan-950/40 via-blue-950/50 to-[#0c1322] border border-cyan-400/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]' : 'bg-slate-900/50 border border-slate-800'
          } flex flex-col md:flex-row items-center justify-between gap-6`}>
            <div className="flex items-center space-x-5">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${
                isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.4)]' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {isActive ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {isActive ? 'SHIELD OPERATIONAL' : 'PROTECTION OFF'}
                  </span>
                  {isActive && <span className="text-[11px] font-mono text-cyan-400">{formatUptime(uptime)}</span>}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {isActive ? 'Your Wi-Fi protection is ACTIVE' : 'Protection is currently OFF'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isActive ? 'Heuristic ARP check, rogue AP defense, and DNS lock active on "Campus-Secure"' : 'Click the button to engage one-click protection'}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggle}
              disabled={isTransitioning}
              className={`w-full md:w-52 h-12 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                isActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/40'
              }`}
            >
              {isTransitioning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  <span>{isActive ? 'DEACTIVATE' : 'ACTIVATE'}</span>
                </>
              )}
            </button>
          </div>

          {/* Simulated Telemetry Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Network SSID</span>
              <span className="font-bold text-white text-sm">Campus-Secure</span>
              <span className="text-[10px] text-cyan-400 font-mono block">5.0 GHz • WPA2</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Signal Strength</span>
              <span className="font-bold text-white text-sm">{signal}% (-32 dBm)</span>
              <span className="text-[10px] text-emerald-400 font-mono block">Channel 48</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Local IPv4</span>
              <span className="font-bold text-white text-sm font-mono">192.168.1.142</span>
              <span className="text-[10px] text-slate-400 font-mono block">GW: 192.168.1.1</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Settings Protection</span>
              <span className="font-bold text-white text-sm">{isLocked ? 'Admin Locked' : 'Unlocked'}</span>
              <button
                onClick={() => setIsLocked(!isLocked)}
                className="text-[10px] text-cyan-400 hover:underline block"
              >
                {isLocked ? 'Click to Unlock' : 'Click to Lock'}
              </button>
            </div>
          </div>

          {/* Activity Mini Feed */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <ScrollText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Event Feed</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {logs.slice(0, 3).map((l) => (
                <div key={l.id} className="flex items-center justify-between p-2 rounded bg-slate-900/60 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">{l.event}:</span>
                    <span className="text-slate-400 truncate max-w-sm">{l.desc}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{l.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
