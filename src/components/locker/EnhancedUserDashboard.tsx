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
  const { userLocks, unlockTokens, claimRewardsForLocks } = useLockerData();
  const { earlyUnlockSettings } = useLockerContractData();
  const [processingUnlock, setProcessingUnlock] = useState<number | null>(null);
  const [processingClaim, setProcessingClaim] = useState<number | null>(null);

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
      tierName: 'Initiate',
      totalRewardsEarned: 2500,
      active: true,
      multiplier: '1.2x',
      daysRemaining: 0
    },
    {
      id: 2,
      amount: 100000,
      lockTime: Date.now() / 1000 - 86400 * 120,
      unlockTime: Date.now() / 1000 + 86400 * 60,
      lockPeriod: 86400 * 180,
      tier: 1,
      tierName: 'Acolyte',
      totalRewardsEarned: 8750,
      active: true,
      multiplier: '2.0x',
      daysRemaining: 60
    },
    {
      id: 3,
      amount: 75000,
      lockTime: Date.now() / 1000 - 86400 * 80,
      unlockTime: Date.now() / 1000 + 86400 * 3,
      lockPeriod: 86400 * 90,
      tier: 0,
      tierName: 'Initiate',
      totalRewardsEarned: 4200,
      active: true,
      multiplier: '1.2x',
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
          'initiate': 'Initiate',
          'acolyte': 'Acolyte',
          'warden': 'Warden',
          'sentinel': 'Sentinel',
          'arch-keeper': 'Arch-Keeper'
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

  const handleClaimForLock = async (lockId: number) => {
    if (!isConnected) return;
    setProcessingClaim(lockId);
    try {
      await claimRewardsForLocks([lockId]);
      toast({
        title: "Rewards Claimed!",
        description: `Successfully claimed rewards for position #${lockId}`
      });
    } catch (error: any) {
      console.error('Claim failed:', error);
      toast({
        variant: "destructive",
        title: "Claim Failed",
        description: error.message || "Failed to claim rewards"
      });
    } finally {
      setProcessingClaim(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Premium Lock Positions Container */}
      <div className="relative group">
        <div className="relative liquid-glass border border-white/10 rounded-2xl p-8 md:p-12 transition-all duration-500 overflow-hidden backdrop-blur-3xl">
          {/* Inner ambient light */}
          <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="relative p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                  <Lock className="w-6 h-6 text-white/40" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">COVENANT SEALS</h2>
                  <p className="text-[10px] text-white/20 font-mono tracking-[0.2em] uppercase">[MANAGEMENT HUB]</p>
                </div>
              </div>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-4">
                {readyToUnlockCount > 0 && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/20 rounded-xl">
                    <CheckCircle className="w-3 h-3 text-white/60" />
                    <span className="text-[10px] font-black font-mono text-white/60 tracking-widest uppercase">
                      {readyToUnlockCount} SEALS READY
                    </span>
                  </div>
                )}
                <div className={`flex items-center gap-2 px-6 py-2 rounded-xl border font-mono text-[10px] font-black tracking-widest uppercase bg-white/5 border-white/10 text-white/20`}>
                  EARLY_BREAK: {earlyUnlockSettings.enabled ? 'PERMITTED' : 'FORBIDDEN'}
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
                        <SelectTrigger className="w-20 h-8 bg-muted border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
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
                        onClaim={handleClaimForLock}
                        processingUnlock={processingUnlock}
                        processingClaim={processingClaim}
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
