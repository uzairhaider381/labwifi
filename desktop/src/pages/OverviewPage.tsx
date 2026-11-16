import React from 'react';
import { HeroProtectionCard } from '../components/HeroProtectionCard';
import { LiveNetworkStatus } from '../components/LiveNetworkStatus';
import { StatusCards } from '../components/StatusCards';
import { LiveActivityFeed } from '../components/LiveActivityFeed';
import { ProtectionState, WifiAdapterInfo, ActivityLog } from '../types';

interface OverviewPageProps {
  protectionState: ProtectionState;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
  wifiInfo: WifiAdapterInfo;
  uptimeSeconds: number;
  isSettingsLocked: boolean;
  onToggleSettingsLock: () => void;
  logs: ActivityLog[];
  onViewAllLogs: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  protectionState,
  onActivate,
  onDeactivate,
  wifiInfo,
  uptimeSeconds,
  isSettingsLocked,
  onToggleSettingsLock,
  logs,
  onViewAllLogs,
}) => {
  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* 1. Large Hero Protection Card */}
      <HeroProtectionCard
        protectionState={protectionState}
        onActivate={onActivate}
        onDeactivate={onDeactivate}
        wifiInfo={wifiInfo}
        uptimeSeconds={uptimeSeconds}
      />

      {/* 2. Real Windows Network Status */}
      <LiveNetworkStatus wifiInfo={wifiInfo} />

      {/* 3. Status Cards */}
      <StatusCards
        protectionState={protectionState}
        wifiInfo={wifiInfo}
        isSettingsLocked={isSettingsLocked}
        onToggleSettingsLock={onToggleSettingsLock}
      />

      {/* 4. Live Activity Feed */}
      <LiveActivityFeed logs={logs} onViewAllLogs={onViewAllLogs} />
    </div>
  );
};
