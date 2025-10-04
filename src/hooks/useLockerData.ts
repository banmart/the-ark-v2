
import { useState, useEffect } from 'react';
import { useLockerContractData } from './useLockerContractData';
import { useWallet } from './useWallet';
import { 
  LockedPosition, 
  UserStats, 
  ProtocolStats, 
  LockTierInfo,
  ContractConstants
} from './locker/types';
import { DEFAULT_CONSTANTS, createLockTiers } from './locker/lockTiers';
import { 
  determineLockTier,
  calculateEarlyUnlockPenalty,
  calculateLockWeight,
  calculateUserWeight,
  calculateAPYRange
} from './locker/calculations';
import {
  fetchContractConstants,
  fetchUserTokenData,
  approveTokens,
  lockTokensOnContract,
  unlockTokensOnContract,
  claimRewardsOnContract
} from './locker/contractInteractions';

export const useLockerData = () => {
  const { account, provider, signer } = useWallet();
  const { 
    protocolStats: contractProtocolStats,
    userStats: contractUserStats,
    userLocks: contractUserLocks,
    userWeight: contractUserWeight,
    emergencyMode,
    contractPaused,
    loading,
    error,
    refetch
  } = useLockerContractData(account || undefined);

  const [isProcessingApproval, setIsProcessingApproval] = useState(false);
  const [isProcessingLock, setIsProcessingLock] = useState(false);
  const [userArkBalance, setUserArkBalance] = useState(0);
  const [currentAllowance, setCurrentAllowance] = useState(0);
  const [realContractConstants, setRealContractConstants] = useState<ContractConstants | null>(null);

  const CONTRACT_CONSTANTS = realContractConstants || DEFAULT_CONSTANTS;
  const lockTiers = createLockTiers(CONTRACT_CONSTANTS);

  useEffect(() => {
    fetchContractConstants().then(setRealContractConstants);
  }, []);

  const fetchUserTokenDataWrapper = async () => {
    if (!account || !provider) return;

    const tokenData = await fetchUserTokenData(account, provider);
    setUserArkBalance(tokenData.balance);
    setCurrentAllowance(tokenData.allowance);
  };

  useEffect(() => {
    fetchUserTokenDataWrapper();
  }, [account, provider]);

  // Calculate dynamic APY based on protocol state
  const calculateDynamicAPY = (): number => {
    const { min, max } = calculateAPYRange(lockTiers, CONTRACT_CONSTANTS);
    
    // If we have active locks, calculate weighted average based on user's positions
    if (contractUserLocks.length > 0) {
      const totalWeight = contractUserLocks.reduce((sum, lock) => {
        if (!lock.active) return sum;
        const tierMultiplier = lockTiers[lock.tier]?.multiplier || CONTRACT_CONSTANTS.BASIS_POINTS;
        return sum + (lock.amount * tierMultiplier);
      }, 0);
      
      const weightedAPY = contractUserLocks.reduce((sum, lock) => {
        if (!lock.active) return sum;
        const tierMultiplier = lockTiers[lock.tier]?.multiplier || CONTRACT_CONSTANTS.BASIS_POINTS;
        const weight = lock.amount * tierMultiplier;
        const baseAPY = 15;
        const tierAPY = baseAPY * (tierMultiplier / CONTRACT_CONSTANTS.BASIS_POINTS);
        return sum + (tierAPY * weight);
      }, 0);
      
      return totalWeight > 0 ? weightedAPY / totalWeight : (min + max) / 2;
    }
    
    // Default to midpoint of APY range
    return (min + max) / 2;
  };

  // Transform contract data to match UI expectations
  const protocolStats: ProtocolStats = {
    totalLockedTokens: contractProtocolStats.totalLockedTokens,
    totalRewardsDistributed: contractProtocolStats.totalRewardsDistributed,
    totalActiveLockers: contractProtocolStats.totalActiveLockers,
    rewardPool: contractProtocolStats.rewardPool,
    averageAPY: calculateDynamicAPY()
  };

  const userStats: UserStats = {
    totalLocked: contractUserStats.totalLocked,
    totalRewardsEarned: contractUserStats.totalRewardsEarned,
    pendingRewards: contractUserStats.pendingRewards,
    activeLocksCount: contractUserStats.activeLocksCount,
    userWeight: contractUserWeight
  };

  const userLocks: LockedPosition[] = contractUserLocks.map(lock => {
    const tierIndex = (lock.tier >= 0 && lock.tier < lockTiers.length) ? lock.tier : 0;
    const tierInfo = lockTiers[tierIndex];
    const now = Date.now() / 1000;
    const daysRemaining = Math.max(0, Math.ceil((lock.unlockTime - now) / (24 * 60 * 60)));
    
    return {
      id: lock.id,
      amount: lock.amount,
      lockTime: lock.lockTime,
      unlockTime: lock.unlockTime,
      lockPeriod: lock.lockPeriod,
      tier: tierIndex,
      tierName: tierInfo.name,
      totalRewardsEarned: lock.totalRewardsEarned,
      active: lock.active,
      multiplier: `${(tierInfo.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS).toFixed(1)}x`,
      daysRemaining
    };
  });

  const approveTokensWrapper = async (amount: number): Promise<boolean> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    setIsProcessingApproval(true);
    try {
      await approveTokens(amount, signer);
      await fetchUserTokenDataWrapper();
      return true;
    } catch (error: any) {
      console.error('Approval failed:', error);
      throw error;
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const lockTokens = async (amount: number, duration: number): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    if (emergencyMode) {
      throw new Error('Emergency mode is active - new locks are disabled');
    }

    if (contractPaused) {
      throw new Error('Contract is paused - operations temporarily disabled');
    }

    if (duration < CONTRACT_CONSTANTS.MIN_LOCK_DURATION || duration > CONTRACT_CONSTANTS.MAX_LOCK_DURATION) {
      throw new Error(`Lock duration must be between ${CONTRACT_CONSTANTS.MIN_LOCK_DURATION} and ${CONTRACT_CONSTANTS.MAX_LOCK_DURATION} days`);
    }

    if (currentAllowance < amount) {
      await approveTokensWrapper(amount);
    }

    setIsProcessingLock(true);
    try {
      await lockTokensOnContract(amount, duration, signer, CONTRACT_CONSTANTS);
      await Promise.all([
        fetchUserTokenDataWrapper(),
        refetch()
      ]);
    } catch (error: any) {
      console.error('Lock failed:', error);
      throw error;
    } finally {
      setIsProcessingLock(false);
    }
  };

  const unlockTokens = async (lockId: number): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      await unlockTokensOnContract(lockId, signer);
      await refetch();
    } catch (error: any) {
      console.error('Unlock failed:', error);
      throw error;
    }
  };

  const claimRewards = async (): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      await claimRewardsOnContract(signer);
      await refetch();
    } catch (error: any) {
      console.error('Claim failed:', error);
      throw error;
    }
  };

  return {
    // Data
    protocolStats,
    userStats,
    userLocks,
    lockTiers,
    loading,
    emergencyMode,
    contractPaused,
    error,
    userArkBalance,
    currentAllowance,
    isProcessingApproval,
    isProcessingLock,
    
    // Constants
    CONTRACT_CONSTANTS,
    
    // Functions
    determineLockTier: (days: number) => determineLockTier(days, lockTiers),
    calculateEarlyUnlockPenalty: (lockPosition: LockedPosition) => 
      calculateEarlyUnlockPenalty(lockPosition, CONTRACT_CONSTANTS),
    calculateLockWeight: (lockPosition: LockedPosition) => 
      calculateLockWeight(lockPosition, lockTiers, CONTRACT_CONSTANTS),
    calculateUserWeight: (positions: LockedPosition[]) => 
      calculateUserWeight(positions, lockTiers, CONTRACT_CONSTANTS),
    calculateAPYRange: () => calculateAPYRange(lockTiers, CONTRACT_CONSTANTS),
    
    // Actions
    lockTokens,
    unlockTokens,
    claimRewards,
    approveTokens: approveTokensWrapper,
    fetchUserTokenData: fetchUserTokenDataWrapper
  };
};
