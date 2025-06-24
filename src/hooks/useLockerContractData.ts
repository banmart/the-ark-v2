
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, LOCKER_VAULT_ABI, LOCKER_VAULT_ADDRESS, NETWORKS } from '../utils/constants';

interface ProtocolStats {
  totalLockedTokens: number;
  totalRewardsDistributed: number;
  totalActiveLockers: number;
}

interface UserStats {
  totalLocked: number;
  totalRewardsEarned: number;
  pendingRewards: number;
  activeLocksCount: number;
}

interface LockPosition {
  id: number;
  amount: number;
  lockTime: number;
  unlockTime: number;
  lockPeriod: number;
  tier: number;
  totalRewardsEarned: number;
  active: boolean;
}

export const useLockerContractData = (userAddress?: string) => {
  const [protocolStats, setProtocolStats] = useState<ProtocolStats>({
    totalLockedTokens: 0,
    totalRewardsDistributed: 0,
    totalActiveLockers: 0
  });

  const [userStats, setUserStats] = useState<UserStats>({
    totalLocked: 0,
    totalRewardsEarned: 0,
    pendingRewards: 0,
    activeLocksCount: 0
  });

  const [userLocks, setUserLocks] = useState<LockPosition[]>([]);
  const [userWeight, setUserWeight] = useState(0);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [contractPaused, setContractPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionHealth, setConnectionHealth] = useState<'healthy' | 'degraded' | 'offline'>('offline');

  const fetchProtocolStats = async () => {
    try {
      console.log('🔄 Fetching live protocol stats from blockchain...');
      
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      
      // Test connection health
      const blockNumber = await provider.getBlockNumber();
      console.log('✅ Connected to blockchain, current block:', blockNumber);
      setConnectionHealth('healthy');
      
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      // Fetch all data in parallel with retry logic
      const fetchWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
        for (let i = 0; i < retries; i++) {
          try {
            return await fn();
          } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`Retry ${i + 1} for contract call...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      };

      const [totalLocked, totalRewards, totalLockers, emergency, paused] = await Promise.all([
        fetchWithRetry(() => contract.totalLockedTokens()),
        fetchWithRetry(() => contract.totalRewardsDistributed()),
        fetchWithRetry(() => contract.totalActiveLockers()),
        fetchWithRetry(() => contract.emergencyMode()),
        fetchWithRetry(() => contract.paused())
      ]);

      // Convert from wei to tokens (18 decimals)
      const totalLockedTokens = parseFloat(ethers.formatEther(totalLocked));
      const totalRewardsDistributed = parseFloat(ethers.formatEther(totalRewards));
      const totalActiveLockers = parseInt(totalLockers.toString());

      setProtocolStats({
        totalLockedTokens,
        totalRewardsDistributed,
        totalActiveLockers
      });

      setEmergencyMode(emergency);
      setContractPaused(paused);

      console.log('✅ Live protocol stats updated:', {
        totalLockedTokens: totalLockedTokens.toLocaleString(),
        totalRewardsDistributed: totalRewardsDistributed.toLocaleString(),
        totalActiveLockers,
        emergency,
        paused,
        blockNumber
      });

    } catch (err: any) {
      console.error('❌ Error fetching live protocol stats:', err);
      setError(err.message || 'Failed to fetch protocol stats');
      setConnectionHealth('degraded');
    }
  };

  const fetchUserData = async (address: string) => {
    try {
      console.log('🔄 Fetching live user data for:', address);
      
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      // Fetch user data with retry logic
      const fetchWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
        for (let i = 0; i < retries; i++) {
          try {
            return await fn();
          } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`Retry ${i + 1} for user data call...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      };

      const [userStatsData, userLocksData, weight] = await Promise.all([
        fetchWithRetry(() => contract.userStats(address)),
        fetchWithRetry(() => contract.getUserActiveLocks(address)),
        fetchWithRetry(() => contract.calculateUserWeight(address))
      ]);

      // Parse user stats
      const totalLocked = parseFloat(ethers.formatEther(userStatsData.totalLocked));
      const totalRewardsEarned = parseFloat(ethers.formatEther(userStatsData.totalRewardsEarned));
      const pendingRewards = parseFloat(ethers.formatEther(userStatsData.pendingRewards));
      const activeLocksCount = parseInt(userStatsData.activeLocksCount.toString());

      setUserStats({
        totalLocked,
        totalRewardsEarned,
        pendingRewards,
        activeLocksCount
      });

      // Parse user locks
      const locks: LockPosition[] = userLocksData.map((lock: any, index: number) => ({
        id: index,
        amount: parseFloat(ethers.formatEther(lock.amount)),
        lockTime: parseInt(lock.lockTime.toString()),
        unlockTime: parseInt(lock.unlockTime.toString()),
        lockPeriod: parseInt(lock.lockPeriod.toString()),
        tier: parseInt(lock.tier.toString()),
        totalRewardsEarned: parseFloat(ethers.formatEther(lock.totalRewardsEarned)),
        active: lock.active
      }));

      setUserLocks(locks);
      setUserWeight(parseFloat(ethers.formatEther(weight)));

      console.log('✅ Live user data updated:', {
        totalLocked: totalLocked.toLocaleString(),
        totalRewardsEarned: totalRewardsEarned.toLocaleString(),
        pendingRewards: pendingRewards.toLocaleString(),
        activeLocksCount,
        locksCount: locks.length,
        userWeight: parseFloat(ethers.formatEther(weight)).toLocaleString()
      });

    } catch (err: any) {
      console.error('❌ Error fetching live user data:', err);
      setError(err.message || 'Failed to fetch user data');
      setConnectionHealth('degraded');
    }
  };

  const fetchContractData = async () => {
    setLoading(true);
    setError(null);

    try {
      await fetchProtocolStats();
      
      if (userAddress) {
        await fetchUserData(userAddress);
      }
      
      setConnectionHealth('healthy');
    } catch (err: any) {
      console.error('❌ Error in contract data fetch:', err);
      setError(err.message || 'Failed to fetch contract data');
      setConnectionHealth('degraded');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Initializing live blockchain connection...');
    fetchContractData();
    
    // Auto-refresh every 15 seconds for more responsive live data
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing live data...');
      fetchContractData();
    }, 15000);
    
    return () => {
      console.log('🛑 Cleaning up blockchain connection...');
      clearInterval(interval);
    };
  }, [userAddress]);

  // Connection health monitoring
  useEffect(() => {
    const healthCheck = setInterval(() => {
      if (connectionHealth === 'degraded') {
        console.log('🔄 Attempting to restore connection...');
        fetchContractData();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(healthCheck);
  }, [connectionHealth]);

  return {
    protocolStats,
    userStats,
    userLocks,
    userWeight,
    emergencyMode,
    contractPaused,
    loading,
    error,
    connectionHealth,
    refetch: fetchContractData,
  };
};
