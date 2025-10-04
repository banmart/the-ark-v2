import { useState, useEffect, useMemo, useCallback } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useLockerContractData } from './useLockerContractData';
import { useWallet } from './useWallet';
import { 
  LockedPosition as UILockedPosition, 
  UserStats as UIUserStats, 
  ProtocolStats as UIProtocolStats, 
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

const BN0 = BigNumber.from(0);
const toBN = (v: any) => BigNumber.isBigNumber(v) ? v as BigNumber : BigNumber.from(v ?? 0);
const toNum = (v: any) => {
  try {
    if (BigNumber.isBigNumber(v)) return (v as BigNumber).toNumber();
    if (typeof v === 'bigint') return Number(v);
    return Number(v ?? 0);
  } catch {
    // As a last resort to avoid crashes; prefer not to hit this branch
    return 0;
  }
};
const nowTs = () => Math.floor(Date.now() / 1000);

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
  const [userArkBalance, setUserArkBalance] = useState<BigNumber>(BN0);
  const [currentAllowance, setCurrentAllowance] = useState<BigNumber>(BN0);
  const [realContractConstants, setRealContractConstants] = useState<ContractConstants | null>(null);

  const CONTRACT_CONSTANTS = realContractConstants || DEFAULT_CONSTANTS;
  const lockTiers: LockTierInfo[] = createLockTiers(CONTRACT_CONSTANTS);

  useEffect(() => {
    fetchContractConstants().then(setRealContractConstants).catch(() => {});
  }, []);

  const fetchUserTokenDataWrapper = useCallback(async () => {
    if (!account || !provider) return;
    try {
      const tokenData = await fetchUserTokenData(account, provider);
      // Expecting fetchUserTokenData to return raw BigNumbers or strings. Coerce to BN.
      setUserArkBalance(toBN(tokenData.balance));
      setCurrentAllowance(toBN(tokenData.allowance));
    } catch (e) {
      console.error('fetchUserTokenData failed:', e);
    }
  }, [account, provider]);

  useEffect(() => {
    fetchUserTokenDataWrapper();
  }, [fetchUserTokenDataWrapper]);

  // Transform contract protocol stats with safe coercion
  const protocolStats: UIProtocolStats = {
    totalLockedTokens: toBN(contractProtocolStats?.totalLockedTokens),
    totalRewardsDistributed: toBN(contractProtocolStats?.totalRewardsDistributed),
    totalActiveLockers: toBN(contractProtocolStats?.totalActiveLockers),
    // If your contract moved to rewardsAvailable(), this may be unused by now.
    rewardPool: toBN(contractProtocolStats?.rewardPool ?? 0),
    averageAPY: 82.5 // placeholder; update from backend if needed
  };

  // Transform user stats
  const userStats: UIUserStats = {
    totalLocked: toBN(contractUserStats?.totalLocked),
    totalRewardsEarned: toBN(contractUserStats?.totalRewardsEarned),
    // If your solidity removed this, your hook/types should be updated accordingly.
    pendingRewards: toBN(contractUserStats?.pendingRewards ?? 0),
    activeLocksCount: toBN(contractUserStats?.activeLocksCount),
    userWeight: toBN(contractUserWeight ?? 0)
  };

  // Map user locks, compute daysRemaining safely
  const userLocks: UILockedPosition[] = useMemo(() => {
    const now = nowTs();
    const list = Array.isArray(contractUserLocks) ? contractUserLocks : [];
    return list.map((lock: any, idx: number) => {
      const tierIndex: number = (lock?.tier >= 0 && lock?.tier < lockTiers.length) ? Number(lock.tier) : 0;
      const tierInfo = lockTiers[tierIndex];
      const unlock = toNum(lock?.unlockTime);
      const daysRemaining = Math.max(0, Math.ceil((unlock - now) / (24 * 60 * 60)));

      return {
        id: toNum(lock?.id ?? idx),
        amount: toBN(lock?.amount),
        lockTime: toBN(lock?.lockTime),
        unlockTime: toBN(lock?.unlockTime),
        lockPeriod: toBN(lock?.lockPeriod),
        tier: tierIndex,
        tierName: tierInfo.name,
        totalRewardsEarned: toBN(lock?.totalRewardsEarned),
        active: Boolean(lock?.active),
        multiplier: `${(tierInfo.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS).toFixed(1)}x`,
        daysRemaining
      } as UILockedPosition;
    });
  }, [contractUserLocks, lockTiers, CONTRACT_CONSTANTS.BASIS_POINTS]);

  // Compute totals in a way that does NOT hide matured-but-active locks
  const totals = useMemo(() => {
    const now = nowTs();
    let totalLocked = BN0;
    let readyToUnlock = BN0;
    let inProgress = BN0;

    for (const l of userLocks) {
      if (l.active) {
        totalLocked = totalLocked.add(l.amount);
        const unlock = toNum(l.unlockTime);
        if (unlock <= now) {
          readyToUnlock = readyToUnlock.add(l.amount);
        } else {
          inProgress = inProgress.add(l.amount);
        }
      }
    }
    return { totalLocked, readyToUnlock, inProgress };
  }, [userLocks]);

  // Approvals
  const approveTokensWrapper = async (amount: BigNumber | number | string): Promise<boolean> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }
    const amtBN = toBN(amount);
    setIsProcessingApproval(true);
    try {
      await approveTokens(amtBN, signer);
      await fetchUserTokenDataWrapper();
      return true;
    } catch (error: any) {
      console.error('Approval failed:', error);
      throw error;
    } finally {
      setIsProcessingApproval(false);
    }
  };

  // Locks
  const lockTokens = async (amount: BigNumber | number | string, durationSeconds: number): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }
    if (emergencyMode) throw new Error('Emergency mode is active - new locks are disabled');
    if (contractPaused) throw new Error('Contract is paused - operations temporarily disabled');

    // Contract constants are seconds; message in days for user clarity
    const minDays = Math.ceil(CONTRACT_CONSTANTS.MIN_LOCK_DURATION / (24 * 60 * 60));
    const maxDays = Math.floor(CONTRACT_CONSTANTS.MAX_LOCK_DURATION / (24 * 60 * 60));
    if (durationSeconds < CONTRACT_CONSTANTS.MIN_LOCK_DURATION || durationSeconds > CONTRACT_CONSTANTS.MAX_LOCK_DURATION) {
      throw new Error(`Lock duration must be between ${minDays} and ${maxDays} days`);
    }

    const amtBN = toBN(amount);
    if (currentAllowance.lt(amtBN)) {
      await approveTokensWrapper(amtBN);
    }

    setIsProcessingLock(true);
    try {
      await lockTokensOnContract(amtBN, durationSeconds, signer, CONTRACT_CONSTANTS);
      await Promise.all([fetchUserTokenDataWrapper(), refetch()]);
    } catch (error: any) {
      console.error('Lock failed:', error);
      throw error;
    } finally {
      setIsProcessingLock(false);
    }
  };

  // Unlock
  const unlockTokens = async (lockId: number): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }
    try {
      await unlockTokensOnContract(lockId, signer);
      await Promise.all([fetchUserTokenDataWrapper(), refetch()]);
    } catch (error: any) {
      console.error('Unlock failed:', error);
      throw error;
    }
  };

  // Claim
  const claimRewards = async (): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }
    try {
      await claimRewardsOnContract(signer);
      await Promise.all([fetchUserTokenDataWrapper(), refetch()]);
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

    // Computed totals to fix the “missing tokens” perception
    totalLocked: totals.totalLocked,
    readyToUnlock: totals.readyToUnlock,
    inProgress: totals.inProgress,
    
    // Constants
    CONTRACT_CONSTANTS,
    
    // Calculators
    determineLockTier: (days: number) => determineLockTier(days, lockTiers),
    calculateEarlyUnlockPenalty: (lockPosition: UILockedPosition) => 
      calculateEarlyUnlockPenalty(lockPosition, CONTRACT_CONSTANTS),
    calculateLockWeight: (lockPosition: UILockedPosition) => 
      calculateLockWeight(lockPosition, lockTiers, CONTRACT_CONSTANTS),
    calculateUserWeight: (positions: UILockedPosition[]) => 
      calculateUserWeight(positions, lockTiers, CONTRACT_CONSTANTS),
    calculateAPYRange: () => calculateAPYRange(lockTiers, CONTRACT_CONSTANTS),
    
    // Actions
    lockTokens,
    unlockTokens,
    claimRewards,
    approveTokens: approveTokensWrapper,
    fetchUserTokenData: fetchUserTokenDataWrapper,

    // Refetch
    refetch,
  };
};