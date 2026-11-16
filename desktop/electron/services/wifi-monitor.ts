import { exec } from 'child_process';
import util from 'util';
import http from 'http';
import { WifiAdapterInfo, NearbyNetwork } from '../types';
import { StorageService } from './storage';

const execAsync = util.promisify(exec);

export type NetworkChangeCallback = (current: WifiAdapterInfo, previous: WifiAdapterInfo | null) => void;

export class WifiMonitorService {
  private currentInfo: WifiAdapterInfo = this.getDefaultAdapterInfo();
  private previousInfo: WifiAdapterInfo | null = null;
  private nearbyNetworks: NearbyNetwork[] = [];
  private isPolling = false;
  private pollInterval: NodeJS.Timeout | null = null;
  private connectionStartTime: number | null = null;
  private storage: StorageService;
  private onNetworkChangeListeners: NetworkChangeCallback[] = [];

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  public getDefaultAdapterInfo(): WifiAdapterInfo {
    return {
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
    };
  }

  public async startMonitoring(intervalMs = 3000): Promise<void> {
    if (this.isPolling) return;
    this.isPolling = true;

    // Run first sample immediately
    await this.refreshTelemetry();

    this.pollInterval = setInterval(async () => {
      try {
        await this.refreshTelemetry();
      } catch (err) {
        console.error('Error during Wi-Fi polling telemetry:', err);
      }
    }, intervalMs);
  }

  public stopMonitoring(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
  }

  public onNetworkChange(listener: NetworkChangeCallback): void {
    this.onNetworkChangeListeners.push(listener);
  }

  public getCurrentInfo(): WifiAdapterInfo {
    return { ...this.currentInfo };
  }

  public getNearbyNetworks(): NearbyNetwork[] {
    return [...this.nearbyNetworks];
  }

  public async refreshTelemetry(): Promise<WifiAdapterInfo> {
    const prev = this.previousInfo ? { ...this.previousInfo } : null;
    const newInfo: WifiAdapterInfo = { ...this.getDefaultAdapterInfo() };

    // 1. Query netsh wlan show interfaces
    try {
      const { stdout: wlanOut } = await execAsync('netsh wlan show interfaces', { windowsHide: true });
      this.parseWlanInterfaces(wlanOut, newInfo);
    } catch (e: any) {
      // If netsh fails (e.g. Wi-Fi disabled or no wlan service), mark state accordingly
      newInfo.description = 'Wi-Fi Adapter Unavailable / Disconnected';
      newInfo.state = 'disconnected';
    }

    // 2. Query ipconfig /all for accurate IP, subnet, gateway, DNS
    try {
      const { stdout: ipOut } = await execAsync('ipconfig /all', { windowsHide: true });
      this.parseIpConfig(ipOut, newInfo);
    } catch (e) {
      // ignore
    }

    // 3. Test real internet connectivity and latency
    const { connected, latency } = await this.testInternetConnectivity();
    newInfo.internetConnected = connected;
    newInfo.pingLatencyMs = latency;

    // 4. Track connection duration
    if (newInfo.state === 'connected' && newInfo.ssid) {
      if (!this.connectionStartTime) {
        this.connectionStartTime = Date.now();
      }
      newInfo.connectionDurationSeconds = Math.floor((Date.now() - this.connectionStartTime) / 1000);
    } else {
      this.connectionStartTime = null;
      newInfo.connectionDurationSeconds = 0;
    }

    newInfo.lastChecked = new Date().toISOString();

    // 5. Detect connection changes & log them
    this.detectStateChanges(newInfo, prev);

    this.previousInfo = { ...newInfo };
    this.currentInfo = newInfo;

    return newInfo;
  }

  public async scanNearbyNetworks(): Promise<NearbyNetwork[]> {
    try {
      const { stdout } = await execAsync('netsh wlan show networks mode=bssid', { windowsHide: true });
      const networks = this.parseNearbyNetworks(stdout);
      this.nearbyNetworks = networks;
      return networks;
    } catch (e) {
      return this.nearbyNetworks;
    }
  }

  private parseWlanInterfaces(output: string, info: WifiAdapterInfo): void {
    const lines = output.split(/\r?\n/);
    let inInterface = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      const key = line.substring(0, colonIdx).trim().toLowerCase();
      const val = line.substring(colonIdx + 1).trim();

      if (key === 'name') {
        info.name = val;
        inInterface = true;
      } else if (key === 'description') {
        info.description = val;
      } else if (key === 'guid') {
        info.guid = val;
      } else if (key === 'physical address') {
        info.physicalAddress = val;
      } else if (key === 'state') {
        info.state = val.toLowerCase().includes('connected') ? 'connected' : 'disconnected';
      } else if (key === 'ssid') {
        info.ssid = val;
      } else if (key === 'ap bssid' || key === 'bssid') {
        info.bssid = val;
      } else if (key === 'network type') {
        info.networkType = val;
      } else if (key === 'radio type') {
        info.radioType = val;
      } else if (key === 'authentication') {
        info.authentication = val;
      } else if (key === 'cipher') {
        info.cipher = val;
      } else if (key === 'channel') {
        const ch = parseInt(val, 10);
        info.channel = isNaN(ch) ? 0 : ch;
      } else if (key === 'band') {
        info.band = val;
      } else if (key === 'signal') {
        const sigMatch = val.match(/(\d+)%/);
        if (sigMatch) {
          info.signalPercent = parseInt(sigMatch[1], 10);
        }
      } else if (key === 'rssi') {
        const rssiVal = parseInt(val, 10);
        if (!isNaN(rssiVal)) info.rssi = rssiVal;
      } else if (key === 'receive rate (mbps)') {
        const rRate = parseFloat(val);
        if (!isNaN(rRate)) info.receiveRateMbps = rRate;
      } else if (key === 'transmit rate (mbps)') {
        const tRate = parseFloat(val);
        if (!isNaN(tRate)) info.transmitRateMbps = tRate;
      }
    }

    // Determine band from channel if band was not explicitly output
    if (!info.band && info.channel > 0) {
      if (info.channel <= 14) info.band = '2.4 GHz';
      else if (info.channel <= 165) info.band = '5.0 GHz';
      else info.band = '6.0 GHz';
    }
    // Calculate approximate RSSI if missing
    if (info.rssi === -100 && info.signalPercent > 0) {
      info.rssi = Math.round((info.signalPercent / 2) - 100);
    }
  }

  private parseIpConfig(output: string, info: WifiAdapterInfo): void {
    const sections = output.split(/\r?\n\r?\n/);
    let matchedSection = '';

    // Find section corresponding to Wireless LAN adapter or Wi-Fi
    for (const sec of sections) {
      if (sec.toLowerCase().includes('wireless lan adapter') || sec.toLowerCase().includes('wifi') || sec.toLowerCase().includes('wi-fi')) {
        if (!sec.toLowerCase().includes('virtual') && !sec.toLowerCase().includes('media disconnected')) {
          matchedSection = sec;
          break;
        }
      }
    }

    if (!matchedSection) {
      // Find any adapter with an IPv4 and default gateway
      for (const sec of sections) {
        if (sec.includes('IPv4 Address') && sec.includes('Default Gateway') && !sec.includes('Hyper-V') && !sec.includes('vEthernet')) {
          matchedSection = sec;
          break;
        }
      }
    }

    if (!matchedSection) return;

    const lines = matchedSection.split(/\r?\n/);
    const dnsList: string[] = [];
    let readingDns = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const colonIdx = line.indexOf(':');

      if (colonIdx !== -1) {
        const key = line.substring(0, colonIdx).trim().toLowerCase();
        const val = line.substring(colonIdx + 1).trim();

        if (key.includes('ipv4 address')) {
          info.ipv4 = val.replace(/\(preferred\)/gi, '').trim();
          readingDns = false;
        } else if (key.includes('subnet mask')) {
          info.subnet = val.trim();
          readingDns = false;
        } else if (key.includes('default gateway')) {
          info.gateway = val.trim();
          readingDns = false;
        } else if (key.includes('dhcp server')) {
          info.dhcpServer = val.trim();
          readingDns = false;
        } else if (key.includes('dns servers')) {
          if (val) dnsList.push(val.trim());
          readingDns = true;
        } else {
          readingDns = false;
        }
      } else if (readingDns && line) {
        // Multi-line DNS
        const ipMatch = line.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
        if (ipMatch) dnsList.push(line);
      }
    }

    if (dnsList.length > 0) {
      info.dnsServers = dnsList;
    }
  }

  private parseNearbyNetworks(output: string): NearbyNetwork[] {
    const list: NearbyNetwork[] = [];
    const blocks = output.split(/SSID \d+ : /);

    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      const lines = block.split(/\r?\n/);
      const ssid = lines[0].trim();
      if (!ssid) continue;

      let bssid = '';
      let signal = 0;
      let channel = 0;
      let security = 'Open';
      let radio = '';
      let band = '2.4 GHz';

      for (const rawLine of lines) {
        const line = rawLine.trim();
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;
        const key = line.substring(0, colonIdx).trim().toLowerCase();
        const val = line.substring(colonIdx + 1).trim();

        if (key.includes('bssid 1') || key === 'bssid') {
          bssid = val;
        } else if (key === 'signal') {
          signal = parseInt(val.replace('%', ''), 10) || 0;
        } else if (key === 'channel') {
          channel = parseInt(val, 10) || 0;
        } else if (key === 'authentication') {
          security = val;
        } else if (key === 'radio type') {
          radio = val;
        } else if (key === 'band') {
          band = val;
        }
      }

      if (channel > 0 && !band) {
        band = channel > 14 ? '5.0 GHz' : '2.4 GHz';
      }

      list.push({
        ssid,
        bssid: bssid || 'Unknown',
        signal,
        channel,
        security,
        radio,
        band
      });
    }

    return list.sort((a, b) => b.signal - a.signal);
  }

  private async testInternetConnectivity(): Promise<{ connected: boolean; latency: number }> {
    const start = Date.now();
    return new Promise((resolve) => {
      const req = http.get('http://1.1.1.1', { timeout: 1800 }, (res) => {
        const latency = Date.now() - start;
        res.resume();
        resolve({ connected: true, latency });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ connected: false, latency: 0 });
      });

      req.on('error', () => {
        // Fallback check to 8.8.8.8
        const req2 = http.get('http://8.8.8.8', { timeout: 1500 }, (res2) => {
          const latency = Date.now() - start;
          res2.resume();
          resolve({ connected: true, latency });
        });
        req2.on('error', () => resolve({ connected: false, latency: 0 }));
        req2.on('timeout', () => {
          req2.destroy();
          resolve({ connected: false, latency: 0 });
        });
      });
    });
  }

  private detectStateChanges(current: WifiAdapterInfo, prev: WifiAdapterInfo | null): void {
    if (!prev) return;

    // Disconnected -> Connected
    if (prev.state !== 'connected' && current.state === 'connected') {
      this.storage.addLog({
        timestamp: new Date().toISOString(),
        event: 'Wi-Fi Connected',
        description: `Connected to SSID: "${current.ssid}" (${current.authentication || 'Protected'})`,
        category: 'network',
        status: 'SUCCESS',
        details: `BSSID: ${current.bssid} | Channel: ${current.channel} | IP: ${current.ipv4 || 'Obtaining...'}`
      });
      this.notifyChange(current, prev);
    }
    // Connected -> Disconnected
    else if (prev.state === 'connected' && current.state !== 'connected') {
      this.storage.addLog({
        timestamp: new Date().toISOString(),
        event: 'Wi-Fi Disconnected',
        description: `Connection to "${prev.ssid}" was terminated.`,
        category: 'network',
        status: 'WARNING',
        details: `Adapter switched to disconnected state. Signal was: ${prev.signalPercent}%.`
      });
      this.notifyChange(current, prev);
    }
    // SSID Switched
    else if (prev.state === 'connected' && current.state === 'connected' && prev.ssid !== current.ssid && current.ssid) {
      this.storage.addLog({
        timestamp: new Date().toISOString(),
        event: 'Network Roamed / Switched',
        description: `Switched network from "${prev.ssid}" to "${current.ssid}"`,
        category: 'network',
        status: 'INFO',
        details: `New BSSID: ${current.bssid} | Band: ${current.band}`
      });
      this.notifyChange(current, prev);
    }
    // BSSID changed on same SSID (Potential Rogue AP / Evil Twin or Mesh Roaming)
    else if (
      prev.state === 'connected' &&
      current.state === 'connected' &&
      prev.ssid === current.ssid &&
      prev.bssid &&
      current.bssid &&
      prev.bssid.toLowerCase() !== current.bssid.toLowerCase()
    ) {
      this.storage.addLog({
        timestamp: new Date().toISOString(),
        event: 'Access Point BSSID Shift',
        description: `Access point MAC changed from [${prev.bssid}] to [${current.bssid}].`,
        category: 'security',
        status: 'ALERT',
        details: 'Verified Wi-Fi interface integrity check: mesh handover or potential clone AP.'
      });
      this.notifyChange(current, prev);
    }

    // IP address changed
    if (prev.ipv4 && current.ipv4 && prev.ipv4 !== current.ipv4) {
      this.storage.addLog({
        timestamp: new Date().toISOString(),
        event: 'Local IP Reassigned',
        description: `IPv4 address updated: ${prev.ipv4} -> ${current.ipv4}`,
        category: 'network',
        status: 'INFO',
        details: `DHCP Server: ${current.dhcpServer || 'N/A'}`
      });
    }

    // Internet connectivity drop/recovery
    if (prev.internetConnected && !current.internetConnected && current.state === 'connected') {
      this.storage.addLog({
        timestamp: new Date().toISOString(),
        event: 'Internet Gateway Unreachable',
        description: `Wi-Fi is associated to "${current.ssid}", but external internet ping failed.`,
        category: 'network',
        status: 'WARNING',
        details: `Gateway: ${current.gateway} | DNS: ${current.dnsServers.join(', ')}`
      });
    } else if (!prev.internetConnected && current.internetConnected && current.state === 'connected') {
      this.storage.addLog({
        timestamp: new Date().toISOString(),
        event: 'Internet Access Restored',
        description: `WAN connectivity re-established with ${current.pingLatencyMs}ms latency.`,
        category: 'network',
        status: 'SUCCESS',
        details: 'Cloud probe verified.'
      });
    }
  }

  private notifyChange(current: WifiAdapterInfo, prev: WifiAdapterInfo | null): void {
    for (const listener of this.onNetworkChangeListeners) {
      try {
        listener(current, prev);
      } catch (e) {
        console.error('Error in network change listener:', e);
      }
    }
  }
}
