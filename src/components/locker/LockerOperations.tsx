
import React from 'react';
import EnhancedLockInterface from './EnhancedLockInterface';
import EnhancedUserDashboard from './EnhancedUserDashboard';

interface LockerOperationsProps {
  isConnected: boolean;
}

const LockerOperations = ({ isConnected }: LockerOperationsProps) => {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-20 space-y-8">
      {/* Lock Interface */}
      <div className="animate-fade-in">
        <EnhancedLockInterface isConnected={isConnected} />
      </div>

      {/* User Dashboard */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <EnhancedUserDashboard isConnected={isConnected} />
      </div>
    </div>
  );
};

export default LockerOperations;
