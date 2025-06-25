
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TierTooltipContent from './TierTooltipContent';

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

interface TierCardProps {
  tier: Tier;
  index: number;
  isMobile: boolean;
}

const TierCard: React.FC<TierCardProps> = ({ tier, index, isMobile }) => {
  if (isMobile) {
    return (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className={`relative group cursor-pointer transition-all duration-300 bg-black/40 backdrop-blur border border-${tier.color}/40 rounded-lg p-4 hover:border-${tier.color}/60 ${
            tier.special ? 'shadow-lg shadow-orange-500/20' : ''
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">{tier.icon}</div>
              <div className={`text-sm font-mono text-${tier.color} mb-2`}>
                {tier.name}
              </div>
              <div className={`text-base font-bold text-${tier.color} font-mono`}>
                {tier.multiplier}
              </div>
              <div className="text-sm text-gray-400 font-mono">
                {tier.duration}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-2 right-2">
              <div className={`w-2 h-2 bg-${tier.color} rounded-full animate-pulse`}></div>
            </div>

            {/* Special Badge */}
            {tier.special && (
              <div className="absolute -top-1 -left-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs px-1.5 py-0.5 rounded font-mono">
                LEG
              </div>
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-96 bg-black/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-0 shadow-2xl shadow-cyan-500/20 z-[60]"
          side="top"
          align="center"
          sideOffset={10}
        >
          <TierTooltipContent tier={tier} />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative group cursor-pointer transition-all duration-300 bg-black/40 backdrop-blur border border-${tier.color}/40 rounded-lg p-4 hover:border-${tier.color}/60 hover:scale-105 ${
            tier.special ? 'shadow-lg shadow-orange-500/20' : ''
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">{tier.icon}</div>
              <div className={`text-sm font-mono text-${tier.color} mb-2`}>
                {tier.name}
              </div>
              <div className={`text-base font-bold text-${tier.color} font-mono`}>
                {tier.multiplier}
              </div>
              <div className="text-sm text-gray-400 font-mono">
                {tier.duration}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-2 right-2">
              <div className={`w-2 h-2 bg-${tier.color} rounded-full animate-pulse`}></div>
            </div>

            {/* Special Badge */}
            {tier.special && (
              <div className="absolute -top-1 -left-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs px-1.5 py-0.5 rounded font-mono">
                LEG
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="w-96 bg-black/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-0 shadow-2xl shadow-cyan-500/20 z-[60]"
          side="top"
          align="center"
          sideOffset={10}
        >
          <TierTooltipContent tier={tier} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TierCard;
