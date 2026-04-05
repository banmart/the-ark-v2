
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
  { name: 'Bronze', icon: '🥉', multiplier: '1.0x', label: '30 DAYS', minDays: 30, maxDays: 89, color: '255, 255, 255' },
  { name: 'Silver', icon: '🥈', multiplier: '1.5x', label: '90 DAYS', minDays: 90, maxDays: 179, color: '255, 255, 255' },
  { name: 'Gold', icon: '🥇', multiplier: '2.0x', label: '180 DAYS', minDays: 180, maxDays: 364, color: '255, 255, 255' },
  { name: 'Diamond', icon: '💎', multiplier: '3.0x', label: '1 YEAR', minDays: 365, maxDays: 729, color: '255, 255, 255' },
  { name: 'Platinum', icon: '⭐', multiplier: '4.0x', label: '2 YEARS', minDays: 730, maxDays: 1094, color: '255, 255, 255' },
  { name: 'Mythic', icon: '🔮', multiplier: '5.0x', label: '3 YEARS', minDays: 1095, maxDays: 1459, color: '255, 255, 255' },
  { name: 'Legendary', icon: '⚡', multiplier: '7.0x', label: '4 YEARS', minDays: 1460, maxDays: 1460, color: '255, 215, 0' },
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
      <label className="text-xs font-black font-mono tracking-[0.2em] text-white/60 uppercase mb-4 block">SELECTION OF MATURITY</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
        {TIER_PRESETS.map((tier, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={tier.name}
              type="button"
              disabled={disabled}
              onClick={() => setLockDuration(tier.minDays)}
              className={`
                relative group rounded-2xl p-4 md:p-6 text-center transition-all duration-300
                border backdrop-blur-3xl overflow-hidden
                disabled:opacity-10 disabled:cursor-not-allowed
                ${isActive 
                  ? 'bg-white border-white scale-[1.05] z-10' 
                  : 'bg-white/5 border-white/10 hover:border-white/40'
                }
              `}
            >
              <div className="relative z-10 space-y-3">
                <div className={`text-xl font-black font-mono transition-colors ${isActive ? 'text-black' : 'text-white/40'}`}>
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
                <div className={`text-[8px] font-black font-mono tracking-widest transition-colors uppercase ${isActive ? 'text-black/40' : 'text-white/40'}`}>
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
