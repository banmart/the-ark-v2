import React, { useState } from 'react';
import { 
  Wallet, 
  Gift, 
  Lock, 
  Unlock, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Coins,
  Calendar,
  Award,
  BarChart3,
  Flame,
  Crown
} from 'lucide-react';

interface LockPosition {
  id: number;
  amount: number;
  lockTime: number;
  unlockTime: number;
  tier: string;
  active: boolean;
  totalRewards: number;
}

interface UserDashboardProps {
  isConnected: boolean;
  pendingRewards: number;
  userLocks: LockPosition[];
  calculatePenalty: (lockTime: number, unlockTime: number, amount: number) => { penalty: number; userReceives: number };
}

const UserDashboard = ({ isConnected, pendingRewards, userLocks, calculatePenalty }: UserDashboardProps) => {
  const [claimingRewards, setClaimingRewards] = useState(false);
  const [processingUnlock, setProcessingUnlock] = useState<number | null>(null);

  // Mock data for demonstration when not connected
  const mockLocks: LockPosition[] = [
    {
      id: 1,
      amount: 50000,
      lockTime: Date.now() / 1000 - (86400 * 45), // 45 days ago
      unlockTime: Date.now() / 1000 + (86400 * 45), // 45 days from now
      tier: 'Bronze',
      active: true,
      totalRewards: 2500
    },
    {
      id: 2,
      amount: 100000,
      lockTime: Date.now() / 1000 - (86400 * 120), // 120 days ago
      unlockTime: Date.now() / 1000 + (86400 * 60), // 60 days from now
      tier: 'Silver',
      active: true,
      totalRewards: 8750
    },
    {
      id: 3,
      amount: 25000,
      lockTime: Date.now() / 1000 - (86400 * 200), // 200 days ago
      unlockTime: Date.now() / 1000 - (86400 * 5), // Unlocked 5 days ago
      tier: 'Gold',
      active: true,
      totalRewards: 15000
    }
  ];

  const displayLocks = isConnected ? userLocks : mockLocks;
  const displayRewards = isConnected ? pendingRewards : 12847;

  const handleClaimRewards = async () => {
    setClaimingRewards(true);
    // Simulate transaction delay
    setTimeout(() => {
      setClaimingRewards(false);
    }, 2000);
  };

  const handleUnlock = async (lockId: number) => {
    setProcessingUnlock(lockId);
    // Simulate transaction delay
    setTimeout(() => {
      setProcessingUnlock(null);
    }, 3000);
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return '⛵';
      case 'silver': return '🛡️';
      case 'gold': return '👑';
      case 'diamond': return '💎';
      case 'platinum': return '⭐';
      case 'legendary': return '⚡';
      default: return '🔒';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 'text-yellow-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-400';
      case 'diamond': return 'text-cyan-400';
      case 'platinum': return 'text-purple-400';
      case 'legendary': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 'from-yellow-600/10 via-yellow-700/5 to-transparent border-yellow-600/30';
      case 'silver': return 'from-gray-400/10 via-gray-500/5 to-transparent border-gray-400/30';
      case 'gold': return 'from-yellow-400/10 via-yellow-500/5 to-transparent border-yellow-400/30';
      case 'diamond': return 'from-cyan-400/10 via-cyan-500/5 to-transparent border-cyan-400/30';
      case 'platinum': return 'from-purple-400/10 via-purple-500/5 to-transparent border-purple-400/30';
      case 'legendary': return 'from-orange-500/10 via-red-500/5 to-transparent border-orange-500/30';
      default: return 'from-gray-400/10 via-gray-500/5 to-transparent border-gray-400/30';
    }
  };

  const totalLocked = displayLocks.reduce((sum, lock) => sum + lock.amount, 0);
  const totalEarned = displayLocks.reduce((sum, lock) => sum + lock.totalRewards, 0);
  const activeLocks = displayLocks.filter(lock => lock.active).length;

  return (
    <div className="space-y-8">
      {/* Connection Status & Overview */}
      {!isConnected && (
        <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-orange-400 mr-3" />
            <h3 className="text-xl font-bold text-orange-400">Demo Mode</h3>
          </div>
          <p className="text-center text-gray-300 mb-4">
            Connect your wallet to view your actual positions and claim real rewards
          </p>
          <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform">
            Connect Wallet
          </button>
        </div>
      )}

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <Gift className="w-8 h-8 text-cyan-400" />
            <div className="text-right">
              <div className="text-sm text-gray-400">Pending</div>
              <div className="text-xl font-bold text-cyan-300">
                {displayRewards.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">ARK</div>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <Lock className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Locked</div>
              <div className="text-xl font-bold text-green-300">
                {totalLocked.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">ARK</div>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Earned</div>
              <div className="text-xl font-bold text-yellow-300">
                {totalEarned.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">ARK</div>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-sm text-gray-400">Active Locks</div>
              <div className="text-xl font-bold text-purple-300">
                {activeLocks}
              </div>
              <div className="text-xs text-gray-500">Positions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Rewards Section */}
      <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-2 border-green-500/30 rounded-xl p-8 shadow-2xl shadow-green-500/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Pending Rewards</h2>
              <p className="text-sm text-gray-400">Ready to be claimed from the sacred vault</p>
            </div>
          </div>
          <button
            disabled={!isConnected || displayRewards === 0 || claimingRewards}
            onClick={handleClaimRewards}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center gap-2"
          >
            {claimingRewards ? (
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
        
        <div className="flex items-center">
          <div className="text-4xl font-black text-green-400 mr-4">
            {isConnected ? `${displayRewards.toLocaleString()} ARK` : `${displayRewards.toLocaleString()} ARK`}
          </div>
          {!isConnected && (
            <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg px-3 py-1">
              <span className="text-xs text-orange-300 font-medium">DEMO</span>
            </div>
          )}
        </div>
        
        {displayRewards > 0 && (
          <div className="mt-4 text-sm text-gray-400">
            💡 Rewards accumulate automatically from transaction fees distributed to locker participants
          </div>
        )}
      </div>

      {/* Active Locks Section */}
      <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8">
        <div className="flex items-center mb-6">
          <Lock className="w-8 h-8 text-cyan-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Your Sacred Locks</h2>
            <p className="text-sm text-gray-400">Ascend through divine tiers and earn multiplied rewards</p>
          </div>
        </div>
        
        {!isConnected ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              Connect your wallet to view your actual lock positions
            </div>
            <div className="text-sm text-gray-500">
              Below is a preview of what your dashboard would look like
            </div>
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
        ) : null}

        {displayLocks.length > 0 && (
          <div className="space-y-6">
            {displayLocks.map((lock) => {
              const now = Date.now() / 1000;
              const isUnlocked = now >= lock.unlockTime;
              const penalty = calculatePenalty ? calculatePenalty(lock.lockTime, lock.unlockTime, lock.amount) : { penalty: 0, userReceives: lock.amount };
              const daysLeft = Math.ceil((lock.unlockTime - now) / 86400);
              const totalDays = Math.ceil((lock.unlockTime - lock.lockTime) / 86400);
              const progress = Math.max(0, Math.min(100, ((now - lock.lockTime) / (lock.unlockTime - lock.lockTime)) * 100));
              
              return (
                <div key={lock.id} className={`bg-gradient-to-br ${getTierGradient(lock.tier)} border-2 rounded-xl p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
                  {/* Background glow effect */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-${getTierColor(lock.tier).replace('text-', '')}/20 to-transparent blur-2xl`}></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="text-3xl mr-3">{getTierIcon(lock.tier)}</div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {lock.amount.toLocaleString()} ARK
                          </div>
                          <div className={`text-lg font-bold ${getTierColor(lock.tier)} flex items-center`}>
                            <Crown className="w-4 h-4 mr-1" />
                            {lock.tier} Tier
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`flex items-center justify-end mb-2 ${isUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                          {isUnlocked ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm font-semibold">Ready to unlock</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm font-semibold">{daysLeft} days remaining</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center text-green-400">
                          <Award className="w-4 h-4 mr-1" />
                          <span className="text-sm font-bold">+{lock.totalRewards.toLocaleString()} ARK earned</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Lock Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isUnlocked 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                              : 'bg-gradient-to-r from-cyan-500 to-blue-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Started {Math.ceil((now - lock.lockTime) / 86400)} days ago</span>
                        <span>Total: {totalDays} days</span>
                      </div>
                    </div>
                    
                    {/* Early Unlock Warning */}
                    {!isUnlocked && penalty.penalty > 0 && (
                      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4">
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-red-400 mb-1">
                              Early Unlock Penalty Warning
                            </div>
                            <div className="text-xs text-gray-300 mb-2">
                              Unlocking before the timer expires will incur a penalty
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-red-400">Penalty: </span>
                                <span className="text-white font-semibold">{penalty.penalty.toFixed(2)} ARK</span>
                              </div>
                              <div>
                                <span className="text-gray-400">You receive: </span>
                                <span className="text-white font-semibold">{penalty.userReceives.toFixed(2)} ARK</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <button
                      onClick={() => handleUnlock(lock.id)}
                      disabled={processingUnlock === lock.id}
                      className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                        isUnlocked 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-black shadow-lg shadow-green-500/30' 
                          : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                      }`}
                    >
                      {processingUnlock === lock.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : isUnlocked ? (
                        <>
                          <Unlock className="w-4 h-4" />
                          Unlock Tokens
                        </>
                      ) : (
                        <>
                          <Flame className="w-4 h-4" />
                          Early Unlock (With Penalty)
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
        <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Pro Tips for Maximum Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start">
            <div className="text-cyan-400 mr-2">💎</div>
            <div>
              <div className="font-semibold text-cyan-300">Lock Longer</div>
              <div className="text-gray-400">Higher tiers get exponentially more rewards</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-green-400 mr-2">🔄</div>
            <div>
              <div className="font-semibold text-green-300">Compound Rewards</div>
              <div className="text-gray-400">Reinvest claimed rewards into new locks</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-yellow-400 mr-2">⏰</div>
            <div>
              <div className="font-semibold text-yellow-300">Be Patient</div>
              <div className="text-gray-400">Early unlocks significantly reduce your gains</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;