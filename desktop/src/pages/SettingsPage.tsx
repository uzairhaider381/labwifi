import React from 'react';
import { 
  Settings as SettingsIcon, 
  Monitor, 
  Bell, 
  Power, 
  ShieldCheck, 
  Lock, 
  Unlock,
  Palette, 
  Key, 
  Check, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSetting: (key: keyof AppSettings, value: any) => Promise<void>;
  isSettingsLocked: boolean;
  onToggleSettingsLock: () => void;
  onOpenSetPassword: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSetting,
  isSettingsLocked,
  onToggleSettingsLock,
  onOpenSetPassword,
}) => {
  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          <span>System & Guardian Preferences</span>
        </h2>
        <p className="text-xs text-slate-400">
          Configure background runtime behavior, startup persistence, and security controls
        </p>
      </div>

      {isSettingsLocked && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Administrator protection is locked. You must unlock controls to modify policies.</span>
          </div>
          <button
            onClick={onToggleSettingsLock}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] uppercase tracking-wider cursor-pointer"
          >
            Unlock Now
          </button>
        </div>
      )}

      {/* 1. General Windows System Settings */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <Power className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">General Windows Integration</h3>
        </div>

        <div className="space-y-4 text-xs">
          {/* Start with Windows */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Launch WiFi Guardian when Windows starts</span>
              <p className="text-slate-400 text-[11px]">
                Automatically registers with Windows login items to boot stealth background monitoring on startup.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.launchOnStartup}
                disabled={isSettingsLocked}
                onChange={(e) => onUpdateSetting('launchOnStartup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-disabled:opacity-50"></div>
            </label>
          </div>

          {/* Minimize to Tray */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Close button (X) minimizes to System Tray</span>
              <p className="text-slate-400 text-[11px]">
                Keeps the background Wi-Fi monitoring agent active in the taskbar notification tray when window is closed.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.minimizeToTray}
                disabled={isSettingsLocked}
                onChange={(e) => onUpdateSetting('minimizeToTray', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-disabled:opacity-50"></div>
            </label>
          </div>

          {/* Launch Minimized */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Launch Minimized into Background</span>
              <p className="text-slate-400 text-[11px]">
                Starts directly in the Windows system tray without popping up the main dashboard on login.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.launchMinimized}
                disabled={isSettingsLocked}
                onChange={(e) => onUpdateSetting('launchMinimized', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-disabled:opacity-50"></div>
            </label>
          </div>

          {/* Show Notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Windows Desktop Toast Notifications</span>
              <p className="text-slate-400 text-[11px]">
                Displays native Windows notification banners for network disconnections and security warnings.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.desktopNotifications}
                disabled={isSettingsLocked}
                onChange={(e) => onUpdateSetting('desktopNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Security & Administrator Authentication */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <Lock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Administrative Policy & Lock</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Master Administrator Passcode</span>
              <p className="text-slate-400 text-[11px]">
                Secures access to configuration controls, log purges, and security policies.
              </p>
            </div>
            <button
              onClick={onOpenSetPassword}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold flex items-center space-x-1.5 cursor-pointer border border-slate-700"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Update Password</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Current Settings Lock State</span>
              <p className="text-slate-400 text-[11px]">
                {isSettingsLocked
                  ? 'Controls are locked. Elevation is required to alter any parameter.'
                  : 'Controls are currently unlocked for configuration.'}
              </p>
            </div>
            <button
              onClick={onToggleSettingsLock}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase text-[11px] flex items-center space-x-1.5 cursor-pointer ${
                isSettingsLocked ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isSettingsLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>{isSettingsLocked ? 'Unlock' : 'Lock Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Appearance & Accent Color */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
          <Palette className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interface Visual Style</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <span className="font-semibold text-white block">Active Theme</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onUpdateSetting('theme', 'cyber')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                  settings.theme === 'cyber' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>Cyber Dark (Recommended)</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <span className="font-semibold text-white block">Accent Glow Color</span>
            <div className="flex items-center space-x-3">
              {[
                { id: 'cyan', color: 'bg-cyan-400' },
                { id: 'blue', color: 'bg-blue-500' },
                { id: 'emerald', color: 'bg-emerald-400' },
                { id: 'purple', color: 'bg-purple-500' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onUpdateSetting('accentColor', c.id)}
                  className={`w-7 h-7 rounded-full ${c.color} flex items-center justify-center transition-all ${
                    settings.accentColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0c1322] scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {settings.accentColor === c.id && <Check className="w-3.5 h-3.5 text-black" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
