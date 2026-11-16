import React, { useState, useMemo } from 'react';
import { 
  ScrollText, 
  Search, 
  Download, 
  Trash2, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  Wifi, 
  Lock, 
  Info, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityLogsPageProps {
  logs: ActivityLog[];
  onClearLogs: () => Promise<void>;
  onRefreshLogs: () => Promise<void>;
}

export const ActivityLogsPage: React.FC<ActivityLogsPageProps> = ({ logs, onClearLogs, onRefreshLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter logs by search, category, status
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchTerm ||
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || log.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [logs, searchTerm, selectedCategory, selectedStatus]);

  const handleExportCsv = async () => {
    try {
      if ((window as any).api?.exportLogsCsv) {
        const csv = await (window as any).api.exportLogsCsv();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `wifi_guardian_logs_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return {
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
    } catch {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'WARNING':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'ALERT':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'protection':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
      case 'network':
        return <Wifi className="w-3.5 h-3.5 text-blue-400" />;
      case 'security':
        return <Lock className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <span>SQLite Activity & Security Audit Logs</span>
          </h2>
          <p className="text-xs text-slate-400">
            Immutable forensic history of all network events, state transitions, and defensive intercepts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-200 hover:text-cyan-300 flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export to CSV</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-400 text-xs font-semibold text-rose-300 hover:text-white flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>Are you sure you want to purge all SQLite activity records? This action cannot be undone.</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await onClearLogs();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-500"
            >
              Yes, Purge
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-cyan-500/15 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search event name, details, SSID, or IP..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-cyan-400"
          >
            <option value="all">All Categories</option>
            <option value="protection">Protection</option>
            <option value="network">Network</option>
            <option value="security">Security</option>
            <option value="system">System</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-cyan-400"
          >
            <option value="all">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="ALERT">Alert</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c1322] border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No activity logs match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const { date, time } = formatDateTime(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700/60">
                            {getCategoryIcon(log.category)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{log.event}</span>
                            <span className="text-[10px] font-mono text-slate-500 capitalize">{log.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-md">
                          <p className="text-slate-200">{log.description}</p>
                          {log.details && (
                            <p className="text-[11px] font-mono text-cyan-400/80 truncate" title={log.details}>
                              {log.details}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {date}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {time}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
