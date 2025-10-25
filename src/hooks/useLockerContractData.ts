
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

  // Reuse provider instance for better performance
  const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
  const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

  const fetchProtocolStats = async () => {
    // Single parallel batch call for all protocol data
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

    // Convert and set all state
    setProtocolStats({
      totalLockedTokens: parseFloat(ethers.formatEther(totalLocked)),
      totalRewardsDistributed: parseFloat(ethers.formatEther(totalRewards)),
      totalActiveLockers: parseInt(totalLockers.toString()),
      rewardPool: parseFloat(ethers.formatEther(rewardPool))
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
  };

  const fetchUserData = async (address: string) => {
    // Single parallel batch call for all user data
    const [userStatsData, userLocksData, weight] = await Promise.all([
      contract.userStats(address),
      contract.getUserActiveLocks(address),
      contract.calculateUserWeight(address)
    ]);

    // Parse and set user stats
    setUserStats({
      totalLocked: parseFloat(ethers.formatEther(userStatsData.totalLocked)),
      totalRewardsEarned: parseFloat(ethers.formatEther(userStatsData.totalRewardsEarned)),
      pendingRewards: parseFloat(ethers.formatEther(userStatsData.pendingRewards)),
      activeLocksCount: parseInt(userStatsData.activeLocksCount.toString())
    });

    // Parse and set user locks
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
  };

  const calculatePenaltyPreview = async (userAddress: string, lockId: number): Promise<PenaltyInfo | null> => {
    try {
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
      // Fetch protocol and user data in parallel for maximum speed
      if (userAddress) {
        await Promise.all([
          fetchProtocolStats(),
          fetchUserData(userAddress)
        ]);
      } else {
        await fetchProtocolStats();
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
    
    // Optimized polling: 60s interval, only when tab is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchContractData();
      }
    }, 60000);
    
    return () => clearInterval(interval);
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
