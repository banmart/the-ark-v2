
import React, { useState } from 'react';
import { 
  Wallet, 
  Gift, 
  Lock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Coins,
  Award,
  BarChart3,
  Calculator,
  Info
} from 'lucide-react';
import { useLockerData } from '../../hooks/useLockerData';
import { useLockerContractData } from '../../hooks/useLockerContractData';
import CompactLockPosition from './CompactLockPosition';
import PenaltyCalculatorCard from './PenaltyCalculatorCard';
import LockPositionFilters, { FilterOptions } from './LockPositionFilters';
import { toast } from "@/components/ui/use-toast";

interface EnhancedUserDashboardProps {
  isConnected: boolean;
}

const EnhancedUserDashboard = ({ isConnected }: EnhancedUserDashboardProps) => {
  const { userStats, userLocks, unlockTokens, claimRewards } = useLockerData();
  const { protocolStats, earlyUnlockSettings } = useLockerContractData();
  const [claimingRewards, setClaimingRewards] = useState(false);
  const [processingUnlock, setProcessingUnlock] = useState<number | null>(null);
  const [selectedLockForPenalty, setSelectedLockForPenalty] = useState<number | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    tier: 'all',
    status: 'all',
    timeRemaining: 'all',
    sortBy: 'timeRemaining',
    sortOrder: 'asc',
    searchTerm: ''
  });

  // Mock data for demonstration when not connected
  const mockLocks = [
    {
      id: 1,
      amount: 50000,
      lockTime: Date.now() / 1000 - (86400 * 45),
      unlockTime: Date.now() / 1000 + (86400 * 45),
      lockPeriod: 86400 * 90,
      tier: 0,
      tierName: 'Bronze',
      totalRewardsEarned: 2500,
      active: true,
      multiplier: '1.0x',
      daysRemaining: 45
    },
    {
      id: 2,
      amount: 100000,
      lockTime: Date.now() / 1000 - (86400 * 120),
      unlockTime: Date.now() / 1000 + (86400 * 60),
      lockPeriod: 86400 * 180,
      tier: 1,
      tierName: 'Silver',
      totalRewardsEarned: 8750,
      active: true,
      multiplier: '1.5x',
      daysRemaining: 60
    }
  ];

  const displayLocks = isConnected ? userLocks : mockLocks;
  const displayRewards = isConnected ? userStats.pendingRewards : 12847;
  
  // Filter and sort locks
  const getFilteredAndSortedLocks = () => {
    let filtered = displayLocks.filter(lock => {
      // Tier filter
      if (filters.tier !== 'all') {
        const tierNames = {
          'bronze': 'Bronze',
          'silver': 'Silver', 
          'gold': 'Gold',
          'diamond': 'Diamond',
          'platinum': 'Platinum',
          'legendary': 'Legendary'
        };
        if (lock.tierName !== tierNames[filters.tier as keyof typeof tierNames]) return false;
      }

      // Status filter
      if (filters.status !== 'all') {
        const now = Date.now() / 1000;
        const daysUntilUnlock = (lock.unlockTime - now) / (24 * 60 * 60);
        
        if (filters.status === 'ready' && daysUntilUnlock > 0) return false;
        if (filters.status === 'soon' && (daysUntilUnlock <= 0 || daysUntilUnlock > 7)) return false;
        if (filters.status === 'active' && daysUntilUnlock <= 0) return false;
      }

      // Time remaining filter
      if (filters.timeRemaining !== 'all') {
        const now = Date.now() / 1000;
        const daysUntilUnlock = (lock.unlockTime - now) / (24 * 60 * 60);
        
        if (filters.timeRemaining === 'ready' && daysUntilUnlock > 0) return false;
        if (filters.timeRemaining === 'week' && (daysUntilUnlock <= 0 || daysUntilUnlock > 7)) return false;
        if (filters.timeRemaining === 'month' && (daysUntilUnlock <= 0 || daysUntilUnlock > 30)) return false;
        if (filters.timeRemaining === 'long' && daysUntilUnlock <= 30) return false;
      }

      // Search filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesAmount = lock.amount.toString().includes(searchTerm);
        const matchesTier = lock.tierName.toLowerCase().includes(searchTerm);
        if (!matchesAmount && !matchesTier) return false;
      }

      return true;
    });

    // Sort
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
          aValue = a.unlockTime;
          bValue = b.unlockTime;
          break;
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredLocks = getFilteredAndSortedLocks();
  
  const displayStats = isConnected ? userStats : {
    totalLocked: 150000,
    totalRewardsEarned: 23500,
    pendingRewards: 12847,
    activeLocksCount: 2,
    userWeight: 85000
  };

  const handleClaimRewards = async () => {
    if (!isConnected) return;
    
    setClaimingRewards(true);
    try {
      await claimRewards();
      toast({
        title: "Success!",
        description: `Successfully claimed ${displayRewards.toLocaleString()} ARK rewards`,
      });
    } catch (error: any) {
      console.error('Claim failed:', error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to claim rewards"
      });
    } finally {
      setClaimingRewards(false);
    }
  };

  const handleUnlock = async (lockId: number) => {
    if (!isConnected) return;
    
    setProcessingUnlock(lockId);
    try {
      await unlockTokens(lockId);
      toast({
        title: "Success!",
        description: "Successfully unlocked tokens",
      });
    } catch (error: any) {
      console.error('Unlock failed:', error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to unlock tokens"
      });
    } finally {
      setProcessingUnlock(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-orange-400 mr-3" />
            <h3 className="text-xl font-bold text-orange-400">Demo Mode</h3>
          </div>
          <p className="text-center text-gray-300 mb-4">
            Connect your wallet to view your actual positions and claim real rewards
          </p>
        </div>
      )}

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <Gift className="w-8 h-8 text-cyan-400" />
            <div className="text-right">
              <div className="text-sm text-gray-400">Pending Rewards</div>
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
                {displayStats.totalLocked.toLocaleString()}
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
                {displayStats.totalRewardsEarned.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">ARK</div>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-sm text-gray-400">User Weight</div>
              <div className="text-xl font-bold text-purple-300">
                {displayStats.userWeight.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Weight</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Rewards Section */}
      <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-2 border-green-500/30 rounded-xl p-8 shadow-2xl shadow-green-500/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-green-400">Pending Rewards</h2>
              <p className="text-sm text-gray-400">
                From protocol fees • Pool: {protocolStats.rewardPool.toLocaleString()} ARK
              </p>
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
            {displayRewards.toLocaleString()} ARK
          </div>
          {!isConnected && (
            <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg px-3 py-1">
              <span className="text-xs text-orange-300 font-medium">DEMO</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Lock Positions */}
      <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Lock className="w-8 h-8 text-cyan-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-cyan-400">Lock Positions</h2>
              <p className="text-sm text-gray-400">
                Enhanced with real-time penalty calculations
              </p>
            </div>
          </div>
          
          {/* Early Unlock Status */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
            earlyUnlockSettings.enabled
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
              : 'bg-red-500/20 border-red-500/50 text-red-400'
          }`}>
            {earlyUnlockSettings.enabled ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-semibold">
              Early Unlock {earlyUnlockSettings.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
        
        {/* Lock Position Filters */}
        {displayLocks.length > 0 && (
          <LockPositionFilters
            filters={filters}
            onFiltersChange={setFilters}
            totalLocks={displayLocks.length}
            filteredCount={filteredLocks.length}
          />
        )}
        
        {filteredLocks.length === 0 && displayLocks.length > 0 ? (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              No locks match your filters
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Try adjusting your filter criteria
            </div>
          </div>
        ) : displayLocks.length === 0 ? (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              No active locks found
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Lock some tokens to start earning multiplied rewards
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLocks.map((lock) => (
              <div key={lock.id} className="space-y-4">
                <CompactLockPosition
                  lock={lock}
                  onUnlock={handleUnlock}
                  processingUnlock={processingUnlock}
                />
                
                {/* Penalty Calculator for locks with time remaining */}
                {lock.daysRemaining > 0 && (
                  <div className="ml-6">
                    <PenaltyCalculatorCard
                      lockAmount={lock.amount}
                      lockTimeRemaining={lock.daysRemaining * 24 * 60 * 60}
                      totalLockDuration={lock.lockPeriod}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Tips Section */}
      <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Enhanced Features & Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start">
            <div className="text-cyan-400 mr-2">🧮</div>
            <div>
              <div className="font-semibold text-cyan-300">Real-time Penalties</div>
              <div className="text-gray-400">Live penalty calculations from contract</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-green-400 mr-2">🔄</div>
            <div>
              <div className="font-semibold text-green-300">Instant Updates</div>
              <div className="text-gray-400">Contract state syncs automatically</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-yellow-400 mr-2">⚡</div>
            <div>
              <div className="font-semibold text-yellow-300">Enhanced Rewards</div>
              <div className="text-gray-400">Penalty redistribution to active lockers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserDashboard;
