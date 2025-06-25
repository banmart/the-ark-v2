
import React from 'react';

interface TierDetails {
  rewards: string;
  community: string;
  features: string;
  governance: string;
}

interface Tier {
  name: string;
  icon: string;
  color: string;
  multiplier: string;
  duration: string;
  description: string;
  details: TierDetails;
  special?: boolean;
}

interface TierTooltipContentProps {
  tier: Tier;
}

const TierTooltipContent: React.FC<TierTooltipContentProps> = ({ tier }) => (
  <div className="w-80 md:w-96 p-6 space-y-4">
    <div className="flex items-center gap-4 pb-3 border-b border-gray-600">
      <span className="text-3xl">{tier.icon}</span>
      <div>
        <div className={`text-xl font-bold text-${tier.color} font-mono`}>
          [{tier.name}_TIER]
        </div>
        <div className="text-sm text-gray-400 font-mono">
          {tier.description}
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 gap-4 text-sm">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 font-mono">MULTIPLIER:</span>
        <span className={`text-${tier.color} font-bold font-mono text-xl`}>{tier.multiplier}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-400 font-mono">DURATION:</span>
        <span className="text-white font-mono">{tier.duration}</span>
      </div>
    </div>

    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-300 font-mono">TIER_BENEFITS:</div>
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="text-green-400 font-mono">•</span>
          <div>
            <span className="font-semibold text-gray-300">Rewards:</span>
            <span className="text-gray-400 ml-2">{tier.details.rewards}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-blue-400 font-mono">•</span>
          <div>
            <span className="font-semibold text-gray-300">Community:</span>
            <span className="text-gray-400 ml-2">{tier.details.community}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-purple-400 font-mono">•</span>
          <div>
            <span className="font-semibold text-gray-300">Features:</span>
            <span className="text-gray-400 ml-2">{tier.details.features}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-yellow-400 font-mono">•</span>
          <div>
            <span className="font-semibold text-gray-300">Governance:</span>
            <span className="text-gray-400 ml-2">{tier.details.governance}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TierTooltipContent;
