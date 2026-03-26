
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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-3xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-6xl font-black font-mono select-none">
        {currentTier.name.toUpperCase()}
      </div>
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="text-[10px] font-black font-mono tracking-[0.2em] text-white/40 uppercase">COVENANT STANDING</div>
          <div className="text-2xl font-black text-white uppercase tracking-tighter">
            {currentTier.name}
          </div>
          <div className="text-[10px] font-black font-mono tracking-widest text-white/40 uppercase">
            {(currentTier.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS).toFixed(1)}X TITHING FACTOR
          </div>
        </div>
      </div>
      
      {lockAmount && (
        <div className="relative z-10 space-y-4 pt-8 border-t border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black font-mono tracking-widest text-white/20 uppercase">BINDING STRENGTH</span>
            <span className="text-2xl font-black text-white tracking-tighter">{estimatedWeight.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black font-mono tracking-widest text-white/20 uppercase">STABILITY PERIOD</span>
            <span className="text-[10px] font-black font-mono tracking-widest text-white uppercase">{currentTier.minDays}-{currentTier.maxDays} CYCLES</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TierDisplay;
