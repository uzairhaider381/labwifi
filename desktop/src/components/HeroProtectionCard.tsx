import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Power, RefreshCw, Lock, Radio, Activity } from 'lucide-react';
import { ProtectionState, WifiAdapterInfo } from '../types';

interface HeroProtectionCardProps {
  protectionState: ProtectionState;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
  wifiInfo: WifiAdapterInfo;
  uptimeSeconds: number;
}

export const HeroProtectionCard: React.FC<HeroProtectionCardProps> = ({
  protectionState,
  onActivate,
  onDeactivate,
  wifiInfo,
  uptimeSeconds,
}) => {
  const isActive = protectionState === 'ACTIVE';
  const isStarting = protectionState === 'STARTING';
  const isStopping = protectionState === 'STOPPING';
  const isInactive = protectionState === 'INACTIVE';
  const isError = protectionState === 'ERROR';

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-8 transition-all duration-500 ${
      isActive 
        ? 'glass-panel-glow border-cyan-500/30' 
        : isStarting || isStopping
        ? 'glass-panel border-amber-500/30'
        : 'glass-panel-red border-rose-500/20'
    }`}>
      {/* Background Animated Energy Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Cyber Glow Orbs */}
      <div 
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isActive ? 'bg-cyan-500/15' : isStarting ? 'bg-yellow-500/15' : 'bg-rose-500/10'
        }`} 
      />
      <div 
        className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isActive ? 'bg-blue-600/15' : 'bg-slate-800/20'
        }`} 
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Shield Visual & Status Statement */}
        <div className="flex items-center space-x-6">
          {/* Animated Shield Container */}
          <div className="relative flex items-center justify-center">
            {/* Outer Rotating Pulse Ring when Active */}
            {isActive && (
              <motion.div
                className="absolute inset-0 w-32 h-32 -m-2 rounded-full border border-cyan-400/30"
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { duration: 16, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              />
            )}

            {/* Glowing Backdrop */}
            <div className={`w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              isActive
                ? 'bg-gradient-to-tr from-cyan-500/20 via-blue-600/30 to-cyan-400/20 border border-cyan-400/50 shadow-[0_0_35px_rgba(0,240,255,0.35)]'
                : isStarting || isStopping
                ? 'bg-amber-500/20 border border-amber-500/50 shadow-[0_0_25px_rgba(234,179,8,0.25)]'
                : 'bg-rose-500/10 border border-rose-500/30 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
            }`}>
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.div
                    key="active-shield"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <ShieldCheck className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
                  </motion.div>
                ) : isStarting || isStopping ? (
                  <motion.div
                    key="transitioning-shield"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-12 h-12 text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="inactive-shield"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <ShieldAlert className="w-14 h-14 text-rose-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Status Prose */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className={`text-[11px] font-mono tracking-wider font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                isActive 
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300' 
                  : isStarting
                  ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-300'
                  : 'bg-rose-500/20 border-rose-400/40 text-rose-300'
              }`}>
                {isActive ? 'SHIELD OPERATIONAL' : isStarting ? 'ENGAGING ENGINE...' : isStopping ? 'DISENGAGING...' : 'PROTECTION OFF'}
              </span>
              {isActive && (
                <span className="flex items-center text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  {formatUptime(uptimeSeconds)}
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              {isActive ? (
                <span>Your Wi-Fi protection is <span className="text-cyan-400">ACTIVE</span></span>
              ) : isStarting ? (
                <span>Starting Wi-Fi Protection...</span>
              ) : isStopping ? (
                <span>Stopping Protection...</span>
              ) : (
                <span>Protection is currently <span className="text-rose-400">OFF</span></span>
              )}
            </h1>

            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              {isActive ? (
                <span>
                  Real-time ARP spoof defense, rogue AP interception, and DNS baseline lock active on{' '}
                  <strong className="text-cyan-300">{wifiInfo.ssid || 'connected interface'}</strong>.
                </span>
              ) : (
                <span>
                  Your wireless connection is currently unmonitored by the active guardian shield. Click below to engage real-time protection.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Master One-Click Button */}
        <div className="w-full md:w-auto flex flex-col items-center md:items-end space-y-2">
          {isActive ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDeactivate}
              disabled={isStopping}
              className="w-full md:w-56 h-14 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-3 transition-all duration-200 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] border border-rose-400/40 cursor-pointer"
            >
              <Power className="w-5 h-5 text-rose-100" />
              <span>DEACTIVATE</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onActivate}
              disabled={isStarting}
              className="w-full md:w-56 h-14 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-3 transition-all duration-200 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(0,240,255,0.5)] border border-cyan-400/60 cursor-pointer"
            >
              {isStarting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>STARTING...</span>
                </>
              ) : (
                <>
                  <Power className="w-5 h-5 text-cyan-200" />
                  <span>ACTIVATE</span>
                </>
              )}
            </motion.button>
          )}

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Radio className={`w-3 h-3 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Background monitoring standby</span>
          </div>
        </div>
      </div>
    </div>
  );
};
