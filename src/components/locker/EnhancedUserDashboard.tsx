import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, CheckCircle, Award } from 'lucide-react';
import { useLockerData } from '../../hooks/useLockerData';
import { useLockerContractData } from '../../hooks/useLockerContractData';
import { formatPercentage } from '../../lib/utils';
import CompactLockPosition from './CompactLockPosition';
import PenaltyCalculatorCard from './PenaltyCalculatorCard';
import LockPositionFilters, { FilterOptions } from './LockPositionFilters';
import { toast } from "@/components/ui/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface EnhancedUserDashboardProps {
  isConnected: boolean;
}
const EnhancedUserDashboard = ({
  isConnected
}: EnhancedUserDashboardProps) => {
  const {
    userLocks,
    unlockTokens
  } = useLockerData();
  const {
    earlyUnlockSettings
  } = useLockerContractData();
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Mock data for demonstration when not connected
  const mockLocks = [{
    id: 1,
    amount: 50000,
    lockTime: Date.now() / 1000 - 86400 * 45,
    unlockTime: Date.now() / 1000 + 86400 * 45,
    lockPeriod: 86400 * 90,
    tier: 0,
    tierName: 'Bronze',
    totalRewardsEarned: 2500,
    active: true,
    multiplier: '1.0x',
    daysRemaining: 45
  }, {
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
  }];
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

  // Pagination logic
  const totalPages = Math.ceil(filteredLocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLocks = filteredLocks.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // Page navigation handlers
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
  return <div className="space-y-8">

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
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border self-start sm:self-auto ${earlyUnlockSettings.enabled ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
              {earlyUnlockSettings.enabled ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              <span className="text-sm font-semibold">
                Early Unlock {earlyUnlockSettings.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        
        {/* Lock Position Filters */}
        {displayLocks.length > 0 && <LockPositionFilters filters={filters} onFiltersChange={setFilters} totalLocks={displayLocks.length} filteredCount={filteredLocks.length} />}
        
        {filteredLocks.length === 0 && displayLocks.length > 0 ? <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              No locks match your filters
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Try adjusting your filter criteria
            </div>
          </div> : displayLocks.length === 0 ? <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              No active locks found
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Lock some tokens to start earning multiplied rewards
            </div>
          </div> : <>
            {/* Pagination Info and Per-Page Selector */}
            {filteredLocks.length > 0 && <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredLocks.length)} of {filteredLocks.length} positions
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Per page:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-20 h-8 bg-black/40 border-cyan-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>}

            {/* Lock Positions */}
            <div className="space-y-4">
              {paginatedLocks.map(lock => <div key={lock.id} className="space-y-4">
                  <CompactLockPosition lock={lock} onUnlock={handleUnlock} processingUnlock={processingUnlock} />
                  
                  {/* Penalty Calculator for locks with time remaining */}
                  {lock.daysRemaining > 0 && <div className="ml-6">
                      <PenaltyCalculatorCard lockAmount={lock.amount} lockTimeRemaining={lock.daysRemaining * 24 * 60 * 60} totalLockDuration={lock.lockPeriod} />
                    </div>}
                </div>)}
            </div>

            {/* Pagination Controls */}
            {filteredLocks.length > itemsPerPage && <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={e => {
                  e.preventDefault();
                  goToPage(currentPage - 1);
                }} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                    </PaginationItem>
                    
                    {/* Page Numbers */}
                    {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                        <PaginationLink href="#" onClick={e => {
                  e.preventDefault();
                  goToPage(page);
                }} isActive={currentPage === page} className="bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-500/20">
                          {page}
                        </PaginationLink>
                      </PaginationItem>)}
                    
                    <PaginationItem>
                      <PaginationNext href="#" onClick={e => {
                  e.preventDefault();
                  goToPage(currentPage + 1);
                }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>}
          </>}
      </div>

      {/* Enhanced Tips Section */}
      
    </div>;
};
export default EnhancedUserDashboard;