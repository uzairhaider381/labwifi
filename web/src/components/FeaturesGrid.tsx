import React from 'react';
import { 
  Power, 
  Radio, 
  Wifi, 
  Lock, 
  ScrollText, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  Globe 
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Power,
      title: 'One-Click Active Shield',
      desc: 'Seamless state machine (INACTIVE -> STARTING -> ACTIVE -> STOPPING). Instant engagement of real-time wireless heuristic defenses with zero friction.',
      badge: 'Core Feature'
    },
    {
      icon: Radio,
      title: 'Stealth Background System Tray',
      desc: 'Clicking the close button (X) preserves monitoring by minimizing directly into the Windows system tray with dynamic active/inactive tray icons.',
      badge: 'Windows Tray'
    },
    {
      icon: Wifi,
      title: 'Real Windows Telemetry',
      desc: 'Zero simulated fake metrics in the desktop agent. Real-time netsh WLAN adapter queries, RSSI, BSSID, physical link rates, channel spectrum, and gateway ping.',
      badge: 'Win32 WLAN API'
    },
    {
      icon: Lock,
      title: 'Administrator Settings Protection',
      desc: 'Lock selected application-managed configuration controls behind PBKDF2-SHA512 password protection to prevent unauthorized tampering.',
      badge: 'Admin Lock'
    },
    {
      icon: Cpu,
      title: 'Rogue AP & ARP Defense',
      desc: 'Heuristic detection of rogue Access Point BSSID cloning (Evil Twin) and subnet ARP gateway cache poisoning with instant security alerts.',
      badge: 'Heuristics'
    },
    {
      icon: ScrollText,
      title: 'SQLite Forensic Activity Audit',
      desc: 'Persistent local SQLite database storing all connection events, roaming handovers, and defensive intercepts with full search, filters, and CSV export.',
      badge: 'SQLite Database'
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Commercial-Grade Architecture
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Reliability, Security, and Precision
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need for comprehensive Windows wireless monitoring and settings integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="glass-panel rounded-2xl p-6 border border-cyan-500/15 hover:border-cyan-500/40 transition-all hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
