import React, { useState } from 'react';
import { 
  Crown, 
  Star, 
  Award, 
  Zap, 
  TrendingUp, 
  Clock, 
  Coins,
  Shield,
  Flame,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface LockTierInfo {
  name: string;
  minDays: number;
  maxDays: number;
  multiplier: number;
  color: string;
}

interface TierBenefitsProps {
  lockTiers: LockTierInfo[];
}

const TierBenefits = ({ lockTiers }: TierBenefitsProps) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  // Default tiers if none provided
  const defaultTiers: LockTierInfo[] = [
    { name: 'Bronze', minDays: 30, maxDays: 89, multiplier: 10000, color: '#ca8a04' },
    { name: 'Silver', minDays: 90, maxDays: 179, multiplier: 15000, color: '#9ca3af' },
    { name: 'Gold', minDays: 180, maxDays: 364, multiplier: 20000, color: '#fbbf24' },
    { name: 'Diamond', minDays: 365, maxDays: 1094, multiplier: 30000, color: '#06b6d4' },
    { name: 'Platinum', minDays: 1095, maxDays: 1459, multiplier: 50000, color: '#8b5cf6' },
    { name: 'Legendary', minDays: 1460, maxDays: 1824, multiplier: 80000, color: '#f97316' }
  ];

  const displayTiers = lockTiers?.length > 0 ? lockTiers : defaultTiers;

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return '⛵';
      case 'silver': return '🛡️';
      case 'gold': return '👑';
      case 'diamond': return '💎';
      case 'platinum': return '⭐';
      case 'legendary': return '⚡';
      default: return '🔒';
    }
  };

  const getTierIconComponent = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return Shield;
      case 'silver': return Award;
      case 'gold': return Crown;
      case 'diamond': return Star;
      case 'platinum': return Sparkles;
      case 'legendary': return Zap;
      default: return Award;
    }
  };

  const getTierGradient = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return 'from-yellow-600/20 via-yellow-700/10 to-transparent';
      case 'silver': return 'from-gray-400/20 via-gray-500/10 to-transparent';
      case 'gold': return 'from-yellow-400/20 via-yellow-500/10 to-transparent';
      case 'diamond': return 'from-cyan-400/20 via-cyan-500/10 to-transparent';
      case 'platinum': return 'from-purple-400/20 via-purple-500/10 to-transparent';
      case 'legendary': return 'from-orange-500/20 via-red-500/10 to-transparent';
      default: return 'from-gray-400/20 via-gray-500/10 to-transparent';
    }
  };

  const getTierBorder = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return 'border-yellow-600/40';
      case 'silver': return 'border-gray-400/40';
      case 'gold': return 'border-yellow-400/40';
      case 'diamond': return 'border-cyan-400/40';
      case 'platinum': return 'border-purple-400/40';
      case 'legendary': return 'border-orange-500/50';
      default: return 'border-gray-400/40';
    }
  };

  const getTierBenefits = (tierName: string, multiplier: number) => {
    const baseMultiplier = multiplier / 10000;
    const benefits = [
      `${baseMultiplier}x reward multiplier`,
      `${tierName} tier community role`,
      'Share in vault distributions'
    ];

    switch (tierName.toLowerCase()) {
      case 'bronze':
        benefits.push('Basic locker benefits', 'Entry level protection');
        break;
      case 'silver':
        benefits.push('Enhanced rewards', 'Priority community support');
        break;
      case 'gold':
        benefits.push('Governance participation', 'Exclusive feature access');
        break;
      case 'diamond':
        benefits.push('VIP community access', 'Special event invitations');
        break;
      case 'platinum':
        benefits.push('Development influence', 'Maximum benefit tier');
        break;
      case 'legendary':
        benefits.push('Ultimate vault rewards', 'True Noah privileges', 'Lead the new world');
        break;
    }

    return benefits;
  };

  const formatDuration = (minDays: number, maxDays: number) => {
    if (minDays >= 365) {
      const minYears = (minDays / 365).toFixed(1);
      const maxYears = (maxDays / 365).toFixed(1);
      return `${minYears}-${maxYears} years`;
    }
    return `${minDays}-${maxDays} days`;
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 hover:border-cyan-500/40 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Crown className="w-8 h-8 text-cyan-400 mr-3" />
        <div>
          <h3 className="text-2xl font-bold text-cyan-400">Sacred Lock Tier Benefits</h3>
          <p className="text-sm text-gray-400">Ascend through divine tiers for greater blessings</p>
        </div>
      </div>

      {/* Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {displayTiers.map((tier, index) => {
          const IconComponent = getTierIconComponent(tier.name);
          const isSelected = selectedTier === index;
          const multiplier = tier.multiplier / 10000;
          
          return (
            <div
              key={index}
              onClick={() => setSelectedTier(isSelected ? null : index)}
              className={`relative bg-gradient-to-br ${getTierGradient(tier.name)} border-2 ${getTierBorder(tier.name)} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 group ${
                isSelected ? 'ring-2 ring-cyan-400/50 scale-105' : ''
              } ${tier.name.toLowerCase() === 'legendary' ? 'shadow-lg shadow-orange-500/20' : ''}`}
            >
              {/* Background glow effect */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-radial opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`} 
                   style={{ background: `radial-gradient(circle, ${tier.color}20 0%, transparent 70%)` }}></div>
              
              {/* Special badge for legendary */}
              {tier.name.toLowerCase() === 'legendary' && (
                <div className="absolute top-2 right-2 bg-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  LEGENDARY
                </div>
              )}

              <div className="relative z-10">
                {/* Icon and Tier Name */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3 group-hover:scale-110 transition-transform">
                      {getTierIcon(tier.name)}
                    </div>
                    <IconComponent 
                      className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-300" 
                      style={{ color: tier.color }}
                    />
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isSelected ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} 
                  />
                </div>

                {/* Tier Info */}
                <div className="mb-4">
                  <div className="text-lg font-bold mb-1" style={{ color: tier.color }}>
                    {tier.name} Tier
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(tier.minDays, tier.maxDays)}
                  </div>
                </div>

                {/* Multiplier Display */}
                <div className="flex items-center justify-center bg-black/30 rounded-lg p-3 mb-4">
                  <TrendingUp className="w-5 h-5 mr-2" style={{ color: tier.color }} />
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: tier.color }}>
                      {multiplier.toFixed(1)}x
                    </div>
                    <div className="text-xs text-gray-400">Reward Multiplier</div>
                  </div>
                </div>

                {/* Quick Benefits Preview */}
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-300">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: tier.color }}></div>
                    Enhanced vault rewards
                  </div>
                  <div className="flex items-center text-xs text-gray-300">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: tier.color }}></div>
                    {tier.name} community role
                  </div>
                  {tier.name.toLowerCase() === 'legendary' && (
                    <div className="flex items-center text-xs text-orange-300">
                      <Flame className="w-3 h-3 mr-1" />
                      Ultimate privileges
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Benefits Panel */}
      {selectedTier !== null && (
        <div className="bg-gradient-to-r from-black/40 via-gray-900/40 to-black/40 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">{getTierIcon(displayTiers[selectedTier].name)}</div>
            <div>
              <h4 className="text-xl font-bold" style={{ color: displayTiers[selectedTier].color }}>
                {displayTiers[selectedTier].name} Tier Benefits
              </h4>
              <p className="text-sm text-gray-400">
                Complete list of privileges and rewards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefits List */}
            <div>
              <h5 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center">
                <Award className="w-4 h-4 mr-1" />
                Tier Benefits
              </h5>
              <div className="space-y-2">
                {getTierBenefits(displayTiers[selectedTier].name, displayTiers[selectedTier].multiplier).map((benefit, idx) => (
                  <div key={idx} className="flex items-start text-sm">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0" 
                         style={{ backgroundColor: displayTiers[selectedTier].color }}></div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h5 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center">
                <Coins className="w-4 h-4 mr-1" />
                Tier Statistics
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <span className="text-sm text-gray-400">Lock Duration</span>
                  <span className="text-sm font-semibold text-white">
                    {formatDuration(displayTiers[selectedTier].minDays, displayTiers[selectedTier].maxDays)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <span className="text-sm text-gray-400">Reward Multiplier</span>
                  <span className="text-sm font-semibold" style={{ color: displayTiers[selectedTier].color }}>
                    {(displayTiers[selectedTier].multiplier / 10000).toFixed(1)}x
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <span className="text-sm text-gray-400">Tier Rank</span>
                  <span className="text-sm font-semibold text-white">
                    {selectedTier + 1} of {displayTiers.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <button 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Lock for {displayTiers[selectedTier].name} Tier
            </button>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-6 flex items-start p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <div className="text-blue-300 font-semibold mb-1">How Tier Benefits Work</div>
          <div className="text-gray-300">
            Your reward multiplier is applied to all vault distributions during your lock period. 
            Higher tiers receive exponentially more rewards from the same transaction fees. 
            Click any tier above to see detailed benefits.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierBenefits;