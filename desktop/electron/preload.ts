import { contextBridge, ipcRenderer } from 'electron';
import { WifiAdapterInfo, NearbyNetwork, ProtectionStatus, SecurityStats, ActivityLog, AppSettings } from './types';
import { SettingsProtectionStatus } from './services/settings-protection';

contextBridge.exposeInMainWorld('api', {
  // Wi-Fi Telemetry
  getWifiInfo: (): Promise<WifiAdapterInfo> => ipcRenderer.invoke('wifi:getInfo'),
  scanNearbyNetworks: (): Promise<NearbyNetwork[]> => ipcRenderer.invoke('wifi:scanNearby'),

  // Protection Controls
  getProtectionStatus: (): Promise<ProtectionStatus> => ipcRenderer.invoke('protection:getStatus'),
  getSecurityStats: (): Promise<SecurityStats> => ipcRenderer.invoke('protection:getStats'),
  activateProtection: (): Promise<{ success: boolean; error?: string }> => ipcRenderer.invoke('protection:activate'),
  deactivateProtection: (): Promise<{ success: boolean }> => ipcRenderer.invoke('protection:deactivate'),

  // Activity Logs
  getLogs: (filter?: string, search?: string): Promise<ActivityLog[]> => ipcRenderer.invoke('logs:get', filter, search),
  clearLogs: (): Promise<boolean> => ipcRenderer.invoke('logs:clear'),
  exportLogsCsv: (): Promise<string> => ipcRenderer.invoke('logs:exportCsv'),

  // Settings
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: Partial<AppSettings>): Promise<boolean> => ipcRenderer.invoke('settings:save', settings),

  // Settings Protection & Administrative Lock
  getSettingsProtectionStatus: (): Promise<SettingsProtectionStatus> => ipcRenderer.invoke('settings-lock:getStatus'),
  authenticateAdmin: (password: string): Promise<{ success: boolean; message: string }> => ipcRenderer.invoke('settings-lock:auth', password),
  setAdminPassword: (password: string): Promise<{ success: boolean; message: string }> => ipcRenderer.invoke('settings-lock:setPassword', password),
  lockSettings: (): Promise<void> => ipcRenderer.invoke('settings-lock:lock'),
  unlockSettings: (): Promise<void> => ipcRenderer.invoke('settings-lock:unlock'),

  // Window Controls
  minimizeWindow: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: (): Promise<void> => ipcRenderer.invoke('window:maximize'),
  closeWindow: (): Promise<void> => ipcRenderer.invoke('window:close'),
  quitApp: (): Promise<void> => ipcRenderer.invoke('app:quit'),

  // Event Subscriptions
  onWifiUpdate: (callback: (info: WifiAdapterInfo) => void) => {
    const subscription = (_event: any, info: WifiAdapterInfo) => callback(info);
    ipcRenderer.on('wifi:updated', subscription);
    return () => ipcRenderer.removeListener('wifi:updated', subscription);
  },
  onProtectionUpdate: (callback: (status: ProtectionStatus) => void) => {
    const subscription = (_event: any, status: ProtectionStatus) => callback(status);
    ipcRenderer.on('protection:updated', subscription);
    return () => ipcRenderer.removeListener('protection:updated', subscription);
  },
  onLogAdded: (callback: (log: ActivityLog) => void) => {
    const subscription = (_event: any, log: ActivityLog) => callback(log);
    ipcRenderer.on('logs:new', subscription);
    return () => ipcRenderer.removeListener('logs:new', subscription);
  },
});
