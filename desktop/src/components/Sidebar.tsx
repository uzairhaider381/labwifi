import React from 'react';
import { 
  LayoutDashboard, 
  Wifi, 
  ShieldCheck, 
  ScrollText, 
  Settings, 
  Info,
  Lock,
  Unlock,
  Radio
} from 'lucide-react';
import { ProtectionState } from '../types';

export type NavTab = 'overview' | 'monitor' | 'protection' | 'logs' | 'settings' | 'about';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  protectionState: ProtectionState;
  isSettingsLocked: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  protectionState,
  isSettingsLocked,
}) => {
  const navItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'monitor' as NavTab, label: 'Wi-Fi Monitor', icon: Wifi },
    { id: 'protection' as NavTab, label: 'Protection', icon: ShieldCheck },
    { id: 'logs' as NavTab, label: 'Activity Logs', icon: ScrollText },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
    { id: 'about' as NavTab, label: 'About', icon: Info },
  ];

  return (
    <aside className="w-56 h-full bg-[#0c1322]/80 border-r border-cyan-500/10 flex flex-col justify-between pt-14 pb-4 px-3 select-none">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00f0ff]" />
                )}
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Service Card */}
      <div className="space-y-3">
        {/* Settings Lock Pill */}
        <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-2 text-slate-400">
            {isSettingsLocked ? (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Admin Lock</span>
          </div>
          <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
            isSettingsLocked ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'
          }`}>
            {isSettingsLocked ? 'LOCKED' : 'OPEN'}
          </span>
        </div>

        {/* Background Status Card */}
        <div className="p-3 rounded-lg bg-gradient-to-b from-slate-900/90 to-[#070b14] border border-cyan-500/20 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5 font-medium">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Background Agent</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Monitoring active. Application runs persistently in system tray.
          </p>
        </div>
      </div>
    </aside>
  );
};
