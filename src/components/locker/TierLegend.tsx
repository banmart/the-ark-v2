
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Database, Zap } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TierLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tiers = [
    {
      name: 'BRONZE',
      icon: '⛵',
      color: 'yellow-600',
      multiplier: '1x',
      duration: '30-89d',
      description: 'Entry level blessing',
      details: {
        rewards: 'Base vault rewards',
        community: 'Bronze community role',
        features: 'Protected from the flood',
        governance: 'Observer status'
      }
    },
    {
      name: 'SILVER',
      icon: '🛡️',
      color: 'gray-400',
      multiplier: '1.5x',
      duration: '90-179d',
      description: 'Enhanced vault share',
      details: {
        rewards: '1.5x vault multiplier',
        community: 'Silver privileges',
        features: 'Priority support',
        governance: 'Limited voting rights'
      }
    },
    {
      name: 'GOLD',
      icon: '👑',
      color: 'yellow-400',
      multiplier: '2x',
      duration: '180-364d',
      description: 'Governance participation',
      details: {
        rewards: '2x vault multiplier',
        community: 'Gold tier status',
        features: 'Exclusive access',
        governance: 'Full voting rights'
      }
    },
    {
      name: 'DIAMOND',
      icon: '💎',
      color: 'cyan-400',
      multiplier: '3x',
      duration: '1-3y',
      description: 'VIP community access',
      details: {
        rewards: '3x vault multiplier',
        community: 'VIP community access',
        features: 'Special event invites',
        governance: 'Proposal creation rights'
      }
    },
    {
      name: 'PLATINUM',
      icon: '⭐',
      color: 'purple-400',
      multiplier: '5x',
      duration: '3-4y',
      description: 'Development influence',
      details: {
        rewards: '5x vault multiplier',
        community: 'Platinum elite status',
        features: 'Development influence',
        governance: 'Strategic decision input'
      }
    },
    {
      name: 'LEGENDARY',
      icon: '⚡',
      color: 'orange-400',
      multiplier: '8x',
      duration: '4-5y',
      description: 'True Noah privileges',
      special: true,
      details: {
        rewards: '8x vault multiplier',
        community: 'Legendary ARK status',
        features: 'Ultimate vault rewards',
        governance: 'Noah council member'
      }
    }
  ];

  const TierTooltipContent = ({ tier }) => (
    <div className="w-72 md:w-80 p-4 space-y-3">
      <div className="flex items-center gap-3 pb-2 border-b border-gray-600">
        <span className="text-2xl">{tier.icon}</span>
        <div>
          <div className={`text-lg font-bold text-${tier.color} font-mono`}>
            [{tier.name}_TIER]
          </div>
          <div className="text-sm text-gray-400 font-mono">
            {tier.description}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-mono">MULTIPLIER:</span>
          <span className={`text-${tier.color} font-bold font-mono text-lg`}>{tier.multiplier}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-mono">DURATION:</span>
          <span className="text-white font-mono">{tier.duration}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-300 font-mono">TIER_BENEFITS:</div>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-green-400 font-mono">•</span>
            <div>
              <span className="font-semibold text-gray-300">Rewards:</span>
              <span className="text-gray-400 ml-1">{tier.details.rewards}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400 font-mono">•</span>
            <div>
              <span className="font-semibold text-gray-300">Community:</span>
              <span className="text-gray-400 ml-1">{tier.details.community}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-400 font-mono">•</span>
            <div>
              <span className="font-semibold text-gray-300">Features:</span>
              <span className="text-gray-400 ml-1">{tier.details.features}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-mono">•</span>
            <div>
              <span className="font-semibold text-gray-300">Governance:</span>
              <span className="text-gray-400 ml-1">{tier.details.governance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TierCard = ({ tier, index }) => {
    if (isMobile) {
      return (
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className={`relative group cursor-pointer transition-all duration-300 bg-black/40 backdrop-blur border border-${tier.color}/40 rounded-lg p-3 hover:border-${tier.color}/60 ${
              tier.special ? 'shadow-lg shadow-orange-500/20' : ''
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">{tier.icon}</div>
                <div className={`text-xs font-mono text-${tier.color} mb-1`}>
                  {tier.name}
                </div>
                <div className={`text-sm font-bold text-${tier.color} font-mono`}>
                  {tier.multiplier}
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {tier.duration}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-1 right-1">
                <div className={`w-1.5 h-1.5 bg-${tier.color} rounded-full animate-pulse`}></div>
              </div>

              {/* Special Badge */}
              {tier.special && (
                <div className="absolute -top-1 -left-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs px-1 rounded font-mono">
                  LEG
                </div>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent 
            className="w-80 bg-black/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-0 shadow-2xl shadow-cyan-500/20"
            side="top"
            align="center"
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
            <div className={`relative group cursor-pointer transition-all duration-300 bg-black/40 backdrop-blur border border-${tier.color}/40 rounded-lg p-3 hover:border-${tier.color}/60 hover:scale-105 ${
              tier.special ? 'shadow-lg shadow-orange-500/20' : ''
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">{tier.icon}</div>
                <div className={`text-xs font-mono text-${tier.color} mb-1`}>
                  {tier.name}
                </div>
                <div className={`text-sm font-bold text-${tier.color} font-mono`}>
                  {tier.multiplier}
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {tier.duration}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-1 right-1">
                <div className={`w-1.5 h-1.5 bg-${tier.color} rounded-full animate-pulse`}></div>
              </div>

              {/* Special Badge */}
              {tier.special && (
                <div className="absolute -top-1 -left-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs px-1 rounded font-mono">
                  LEG
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            className="w-80 bg-black/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-0 shadow-2xl shadow-cyan-500/20 z-50"
            side="top"
            align="center"
          >
            <TierTooltipContent tier={tier} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div ref={containerRef} className="relative max-w-6xl mx-auto px-6 mb-8">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Container */}
      <div className="relative bg-black/30 backdrop-blur-xl border border-cyan-500/30 rounded-xl overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyan-500/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-cyan-400 text-sm tracking-wider">
              [TIER_LEGEND_SYSTEM]
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-400">
              {isExpanded ? 'COLLAPSE' : 'EXPAND'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            )}
          </div>
        </div>

        {/* Compact Tier Display - Responsive Grid */}
        <div className="px-4 pb-4">
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
            {tiers.map((tier, index) => (
              <TierCard key={tier.name} tier={tier} index={index} />
            ))}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
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
        )}

        {/* Scan Effect */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default TierLegend;
