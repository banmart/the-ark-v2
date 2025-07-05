
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

  const fetchProtocolStats = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);
      
      console.log('Fetching protocol stats from SimplifiedLockerVault contract...');

      // Call actual contract methods
      const [totalLocked, totalRewards, totalLockers, emergency, paused] = await Promise.all([
        contract.totalLockedTokens(),
        contract.totalRewardsDistributed(),
        contract.totalActiveLockers(),
        contract.emergencyMode(),
        contract.paused()
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

      console.log('Protocol stats fetched successfully:', {
        totalLockedTokens,
        totalRewardsDistributed,
        totalActiveLockers,
        emergency,
        paused
      });
    } catch (err: any) {
      console.error('Error fetching protocol stats:', err);
      setError(err.message || 'Failed to fetch protocol stats');
    }
  };

  const fetchUserData = async (address: string) => {
    try {
      console.log('Fetching user data for address:', address);
      
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      // Get user stats and locks from contract
      const [userStatsData, userLocksData, weight] = await Promise.all([
        contract.userStats(address),
        contract.getUserActiveLocks(address),
        contract.calculateUserWeight(address)
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

      console.log('User data fetched successfully:', {
        totalLocked,
        totalRewardsEarned,
        pendingRewards,
        activeLocksCount,
        locks: locks.length
      });
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to fetch user data');
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
    } catch (err: any) {
      console.error('Error fetching contract data:', err);
      setError(err.message || 'Failed to fetch contract data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchContractData, 30000);
    
    return () => clearInterval(interval);
  }, [userAddress]);

  return {
    protocolStats,
    userStats,
    userLocks,
    userWeight,
    emergencyMode,
    contractPaused,
    loading,
    error,
    refetch: fetchContractData,
  };
};
