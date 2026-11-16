export type ProtectionState = 'INACTIVE' | 'STARTING' | 'ACTIVE' | 'STOPPING' | 'ERROR';

export interface WifiAdapterInfo {
  name: string;
  description: string;
  guid: string;
  physicalAddress: string;
  state: 'connected' | 'disconnected' | 'disabled' | 'unknown';
  ssid: string;
  bssid: string;
  networkType: string;
  radioType: string;
  authentication: string;
  cipher: string;
  channel: number;
  band: string;
  signalPercent: number;
  rssi: number;
  receiveRateMbps: number;
  transmitRateMbps: number;
  ipv4: string;
  subnet: string;
  gateway: string;
  dnsServers: string[];
  dhcpServer: string;
  internetConnected: boolean;
  pingLatencyMs: number;
  connectionDurationSeconds: number;
  lastChecked: string;
}

export interface NearbyNetwork {
  ssid: string;
  bssid: string;
  signal: number;
  channel: number;
  security: string;
  radio: string;
  band: string;
}

export interface ActivityLog {
  id: number;
  timestamp: string;
  event: string;
  description: string;
  category: 'protection' | 'network' | 'system' | 'security';
  status: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
  details?: string;
}

export interface AppSettings {
  launchOnStartup: boolean;
  minimizeToTray: boolean;
  launchMinimized: boolean;
  desktopNotifications: boolean;
  rogueApDetection: boolean;
  dnsProtection: boolean;
  arpInspection: boolean;
  highFrequencyPolling: boolean;
  settingsProtectionEnabled: boolean;
  theme: 'dark' | 'cyber' | 'light';
  accentColor: 'cyan' | 'blue' | 'emerald' | 'purple';
}

export interface ProtectionStatus {
  state: ProtectionState;
  uptimeSeconds: number;
  startedAt: string | null;
  threatsBlocked: number;
  packetsInspected: number;
  settingsLocked: boolean;
  serviceHealthy: boolean;
  lastError?: string;
}

export interface SecurityStats {
  arpSpoofAttempts: number;
  rogueApsDetected: number;
  dnsTamperingAttempts: number;
  unauthorizedConfigAttempts: number;
}
