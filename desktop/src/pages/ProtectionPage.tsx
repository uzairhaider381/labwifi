import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Eye, 
  Cpu, 
  Sliders
} from 'lucide-react';
import { ProtectionState, SecurityStats, AppSettings } from '../types';

interface ProtectionPageProps {
  protectionState: ProtectionState;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
  isSettingsLocked: boolean;
  onToggleSettingsLock: () => void;
  onOpenSetPassword: () => void;
  securityStats: SecurityStats;
  settings: AppSettings;
  onUpdateSetting: (key: keyof AppSettings, value: boolean) => Promise<void>;
}

export const ProtectionPage: React.FC<ProtectionPageProps> = ({
  protectionState,
  onActivate,
  onDeactivate,
  isSettingsLocked,
  onToggleSettingsLock,
  onOpenSetPassword,
  securityStats,
  settings,
  onUpdateSetting,
}) => {
  const isProtected = protectionState === 'ACTIVE';

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Wi-Fi Protection & Security Policies</span>
          </h2>
          <p className="text-xs text-slate-400">
            Enterprise wireless heuristic defense modules and administrative policy enforcement
          </p>
        </div>

        {/* Master State Pill */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-2 border ${
          isProtected 
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isProtected ? 'bg-cyan-400 animate-pulse' : 'bg-rose-400'}`} />
          <span>{isProtected ? 'ACTIVE REAL-TIME SHIELD' : 'STANDBY MODE'}</span>
        </div>
      </div>

      {/* Admin Settings Lock Hero Section */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-start space-x-3.5">
            <div className={`p-3 rounded-xl border ${
              isSettingsLocked ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {isSettingsLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Administrator Settings Protection</h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  isSettingsLocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isSettingsLocked ? 'LOCKED' : 'UNLOCKED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                When activated, security configuration controls, startup hooks, and telemetry thresholds are locked. Modifying them requires administrator authorization.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSetPassword}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change Password</span>
            </button>
            <button
              onClick={onToggleSettingsLock}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-md ${
                isSettingsLocked
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/30'
              }`}
            >
              {isSettingsLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isSettingsLocked ? 'Unlock Controls' : 'Engage Lock'}</span>
            </button>
          </div>
        </div>

        {/* Informational Notice */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Scope Disclosure:</strong> Wi-Fi Settings Protection locks application-managed policies, diagnostic loops, and startup hooks. It does not alter Windows kernel components without explicit user elevation.
          </span>
        </div>
      </div>

      {/* Active Defense Heuristic Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Rogue AP & Evil Twin Detection */}
        <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Rogue AP & Evil Twin Detection</h4>
                <p className="text-[11px] text-slate-400">BSSID beacon consistency & MAC verification</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.rogueApDetection}
                disabled={isSettingsLocked}
                onChange={(e) => onUpdateSetting('rogueApDetection', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-disabled:opacity-50"></div>
            </label>
          </div>
          <p className="text-xs text-slate-400">
            Continuously compares the active Access Point BSSID against established trusted baselines to prevent malicious clone access points from intercepting wireless frames.
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
            <span>Threats Intercepted:</span>
            <span className="text-cyan-300 font-bold">{securityStats.rogueApsDetected} events</span>
          </div>
        </div>

        {/* Module 2: ARP Spoof & Gateway Poisoning */}
        <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">ARP Poisoning & MitM Inspection</h4>
                <p className="text-[11px] text-slate-400">Default gateway MAC table binding</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.arpInspection}
                disabled={isSettingsLocked}
                onChange={(e) => onUpdateSetting('arpInspection', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-disabled:opacity-50"></div>
            </label>
          </div>
          <p className="text-xs text-slate-400">
            Audits the local ARP cache to detect gratuitous ARP poisoning attempts where an attacker on the same local network attempts to redirect your gateway traffic.
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
            <span>Poisoning Attempts Blocked:</span>
            <span className="text-cyan-300 font-bold">{securityStats.arpSpoofAttempts} events</span>
          </div>
        </div>

        {/* Module 3: DNS Redirection Guard */}
        <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">DNS Redirection & Hijack Guard</h4>
                <p className="text-[11px] text-slate-400">Resolver integrity & baseline lock</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dnsProtection}
                disabled={isSettingsLocked}
                onChange={(e) => onUpdateSetting('dnsProtection', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-disabled:opacity-50"></div>
            </label>
          </div>
          <p className="text-xs text-slate-400">
            Protects against unauthorized changes to active DNS nameservers. Triggers immediate security alarms if rogue DHCP leases attempt to substitute malicious resolvers.
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
            <span>DNS Anomalies Caught:</span>
            <span className="text-cyan-300 font-bold">{securityStats.dnsTamperingAttempts} events</span>
          </div>
        </div>

        {/* Module 4: High-Frequency Polling */}
        <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">High-Frequency Telemetry Loop</h4>
                <p className="text-[11px] text-slate-400">Sub-second link & RF verification</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.highFrequencyPolling}
                disabled={isSettingsLocked}
                onChange={(e) => onUpdateSetting('highFrequencyPolling', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-disabled:opacity-50"></div>
            </label>
          </div>
          <p className="text-xs text-slate-400">
            Increases Wi-Fi telemetry polling frequency from 5s to 2s whenever Protection is active for rapid detection of link disconnections, de-authentication frames, or signal drops.
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
            <span>Current Sampling Rate:</span>
            <span className="text-cyan-300 font-bold">{settings.highFrequencyPolling ? '2,000 ms' : '5,000 ms'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
