import React from 'react';
import { Shield, Minus, Square, X, Wifi, ShieldAlert, ShieldCheck } from 'lucide-react';
import { ProtectionState } from '../types';

interface TitleBarProps {
  protectionState: ProtectionState;
  isWifiConnected: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({ protectionState, isWifiConnected }) => {
  const handleMinimize = () => {
    (window as any).api?.minimizeWindow();
  };

  const handleMaximize = () => {
    (window as any).api?.maximizeWindow();
  };

  const handleClose = () => {
    (window as any).api?.closeWindow();
  };

  const isActive = protectionState === 'ACTIVE';
  const isStarting = protectionState === 'STARTING';

  return (
    <div className="h-10 w-full bg-[#0c1322]/90 border-b border-cyan-500/15 flex items-center justify-between px-3 select-none z-50 fixed top-0 left-0 right-0 [app-region:drag]">
      {/* Brand & Status Pill */}
      <div className="flex items-center space-x-3 [app-region:no-drag]">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-md ${isActive ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'bg-slate-800 text-slate-400'}`}>
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-wider text-xs uppercase bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            WIFI GUARDIAN
          </span>
          <span className="text-[10px] tracking-widest text-slate-500 font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
            v1.0.0
          </span>
        </div>

        {/* Live Status Indicator Pill */}
        <div className="flex items-center space-x-2 pl-3 border-l border-slate-800">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all duration-300 bg-slate-900/60"
            style={{
              borderColor: isActive ? 'rgba(0, 240, 255, 0.4)' : isStarting ? 'rgba(234, 179, 8, 0.4)' : 'rgba(239, 68, 68, 0.3)',
              color: isActive ? '#22d3ee' : isStarting ? '#eab308' : '#f87171'
            }}
          >
            {isActive ? (
              <>
                <ShieldCheck className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>SHIELD ACTIVE</span>
              </>
            ) : isStarting ? (
              <>
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping mr-1" />
                <span>INITIALIZING...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>SHIELD OFF</span>
              </>
            )}
          </div>

          {/* Wi-Fi hardware badge */}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800">
            <Wifi className={`w-3 h-3 ${isWifiConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className="text-[10px]">{isWifiConnected ? 'Wi-Fi Online' : 'No Wi-Fi'}</span>
          </div>
        </div>
      </div>

      {/* Window Controls */}
      <div className="flex items-center space-x-1 [app-region:no-drag]">
        <button
          onClick={handleMinimize}
          className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded transition-colors"
          title="Minimize to Tray / Taskbar"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded transition-colors"
          title="Maximize / Restore"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600/90 rounded transition-colors"
          title="Close to Background Tray"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
