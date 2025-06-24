
import React, { useState } from 'react';
import { useLockerData } from '../../hooks/useLockerData';
import { AlertTriangle, Info, Lock } from 'lucide-react';

interface EnhancedLockInterfaceProps {
  isConnected: boolean;
}

const EnhancedLockInterface = ({ isConnected }: EnhancedLockInterfaceProps) => {
  const { 
    lockTiers, 
    determineLockTier, 
    CONTRACT_CONSTANTS, 
    lockTokens,
    emergencyMode,
    contractPaused,
    loading 
  } = useLockerData();
  
  const [lockAmount, setLockAmount] = useState('');
  const [lockDuration, setLockDuration] = useState(1); // UPDATED: Start from 1 day
  const [isLocking, setIsLocking] = useState(false);

  const currentTier = determineLockTier(lockDuration);
  const estimatedWeight = lockAmount ? parseFloat(lockAmount) * lockDuration * (currentTier.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS) : 0;

  const handleLock = async () => {
    if (!lockAmount || !isConnected) return;
    
    setIsLocking(true);
    try {
      await lockTokens(parseFloat(lockAmount), lockDuration);
      setLockAmount('');
      setLockDuration(1);
    } catch (error) {
      console.error('Lock failed:', error);
    } finally {
      setIsLocking(false);
    }
  };

  const isValidDuration = lockDuration >= CONTRACT_CONSTANTS.MIN_LOCK_DURATION && 
                         lockDuration <= CONTRACT_CONSTANTS.MAX_LOCK_DURATION;

  return (
    <div className="bg-white/5 border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lock className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-cyan-400">Lock Tokens</h3>
        {(emergencyMode || contractPaused) && (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        )}
      </div>

      {emergencyMode && (
        <div className="bg-red-900/20 border border-red-500/30 rounded p-3 mb-4">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-3 h-3" />
            <span className="font-semibold">Emergency Mode Active</span>
          </div>
          <p className="text-xs text-red-300 mt-1">
            New locks disabled. Existing locks unlockable after 3 days.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1">Amount (ARK)</label>
          <input
            type="number"
            value={lockAmount}
            onChange={(e) => setLockAmount(e.target.value)}
            placeholder="0.0"
            disabled={emergencyMode || contractPaused || isLocking}
            className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium">Duration (Days)</label>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Info className="w-3 h-3" />
              {CONTRACT_CONSTANTS.MIN_LOCK_DURATION}-{CONTRACT_CONSTANTS.MAX_LOCK_DURATION}
            </div>
          </div>
          <input
            type="range"
            min={CONTRACT_CONSTANTS.MIN_LOCK_DURATION}
            max={CONTRACT_CONSTANTS.MAX_LOCK_DURATION}
            value={lockDuration}
            onChange={(e) => setLockDuration(Number(e.target.value))}
            disabled={emergencyMode || contractPaused || isLocking}
            className="w-full h-2 bg-gray-700 rounded appearance-none cursor-pointer disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{CONTRACT_CONSTANTS.MIN_LOCK_DURATION}d</span>
            <span className={`font-bold ${isValidDuration ? 'text-cyan-400' : 'text-red-400'}`}>
              {lockDuration}d
            </span>
            <span>{CONTRACT_CONSTANTS.MAX_LOCK_DURATION}d</span>
          </div>
        </div>

        {/* Compact Tier Display */}
        <div className="bg-black/30 rounded p-3 border" style={{ borderColor: currentTier.color }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-bold" style={{ color: currentTier.color }}>
                {currentTier.name} Tier
              </div>
              <div className="text-xs text-gray-400">
                {(currentTier.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS).toFixed(1)}x multiplier
              </div>
            </div>
            <div className="text-lg">{currentTier.icon}</div>
          </div>
          
          {lockAmount && (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Weight:</span>
                <span className="text-white font-medium">{estimatedWeight.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Range:</span>
                <span className="text-white">{currentTier.minDays}-{currentTier.maxDays} days</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLock}
          disabled={!isConnected || !lockAmount || !isValidDuration || emergencyMode || contractPaused || isLocking}
          className="w-full bg-cyan-500 text-black font-bold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform text-sm"
        >
          {!isConnected ? 'Connect Wallet' : 
           isLocking ? 'Locking...' :
           emergencyMode ? 'Emergency Mode' :
           contractPaused ? 'Contract Paused' :
           !isValidDuration ? 'Invalid Duration' :
           'Lock Tokens'}
        </button>
      </div>
    </div>
  );
};

export default EnhancedLockInterface;
