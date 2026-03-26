
import React from 'react';
import { ContractConstants } from '../../hooks/locker/types';

interface LockDurationSliderProps {
  lockDuration: number;
  setLockDuration: (duration: number) => void;
  CONTRACT_CONSTANTS: ContractConstants;
  emergencyMode: boolean;
  contractPaused: boolean;
  isProcessing: boolean;
}

const TIER_PRESETS = [
  { name: 'Initiate', icon: 'I', multiplier: '1.2x', label: '30-89 DAYS', minDays: 30, maxDays: 89, color: '255, 255, 255' },
  { name: 'Acolyte', icon: 'II', multiplier: '2.0x', label: '90-179 DAYS', minDays: 90, maxDays: 179, color: '255, 255, 255' },
  { name: 'Warden', icon: 'III', multiplier: '3.5x', label: '180-364 DAYS', minDays: 180, maxDays: 364, color: '255, 255, 255' },
  { name: 'Sentinel', icon: 'IV', multiplier: '6.0x', label: '1-2 YEARS', minDays: 365, maxDays: 729, color: '255, 255, 255' },
  { name: 'Arch-Keeper', icon: 'V', multiplier: '10.0x', label: '2+ YEARS', minDays: 730, maxDays: 1826, color: '255, 255, 255' },
];

const LockDurationSlider = ({ 
  lockDuration, 
  setLockDuration, 
  CONTRACT_CONSTANTS, 
  emergencyMode, 
  contractPaused, 
  isProcessing 
}: LockDurationSliderProps) => {
  const disabled = emergencyMode || contractPaused || isProcessing;

  const getActiveTier = () => 
    TIER_PRESETS.findIndex(t => lockDuration >= t.minDays && lockDuration <= t.maxDays);

  const activeIndex = getActiveTier();

  return (
    <div>
      <label className="text-[10px] font-black font-mono tracking-[0.2em] text-white/40 uppercase mb-4 block">SELECTION OF MATURITY</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TIER_PRESETS.map((tier, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={tier.name}
              type="button"
              disabled={disabled}
              onClick={() => setLockDuration(tier.minDays)}
              className={`
                relative group rounded-2xl p-6 text-center transition-all duration-300
                border backdrop-blur-3xl overflow-hidden
                disabled:opacity-10 disabled:cursor-not-allowed
                ${isActive 
                  ? 'bg-white border-white scale-[1.05] z-10' 
                  : 'bg-white/5 border-white/10 hover:border-white/40'
                }
              `}
            >
              <div className="relative z-10 space-y-3">
                <div className={`text-xl font-black font-mono transition-colors ${isActive ? 'text-black' : 'text-white/20'}`}>
                  {tier.icon}
                </div>
                <div className="space-y-1">
                  <div className={`text-[10px] font-black font-mono tracking-widest transition-colors uppercase ${isActive ? 'text-black' : 'text-white/60'}`}>
                    {tier.name}
                  </div>
                  <div className={`text-sm font-black font-mono tracking-tighter transition-colors ${isActive ? 'text-black' : 'text-white'}`}>
                    {tier.multiplier}
                  </div>
                </div>
                <div className={`text-[8px] font-black font-mono tracking-widest transition-colors uppercase ${isActive ? 'text-black/40' : 'text-white/20'}`}>
                  {tier.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LockDurationSlider;
