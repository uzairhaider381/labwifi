import React from 'react';
import { BookOpen, Terminal, CheckCircle2, ShieldCheck, Power, Radio, Lock } from 'lucide-react';

export const DocumentationSection: React.FC = () => {
  return (
    <section id="docs" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Manual & User Reference
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Documentation & Operational Guide
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Step-by-step instructions for installation, one-click protection, background tray operation, and settings management.
          </p>
        </div>

        <div className="space-y-6">
          {/* Guide 1: One-Click Activation */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/15 space-y-3">
            <div className="flex items-center space-x-3 text-cyan-400">
              <Power className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">1. One-Click Activation & Deactivation</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upon launching WiFi Guardian, the large central Hero Card displays the current shield state. Clicking <strong>ACTIVATE</strong> initiates the state machine: it samples the initial Wi-Fi baseline, stores the trusted BSSID, DNS, and Gateway ARP bindings, and engages high-frequency telemetry polling. Clicking <strong>DEACTIVATE</strong> stops active audits and returns the system to passive background monitoring.
            </p>
          </div>

          {/* Guide 2: Background Operation & System Tray */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/15 space-y-3">
            <div className="flex items-center space-x-3 text-cyan-400">
              <Radio className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">2. Background Operation (Close-to-Tray)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When the user clicks the <strong>X</strong> button on the top right, WiFi Guardian does <strong>not</strong> quit. It intercepts the event and hides the main window while keeping the background monitoring agent alive. The system tray icon dynamically reflects protection status (Cyan Shield = Active, Slate Shield = Inactive). Right-clicking the tray icon reveals options to Open, Activate, Deactivate, or Exit.
            </p>
          </div>

          {/* Guide 3: Administrator Settings Protection */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/15 space-y-3">
            <div className="flex items-center space-x-3 text-cyan-400">
              <Lock className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">3. Administrator Settings Protection</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To prevent unauthorized changes to security preferences or startup configurations, engage the <strong>Settings Lock</strong>. Unlocking requires entering the administrator password (default: <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">admin123</code>, configurable at any time). Passwords are cryptographically salted and hashed using PBKDF2 with SHA-512.
            </p>
          </div>

          {/* Guide 4: Windows Startup Integration */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/15 space-y-3">
            <div className="flex items-center space-x-3 text-cyan-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">4. Auto-Start with Windows</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In the Settings page, toggle <em>"Launch WiFi Guardian when Windows starts"</em>. When enabled, the application registers with Windows user startup items and can launch minimized directly into the background tray upon login.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
