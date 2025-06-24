
import React from 'react';
import { LockTierInfo, ContractConstants } from '../../hooks/locker/types';

interface TierDisplayProps {
  currentTier: LockTierInfo;
  lockAmount: string;
  lockDuration: number;
  CONTRACT_CONSTANTS: ContractConstants;
}

const TierDisplay = ({ currentTier, lockAmount, lockDuration, CONTRACT_CONSTANTS }: TierDisplayProps) => {
  const estimatedWeight = lockAmount ? parseFloat(lockAmount) * lockDuration * (currentTier.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS) : 0;

  return (
    <div className="bg-black/30 rounded-lg p-4 border" style={{ borderColor: currentTier.color }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-lg font-bold" style={{ color: currentTier.color }}>
            {currentTier.name} Tier
          </div>
          <div className="text-sm text-gray-400">
            {(currentTier.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS).toFixed(1)}x reward multiplier
          </div>
        </div>
        <div className="text-3xl">
          {currentTier.icon}
        </div>
      </div>
      
      {lockAmount && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Estimated Weight:</span>
            <span className="text-white font-medium">{estimatedWeight.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Duration Range:</span>
            <span className="text-white">{currentTier.minDays}-{currentTier.maxDays} days</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TierDisplay;
