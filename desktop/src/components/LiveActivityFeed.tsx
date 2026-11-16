import React from 'react';
import { ScrollText, ShieldCheck, ShieldAlert, Wifi, Lock, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { ActivityLog } from '../types';

interface LiveActivityFeedProps {
  logs: ActivityLog[];
  onViewAllLogs?: () => void;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ logs, onViewAllLogs }) => {
  const recentLogs = logs.slice(0, 5);

  const getStatusIcon = (status: string, category: string) => {
    if (status === 'ALERT') return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    if (status === 'WARNING') return <AlertCircle className="w-4 h-4 text-amber-400" />;
    if (category === 'network') return <Wifi className="w-4 h-4 text-cyan-400" />;
    if (category === 'security') return <Lock className="w-4 h-4 text-purple-400" />;
    if (category === 'protection') return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    return <Info className="w-4 h-4 text-blue-400" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ALERT':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '--:--:--';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-cyan-500/15 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <ScrollText className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Live Activity & Forensic Events</h3>
        </div>
        {onViewAllLogs && (
          <button
            onClick={onViewAllLogs}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-medium transition-colors"
          >
            <span>View Full Audit Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {recentLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No activity logged yet. Monitoring system events...
          </div>
        ) : (
          recentLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 p-1 rounded bg-slate-800/80 border border-slate-700/60">
                  {getStatusIcon(log.status, log.category)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200">{log.event}</span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${getStatusBadge(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{log.description}</p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 shrink-0">
                {formatTime(log.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
