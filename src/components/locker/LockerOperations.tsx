
import React from 'react';
import EnhancedLockInterface from './EnhancedLockInterface';
import EnhancedUserDashboard from './EnhancedUserDashboard';
import EnhancedProtocolStats from './EnhancedProtocolStats';
import UserStatsSection from './UserStatsSection';
import TierLegend from './TierLegend';
import CompactTierDisplay from './CompactTierDisplay';

interface LockerOperationsProps {
  isConnected: boolean;
}

const LockerOperations = ({ isConnected }: LockerOperationsProps) => {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-20 space-y-8">
      {/* User Stats & Pending Rewards */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <UserStatsSection isConnected={isConnected} />
      </div>

      {/* Lock Interface */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <EnhancedLockInterface isConnected={isConnected} />
      </div>

      {/* User Dashboard */}
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <EnhancedUserDashboard isConnected={isConnected} />
      </div>
    </div>
  );
};

export default LockerOperations;
