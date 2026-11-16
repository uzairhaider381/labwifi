import React from 'react';
import { ShieldCheck, Wifi, Radio, Lock, Unlock, Clock, AlertTriangle } from 'lucide-react';
import { ProtectionState, WifiAdapterInfo } from '../types';

interface StatusCardsProps {
  protectionState: ProtectionState;
  wifiInfo: WifiAdapterInfo;
  isSettingsLocked: boolean;
  onToggleSettingsLock?: () => void;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  protectionState,
  wifiInfo,
  isSettingsLocked,
  onToggleSettingsLock,
}) => {
  const isProtected = protectionState === 'ACTIVE';
  const isConnected = wifiInfo.state === 'connected';

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {/* 1. Protection Mode */}
      <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Protection Mode</span>
          <ShieldCheck className={`w-4 h-4 ${isProtected ? 'text-cyan-400' : 'text-slate-500'}`} />
        </div>
        <div className="text-sm font-bold text-white flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isProtected ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]' : 'bg-rose-500'}`} />
          <span>{isProtected ? 'Shield Active' : 'Shield Inactive'}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {isProtected ? 'Real-time defense on' : 'Click activate above'}
        </p>
      </div>

      {/* 2. Wi-Fi Connection */}
      <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Wi-Fi Connection</span>
          <Wifi className={`w-4 h-4 ${isConnected ? 'text-emerald-400' : 'text-rose-500'}`} />
        </div>
        <div className="text-sm font-bold text-white flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`} />
          <span className="truncate">{isConnected ? (wifiInfo.ssid || 'Associated') : 'Disconnected'}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 truncate">
          {isConnected ? `${wifiInfo.signalPercent}% signal quality` : 'No WLAN active'}
        </p>
      </div>

      {/* 3. Background Service */}
      <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Background Agent</span>
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
        </div>
        <div className="text-sm font-bold text-white flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <span>Persistent (Tray)</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Survives window close
        </p>
      </div>

      {/* 4. Settings Lock */}
      <div 
        onClick={onToggleSettingsLock}
        className="p-3.5 rounded-xl glass-panel border border-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Settings Lock</span>
          {isSettingsLocked ? (
            <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          ) : (
            <Unlock className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
          )}
        </div>
        <div className="text-sm font-bold text-white flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isSettingsLocked ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-500'}`} />
          <span>{isSettingsLocked ? 'Admin Locked' : 'Unlocked'}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {isSettingsLocked ? 'PIN required to modify' : 'Click to configure lock'}
        </p>
      </div>

      {/* 5. Network Uptime */}
      <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/10 hover:border-cyan-500/30 transition-all col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Network Uptime</span>
          <Clock className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-sm font-bold text-white font-mono flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
          <span>
            {isConnected ? `${Math.floor(wifiInfo.connectionDurationSeconds / 60)}m ${wifiInfo.connectionDurationSeconds % 60}s` : '0m'}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 truncate">
          {wifiInfo.internetConnected ? 'WAN link verified' : 'Local link only'}
        </p>
      </div>
    </div>
  );
};
