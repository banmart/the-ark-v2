
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
  { name: 'Bronze', icon: '⛵', multiplier: '1x', label: '1-3 months', minDays: 30, maxDays: 89, color: '205, 127, 50' },
  { name: 'Silver', icon: '🛡️', multiplier: '1.5x', label: '3-6 months', minDays: 90, maxDays: 179, color: '192, 192, 192' },
  { name: 'Gold', icon: '👑', multiplier: '2x', label: '6-12 months', minDays: 180, maxDays: 364, color: '255, 215, 0' },
  { name: 'Diamond', icon: '💎', multiplier: '3x', label: '1-2 years', minDays: 365, maxDays: 729, color: '96, 165, 250' },
  { name: 'Platinum', icon: '⭐', multiplier: '4x', label: '2-3 years', minDays: 730, maxDays: 1094, color: '167, 139, 250' },
  { name: 'Mythic', icon: '🔮', multiplier: '5x', label: '3-4 years', minDays: 1095, maxDays: 1459, color: '139, 92, 246' },
  { name: 'Legendary', icon: '⚡', multiplier: '7x', label: '4-5 years', minDays: 1460, maxDays: 1826, color: '251, 146, 60' },
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
      <label className="text-sm font-medium text-white/90 mb-3 block">Select Lock Period</label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {TIER_PRESETS.map((tier, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={tier.name}
              type="button"
              disabled={disabled}
              onClick={() => setLockDuration(tier.minDays)}
              className={`
                relative group rounded-xl p-3 text-center transition-all duration-300
                border bg-black/40 backdrop-blur-sm
                disabled:opacity-40 disabled:cursor-not-allowed
                ${isActive 
                  ? 'scale-[1.03] z-10' 
                  : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                }
              `}
              style={{
                borderColor: isActive ? `rgba(${tier.color}, 0.6)` : undefined,
                boxShadow: isActive ? `0 0 20px rgba(${tier.color}, 0.2), inset 0 0 20px rgba(${tier.color}, 0.05)` : undefined,
              }}
            >
              {isActive && (
                <div 
                  className="absolute inset-0 rounded-xl opacity-15"
                  style={{ background: `radial-gradient(ellipse at center, rgba(${tier.color}, 0.4) 0%, transparent 70%)` }}
                />
              )}
              <div className="relative z-10">
                <div className={`text-xl mb-1 ${isActive ? 'animate-bounce' : ''}`}>{tier.icon}</div>
                <div 
                  className="text-[11px] font-bold font-mono tracking-wide mb-0.5"
                  style={{ color: `rgb(${tier.color})` }}
                >
                  {tier.name}
                </div>
                <div className="text-sm font-black font-mono bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  {tier.multiplier}
                </div>
                <div className="text-[10px] text-white/40 font-mono mt-0.5">{tier.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LockDurationSlider;
