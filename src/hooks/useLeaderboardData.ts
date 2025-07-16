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
  const [sortBy, setSortBy] = useState<SortCriteria>('weight');
  const [totalUsers, setTotalUsers] = useState(0);

  // Cache for user addresses to avoid refetching events every time
  const [userAddresses, setUserAddresses] = useState<string[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchUserAddresses = useCallback(async () => {
    // Only refetch if more than 5 minutes have passed
    const now = Date.now();
    if (userAddresses.length > 0 && now - lastFetchTime < 5 * 60 * 1000) {
      return userAddresses;
    }

    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      // Get current block number
      const currentBlock = await provider.getBlockNumber();
      
      // Calculate blocks to go back (roughly 30 days - assuming 3 second blocks)
      const blocksPerDay = Math.floor(24 * 60 * 60 / 3);
      const fromBlock = Math.max(0, currentBlock - (30 * blocksPerDay));

      console.log('Fetching TokensLocked events from block', fromBlock, 'to', currentBlock);

      // Get all TokensLocked events to find unique users
      const filter = contract.filters.TokensLocked();
      const events = await contract.queryFilter(filter, fromBlock, currentBlock);

      console.log('Found', events.length, 'TokensLocked events');

      // Extract unique user addresses
      const addresses = [...new Set(events.map(event => {
        // Check if this is an EventLog (has args) vs a Log (no args)
        if ('args' in event && event.args) {
          return event.args[0];
        }
        return null;
      }).filter(Boolean))];
      
      console.log('Found', addresses.length, 'unique users');

      setUserAddresses(addresses);
      setLastFetchTime(now);
      return addresses;
    } catch (err: any) {
      console.error('Error fetching user addresses:', err);
      throw new Error('Failed to fetch user addresses from blockchain events');
    }
  }, [userAddresses, lastFetchTime]);

  const fetchUserData = async (address: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      const [userStatsData, weight] = await Promise.all([
        contract.userStats(address),
        contract.calculateUserWeight(address)
      ]);

      return {
        address,
        totalWeight: parseFloat(ethers.formatEther(weight)),
        totalLocked: parseFloat(ethers.formatEther(userStatsData.totalLocked)),
        totalRewardsEarned: parseFloat(ethers.formatEther(userStatsData.totalRewardsEarned)),
        pendingRewards: parseFloat(ethers.formatEther(userStatsData.pendingRewards)),
        activeLocksCount: parseInt(userStatsData.activeLocksCount.toString()),
        rank: 0, // Will be set after sorting
        percentile: 0 // Will be calculated after sorting
      };
    } catch (err) {
      console.error(`Error fetching data for user ${address}:`, err);
      return null;
    }
  };

  const fetchLeaderboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching leaderboard data...');
      
      // Get user addresses
      const addresses = await fetchUserAddresses();
      setTotalUsers(addresses.length);

      // Fetch data for all users in batches to avoid overwhelming the RPC
      const batchSize = 10;
      const allUserData: LeaderboardUser[] = [];

      for (let i = 0; i < addresses.length; i += batchSize) {
        const batch = addresses.slice(i, i + batchSize);
        const batchPromises = batch.map(address => fetchUserData(address));
        const batchResults = await Promise.all(batchPromises);
        
        // Filter out null results and add to main array
        const validResults = batchResults.filter(Boolean) as LeaderboardUser[];
        allUserData.push(...validResults);

        // Small delay between batches to be respectful to RPC
        if (i + batchSize < addresses.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log('Fetched data for', allUserData.length, 'users');

      // Filter out users with no activity (0 weight and 0 locked)
      const activeUsers = allUserData.filter(user => 
        user.totalWeight > 0 || user.totalLocked > 0 || user.activeLocksCount > 0
      );

      // Sort users based on selected criteria
      const sortedUsers = [...activeUsers].sort((a, b) => {
        switch (sortBy) {
          case 'weight':
            return b.totalWeight - a.totalWeight;
          case 'locked':
            return b.totalLocked - a.totalLocked;
          case 'rewards':
            return b.totalRewardsEarned - a.totalRewardsEarned;
          case 'activeLocks':
            return b.activeLocksCount - a.activeLocksCount;
          default:
            return b.totalWeight - a.totalWeight;
        }
      });

      // Add rank and percentile
      const rankedUsers = sortedUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
        percentile: Math.round(((sortedUsers.length - index) / sortedUsers.length) * 100)
      }));

      // Take only the requested limit
      const limitedUsers = rankedUsers.slice(0, limit);

      setUsers(limitedUsers);
      console.log('Leaderboard updated with', limitedUsers.length, 'users');

    } catch (err: any) {
      console.error('Error fetching leaderboard data:', err);
      setError(err.message || 'Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  }, [fetchUserAddresses, sortBy, limit]);

  const findUserRank = useCallback(async (userAddress: string) => {
    if (!userAddress) return null;

    try {
      const addresses = await fetchUserAddresses();
      const allUserData: LeaderboardUser[] = [];

      // Fetch data for all users (same as fetchLeaderboardData but without limit)
      const batchSize = 10;
      for (let i = 0; i < addresses.length; i += batchSize) {
        const batch = addresses.slice(i, i + batchSize);
        const batchPromises = batch.map(address => fetchUserData(address));
        const batchResults = await Promise.all(batchPromises);
        
        const validResults = batchResults.filter(Boolean) as LeaderboardUser[];
        allUserData.push(...validResults);

        if (i + batchSize < addresses.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const activeUsers = allUserData.filter(user => 
        user.totalWeight > 0 || user.totalLocked > 0 || user.activeLocksCount > 0
      );

      const sortedUsers = [...activeUsers].sort((a, b) => {
        switch (sortBy) {
          case 'weight':
            return b.totalWeight - a.totalWeight;
          case 'locked':
            return b.totalLocked - a.totalLocked;
          case 'rewards':
            return b.totalRewardsEarned - a.totalRewardsEarned;
          case 'activeLocks':
            return b.activeLocksCount - a.activeLocksCount;
          default:
            return b.totalWeight - a.totalWeight;
        }
      });

      const userIndex = sortedUsers.findIndex(user => 
        user.address.toLowerCase() === userAddress.toLowerCase()
      );

      if (userIndex === -1) return null;

      return {
        ...sortedUsers[userIndex],
        rank: userIndex + 1,
        percentile: Math.round(((sortedUsers.length - userIndex) / sortedUsers.length) * 100)
      };

    } catch (err) {
      console.error('Error finding user rank:', err);
      return null;
    }
  }, [fetchUserAddresses, sortBy]);

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