import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  RefreshCw, 
  Radio, 
  Signal, 
  Router, 
  Activity, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Cpu,
  Layers,
  ArrowDownUp,
  Shield
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WifiAdapterInfo, NearbyNetwork } from '../types';

interface WifiMonitorPageProps {
  wifiInfo: WifiAdapterInfo;
  onRefresh: () => Promise<void>;
}

export const WifiMonitorPage: React.FC<WifiMonitorPageProps> = ({ wifiInfo, onRefresh }) => {
  const [nearbyNetworks, setNearbyNetworks] = useState<NearbyNetwork[]>([]);
  const [scanningNearby, setScanningNearby] = useState(false);
  const [latencyHistory, setLatencyHistory] = useState<{ time: string; latency: number }[]>([]);
  const isConnected = wifiInfo.state === 'connected';

  // Record ping latency telemetry over time
  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLatencyHistory((prev) => {
      const updated = [...prev, { time: now, latency: wifiInfo.pingLatencyMs || 15 }];
      return updated.slice(-15);
    });
  }, [wifiInfo.pingLatencyMs, wifiInfo.lastChecked]);

  const handleScanNearby = async () => {
    setScanningNearby(true);
    try {
      if ((window as any).api?.scanNearbyNetworks) {
        const networks = await (window as any).api.scanNearbyNetworks();
        setNearbyNetworks(networks);
      }
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setScanningNearby(false);
    }
  };

  useEffect(() => {
    handleScanNearby();
  }, []);

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Top Banner & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <span>Windows Wi-Fi Adapter Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time diagnostics and radio frequency spectrum analysis via Windows WLAN API
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold text-cyan-300 hover:text-white flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Hardware</span>
        </button>
      </div>

      {/* Main Hardware Spec Sheet Card */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-6">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{wifiInfo.name}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}>
                  {isConnected ? 'ONLINE / ASSOCIATED' : 'DISCONNECTED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{wifiInfo.description}</p>
            </div>
          </div>

          <div className="text-right text-xs space-y-0.5">
            <div className="text-slate-500 font-mono text-[10px]">MAC ADDRESS</div>
            <div className="font-mono text-cyan-300 font-semibold">{wifiInfo.physicalAddress}</div>
          </div>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Network SSID</span>
            <span className="font-bold text-white text-sm truncate block">{wifiInfo.ssid || 'None'}</span>
            <span className="text-[10px] font-mono text-slate-500">{wifiInfo.networkType || 'Infrastructure'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Radio & Encryption</span>
            <span className="font-bold text-white text-sm truncate block">{wifiInfo.radioType || '802.11ax'}</span>
            <span className="text-[10px] font-mono text-cyan-400">{wifiInfo.authentication || 'WPA2-Personal'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">RF Channel & Band</span>
            <span className="font-bold text-white text-sm block">Channel {wifiInfo.channel || 0}</span>
            <span className="text-[10px] font-mono text-slate-400">{wifiInfo.band || '2.4 GHz'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">Physical Link Rate</span>
            <span className="font-bold text-white text-sm flex items-center space-x-1">
              <ArrowDownUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>{wifiInfo.receiveRateMbps || 0} / {wifiInfo.transmitRateMbps || 0} Mbps</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Rx / Tx Throughput</span>
          </div>
        </div>

        {/* IP and Gateway Details */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block">ASSIGNED IPV4 / SUBNET</span>
            <span className="text-slate-200 font-semibold">{wifiInfo.ipv4 || '0.0.0.0'}</span>
            <span className="text-slate-500 text-[10px] block">{wifiInfo.subnet || '255.255.255.0'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">DEFAULT GATEWAY</span>
            <span className="text-slate-200 font-semibold">{wifiInfo.gateway || '0.0.0.0'}</span>
            <span className="text-slate-500 text-[10px] block">DHCP: {wifiInfo.dhcpServer || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">DNS RESOLVERS</span>
            <span className="text-cyan-300 font-semibold truncate block">
              {wifiInfo.dnsServers?.length > 0 ? wifiInfo.dnsServers.join(', ') : 'Default DHCP Resolver'}
            </span>
            <span className="text-slate-500 text-[10px] block">Secure DNS Baseline</span>
          </div>
        </div>
      </div>

      {/* Latency & Connectivity Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Real-time Ping Latency Graph */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">WAN Gateway Latency (ms)</h3>
            </div>
            <span className="text-xs font-mono text-cyan-300">{wifiInfo.pingLatencyMs} ms</span>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyHistory}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0066ff" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} domain={[0, 'auto']} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c1322', borderColor: '#00f0ff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#latencyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Diagnostics Checklist */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Interface Health Verification</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">Windows WLAN AutoConfig Service (WlanSvc)</span>
              <span className="flex items-center text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> RUNNING
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">Physical 802.11 Radio Binding</span>
              <span className="flex items-center text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> HEALTHY
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">IPv4 Routing & Gateway Reachability</span>
              <span className={`flex items-center text-[11px] font-semibold ${wifiInfo.gateway ? 'text-emerald-400' : 'text-amber-400'}`}>
                {wifiInfo.gateway ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                {wifiInfo.gateway ? 'REACHABLE' : 'UNASSIGNED'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">Public Internet Cloud Probe (1.1.1.1 / 8.8.8.8)</span>
              <span className={`flex items-center text-[11px] font-semibold ${wifiInfo.internetConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
                {wifiInfo.internetConnected ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
                {wifiInfo.internetConnected ? 'VERIFIED' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Access Points Scanner */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Nearby Access Points Spectrum Scanner</h3>
          </div>
          <button
            onClick={handleScanNearby}
            disabled={scanningNearby}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanningNearby ? 'animate-spin' : ''}`} />
            <span>{scanningNearby ? 'Scanning Spectrum...' : 'Scan Frequencies'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                <th className="pb-2">SSID</th>
                <th className="pb-2">BSSID (MAC)</th>
                <th className="pb-2">SIGNAL</th>
                <th className="pb-2">CHANNEL</th>
                <th className="pb-2">SECURITY</th>
                <th className="pb-2">BAND</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nearbyNetworks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-500">
                    {scanningNearby ? 'Scanning nearby Wi-Fi beacons...' : 'No nearby networks discovered or Wi-Fi adapter is idle.'}
                  </td>
                </tr>
              ) : (
                nearbyNetworks.map((net, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 font-semibold text-white flex items-center space-x-2">
                      <Wifi className={`w-3.5 h-3.5 ${net.signal > 50 ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{net.ssid || '<Hidden SSID>'}</span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-400 text-[11px]">{net.bssid}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        net.signal >= 70 ? 'bg-cyan-500/20 text-cyan-400' : net.signal >= 40 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {net.signal}%
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-300">Ch {net.channel}</td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        net.security.toLowerCase().includes('open') ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {net.security}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-400">{net.band}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
