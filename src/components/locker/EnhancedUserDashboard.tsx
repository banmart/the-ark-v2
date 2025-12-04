import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { useLockerData } from '../../hooks/useLockerData';
import { useLockerContractData } from '../../hooks/useLockerContractData';
import CompactLockPosition from './CompactLockPosition';
import PenaltyCalculatorCard from './PenaltyCalculatorCard';
import LockPositionFilters, { FilterOptions } from './LockPositionFilters';
import { toast } from "@/components/ui/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnhancedUserDashboardProps {
  isConnected: boolean;
}

const EnhancedUserDashboard = ({ isConnected }: EnhancedUserDashboardProps) => {
  const { userLocks, unlockTokens } = useLockerData();
  const { earlyUnlockSettings } = useLockerContractData();
  const [processingUnlock, setProcessingUnlock] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    tier: 'all',
    status: 'all',
    timeRemaining: 'all',
    sortBy: 'timeRemaining',
    sortOrder: 'asc',
    searchTerm: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Mock data for demonstration when not connected
  const mockLocks = [
    {
      id: 1,
      amount: 50000,
      lockTime: Date.now() / 1000 - 86400 * 45,
      unlockTime: Date.now() / 1000 - 86400 * 2, // FINISHED - ready to unlock
      lockPeriod: 86400 * 90,
      tier: 0,
      tierName: 'Bronze',
      totalRewardsEarned: 2500,
      active: true,
      multiplier: '1.0x',
      daysRemaining: 0
    },
    {
      id: 2,
      amount: 100000,
      lockTime: Date.now() / 1000 - 86400 * 120,
      unlockTime: Date.now() / 1000 + 86400 * 60,
      lockPeriod: 86400 * 180,
      tier: 1,
      tierName: 'Silver',
      totalRewardsEarned: 8750,
      active: true,
      multiplier: '1.5x',
      daysRemaining: 60
    },
    {
      id: 3,
      amount: 75000,
      lockTime: Date.now() / 1000 - 86400 * 80,
      unlockTime: Date.now() / 1000 + 86400 * 3,
      lockPeriod: 86400 * 90,
      tier: 0,
      tierName: 'Bronze',
      totalRewardsEarned: 4200,
      active: true,
      multiplier: '1.0x',
      daysRemaining: 3
    }
  ];

  // Use real data when connected, include all active locks regardless of unlock status
  const displayLocks = isConnected ? userLocks : mockLocks;

  // Filter and sort locks - Show ALL locks without restrictions
  const getFilteredAndSortedLocks = () => {
    let filtered = displayLocks.filter(lock => {
      // IMPORTANT: Show ALL locks - both active and withdrawn positions
      // No restriction on lock.active status - users should see their full history

      const now = Date.now() / 1000;
      const daysUntilUnlock = (lock.unlockTime - now) / (24 * 60 * 60);

      // Tier filter
      if (filters.tier !== 'all') {
        const tierNames: Record<string, string> = {
          'bronze': 'Bronze',
          'silver': 'Silver',
          'gold': 'Gold',
          'diamond': 'Diamond',
          'platinum': 'Platinum',
          'legendary': 'Legendary'
        };
        if (lock.tierName !== tierNames[filters.tier]) return false;
      }

      // Status filter - FIX: correctly categorize finished locks
      if (filters.status !== 'all') {
        if (filters.status === 'ready' && daysUntilUnlock > 0) return false;
        if (filters.status === 'soon' && (daysUntilUnlock <= 0 || daysUntilUnlock > 7)) return false;
        if (filters.status === 'active' && daysUntilUnlock <= 7) return false;
      }

      // Time remaining filter - FIX: include ready locks in 'ready' filter
      if (filters.timeRemaining !== 'all') {
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

    // Sort - prioritize ready-to-unlock locks
    filtered.sort((a, b) => {
      const now = Date.now() / 1000;
      const aReady = a.unlockTime <= now;
      const bReady = b.unlockTime <= now;
      
      // Always show ready-to-unlock locks first
      if (aReady && !bReady) return -1;
      if (!aReady && bReady) return 1;

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

  // Count ready-to-unlock positions
  const readyToUnlockCount = displayLocks.filter(lock => {
    const now = Date.now() / 1000;
    return lock.active && lock.unlockTime <= now;
  }).length;

  const totalPages = Math.ceil(filteredLocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLocks = filteredLocks.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleUnlock = async (lockId: number) => {
    if (!isConnected) return;
    setProcessingUnlock(lockId);
    try {
      await unlockTokens(lockId);
      toast({
        title: "Success!",
        description: "Successfully unlocked tokens"
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
      {/* Premium Lock Positions Container */}
      <div className="relative group">
        {/* Outer glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-sm opacity-60"></div>
        
        {/* Card */}
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-8 overflow-hidden">
          {/* Inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400/30 rounded-xl blur-lg"></div>
                  <div className="relative p-3 bg-cyan-500/10 border border-cyan-500/40 rounded-xl">
                    <Lock className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    Lock Positions
                    <Sparkles className="w-5 h-5 text-cyan-400/60" />
                  </h2>
                  <p className="text-sm text-gray-400">
                    Real-time penalty calculations
                  </p>
                </div>
              </div>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {readyToUnlockCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/40 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">
                      {readyToUnlockCount} Ready to Unlock
                    </span>
                  </div>
                )}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                  earlyUnlockSettings.enabled 
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400' 
                    : 'bg-gray-500/10 border-gray-500/40 text-gray-400'
                }`}>
                  {earlyUnlockSettings.enabled ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  <span className="text-sm font-semibold">
                    Early Unlock {earlyUnlockSettings.enabled ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>
          
            {/* Filters */}
            {displayLocks.length > 0 && (
              <LockPositionFilters 
                filters={filters} 
                onFiltersChange={setFilters} 
                totalLocks={displayLocks.length} 
                filteredCount={filteredLocks.length} 
              />
            )}
            
            {/* Content */}
            {filteredLocks.length === 0 && displayLocks.length > 0 ? (
              <div className="text-center py-12">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gray-500/20 rounded-full blur-xl"></div>
                  <div className="relative p-4 bg-gray-500/10 border border-gray-500/30 rounded-full">
                    <Lock className="w-12 h-12 text-gray-500" />
                  </div>
                </div>
                <div className="text-gray-400 mb-2 text-lg">No locks match your filters</div>
                <div className="text-sm text-gray-500">Try adjusting your filter criteria</div>
              </div>
            ) : displayLocks.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
                  <div className="relative p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                    <Lock className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <div className="text-gray-400 mb-2 text-lg">No active locks found</div>
                <div className="text-sm text-gray-500">Lock some tokens to start earning multiplied rewards</div>
              </div>
            ) : (
              <>
                {/* Pagination Info */}
                {filteredLocks.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="text-sm text-gray-400">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredLocks.length)} of {filteredLocks.length} positions
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Per page:</span>
                      <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-20 h-8 bg-black/60 border-white/[0.1] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/[0.1]">
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Lock Positions */}
                <div className="space-y-4">
                  {paginatedLocks.map(lock => (
                    <div key={lock.id} className="space-y-4">
                      <CompactLockPosition 
                        lock={lock} 
                        onUnlock={handleUnlock} 
                        processingUnlock={processingUnlock} 
                      />
                      
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

                {/* Pagination Controls */}
                {filteredLocks.length > itemsPerPage && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={e => { e.preventDefault(); goToPage(currentPage - 1); }}
                            className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} bg-black/40 border-white/[0.1] text-white hover:bg-white/[0.1]`}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              href="#" 
                              onClick={e => { e.preventDefault(); goToPage(page); }}
                              isActive={currentPage === page}
                              className={`bg-black/40 border-white/[0.1] text-white hover:bg-cyan-500/20 ${currentPage === page ? 'bg-cyan-500/20 border-cyan-500/40' : ''}`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={e => { e.preventDefault(); goToPage(currentPage + 1); }}
                            className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} bg-black/40 border-white/[0.1] text-white hover:bg-white/[0.1]`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserDashboard;
