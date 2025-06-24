
import React from 'react';
import { Crown, Star, Zap, TrendingUp } from 'lucide-react';

interface LockTier {
  name: string;
  duration: number;
  multiplier: string;
  color: string;
  minDays: number;
  maxDays: number;
}

interface TierDisplayProps {
  currentTier: LockTier;
}

const TierDisplay = ({ currentTier }: TierDisplayProps) => {
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
      case 'bronze': return Crown;
      case 'silver': return Crown;
      case 'gold': return Crown;
      case 'diamond': return Star;
      case 'platinum': return Star;
      case 'legendary': return Zap;
      default: return Crown;
    }
  };

  const TierIconComponent = getTierIconComponent(currentTier.name);

  return (
    <div 
      className="relative bg-gradient-to-r from-black/40 via-gray-900/40 to-black/40 rounded-xl p-6 border-2 overflow-hidden"
      style={{ borderColor: currentTier.color }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-2xl opacity-30"
        style={{ background: `radial-gradient(circle, ${currentTier.color}40 0%, transparent 70%)` }}
      ></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-3xl mr-3">{getTierIcon(currentTier.name)}</div>
            <TierIconComponent className="w-6 h-6 mr-3" style={{ color: currentTier.color }} />
            <div>
              <div className="text-xl font-bold" style={{ color: currentTier.color }}>
                {currentTier.name} Tier
              </div>
              <div className="text-sm text-gray-400">
                {currentTier.multiplier} reward multiplier
              </div>
            </div>
          </div>
          {currentTier.name === 'Legendary' && (
            <div className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              LEGENDARY
            </div>
          )}
        </div>
        
        {/* Tier Benefits Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-300">
            <TrendingUp className="w-4 h-4 mr-2" style={{ color: currentTier.color }} />
            Enhanced vault rewards
          </div>
          <div className="flex items-center text-gray-300">
            <Crown className="w-4 h-4 mr-2" style={{ color: currentTier.color }} />
            {currentTier.name} community status
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierDisplay;
