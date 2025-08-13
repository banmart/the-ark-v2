
import React, { useState } from 'react';
import { 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  Award
} from 'lucide-react';
import { useLockerData } from '../../hooks/useLockerData';
import { useLockerContractData } from '../../hooks/useLockerContractData';
import { formatPercentage } from '../../lib/utils';
import CompactLockPosition from './CompactLockPosition';
import PenaltyCalculatorCard from './PenaltyCalculatorCard';
import LockPositionFilters, { FilterOptions } from './LockPositionFilters';
import { toast } from "@/components/ui/use-toast";

interface EnhancedUserDashboardProps {
  isConnected: boolean;
}

const EnhancedUserDashboard = ({ isConnected }: EnhancedUserDashboardProps) => {
  const { userLocks, unlockTokens } = useLockerData();
  const { earlyUnlockSettings } = useLockerContractData();
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

      {/* Enhanced Lock Positions */}
      <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mr-3" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Lock Positions</h2>
                <p className="text-sm text-gray-400">
                  Enhanced with real-time penalty calculations
                </p>
              </div>
            </div>
            
            {/* Early Unlock Status */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border self-start sm:self-auto ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
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
