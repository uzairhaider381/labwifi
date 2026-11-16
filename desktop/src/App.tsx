import React, { useState, useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar, NavTab } from './components/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { WifiMonitorPage } from './pages/WifiMonitorPage';
import { ProtectionPage } from './pages/ProtectionPage';
import { ActivityLogsPage } from './pages/ActivityLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminAuthModal } from './components/AdminAuthModal';
import { 
  ProtectionState, 
  ProtectionStatus, 
  WifiAdapterInfo, 
  SecurityStats, 
  ActivityLog, 
  AppSettings 
} from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  
  // Real State Defaults
  const [protectionStatus, setProtectionStatus] = useState<ProtectionStatus>({
    state: 'INACTIVE',
    uptimeSeconds: 0,
    startedAt: null,
    threatsBlocked: 0,
    packetsInspected: 0,
    settingsLocked: false,
    serviceHealthy: true,
  });

  const [wifiInfo, setWifiInfo] = useState<WifiAdapterInfo>({
    name: 'WiFi',
    description: 'Scanning Windows Wi-Fi Interface...',
    guid: '',
    physicalAddress: '--:--:--:--:--:--',
    state: 'unknown',
    ssid: '',
    bssid: '',
    networkType: '',
    radioType: '',
    authentication: '',
    cipher: '',
    channel: 0,
    band: '',
    signalPercent: 0,
    rssi: -100,
    receiveRateMbps: 0,
    transmitRateMbps: 0,
    ipv4: '',
    subnet: '',
    gateway: '',
    dnsServers: [],
    dhcpServer: '',
    internetConnected: false,
    pingLatencyMs: 0,
    connectionDurationSeconds: 0,
    lastChecked: new Date().toISOString(),
  });

  const [securityStats, setSecurityStats] = useState<SecurityStats>({
    arpSpoofAttempts: 0,
    rogueApsDetected: 0,
    dnsTamperingAttempts: 0,
    unauthorizedConfigAttempts: 0,
  });

  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const [settings, setSettings] = useState<AppSettings>({
    launchOnStartup: false,
    minimizeToTray: true,
    launchMinimized: false,
    desktopNotifications: true,
    rogueApDetection: true,
    dnsProtection: true,
    arpInspection: true,
    highFrequencyPolling: true,
    settingsProtectionEnabled: false,
    theme: 'cyber',
    accentColor: 'cyan',
  });

  const [isSettingsLocked, setIsSettingsLocked] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSettingPasswordModalOpen, setIsSettingPasswordModalOpen] = useState<boolean>(false);

  // Initial Load & IPC Bridge Subscriptions
  const loadInitialData = useCallback(async () => {
    if ((window as any).api) {
      try {
        const [wifi, prot, stats, storedLogs, appSettings, lockStatus] = await Promise.all([
          (window as any).api.getWifiInfo(),
          (window as any).api.getProtectionStatus(),
          (window as any).api.getSecurityStats(),
          (window as any).api.getLogs(),
          (window as any).api.getSettings(),
          (window as any).api.getSettingsProtectionStatus(),
        ]);

        if (wifi) setWifiInfo(wifi);
        if (prot) setProtectionStatus(prot);
        if (stats) setSecurityStats(stats);
        if (storedLogs) setLogs(storedLogs);
        if (appSettings) setSettings(appSettings);
        if (lockStatus) setIsSettingsLocked(lockStatus.isLocked && !lockStatus.sessionUnlocked);
      } catch (e) {
        console.error('Error fetching initial desktop state:', e);
      }
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    // Event listeners
    if ((window as any).api) {
      const unsubWifi = (window as any).api.onWifiUpdate((info: WifiAdapterInfo) => {
        setWifiInfo(info);
      });

      const unsubProt = (window as any).api.onProtectionUpdate((status: ProtectionStatus) => {
        setProtectionStatus(status);
      });

      const unsubLogs = (window as any).api.onLogAdded((newLog: ActivityLog) => {
        setLogs((prev) => [newLog, ...prev]);
      });

      return () => {
        if (unsubWifi) unsubWifi();
        if (unsubProt) unsubProt();
        if (unsubLogs) unsubLogs();
      };
    }
  }, [loadInitialData]);

  // One-Click Activation Flow
  const handleActivate = async () => {
    setProtectionStatus((prev) => ({ ...prev, state: 'STARTING' }));
    try {
      if ((window as any).api) {
        const res = await (window as any).api.activateProtection();
        if (!res.success) {
          setProtectionStatus((prev) => ({ ...prev, state: 'ERROR', lastError: res.error }));
        }
      } else {
        // Fallback demo in browser
        setTimeout(() => {
          setProtectionStatus((prev) => ({ ...prev, state: 'ACTIVE', startedAt: new Date().toISOString() }));
        }, 1200);
      }
    } catch (err: any) {
      setProtectionStatus((prev) => ({ ...prev, state: 'ERROR', lastError: err?.message }));
    }
  };

  // One-Click Deactivation Flow
  const handleDeactivate = async () => {
    setProtectionStatus((prev) => ({ ...prev, state: 'STOPPING' }));
    try {
      if ((window as any).api) {
        await (window as any).api.deactivateProtection();
      } else {
        setTimeout(() => {
          setProtectionStatus((prev) => ({ ...prev, state: 'INACTIVE', uptimeSeconds: 0 }));
        }, 800);
      }
    } catch (err) {
      setProtectionStatus((prev) => ({ ...prev, state: 'INACTIVE' }));
    }
  };

  // Refresh Hardware
  const handleRefreshHardware = async () => {
    if ((window as any).api) {
      const wifi = await (window as any).api.getWifiInfo();
      if (wifi) setWifiInfo(wifi);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    if ((window as any).api) {
      await (window as any).api.clearLogs();
      const updated = await (window as any).api.getLogs();
      setLogs(updated || []);
    }
  };

  // Update Settings
  const handleUpdateSetting = async (key: keyof AppSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    if ((window as any).api) {
      await (window as any).api.saveSettings({ [key]: value });
    }
  };

  // Settings Lock Toggle
  const handleToggleSettingsLock = () => {
    if (isSettingsLocked) {
      // Need password to unlock
      setIsAuthModalOpen(true);
    } else {
      // Lock immediately
      if ((window as any).api) {
        (window as any).api.lockSettings();
      }
      setIsSettingsLocked(true);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 select-none">
      {/* 1. Custom Frameless Windows Titlebar */}
      <TitleBar
        protectionState={protectionStatus.state}
        isWifiConnected={wifiInfo.state === 'connected'}
      />

      {/* 2. Main Content Area: Sidebar + Active Page */}
      <div className="flex flex-1 overflow-hidden pt-10">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          protectionState={protectionStatus.state}
          isSettingsLocked={isSettingsLocked}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-8 py-6 relative">
          {currentTab === 'overview' && (
            <OverviewPage
              protectionState={protectionStatus.state}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              wifiInfo={wifiInfo}
              uptimeSeconds={protectionStatus.uptimeSeconds}
              isSettingsLocked={isSettingsLocked}
              onToggleSettingsLock={handleToggleSettingsLock}
              logs={logs}
              onViewAllLogs={() => setCurrentTab('logs')}
            />
          )}

          {currentTab === 'monitor' && (
            <WifiMonitorPage
              wifiInfo={wifiInfo}
              onRefresh={handleRefreshHardware}
            />
          )}

          {currentTab === 'protection' && (
            <ProtectionPage
              protectionState={protectionStatus.state}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              isSettingsLocked={isSettingsLocked}
              onToggleSettingsLock={handleToggleSettingsLock}
              onOpenSetPassword={() => setIsSettingPasswordModalOpen(true)}
              securityStats={securityStats}
              settings={settings}
              onUpdateSetting={handleUpdateSetting}
            />
          )}

          {currentTab === 'logs' && (
            <ActivityLogsPage
              logs={logs}
              onClearLogs={handleClearLogs}
              onRefreshLogs={async () => {
                if ((window as any).api) {
                  const updated = await (window as any).api.getLogs();
                  setLogs(updated);
                }
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSetting={handleUpdateSetting}
              isSettingsLocked={isSettingsLocked}
              onToggleSettingsLock={handleToggleSettingsLock}
              onOpenSetPassword={() => setIsSettingPasswordModalOpen(true)}
            />
          )}

          {currentTab === 'about' && <AboutPage />}
        </main>
      </div>

      {/* Admin Unlock Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsSettingsLocked(false);
        }}
        isSettingPassword={false}
      />

      {/* Set Admin Password Modal */}
      <AdminAuthModal
        isOpen={isSettingPasswordModalOpen}
        onClose={() => setIsSettingPasswordModalOpen(false)}
        onSuccess={() => {
          // Password set
        }}
        isSettingPassword={true}
      />
    </div>
  );
};
