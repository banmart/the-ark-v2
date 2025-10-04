
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, LOCKER_VAULT_ABI, LOCKER_VAULT_ADDRESS, NETWORKS } from '../utils/constants';

interface ProtocolStats {
  totalLockedTokens: number;
  totalRewardsDistributed: number;
  totalActiveLockers: number;
  rewardPool: number;
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

interface PenaltyInfo {
  penaltyAmount: number;
  userReceives: number;
  penaltyRate: number;
}

interface EarlyUnlockSettings {
  enabled: boolean;
  penaltyRate: number;
  burnShare: number;
  rewardShare: number;
}

export const useLockerContractData = (userAddress?: string) => {
  const [protocolStats, setProtocolStats] = useState<ProtocolStats>({
    totalLockedTokens: 0,
    totalRewardsDistributed: 0,
    totalActiveLockers: 0,
    rewardPool: 0
  });

  const [userStats, setUserStats] = useState<UserStats>({
    totalLocked: 0,
    totalRewardsEarned: 0,
    pendingRewards: 0,
    activeLocksCount: 0
  });

  const [userLocks, setUserLocks] = useState<LockPosition[]>([]);
  const [userWeight, setUserWeight] = useState(0);
  const [totalProtocolWeight, setTotalProtocolWeight] = useState(0);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [contractPaused, setContractPaused] = useState(false);
  const [earlyUnlockSettings, setEarlyUnlockSettings] = useState<EarlyUnlockSettings>({
    enabled: true,
    penaltyRate: 5000,
    burnShare: 5000,
    rewardShare: 5000
  });
  const [emergencyUnlockTime, setEmergencyUnlockTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProtocolStats = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);
      
      console.log('Fetching enhanced protocol stats from SimplifiedLockerVault contract...');

      // Use new getProtocolStats function that returns reward pool and total weight
      const [totalLocked, totalRewards, totalLockers, rewardPool, totalWeight, emergency, paused, earlyUnlockEnabled, earlyPenalty, burnShare, rewardShare, emergencyTime] = await Promise.all([
        contract.totalLockedTokens(),
        contract.totalRewardsDistributed(),
        contract.totalActiveLockers(),
        contract.rewardPool(),
        contract.calculateTotalProtocolWeight ? contract.calculateTotalProtocolWeight() : ethers.parseEther("0"),
        contract.emergencyMode(),
        contract.paused(),
        contract.earlyUnlockEnabled(),
        contract.earlyUnlockPenalty(),
        contract.penaltyBurnShare(),
        contract.penaltyRewardShare(),
        contract.emergencyUnlockTime()
      ]);

      // Convert from wei to tokens (18 decimals)
      const totalLockedTokens = parseFloat(ethers.formatEther(totalLocked));
      const totalRewardsDistributed = parseFloat(ethers.formatEther(totalRewards));
      const totalActiveLockers = parseInt(totalLockers.toString());
      const rewardPoolAmount = parseFloat(ethers.formatEther(rewardPool));

      setProtocolStats({
        totalLockedTokens,
        totalRewardsDistributed,
        totalActiveLockers,
        rewardPool: rewardPoolAmount
      });

      setTotalProtocolWeight(parseFloat(ethers.formatEther(totalWeight)));
      setEmergencyMode(emergency);
      setContractPaused(paused);
      setEmergencyUnlockTime(parseInt(emergencyTime.toString()));
      setEarlyUnlockSettings({
        enabled: earlyUnlockEnabled,
        penaltyRate: parseInt(earlyPenalty.toString()),
        burnShare: parseInt(burnShare.toString()),
        rewardShare: parseInt(rewardShare.toString())
      });

      console.log('Enhanced protocol stats fetched successfully:', {
        totalLockedTokens,
        totalRewardsDistributed,
        totalActiveLockers,
        rewardPool: rewardPoolAmount,
        emergency,
        paused,
        earlyUnlockSettings: {
          enabled: earlyUnlockEnabled,
          penaltyRate: parseInt(earlyPenalty.toString()),
          burnShare: parseInt(burnShare.toString()),
          rewardShare: parseInt(rewardShare.toString())
        }
      });
    } catch (err: any) {
      console.error('Error fetching protocol stats:', err);
      setError(err.message || 'Failed to fetch protocol stats');
    }
  };

  const fetchUserData = async (address: string) => {
    try {
      console.log('Fetching enhanced user data for address:', address);
      
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      // Use new getUserActiveLocks function for better performance
      const [userStatsData, userLocksData, weight] = await Promise.all([
        contract.userStats(address),
        contract.getUserActiveLocks(address), // This only returns active locks
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

      // Parse user locks - use lockId from contract if available
      const locks: LockPosition[] = userLocksData.map((lock: any, index: number) => {
        // Try to get lockId from the contract data, fallback to fetching from user's lock indices
        const lockId = lock.lockId !== undefined ? parseInt(lock.lockId.toString()) : index;
        
        return {
          id: lockId,
          amount: parseFloat(ethers.formatEther(lock.amount)),
          lockTime: parseInt(lock.lockTime.toString()),
          unlockTime: parseInt(lock.unlockTime.toString()),
          lockPeriod: parseInt(lock.lockPeriod.toString()),
          tier: parseInt(lock.tier.toString()),
          totalRewardsEarned: parseFloat(ethers.formatEther(lock.totalRewardsEarned)),
          active: lock.active
        };
      });

      setUserLocks(locks);
      setUserWeight(parseFloat(ethers.formatEther(weight)));

      console.log('Enhanced user data fetched successfully:', {
        totalLocked,
        totalRewardsEarned,
        pendingRewards,
        activeLocksCount,
        locks: locks.length,
        userWeight: parseFloat(ethers.formatEther(weight))
      });
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to fetch user data');
    }
  };

  const calculatePenaltyPreview = async (userAddress: string, lockId: number): Promise<PenaltyInfo | null> => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      const [penaltyAmount, userReceives] = await contract.calculateEarlyUnlockPenalty(userAddress, lockId);
      
      const penalty = parseFloat(ethers.formatEther(penaltyAmount));
      const receives = parseFloat(ethers.formatEther(userReceives));
      const lockAmount = receives + penalty;
      const penaltyRate = lockAmount > 0 ? (penalty / lockAmount) * 100 : 0;

      return {
        penaltyAmount: penalty,
        userReceives: receives,
        penaltyRate
      };
    } catch (err: any) {
      console.error('Error calculating penalty preview:', err);
      return null;
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
    
    // Smart refresh intervals based on data type
    // Protocol stats: 90 seconds (slow-changing)
    // User data: 60 seconds (more dynamic)
    const protocolInterval = setInterval(fetchProtocolStats, 90000);
    const userInterval = userAddress ? setInterval(() => fetchUserData(userAddress), 60000) : null;
    
    // Only refresh when tab is visible (Page Visibility API)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchContractData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(protocolInterval);
      if (userInterval) clearInterval(userInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userAddress]);

  return {
    protocolStats,
    userStats,
    userLocks,
    userWeight,
    totalProtocolWeight,
    emergencyMode,
    contractPaused,
    earlyUnlockSettings,
    emergencyUnlockTime,
    loading,
    error,
    refetch: fetchContractData,
    calculatePenaltyPreview,
  };
};
