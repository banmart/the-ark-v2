
import React from 'react';
import { Zap } from 'lucide-react';

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

interface TierExpandedDetailsProps {
  tiers: Tier[];
}

const TierExpandedDetails: React.FC<TierExpandedDetailsProps> = ({ tiers }) => (
  <div className="border-t border-cyan-500/20 p-4 bg-black/20">
    <div className="flex items-center gap-2 mb-3">
      <Zap className="w-4 h-4 text-cyan-400" />
      <span className="font-mono text-cyan-400 text-sm">
        [DETAILED_TIER_ANALYSIS]
      </span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
      {tiers.map((tier) => (
        <div key={tier.name} className={`bg-${tier.color}/5 border border-${tier.color}/20 rounded p-3`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{tier.icon}</span>
            <span className={`text-${tier.color} font-bold`}>{tier.name}</span>
          </div>
          <div className="space-y-1 text-gray-300">
            <div>MULTIPLIER: <span className={`text-${tier.color}`}>{tier.multiplier}</span></div>
            <div>DURATION: <span className="text-white">{tier.duration}</span></div>
            <div>BENEFIT: <span className="text-gray-200">{tier.description}</span></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TierExpandedDetails;
