import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, NETWORKS } from '../utils/constants';

export interface LeaderboardUser {
  address: string;
  totalWeight: number;
  totalLocked: number;
  totalRewardsEarned: number;
  pendingRewards: number;
  activeLocksCount: number;
  rank: number;
  percentile: number;
}

type SortCriteria = 'weight' | 'locked' | 'rewards' | 'activeLocks';

export const useLeaderboardData = (limit: number = 50) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortCriteria>('locked');
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUserDetails = async (address: string, contract: ethers.Contract): Promise<LeaderboardUser | null> => {
    try {
      const [summary, pendingRewards] = await Promise.all([
        contract.getUserSummary(address),
        contract.pendingRewardsAll(address)
      ]);

      return {
        address,
        totalWeight: 0, // Will be derived from locked amount for sorting
        totalLocked: parseFloat(ethers.formatEther(summary._totalLocked)),
        totalRewardsEarned: parseFloat(ethers.formatEther(summary._totalRewardsEarned)),
        pendingRewards: parseFloat(ethers.formatEther(pendingRewards)),
        activeLocksCount: parseInt(summary._activeLocksCount.toString()),
        rank: 0,
        percentile: 0
      };
    } catch (err) {
      console.error(`Error fetching data for ${address}:`, err);
      return null;
    }
  };

  const fetchLeaderboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      // Use built-in getTopLockers() - returns top 100 by locked amount
      const topLockers = await contract.getTopLockers();
      
      console.log('Got', topLockers.length, 'top lockers from contract');

      // Filter out zero-amount entries
      const validLockers = topLockers.filter((l: any) => 
        l.locker !== ethers.ZeroAddress && BigInt(l.locked.toString()) > 0n
      );

      setTotalUsers(validLockers.length);

      // Fetch detailed data for each top locker in batches
      const batchSize = 10;
      const allUserData: LeaderboardUser[] = [];

      for (let i = 0; i < validLockers.length && i < limit; i += batchSize) {
        const batch = validLockers.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map((l: any) => fetchUserDetails(l.locker, contract))
        );
        
        const valid = batchResults.filter(Boolean) as LeaderboardUser[];
        // Set totalWeight from the contract's locked amount for consistent sorting
        valid.forEach((user, idx) => {
          user.totalWeight = parseFloat(ethers.formatEther(batch[idx].locked));
        });
        allUserData.push(...valid);

        if (i + batchSize < validLockers.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Sort based on selected criteria
      const sortedUsers = [...allUserData].sort((a, b) => {
        switch (sortBy) {
          case 'weight': return b.totalWeight - a.totalWeight;
          case 'locked': return b.totalLocked - a.totalLocked;
          case 'rewards': return b.totalRewardsEarned - a.totalRewardsEarned;
          case 'activeLocks': return b.activeLocksCount - a.activeLocksCount;
          default: return b.totalLocked - a.totalLocked;
        }
      });

      // Add rank and percentile
      const rankedUsers = sortedUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
        percentile: Math.round(((sortedUsers.length - index) / sortedUsers.length) * 100)
      }));

      setUsers(rankedUsers.slice(0, limit));
      console.log('Leaderboard updated with', rankedUsers.length, 'users');
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  }, [sortBy, limit]);

  const findUserRank = useCallback(async (userAddress: string) => {
    if (!userAddress) return null;

    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      const [summary, pendingRewards] = await Promise.all([
        contract.getUserSummary(userAddress),
        contract.pendingRewardsAll(userAddress)
      ]);

      const totalLocked = parseFloat(ethers.formatEther(summary._totalLocked));
      if (totalLocked === 0) return null;

      // Find rank among top lockers
      const topLockers = await contract.getTopLockers();
      const validLockers = topLockers.filter((l: any) => 
        l.locker !== ethers.ZeroAddress && BigInt(l.locked.toString()) > 0n
      );

      const userIndex = validLockers.findIndex((l: any) => 
        l.locker.toLowerCase() === userAddress.toLowerCase()
      );

      return {
        address: userAddress,
        totalWeight: totalLocked,
        totalLocked,
        totalRewardsEarned: parseFloat(ethers.formatEther(summary._totalRewardsEarned)),
        pendingRewards: parseFloat(ethers.formatEther(pendingRewards)),
        activeLocksCount: parseInt(summary._activeLocksCount.toString()),
        rank: userIndex >= 0 ? userIndex + 1 : validLockers.length + 1,
        percentile: userIndex >= 0 
          ? Math.round(((validLockers.length - userIndex) / validLockers.length) * 100) 
          : 0
      };
    } catch (err) {
      console.error('Error finding user rank:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchLeaderboardData();
  }, [sortBy]);

  return {
    users,
    loading,
    error,
    sortBy,
    setSortBy,
    totalUsers,
    refetch: fetchLeaderboardData,
    findUserRank
  };
};
