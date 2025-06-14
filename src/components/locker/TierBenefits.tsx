
import React from 'react';
import { LockTierInfo } from '../../hooks/useLockerData';

interface TierBenefitsProps {
  lockTiers: LockTierInfo[];
}

const TierBenefits = ({ lockTiers }: TierBenefitsProps) => {
  return (
    <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
      <h3 className="text-xl font-bold mb-6 text-cyan-400">Lock Tier Benefits</h3>
      <div className="grid grid-cols-2 gap-4">
        {lockTiers.map((tier, index) => (
          <div key={index} className="bg-black/30 rounded-lg p-4 border border-gray-600">
            <div className="text-sm font-bold mb-1" style={{ color: tier.color }}>
              {tier.name}
            </div>
            <div className="text-xs text-gray-400 mb-1">
              {tier.minDays}-{tier.maxDays} days
            </div>
            <div className="text-sm font-bold text-white">
              {(tier.multiplier / 10000).toFixed(1)}x rewards
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierBenefits;
