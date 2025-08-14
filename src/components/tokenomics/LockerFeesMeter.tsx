import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Lock, Trophy, Zap, Coins, Shield, TrendingUp } from 'lucide-react';
import { CONTRACT_CONSTANTS, LOCKER_CONSTANTS } from '../../utils/constants';

interface LockerFeesMeterProps {
  accumulatedFees: number;
  distributionThreshold: number;
  totalLockers: number;
  userPendingRewards?: number;
  userTier?: number;
  lastDistribution: number;
  loading: boolean;
}

type LockerState = 'ACCUMULATING' | 'READY_DISTRIBUTION' | 'DISTRIBUTING' | 'COMPLETED';

const LockerFeesMeter = ({ 
  accumulatedFees, 
  distributionThreshold,
  totalLockers, 
  userPendingRewards = 0,
  userTier = 0,
  lastDistribution,
  loading 
}: LockerFeesMeterProps) => {
  const [lockerState, setLockerState] = useState<LockerState>('ACCUMULATING');
  const [selectedTier, setSelectedTier] = useState(userTier);

  const percentage = Math.min((accumulatedFees / distributionThreshold) * 100, 100);

  // Tier information
  const tierInfo = [
    { name: 'BRONZE', multiplier: 1, color: 'amber-600', minDays: 30 },
    { name: 'SILVER', multiplier: 1.5, color: 'gray-400', minDays: 90 },
    { name: 'GOLD', multiplier: 2, color: 'yellow-400', minDays: 180 },
    { name: 'DIAMOND', multiplier: 3, color: 'cyan-400', minDays: 365 },
    { name: 'PLATINUM', multiplier: 5, color: 'purple-400', minDays: 730 },
    { name: 'LEGENDARY', multiplier: 8, color: 'red-400', minDays: 1095 }
  ];

  useEffect(() => {
    if (loading) return;

    if (accumulatedFees >= distributionThreshold) {
      setLockerState('READY_DISTRIBUTION');
    } else if (accumulatedFees > distributionThreshold * 0.8) {
      setLockerState('DISTRIBUTING');
    } else {
      setLockerState('ACCUMULATING');
    }
  }, [accumulatedFees, distributionThreshold, loading]);

  const getStateColor = () => {
    switch (lockerState) {
      case 'ACCUMULATING': return 'blue';
      case 'READY_DISTRIBUTION': return 'yellow';
      case 'DISTRIBUTING': return 'green';
      case 'COMPLETED': return 'purple';
      default: return 'blue';
    }
  };

  const getStateText = () => {
    switch (lockerState) {
      case 'ACCUMULATING': return 'ACCUMULATING_FEES';
      case 'READY_DISTRIBUTION': return 'READY_FOR_DISTRIBUTION';
      case 'DISTRIBUTING': return 'DISTRIBUTING_REWARDS';
      case 'COMPLETED': return 'DISTRIBUTION_COMPLETE';
      default: return 'PROCESSING_FEES';
    }
  };

  const calculateTierRewards = (tierIndex: number, baseReward: number = 1000) => {
    const tier = tierInfo[tierIndex];
    return baseReward * tier.multiplier;
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-6 overflow-hidden relative group hover:border-blue-500/60 transition-all duration-500">
      {/* Vault Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-blue-400/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 border-2 border-cyan-400/10 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      </div>

      {/* Status Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <Lock className={`w-5 h-5 text-${getStateColor()}-400 ${lockerState === 'DISTRIBUTING' ? 'animate-bounce' : ''}`} />
          <h4 className="text-lg font-bold text-blue-400 font-mono">
            [LOCKER_REWARDS_VAULT]
          </h4>
        </div>
        <div className={`text-${getStateColor()}-400 font-mono text-sm px-3 py-1 bg-${getStateColor()}-500/20 border border-${getStateColor()}-500/30 rounded`}>
          {getStateText()}
        </div>
      </div>

      {/* Locker Fee Display */}
      <div className="mb-6 relative z-10">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🔒</div>
          <div className="text-2xl font-bold text-blue-400 font-mono mb-2">
            {CONTRACT_CONSTANTS.LOCKER_FEE / CONTRACT_CONSTANTS.DIVIDER * 100}% LOCKER FEE
          </div>
          <div className="text-sm text-gray-400 font-mono">
            Collected fees distributed to ARK Locker participants
          </div>
        </div>
      </div>

      {/* Fee Accumulation Progress */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400 font-mono">
            FEE_ACCUMULATION
          </span>
          <span className={`text-sm text-${getStateColor()}-400 font-mono`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={percentage} 
            className={`h-4 bg-gray-800/50 ${lockerState === 'READY_DISTRIBUTION' ? 'animate-pulse' : ''}`}
          />
          {lockerState === 'DISTRIBUTING' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-[scan_1s_ease-in-out_infinite]" />
          )}
        </div>
        
        <div className="flex justify-between mt-2 text-xs font-mono">
          <span className="text-gray-500">
            {loading ? '[LOADING...]' : `${accumulatedFees.toLocaleString()} ARK`}
          </span>
          <span className="text-blue-400">
            {loading ? '[LOADING...]' : `${distributionThreshold.toLocaleString()} ARK`}
          </span>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-400 font-mono">
            {loading ? '[LOADING...]' : totalLockers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">ACTIVE_LOCKERS</div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <Coins className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-400 font-mono">
            {loading ? '[LOADING...]' : `${accumulatedFees.toLocaleString()}`}
          </div>
          <div className="text-xs text-gray-400">PENDING_DISTRIBUTION</div>
        </div>
      </div>

      {/* User Pending Rewards (if connected) */}
      {userPendingRewards > 0 && (
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4 mb-6 relative z-10">
          <div className="text-center">
            <div className="text-blue-400 font-mono text-sm mb-2">YOUR_PENDING_REWARDS</div>
            <div className="text-2xl font-bold text-white font-mono mb-1">
              {userPendingRewards.toLocaleString()} ARK
            </div>
            <div className="text-xs text-gray-400">
              {userTier < 6 ? `${tierInfo[userTier].name} TIER` : 'NO_ACTIVE_LOCKS'}
            </div>
          </div>
        </div>
      )}

      {/* Tier Benefits Calculator */}
      <div className="bg-black/50 border border-blue-500/30 rounded-lg p-4 mb-4 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-mono text-sm">TIER_MULTIPLIER_CALCULATOR</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {tierInfo.map((tier, index) => (
            <button
              key={tier.name}
              onClick={() => setSelectedTier(index)}
              className={`p-2 rounded text-xs font-mono border transition-all duration-200 ${
                selectedTier === index 
                  ? `bg-${tier.color}/20 border-${tier.color} text-${tier.color}` 
                  : 'bg-gray-800/50 border-gray-600/30 text-gray-400 hover:border-gray-500'
              }`}
            >
              {tier.name}
              <br />
              <span className="text-xs">{tier.multiplier}x</span>
            </button>
          ))}
        </div>
        
        <div className="bg-blue-500/10 rounded p-3">
          <div className="text-xs text-blue-400 font-mono mb-1">
            {tierInfo[selectedTier].name}_TIER_REWARDS:
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {calculateTierRewards(selectedTier).toLocaleString()} ARK
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {tierInfo[selectedTier].multiplier}x multiplier • Min {tierInfo[selectedTier].minDays} days
          </div>
        </div>
      </div>

      {/* Distribution Process Flow */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4 relative z-10">
        <div className="text-blue-400 font-mono text-sm mb-3 text-center">
          [REWARD_DISTRIBUTION_PROCESS]
        </div>
        
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex flex-col items-center text-blue-400">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
              2%
            </div>
            <span>FEES</span>
          </div>
          
          <Zap className="w-4 h-4 text-blue-400" />
          
          <div className="flex flex-col items-center text-cyan-400">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
              <Lock className="w-4 h-4" />
            </div>
            <span>VAULT</span>
          </div>
          
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          
          <div className="flex flex-col items-center text-green-400">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <span>LOCKERS</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 text-center mt-2">
          Rewards distributed based on locked amount, duration, and tier multipliers
        </div>
      </div>

      {/* Scanning Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default LockerFeesMeter;