
import React from 'react';
import { useLockerData } from '../../hooks/useLockerData';
import { Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface EnhancedUserDashboardProps {
  isConnected: boolean;
}

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

  const handleUnlock = async (lockId: number) => {
    try {
      await unlockTokens(lockId);
    } catch (error) {
      console.error('Unlock failed:', error);
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  const getTierInfo = (tierIndex: number) => {
    return lockTiers[tierIndex];
  };

  return (
    <div className="space-y-8">
      {/* User Stats Overview */}
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">Your Locker Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {loading ? <span className="animate-pulse">...</span> : userStats.totalLocked.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Locked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {loading ? <span className="animate-pulse">...</span> : userStats.totalRewardsEarned.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {loading ? <span className="animate-pulse">...</span> : userStats.activeLocksCount}
            </div>
            <div className="text-sm text-gray-400">Active Locks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {loading ? <span className="animate-pulse">...</span> : userStats.userWeight.toFixed(0)}
            </div>
            <div className="text-sm text-gray-400">Weight Score</div>
          </div>
        </div>
      </div>

      {/* Pending Rewards */}
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">Pending Rewards</h2>
            <p className="text-sm text-gray-400 mt-1">
              From 2% locker fees + penalty distributions
            </p>
          </div>
          <button
            onClick={handleClaimRewards}
            disabled={!isConnected || userStats.pendingRewards === 0 || loading}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            Claim
          </button>
        </div>
        <div className="text-3xl font-black text-green-400 mb-2">
          {!isConnected ? 'Connect wallet' : 
           loading ? <span className="animate-pulse">Loading...</span> :
           `${userStats.pendingRewards.toLocaleString()} ARK`}
        </div>
        <div className="text-sm text-gray-400">
          Weight-based distribution from SimplifiedLockerVault
        </div>
      </div>

      {/* Active Locks */}
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">Your Active Locks</h2>
        
        {!isConnected ? (
          <div className="text-center py-8 text-gray-400">
            Connect your wallet to view your locks
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-400">Loading your positions from contract...</div>
          </div>
        ) : userLocks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No active locks found. Lock some tokens to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {userLocks.map((lock) => {
              const now = Date.now() / 1000;
              const isUnlocked = now >= lock.unlockTime;
              const penalty = calculateEarlyUnlockPenalty(lock);
              const tierInfo = getTierInfo(lock.tier);
              
              return (
                <div key={lock.id} className="bg-black/30 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{tierInfo.icon}</div>
                      <div>
                        <div className="text-xl font-bold text-white">
                          {lock.amount.toLocaleString()} ARK
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium" style={{ color: tierInfo.color }}>
                            {tierInfo.name} Tier
                          </div>
                          <div className="text-sm text-gray-400">
                            • {lock.multiplier} multiplier
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                        <Clock className="w-4 h-4" />
                        {isUnlocked ? 'Ready to unlock' : `${lock.daysRemaining} days left`}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        +{lock.totalRewardsEarned.toLocaleString()} ARK earned
                      </div>
                    </div>
                  </div>
                  
                  {/* Lock Details */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-400">Lock Duration</div>
                      <div className="text-white font-medium">{Math.round(lock.lockPeriod / (24 * 60 * 60))} days</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Weight Contribution</div>
                      <div className="text-white font-medium">{(lock.amount * (tierInfo.multiplier / 10000)).toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Unlock Time</div>
                      <div className="text-white font-medium">{new Date(lock.unlockTime * 1000).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  {!isUnlocked && penalty.penalty > 0 && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded p-3 mb-4">
                      <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-semibold">Early Unlock Penalty</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-red-400">Penalty Amount:</div>
                          <div className="text-white font-medium">{penalty.penalty.toFixed(2)} ARK ({penalty.penaltyRate.toFixed(1)}%)</div>
                        </div>
                        <div>
                          <div className="text-red-400">You would receive:</div>
                          <div className="text-white font-medium">{penalty.userReceives.toFixed(2)} ARK</div>
                        </div>
                      </div>
                      <div className="text-xs text-red-300 mt-2">
                        50% penalty burned, 50% distributed to all lockers
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleUnlock(lock.id)}
                    className={`w-full py-3 rounded font-bold text-sm transition-transform hover:scale-105 ${
                      isUnlocked 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-black' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }`}
                  >
                    {isUnlocked ? 
                      <span className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" />
                        Unlock Tokens
                      </span> : 
                      <span className="flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Early Unlock (Penalty)
                      </span>
                    }
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedUserDashboard;
