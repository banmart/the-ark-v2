
import React from 'react';
import { Info } from 'lucide-react';
import { ContractConstants } from '../../hooks/locker/types';

interface LockDurationSliderProps {
  lockDuration: number;
  setLockDuration: (duration: number) => void;
  CONTRACT_CONSTANTS: ContractConstants;
  emergencyMode: boolean;
  contractPaused: boolean;
  isProcessing: boolean;
}

const LockDurationSlider = ({ 
  lockDuration, 
  setLockDuration, 
  CONTRACT_CONSTANTS, 
  emergencyMode, 
  contractPaused, 
  isProcessing 
}: LockDurationSliderProps) => {
  const isValidDuration = lockDuration >= CONTRACT_CONSTANTS.MIN_LOCK_DURATION && 
                         lockDuration <= CONTRACT_CONSTANTS.MAX_LOCK_DURATION;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <label className="text-sm font-medium text-white/90">Lock Duration (Days)</label>
        <div className="flex items-center gap-1 text-xs text-white/50">
          <Info className="w-3 h-3" />
          Min: {CONTRACT_CONSTANTS.MIN_LOCK_DURATION}, Max: {CONTRACT_CONSTANTS.MAX_LOCK_DURATION}
        </div>
      </div>
      <input
        type="range"
        min={CONTRACT_CONSTANTS.MIN_LOCK_DURATION}
        max={CONTRACT_CONSTANTS.MAX_LOCK_DURATION}
        value={lockDuration}
        onChange={(e) => setLockDuration(Number(e.target.value))}
        disabled={emergencyMode || contractPaused || isProcessing}
        className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 accent-cyan-500"
      />
      <div className="flex justify-between text-xs sm:text-sm text-white/50 mt-2">
        <span>{CONTRACT_CONSTANTS.MIN_LOCK_DURATION} days</span>
        <span className={`font-bold ${isValidDuration ? 'text-cyan-400' : 'text-red-400'}`}>
          {lockDuration} days
        </span>
        <span>{CONTRACT_CONSTANTS.MAX_LOCK_DURATION} days</span>
      </div>
    </div>
  );
};

export default LockDurationSlider;
