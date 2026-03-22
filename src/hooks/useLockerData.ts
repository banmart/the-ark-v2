import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  lockTokensForOthersOnContract,
  unlockTokensOnContract,
  claimRewardsOnContract,
  claimRewardsForLocksOnContract,
  forceUnlockMaturedOnContract,
  getCurrentDay
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

  // Cache contract constants fetch (rule: advanced-init-once)
  const constantsFetchedRef = useRef(false);

  // Lazy computed constants (rule: rerender-lazy-state-init)
  const CONTRACT_CONSTANTS = useMemo(() => 
    realContractConstants || DEFAULT_CONSTANTS, 
    [realContractConstants]
  );
  
  const lockTiers = useMemo(() => 
    createLockTiers(CONTRACT_CONSTANTS), 
    [CONTRACT_CONSTANTS]
  );

  // Fetch contract constants once (rule: advanced-init-once)
  useEffect(() => {
    if (constantsFetchedRef.current) return;
    constantsFetchedRef.current = true;
    fetchContractConstants().then(setRealContractConstants);
  }, []);

  // Stable callback for fetching user token data (rule: rerender-functional-setstate)
  const fetchUserTokenDataWrapper = useCallback(async () => {
    if (!account || !provider) return;

    const tokenData = await fetchUserTokenData(account, provider);
    setUserArkBalance(tokenData.balance);
    setCurrentAllowance(tokenData.allowance);
  }, [account, provider]);

  // Use primitive dependencies (rule: rerender-dependencies)
  const hasAccount = !!account;
  const hasProvider = !!provider;
  
  useEffect(() => {
    if (hasAccount && hasProvider) {
      fetchUserTokenDataWrapper();
    }
  }, [hasAccount, hasProvider, fetchUserTokenDataWrapper]);

  // Memoized protocol stats (rule: rerender-memo)
  const protocolStats: ProtocolStats = useMemo(() => ({
    totalLockedTokens: contractProtocolStats.totalLockedTokens,
    totalRewardsDistributed: contractProtocolStats.totalRewardsDistributed,
    totalActiveLockers: contractProtocolStats.totalActiveLockers,
    rewardPool: contractProtocolStats.rewardPool,
    averageAPY: 82.5
  }), [
    contractProtocolStats.totalLockedTokens,
    contractProtocolStats.totalRewardsDistributed,
    contractProtocolStats.totalActiveLockers,
    contractProtocolStats.rewardPool
  ]);

  // Memoized user stats with derived state (rule: rerender-derived-state-no-effect)
  const userStats: UserStats = useMemo(() => {
    const now = Date.now() / 1000;
    const readyToUnlockCount = contractUserLocks.filter(lock => lock.active && lock.unlockTime <= now).length;
    const inProgressCount = contractUserLocks.filter(lock => lock.active && lock.unlockTime > now).length;

    return {
      totalLocked: contractUserStats.totalLocked,
      totalRewardsEarned: contractUserStats.totalRewardsEarned,
      pendingRewards: contractUserStats.pendingRewards,
      activeLocksCount: contractUserStats.activeLocksCount,
      userWeight: contractUserWeight,
      readyToUnlockCount,
      inProgressCount
    };
  }, [contractUserStats, contractUserLocks, contractUserWeight]);

  // Memoized user locks transformation (rule: js-combine-iterations)
  const userLocks: LockedPosition[] = useMemo(() => {
    const now = Date.now() / 1000;
    const tiersLength = lockTiers.length;
    const basisPoints = CONTRACT_CONSTANTS.BASIS_POINTS;
    
    return contractUserLocks.map(lock => {
      const tierIndex = (lock.tier >= 0 && lock.tier < tiersLength) ? lock.tier : 0;
      const tierInfo = lockTiers[tierIndex];
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
        multiplier: `${(tierInfo.multiplier / basisPoints).toFixed(1)}x`,
        daysRemaining
      };
    });
  }, [contractUserLocks, lockTiers, CONTRACT_CONSTANTS.BASIS_POINTS]);

  // Stable callbacks for actions (rule: rerender-functional-setstate)
  const approveTokensWrapper = useCallback(async (amount: number): Promise<boolean> => {
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
  }, [signer, account, fetchUserTokenDataWrapper]);

  const lockTokens = useCallback(async (amount: number, duration: number): Promise<void> => {
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
      // Parallel refetch (rule: async-parallel)
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
  }, [signer, account, emergencyMode, contractPaused, CONTRACT_CONSTANTS, currentAllowance, approveTokensWrapper, fetchUserTokenDataWrapper, refetch]);

  const unlockTokens = useCallback(async (lockId: number): Promise<void> => {
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
  }, [signer, account, refetch]);

  const claimRewards = useCallback(async (): Promise<void> => {
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
  }, [signer, account, refetch]);

  const lockTokensForOthers = useCallback(async (amount: number, duration: number, recipientAddress: string): Promise<void> => {
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
      await lockTokensForOthersOnContract(amount, duration, recipientAddress, signer, CONTRACT_CONSTANTS);
      await Promise.all([
        fetchUserTokenDataWrapper(),
        refetch()
      ]);
    } catch (error: any) {
      console.error('Lock for others failed:', error);
      throw error;
    } finally {
      setIsProcessingLock(false);
    }
  }, [signer, account, emergencyMode, contractPaused, CONTRACT_CONSTANTS, currentAllowance, approveTokensWrapper, fetchUserTokenDataWrapper, refetch]);

  const claimRewardsForLocks = useCallback(async (lockIds: number[]): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      await claimRewardsForLocksOnContract(lockIds, signer);
      await refetch();
    } catch (error: any) {
      console.error('Selective claim failed:', error);
      throw error;
    }
  }, [signer, account, refetch]);

  const forceUnlockMatured = useCallback(async (maxLocks: number = 50): Promise<void> => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const currentDayValue = await getCurrentDay();
      await forceUnlockMaturedOnContract(currentDayValue, maxLocks, signer);
      await refetch();
    } catch (error: any) {
      console.error('Force unlock matured failed:', error);
      throw error;
    }
  }, [signer, refetch]);

  // Memoized calculation functions (rule: rerender-memo)
  const determineLockTierFn = useCallback((days: number) => 
    determineLockTier(days, lockTiers), 
    [lockTiers]
  );
  
  const calculateEarlyUnlockPenaltyFn = useCallback((lockPosition: LockedPosition) => 
    calculateEarlyUnlockPenalty(lockPosition, CONTRACT_CONSTANTS), 
    [CONTRACT_CONSTANTS]
  );
  
  const calculateLockWeightFn = useCallback((lockPosition: LockedPosition) => 
    calculateLockWeight(lockPosition, lockTiers, CONTRACT_CONSTANTS), 
    [lockTiers, CONTRACT_CONSTANTS]
  );
  
  const calculateUserWeightFn = useCallback((positions: LockedPosition[]) => 
    calculateUserWeight(positions, lockTiers, CONTRACT_CONSTANTS), 
    [lockTiers, CONTRACT_CONSTANTS]
  );
  
  const calculateAPYRangeFn = useCallback(() => 
    calculateAPYRange(lockTiers, CONTRACT_CONSTANTS), 
    [lockTiers, CONTRACT_CONSTANTS]
  );

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
    determineLockTier: determineLockTierFn,
    calculateEarlyUnlockPenalty: calculateEarlyUnlockPenaltyFn,
    calculateLockWeight: calculateLockWeightFn,
    calculateUserWeight: calculateUserWeightFn,
    calculateAPYRange: calculateAPYRangeFn,
    
    // Actions
    lockTokens,
    unlockTokens,
    claimRewards,
    approveTokens: approveTokensWrapper,
    fetchUserTokenData: fetchUserTokenDataWrapper
  };
};
