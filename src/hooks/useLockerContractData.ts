
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, NETWORKS } from '../utils/constants';

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
      const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      console.log('Fetching protocol stats from locker contract:', LOCKER_VAULT_ADDRESS);

      const [totalLocked, totalRewards, totalLockers, emergencyModeStatus, pausedStatus] = await Promise.all([
        lockerContract.totalLockedTokens(),
        lockerContract.totalRewardsDistributed(),
        lockerContract.totalActiveLockers(),
        lockerContract.emergencyMode(),
        lockerContract.paused()
      ]);

      setProtocolStats({
        totalLockedTokens: parseFloat(ethers.formatUnits(totalLocked, 18)),
        totalRewardsDistributed: parseFloat(ethers.formatUnits(totalRewards, 18)),
        totalActiveLockers: parseInt(totalLockers.toString())
      });

      setEmergencyMode(emergencyModeStatus);
      setContractPaused(pausedStatus);

      console.log('Protocol stats updated successfully');
    } catch (err: any) {
      console.error('Error fetching protocol stats:', err);
      setError(err.message || 'Failed to fetch protocol stats');
    }
  };

  const fetchUserData = async (address: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      console.log('Fetching user data for address:', address);

      const [userStatsData, userLocksData, weight, pendingRewardsAmount] = await Promise.all([
        lockerContract.userStats(address),
        lockerContract.getUserActiveLocks(address),
        lockerContract.calculateUserWeight(address),
        lockerContract.pendingRewards(address)
      ]);

      // Parse user stats
      setUserStats({
        totalLocked: parseFloat(ethers.formatUnits(userStatsData.totalLocked, 18)),
        totalRewardsEarned: parseFloat(ethers.formatUnits(userStatsData.totalRewardsEarned, 18)),
        pendingRewards: parseFloat(ethers.formatUnits(pendingRewardsAmount, 18)),
        activeLocksCount: parseInt(userStatsData.activeLocksCount.toString())
      });

      // Parse user locks
      const parsedLocks: LockPosition[] = userLocksData.map((lock: any, index: number) => ({
        id: index,
        amount: parseFloat(ethers.formatUnits(lock.amount, 18)),
        lockTime: parseInt(lock.lockTime.toString()),
        unlockTime: parseInt(lock.unlockTime.toString()),
        lockPeriod: parseInt(lock.lockPeriod.toString()),
        tier: parseInt(lock.tier.toString()),
        totalRewardsEarned: parseFloat(ethers.formatUnits(lock.totalRewardsEarned, 18)),
        active: lock.active
      }));

      setUserLocks(parsedLocks);
      setUserWeight(parseFloat(ethers.formatUnits(weight, 18)));

      console.log('User data updated successfully');
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
