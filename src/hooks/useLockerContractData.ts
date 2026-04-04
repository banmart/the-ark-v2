
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LOCKER_VAULT_ABI, LOCKER_VAULT_ADDRESS, NETWORKS } from '../utils/constants';

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
  const [protocolStats, setProtocolStats] = useState<ProtocolStats>(() => {
    const cached = localStorage.getItem('ark-protocol-metrics');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) { return { totalLockedTokens: 0, totalRewardsDistributed: 0, totalActiveLockers: 0, rewardPool: 0 }; }
    }
    return {
      totalLockedTokens: 0,
      totalRewardsDistributed: 0,
      totalActiveLockers: 0,
      rewardPool: 0
    };
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
  const [loading, setLoading] = useState(!protocolStats.totalLockedTokens);
  const [error, setError] = useState<string | null>(null);

  const fetchProtocolStats = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);
      
      console.log('Fetching protocol dashboard from ARKLocker contract...');

      // Use getProtocolDashboard() - single call for all protocol data
      const [dashboard, protocolWeight] = await Promise.all([
        contract.getProtocolDashboard(),
        contract.lockedWeight()
      ]);

      const [config, totalLocked, totalRewards, totalLockers, rewardPool] = dashboard;

      const totalLockedTokens = parseFloat(ethers.formatEther(totalLocked));
      const totalRewardsDistributed = parseFloat(ethers.formatEther(totalRewards));
      const totalActiveLockers = parseInt(totalLockers.toString());
      const rewardPoolAmount = parseFloat(ethers.formatEther(rewardPool));

      const newStats = {
        totalLockedTokens,
        totalRewardsDistributed,
        totalActiveLockers,
        rewardPool: rewardPoolAmount
      };

      setProtocolStats(newStats);
      localStorage.setItem('ark-protocol-metrics', JSON.stringify(newStats));

      setTotalProtocolWeight(parseFloat(ethers.formatEther(protocolWeight)));
      setEmergencyMode(config.emergencyMode);
      setContractPaused(config.paused);
      setEmergencyUnlockTime(parseInt(config.emergencyUnlockTime.toString()));
      setEarlyUnlockSettings({
        enabled: config.earlyUnlockEnabled,
        penaltyRate: parseInt(config.earlyUnlockPenalty.toString()),
        burnShare: parseInt(config.penaltyBurnShare.toString()),
        rewardShare: parseInt(config.penaltyRewardShare.toString())
      });
    } catch (err: any) {
      console.error('Error fetching protocol stats:', err);
      setError(err.message || 'Failed to fetch protocol stats');
    }
  };

  const fetchUserData = async (address: string) => {
    try {
      console.log('Fetching user dashboard for:', address);
      
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);

      // Use getUserDashboard + pendingRewardsAll in parallel
      const [dashboardData, pendingRewards] = await Promise.all([
        contract.getUserDashboard(address),
        contract.pendingRewardsAll(address)
      ]);

      const [statsData, locksData] = dashboardData;

      // Parse user stats
      const totalLocked = parseFloat(ethers.formatEther(statsData.totalLocked));
      const totalRewardsEarned = parseFloat(ethers.formatEther(statsData.totalRewardEarned));
      const pending = parseFloat(ethers.formatEther(pendingRewards));
      const activeLocksCount = parseInt(statsData.activeLocksCount.toString());

      setUserStats({
        totalLocked,
        totalRewardsEarned,
        pendingRewards: pending,
        activeLocksCount
      });

      // Parse user locks
      const locks: LockPosition[] = locksData.map((lock: any, index: number) => ({
        id: index,
        amount: parseFloat(ethers.formatEther(lock.amount)),
        lockTime: parseInt(lock.lockTime.toString()),
        unlockTime: parseInt(lock.unlockTime.toString()),
        lockPeriod: parseInt(lock.lockPeriod.toString()),
        tier: parseInt(lock.tier.toString()),
        totalRewardsEarned: parseFloat(ethers.formatEther(lock.rewardEarned)),
        active: lock.active
      }));

      setUserLocks(locks);
      
      // Calculate user weight from lock amountWeights
      const weight = locksData.reduce((total: number, lock: any) => {
        if (lock.active) {
          return total + parseFloat(ethers.formatEther(lock.amountWeight));
        }
        return total;
      }, 0);
      setUserWeight(weight);
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
    // Only fetch automatically if we don't have cached data or if address changed
    if (!protocolStats.totalLockedTokens || userAddress) {
      fetchContractData();
    }
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
