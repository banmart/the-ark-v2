import React, { useState } from 'react';
import { 
  Clock, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Gift,
  Lock,
  Users,
  Award,
  BarChart3,
  Calendar,
  Flame,
  Crown,
  Shield,
  Star,
  Sparkles,
  Wallet,
  Info,
  CheckCircle,
  Coins
} from 'lucide-react';

interface UserStats {
  totalLocked: number;
  totalRewardsEarned: number;
  activeLocksCount: number;
  userWeight: number;
  pendingRewards: number;
}

interface UserLock {
  id: number;
  amount: number;
  lockTime: number;
  unlockTime: number;
  tier: number;
  multiplier: number;
  totalRewardsEarned: number;
  lockPeriod: number;
  daysRemaining: number;
}

interface LockTier {
  name: string;
  icon: string;
  color: string;
  multiplier: number;
}

interface EnhancedUserDashboardProps {
  isConnected: boolean;
}

// Mock hook for demonstration
const useLockerData = () => {
  const mockUserStats: UserStats = {
    totalLocked: 250000,
    totalRewardsEarned: 18750,
    activeLocksCount: 3,
    userWeight: 375000,
    pendingRewards: 2847
  };

  const mockLockTiers: LockTier[] = [
    { name: 'Bronze', icon: '⛵', color: '#ca8a04', multiplier: 10000 },
    { name: 'Silver', icon: '🛡️', color: '#9ca3af', multiplier: 15000 },
    { name: 'Gold', icon: '👑', color: '#fbbf24', multiplier: 20000 },
    { name: 'Diamond', icon: '💎', color: '#06b6d4', multiplier: 30000 },
    { name: 'Platinum', icon: '⭐', color: '#8b5cf6', multiplier: 50000 },
    { name: 'Legendary', icon: '⚡', color: '#f97316', multiplier: 80000 }
  ];

  const mockUserLocks: UserLock[] = [
    {
      id: 1,
      amount: 50000,
      lockTime: Date.now() / 1000 - (86400 * 45),
      unlockTime: Date.now() / 1000 + (86400 * 45),
      tier: 0,
      multiplier: 1.0,
      totalRewardsEarned: 2500,
      lockPeriod: 86400 * 90,
      daysRemaining: 45
    },
    {
      id: 2,
      amount: 100000,
      lockTime: Date.now() / 1000 - (86400 * 120),
      unlockTime: Date.now() / 1000 + (86400 * 60),
      tier: 1,
      multiplier: 1.5,
      totalRewardsEarned: 8750,
      lockPeriod: 86400 * 180,
      daysRemaining: 60
    },
    {
      id: 3,
      amount: 100000,
      lockTime: Date.now() / 1000 - (86400 * 350),
      unlockTime: Date.now() / 1000 - (86400 * 5),
      tier: 2,
      multiplier: 2.0,
      totalRewardsEarned: 7500,
      lockPeriod: 86400 * 365,
      daysRemaining: 0
    }
  ];

  const calculateEarlyUnlockPenalty = (lock: UserLock) => {
    const now = Date.now() / 1000;
    const timeRemaining = Math.max(0, lock.unlockTime - now);
    const totalLockTime = lock.lockPeriod;
    const penaltyRate = (timeRemaining / totalLockTime) * 50; // Max 50% penalty
    const penalty = lock.amount * (penaltyRate / 100);
    const userReceives = lock.amount - penalty;
    
    return {
      penalty,
      penaltyRate,
      userReceives
    };
  };

  return {
    userStats: mockUserStats,
    userLocks: mockUserLocks,
    calculateEarlyUnlockPenalty,
    unlockTokens: async (lockId: number) => {
      console.log('Unlocking lock:', lockId);
    },
    claimRewards: async () => {
      console.log('Claiming rewards');
    },
    loading: false,
    lockTiers: mockLockTiers
  };
};

const EnhancedUserDashboard = ({ isConnected }: EnhancedUserDashboardProps) => {
  const { 
    userStats, 
    userLocks, 
    calculateEarlyUnlockPenalty, 
    unlockTokens, 
    claimRewards,
    loading,
    lockTiers 
  } = useLockerData();

  const [processingClaim, setProcessingClaim] = useState(false);
  const [processingUnlock, setProcessingUnlock] = useState<number | null>(null);

  const handleUnlock = async (lockId: number) => {
    setProcessingUnlock(lockId);
    try {
      await unlockTokens(lockId);
    } catch (error) {
      console.error('Unlock failed:', error);
    } finally {
      setTimeout(() => setProcessingUnlock(null), 2000);
    }
  };

  const handleClaimRewards = async () => {
    setProcessingClaim(true);
    try {
      await claimRewards();
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setTimeout(() => setProcessingClaim(false), 2000);
    }
  };

  const getTierInfo = (tierIndex: number) => {
    return lockTiers[tierIndex] || lockTiers[0];
  };

  const getTierIconComponent = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return Shield;
      case 'silver': return Award;
      case 'gold': return Crown;
      case 'diamond': return Star;
      case 'platinum': return Sparkles;
      case 'legendary': return Zap;
      default: return Lock;
    }
  };

  const displayStats = isConnected ? userStats : userStats; // Same data for demo
  const displayLocks = isConnected ? userLocks : userLocks; // Same data for demo

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-orange-400 mr-3" />
            <h3 className="text-xl font-bold text-orange-400">Demo Mode - Connect Wallet</h3>
          </div>
          <p className="text-center text-gray-300 mb-4">
            The data below is for demonstration. Connect your wallet to see your actual positions.
          </p>
          <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform">
            Connect Wallet to View Real Data
          </button>
        </div>
      )}

      {/* User Stats Overview */}
      <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 hover:border-cyan-500/40 transition-all duration-300">
        <div className="flex items-center mb-8">
          <BarChart3 className="w-8 h-8 text-cyan-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Your Locker Statistics</h2>
            <p className="text-sm text-gray-400">Complete overview of your ARK locking activity</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
            <Lock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {loading ? <span className="animate-pulse">...</span> : displayStats.totalLocked.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Locked ARK</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400 mb-1">
              {loading ? <span className="animate-pulse">...</span> : displayStats.totalRewardsEarned.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Earned ARK</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {loading ? <span className="animate-pulse">...</span> : displayStats.activeLocksCount}
            </div>
            <div className="text-sm text-gray-400">Active Positions</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent border border-yellow-500/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {loading ? <span className="animate-pulse">...</span> : displayStats.userWeight.toFixed(0)}
            </div>
            <div className="text-sm text-gray-400">Weight Score</div>
          </div>
        </div>
      </div>

      {/* Pending Rewards */}
      <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-2 border-green-500/30 rounded-xl p-8 shadow-2xl shadow-green-500/10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-green-400">Pending Vault Rewards</h2>
              <p className="text-sm text-gray-400 mt-1">
                From 2% locker fees + early unlock penalty distributions
              </p>
            </div>
          </div>
          <button
            onClick={handleClaimRewards}
            disabled={!isConnected || displayStats.pendingRewards === 0 || loading || processingClaim}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center gap-2"
          >
            {processingClaim ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Claiming...
              </>
            ) : (
              <>
                <Coins className="w-5 h-5" />
                Claim Rewards
              </>
            )}
          </button>
        </div>

        <div className="flex items-center mb-4">
          <div className="text-4xl font-black text-green-400 mr-4">
            {!isConnected ? `${displayStats.pendingRewards.toLocaleString()} ARK` : 
             loading ? <span className="animate-pulse">Loading...</span> :
             `${displayStats.pendingRewards.toLocaleString()} ARK`}
          </div>
          {!isConnected && (
            <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg px-3 py-1">
              <span className="text-xs text-orange-300 font-medium">DEMO</span>
            </div>
          )}
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
          <div className="text-sm text-gray-300">
            💡 <strong>Weight-based distribution:</strong> Your share is calculated based on your total weight score 
            ({displayStats.userWeight.toFixed(0)}) relative to all active lockers in the SimplifiedLockerVault.
          </div>
        </div>
      </div>

      {/* Active Locks */}
      <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8">
        <div className="flex items-center mb-8">
          <Lock className="w-8 h-8 text-cyan-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Your Sacred Lock Positions</h2>
            <p className="text-sm text-gray-400">Manage your locked tokens and track earnings</p>
          </div>
        </div>
        
        {!isConnected ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              Connect your wallet to view your actual lock positions
            </div>
            <div className="text-sm text-gray-500 mb-6">
              The positions below are for demonstration purposes
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-400">Loading your positions from contract...</div>
          </div>
        ) : displayLocks.length === 0 ? (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              No active locks found
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Lock some tokens to start earning multiplied rewards from the vault
            </div>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform">
              Create Your First Lock
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {displayLocks.map((lock) => {
              const now = Date.now() / 1000;
              const isUnlocked = now >= lock.unlockTime;
              const penalty = calculateEarlyUnlockPenalty(lock);
              const tierInfo = getTierInfo(lock.tier);
              const TierIconComponent = getTierIconComponent(tierInfo.name);
              const progress = Math.max(0, Math.min(100, ((now - lock.lockTime) / (lock.unlockTime - lock.lockTime)) * 100));
              
              return (
                <div 
                  key={lock.id} 
                  className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl p-6 border-2 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                  style={{ borderColor: tierInfo.color }}
                >
                  {/* Background glow */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 blur-2xl opacity-20"
                    style={{ background: `radial-gradient(circle, ${tierInfo.color}40 0%, transparent 70%)` }}
                  ></div>

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{tierInfo.icon}</div>
                        <TierIconComponent className="w-8 h-8" style={{ color: tierInfo.color }} />
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {lock.amount.toLocaleString()} ARK
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold" style={{ color: tierInfo.color }}>
                              {tierInfo.name} Tier
                            </div>
                            <div className="text-sm text-gray-400">
                              • {lock.multiplier}x multiplier
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`flex items-center gap-2 text-sm mb-2 ${isUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                          {isUnlocked ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-semibold">Ready to unlock</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">{lock.daysRemaining} days remaining</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-bold">+{lock.totalRewardsEarned.toLocaleString()} ARK earned</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Lock Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${progress}%`,
                            background: `linear-gradient(to right, ${tierInfo.color}, ${tierInfo.color}80)`
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Lock Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-600/50">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-400 text-sm">Lock Duration</span>
                        </div>
                        <div className="text-white font-bold">{Math.round(lock.lockPeriod / (24 * 60 * 60))} days</div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-600/50">
                        <div className="flex items-center mb-2">
                          <Award className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-400 text-sm">Weight Contribution</span>
                        </div>
                        <div className="text-white font-bold">
                          {(lock.amount * (tierInfo.multiplier / 10000)).toFixed(0)}
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4 border border-gray-600/50">
                        <div className="flex items-center mb-2">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-400 text-sm">Unlock Date</span>
                        </div>
                        <div className="text-white font-bold">
                          {new Date(lock.unlockTime * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Early Unlock Warning */}
                    {!isUnlocked && penalty.penalty > 0 && (
                      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-semibold">Early Unlock Penalty Warning</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-red-400 mb-1">Penalty Amount:</div>
                            <div className="text-white font-bold">
                              {penalty.penalty.toFixed(2)} ARK ({penalty.penaltyRate.toFixed(1)}%)
                            </div>
                          </div>
                          <div>
                            <div className="text-red-400 mb-1">You would receive:</div>
                            <div className="text-white font-bold">{penalty.userReceives.toFixed(2)} ARK</div>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-red-800/20 rounded-lg">
                          <div className="text-xs text-red-300 flex items-center">
                            <Flame className="w-4 h-4 mr-2" />
                            50% of penalty is burned forever, 50% distributed to all active lockers
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <button
                      onClick={() => handleUnlock(lock.id)}
                      disabled={processingUnlock === lock.id}
                      className={`w-full py-4 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 ${
                        isUnlocked 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-black shadow-lg shadow-green-500/30' 
                          : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                      }`}
                    >
                      {processingUnlock === lock.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Processing Transaction...
                        </>
                      ) : isUnlocked ? (
                        <>
                          <Zap className="w-5 h-5" />
                          Unlock Tokens - No Penalty
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5" />
                          Early Unlock (With {penalty.penaltyRate.toFixed(1)}% Penalty)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Info className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-lg font-bold text-purple-400">Maximizing Your Rewards</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start">
            <Star className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-cyan-300 mb-1">Lock for Higher Tiers</div>
              <div className="text-gray-400">Legendary tier gets 8x more rewards than Bronze from the same fee pool</div>
            </div>
          </div>
          <div className="flex items-start">
            <TrendingUp className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-green-300 mb-1">Compound Your Gains</div>
              <div className="text-gray-400">Reinvest claimed rewards into new locks to increase your weight score</div>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-yellow-300 mb-1">Patience Pays</div>
              <div className="text-gray-400">Early unlocks can cost up to 50% in penalties - plan your locks carefully</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserDashboard;