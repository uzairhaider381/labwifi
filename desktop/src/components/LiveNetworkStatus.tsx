import React from 'react';
import { Wifi, Globe, Shield, Router, Signal, Radio, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { WifiAdapterInfo } from '../types';

interface LiveNetworkStatusProps {
  wifiInfo: WifiAdapterInfo;
}

export const LiveNetworkStatus: React.FC<LiveNetworkStatusProps> = ({ wifiInfo }) => {
  const isConnected = wifiInfo.state === 'connected';

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0m';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${seconds % 60}s`;
  };

  const getSignalColor = (percent: number) => {
    if (percent >= 75) return 'text-cyan-400 bg-cyan-500/20 border-cyan-400/40';
    if (percent >= 45) return 'text-emerald-400 bg-emerald-500/20 border-emerald-400/40';
    if (percent >= 25) return 'text-amber-400 bg-amber-500/20 border-amber-400/40';
    return 'text-rose-400 bg-rose-500/20 border-rose-400/40';
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Live Windows Network Telemetry</h2>
            <p className="text-[11px] text-slate-400">Real hardware readings via Windows Networking API</p>
          </div>
        </div>

        {/* Live Internet Badge */}
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
          wifiInfo.internetConnected
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }`}>
          <Globe className="w-3.5 h-3.5" />
          <span>{wifiInfo.internetConnected ? 'Internet Online' : 'No Internet Access'}</span>
          {wifiInfo.pingLatencyMs > 0 && (
            <span className="text-[10px] font-mono text-slate-400 pl-1 border-l border-slate-700">
              {wifiInfo.pingLatencyMs}ms
            </span>
          )}
        </div>
      </div>

      {/* Grid of Telemetry Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* SSID & Security */}
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center space-x-1">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>Network SSID</span>
            </span>
            <span className="text-[10px] uppercase font-mono text-cyan-400/90">{wifiInfo.band || '2.4 GHz'}</span>
          </div>
          <div className="font-bold text-white text-base truncate" title={wifiInfo.ssid || 'Not Connected'}>
            {isConnected && wifiInfo.ssid ? wifiInfo.ssid : <span className="text-slate-500 italic">Disconnected</span>}
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>{wifiInfo.authentication || 'WPA2/WPA3'}</span>
            <span>Ch {wifiInfo.channel || 'Auto'}</span>
          </div>
        </div>

        {/* Signal Strength & RSSI */}
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center space-x-1">
              <Signal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Signal Quality</span>
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getSignalColor(wifiInfo.signalPercent)}`}>
              {wifiInfo.signalPercent}%
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#00f0ff]" 
                style={{ width: `${Math.min(100, Math.max(0, wifiInfo.signalPercent))}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex justify-between">
              <span>RSSI: {wifiInfo.rssi} dBm</span>
              <span>{wifiInfo.radioType || '802.11ax'}</span>
            </div>
          </div>
        </div>

        {/* Local IP Address & Gateway */}
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center space-x-1">
              <Router className="w-3.5 h-3.5 text-cyan-400" />
              <span>Local IP (IPv4)</span>
            </span>
          </div>
          <div className="font-bold text-white text-base font-mono truncate" title={wifiInfo.ipv4 || 'N/A'}>
            {wifiInfo.ipv4 || <span className="text-slate-500 text-xs">No IP Assigned</span>}
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate" title={`Gateway: ${wifiInfo.gateway || 'None'}`}>
            GW: {wifiInfo.gateway || '0.0.0.0'}
          </div>
        </div>

        {/* Connection Duration & Adapter State */}
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Session Uptime</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {isConnected ? 'Active' : 'Idle'}
            </span>
          </div>
          <div className="font-bold text-white text-base font-mono">
            {isConnected ? formatDuration(wifiInfo.connectionDurationSeconds) : '0m'}
          </div>
          <div className="text-[10px] text-slate-400 truncate" title={wifiInfo.description}>
            {wifiInfo.description || 'Intel Wi-Fi'}
          </div>
        </div>
      </div>
    </div>
  );
};
