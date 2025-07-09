import React, { useState, useMemo } from 'react';
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
import { useLockerData } from '../../hooks/useLockerData';
import CompactLockPosition from './CompactLockPosition';
import LockPositionFilters, { FilterOptions } from './LockPositionFilters';
import { formatLargeNumber } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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

  const [processingClaim, setProcessingClaim] = useState(false);
  const [processingUnlock, setProcessingUnlock] = useState<number | null>(null);
  const [showWeightInfo, setShowWeightInfo] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    tier: 'all',
    status: 'all',
    timeRemaining: 'all',
    sortBy: 'timeRemaining',
    sortOrder: 'asc',
    searchTerm: ''
  });

  // Filter and sort logic
  const filteredAndSortedLocks = useMemo(() => {
    if (!userLocks.length) return [];

    let filtered = userLocks.filter(lock => {
      const now = Date.now() / 1000;
      const isUnlocked = now >= lock.unlockTime;
      const tierInfo = lockTiers[lock.tier] || lockTiers[0];

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!lock.amount.toString().includes(searchLower) && 
            !tierInfo.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Tier filter
      if (filters.tier !== 'all' && tierInfo.name.toLowerCase() !== filters.tier) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'ready' && !isUnlocked) return false;
        if (filters.status === 'soon' && (isUnlocked || lock.daysRemaining > 7)) return false;
        if (filters.status === 'active' && (isUnlocked || lock.daysRemaining <= 7)) return false;
      }

      // Time remaining filter
      if (filters.timeRemaining !== 'all') {
        if (filters.timeRemaining === 'ready' && !isUnlocked) return false;
        if (filters.timeRemaining === 'week' && (isUnlocked || lock.daysRemaining > 7)) return false;
        if (filters.timeRemaining === 'month' && (isUnlocked || lock.daysRemaining > 30)) return false;
        if (filters.timeRemaining === 'long' && (isUnlocked || lock.daysRemaining <= 30)) return false;
      }

      return true;
    });

    // Sort logic
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'tier':
          aValue = a.tier;
          bValue = b.tier;
          break;
        case 'rewards':
          aValue = a.totalRewardsEarned;
          bValue = b.totalRewardsEarned;
          break;
        case 'timeRemaining':
        default:
          aValue = a.daysRemaining;
          bValue = b.daysRemaining;
          break;
      }

      if (filters.sortOrder === 'desc') {
        return bValue - aValue;
      }
      return aValue - bValue;
    });

    return filtered;
  }, [userLocks, filters, lockTiers]);

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

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-orange-400 mr-3" />
            <h3 className="text-xl font-bold text-orange-400">Connect Wallet</h3>
          </div>
          <p className="text-center text-gray-300 mb-4">
            Connect your wallet to view your actual locker positions and stats.
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
            <h2 className="text-2xl font-bold">Your Locker Statistics</h2>
            <p className="text-sm text-gray-400">Complete overview of your ARK locking activity</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
            <Lock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {loading ? <span className="animate-pulse">...</span> : userStats.totalLocked.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Locked ARK</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-400 mb-1">
              {loading ? <span className="animate-pulse">...</span> : userStats.totalRewardsEarned.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Earned ARK</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {loading ? <span className="animate-pulse">...</span> : userStats.activeLocksCount}
            </div>
            <div className="text-sm text-gray-400">Active Positions</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent border border-yellow-500/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-8 h-8 text-yellow-400 mr-2" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-yellow-400/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Your influence in the reward pool. Higher = bigger share of weekly rewards. 
                      Calculated from: locked amount × time remaining × tier bonus
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {loading ? <span className="animate-pulse">...</span> : formatLargeNumber(userStats.userWeight)}
            </div>
            <div className="text-sm text-gray-400">Reward Power</div>
            <div className="text-xs text-yellow-400/60 mt-1">Your influence in the vault</div>
          </div>
        </div>

        {/* Reward Power Explanation */}
        <div className="mt-6">
          <button
            onClick={() => setShowWeightInfo(!showWeightInfo)}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Info className="w-4 h-4" />
            How does Reward Power work?
            <span className={`transform transition-transform ${showWeightInfo ? 'rotate-180' : ''}`}>
              ↓
            </span>
          </button>
          
          {showWeightInfo && (
            <div className="mt-4 bg-black/30 border border-cyan-500/20 rounded-lg p-4 text-sm">
              <div className="space-y-3">
                <div>
                  <div className="text-cyan-400 font-semibold mb-1">📊 Your Share Formula:</div>
                  <div className="text-gray-300">Your Rewards = (Your Power ÷ Total Power) × Weekly Distribution</div>
                </div>
                
                <div>
                  <div className="text-cyan-400 font-semibold mb-1">⚡ Power Calculation:</div>
                  <div className="text-gray-300">Locked Amount × Days Remaining × Tier Multiplier</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Example: 1,000 ARK × 365 days × 3x Diamond = 1.1M Power
                  </div>
                </div>
                
                <div>
                  <div className="text-cyan-400 font-semibold mb-1">📈 Maximize Your Power:</div>
                  <div className="text-gray-300">• Lock for higher tiers (Diamond = 8x Bronze rewards)</div>
                  <div className="text-gray-300">• Lock for longer periods</div>
                  <div className="text-gray-300">• Reinvest claimed rewards into new locks</div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                  <div className="text-yellow-400 font-semibold text-xs mb-1">⚠️ Important:</div>
                  <div className="text-gray-300 text-xs">
                    Your power decreases over time as lock periods expire. 
                    Power goes to zero when locks end.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Rewards */}
      <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-2 border-green-500/30 rounded-xl p-8 shadow-2xl shadow-green-500/10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Pending Vault Rewards</h2>
              <p className="text-sm text-gray-400 mt-1">
                From 2% locker fees + early unlock penalty distributions
              </p>
            </div>
          </div>
          <button
            onClick={handleClaimRewards}
            disabled={!isConnected || userStats.pendingRewards === 0 || loading || processingClaim}
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
            {loading ? <span className="animate-pulse">Loading...</span> :
             `${userStats.pendingRewards.toLocaleString()} ARK`}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
          <div className="text-sm text-gray-300">
            💡 <strong>Weight-based distribution:</strong> Your share is calculated based on your total weight score 
            ({userStats.userWeight.toFixed(0)}) relative to all active lockers in the SimplifiedLockerVault.
          </div>
        </div>
      </div>

      {/* Active Locks */}
      <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8">
        <div className="flex items-center mb-8">
          <Lock className="w-8 h-8 text-cyan-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Your Sacred Lock Positions</h2>
            <p className="text-sm text-gray-400">Manage your locked tokens and track earnings</p>
          </div>
        </div>
        
        {!isConnected ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              Connect your wallet to view your lock positions
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-400">Loading your positions from contract...</div>
          </div>
        ) : userLocks.length === 0 ? (
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
          <>
            {/* Filters */}
            <LockPositionFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalLocks={userLocks.length}
              filteredCount={filteredAndSortedLocks.length}
            />

            {/* Lock Positions */}
            <div className="space-y-4">
              {filteredAndSortedLocks.map((lock) => (
                <CompactLockPosition
                  key={lock.id}
                  lock={lock}
                  onUnlock={handleUnlock}
                  processingUnlock={processingUnlock}
                />
              ))}
              
              {filteredAndSortedLocks.length === 0 && userLocks.length > 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">No positions match your current filters</div>
                  <button 
                    onClick={() => setFilters({
                      tier: 'all',
                      status: 'all',
                      timeRemaining: 'all',
                      sortBy: 'timeRemaining',
                      sortOrder: 'asc',
                      searchTerm: ''
                    })}
                    className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Info className="w-6 h-6 text-purple-400 mr-3" />
          <h3 className="text-lg font-bold">Maximizing Your Rewards</h3>
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
