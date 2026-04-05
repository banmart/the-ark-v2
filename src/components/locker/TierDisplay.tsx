
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
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-right select-none pointer-events-none">
        <div className="text-8xl font-black font-mono leading-none tracking-tighter">
          {currentTier.name.toUpperCase()}
        </div>
        <div className="text-4xl font-black font-mono mt-2 tracking-widest">
          {lockDuration} DAYS
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <div className="text-xs font-black font-mono tracking-[0.2em] text-white/60 uppercase">COVENANT STANDING</div>
          <div className="text-4xl font-black text-white uppercase tracking-tighter">
            {currentTier.name}
          </div>
          <div className="text-xs font-black font-mono tracking-widest text-white/50 uppercase">
            {(currentTier.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS).toFixed(1)}X TITHING FACTOR
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-black font-mono tracking-[0.2em] text-white/40 uppercase mb-1">STABILITY PERIOD</div>
          <div className="text-4xl font-black text-white/90 uppercase tracking-tighter">
            {lockDuration} <span className="text-lg opacity-40">DAYS</span>
          </div>
        </div>
      </div>
      
      {lockAmount && (
        <div className="relative z-10 space-y-4 pt-8 mt-8 border-t border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black font-mono tracking-widest text-white/50 uppercase">BINDING STRENGTH</span>
            <span className="text-2xl font-black text-white tracking-tighter">{estimatedWeight.toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TierDisplay;
