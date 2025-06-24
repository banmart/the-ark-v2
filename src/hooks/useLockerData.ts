import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useLockerContractData } from './useLockerContractData';
import { useWallet } from './useWallet';
import { ARK_TOKEN_ABI, LOCKER_VAULT_ABI, CONTRACT_ADDRESSES, LOCKER_VAULT_ADDRESS } from '../utils/constants';

export enum LockTier {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
  DIAMOND = 3,
  PLATINUM = 4,
  LEGENDARY = 5
}

export interface LockedPosition {
  id: number;
  amount: number;
  lockTime: number;
  unlockTime: number;
  lockPeriod: number;
  tier: LockTier;
  tierName: string;
  totalRewardsEarned: number;
  active: boolean;
  multiplier: string;
  daysRemaining: number;
}

export interface LockTierInfo {
  name: string;
  minDuration: number;
  multiplier: number;
  color: string;
  icon: string;
  minDays: number;
  maxDays: number;
}

export interface UserStats {
  totalLocked: number;
  totalRewardsEarned: number;
  pendingRewards: number;
  activeLocksCount: number;
  userWeight: number;
}

export interface ProtocolStats {
  totalLockedTokens: number;
  totalRewardsDistributed: number;
  totalActiveLockers: number;
  averageAPY: number;
}

export interface PenaltyCalculation {
  penalty: number;
  userReceives: number;
  penaltyRate: number;
}

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

  // Contract tier definitions matching the smart contract exactly
  const lockTiers: LockTierInfo[] = [
    {
      name: 'Bronze',
      minDuration: 1,
      multiplier: 10000, // 1x in basis points
      color: '#CD7F32',
      icon: '⛵',
      minDays: 1,
      maxDays: 89
    },
    {
      name: 'Silver',
      minDuration: 90,
      multiplier: 15000, // 1.5x in basis points
      color: '#C0C0C0',
      icon: '🛡️',
      minDays: 90,
      maxDays: 179
    },
    {
      name: 'Gold',
      minDuration: 180,
      multiplier: 20000, // 2x in basis points
      color: '#FFD700',
      icon: '👑',
      minDays: 180,
      maxDays: 364
    },
    {
      name: 'Diamond',
      minDuration: 365,
      multiplier: 30000, // 3x in basis points
      color: '#B9F2FF',
      icon: '💎',
      minDays: 365,
      maxDays: 1094
    },
    {
      name: 'Platinum',
      minDuration: 1095,
      multiplier: 50000, // 5x in basis points
      color: '#E5E4E2',
      icon: '⭐',
      minDays: 1095,
      maxDays: 1459
    },
    {
      name: 'Legendary',
      minDuration: 1460,
      multiplier: 80000, // 8x in basis points
      color: '#FF6B35',
      icon: '⚡',
      minDays: 1460,
      maxDays: 1826
    }
  ];

  // Contract constants
  const CONTRACT_CONSTANTS = {
    MIN_LOCK_DURATION: 1, // days
    MAX_LOCK_DURATION: 1826, // days (5 years)
    BASIS_POINTS: 10000,
    EARLY_UNLOCK_PENALTY: 5000, // 50% max penalty
    PENALTY_BURN_SHARE: 5000, // 50% burned
    PENALTY_REWARD_SHARE: 5000 // 50% to lockers
  };

  // Fetch user ARK balance and allowance
  const fetchUserTokenData = async () => {
    if (!account || !provider) return;

    try {
      const arkContract = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);
      
      const [balance, allowance] = await Promise.all([
        arkContract.balanceOf(account),
        arkContract.allowance(account, LOCKER_VAULT_ADDRESS)
      ]);

      setUserArkBalance(parseFloat(ethers.formatEther(balance)));
      setCurrentAllowance(parseFloat(ethers.formatEther(allowance)));
    } catch (error) {
      console.error('Error fetching user token data:', error);
    }
  };

  useEffect(() => {
    fetchUserTokenData();
  }, [account, provider]);

  // Transform contract data to match UI expectations
  const protocolStats: ProtocolStats = {
    totalLockedTokens: contractProtocolStats.totalLockedTokens,
    totalRewardsDistributed: contractProtocolStats.totalRewardsDistributed,
    totalActiveLockers: contractProtocolStats.totalActiveLockers,
    averageAPY: 82.5 // This would need to be calculated based on reward distribution rate
  };

  const userStats: UserStats = {
    totalLocked: contractUserStats.totalLocked,
    totalRewardsEarned: contractUserStats.totalRewardsEarned,
    pendingRewards: contractUserStats.pendingRewards,
    activeLocksCount: contractUserStats.activeLocksCount,
    userWeight: contractUserWeight
  };

  // Transform contract locks to UI format with proper tier validation
  const userLocks: LockedPosition[] = contractUserLocks.map(lock => {
    // Ensure tier is within valid range, default to Bronze (0) if invalid
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
      tier: tierIndex as LockTier,
      tierName: tierInfo.name,
      totalRewardsEarned: lock.totalRewardsEarned,
      active: lock.active,
      multiplier: `${(tierInfo.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS).toFixed(1)}x`,
      daysRemaining
    };
  });

  const determineLockTier = (days: number): LockTierInfo => {
    return lockTiers.find(tier => days >= tier.minDays && days <= tier.maxDays) || lockTiers[0];
  };

  const calculateEarlyUnlockPenalty = (lockPosition: LockedPosition): PenaltyCalculation => {
    const now = Date.now() / 1000;
    if (now >= lockPosition.unlockTime) {
      return { penalty: 0, userReceives: lockPosition.amount, penaltyRate: 0 };
    }

    const timeRemaining = lockPosition.unlockTime - now;
    const totalLockTime = lockPosition.lockPeriod;
    const penaltyRate = (CONTRACT_CONSTANTS.EARLY_UNLOCK_PENALTY * timeRemaining) / totalLockTime;
    const penalty = (lockPosition.amount * penaltyRate) / CONTRACT_CONSTANTS.BASIS_POINTS;
    
    return {
      penalty,
      userReceives: lockPosition.amount - penalty,
      penaltyRate: penaltyRate / 100 // Convert to percentage
    };
  };

  const calculateLockWeight = (lockPosition: LockedPosition): number => {
    const now = Date.now() / 1000;
    if (!lockPosition.active || now >= lockPosition.unlockTime) return 0;

    const timeRemaining = lockPosition.unlockTime - now;
    const tierMultiplier = lockTiers[lockPosition.tier].multiplier;
    
    return (lockPosition.amount * timeRemaining * tierMultiplier) / CONTRACT_CONSTANTS.BASIS_POINTS;
  };

  const calculateUserWeight = (positions: LockedPosition[]): number => {
    return positions.reduce((total, position) => {
      return total + calculateLockWeight(position);
    }, 0);
  };

  const calculateAPYRange = (): { min: number; max: number } => {
    // Calculate based on tier multipliers and typical lock durations
    const baseAPY = 15; // Base 15% APY
    const minAPY = baseAPY * (lockTiers[0].multiplier / CONTRACT_CONSTANTS.BASIS_POINTS);
    const maxAPY = baseAPY * (lockTiers[5].multiplier / CONTRACT_CONSTANTS.BASIS_POINTS);
    
    return { min: minAPY, max: maxAPY };
  };

  // Real token approval function
  const approveTokens = async (amount: number): Promise<boolean> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    setIsProcessingApproval(true);
    try {
      console.log(`Approving ${amount} ARK tokens for locker contract...`);
      
      const arkContract = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, signer);
      const amountWei = ethers.parseEther(amount.toString());
      
      const tx = await arkContract.approve(LOCKER_VAULT_ADDRESS, amountWei);
      console.log('Approval transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Approval confirmed:', receipt);
      
      // Update allowance
      await fetchUserTokenData();
      
      return true;
    } catch (error: any) {
      console.error('Approval failed:', error);
      throw error;
    } finally {
      setIsProcessingApproval(false);
    }
  };

  // Real token locking function
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

    // Check if approval is needed
    if (currentAllowance < amount) {
      await approveTokens(amount);
    }

    setIsProcessingLock(true);
    try {
      console.log(`Locking ${amount} ARK tokens for ${duration} days...`);
      
      const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, signer);
      const amountWei = ethers.parseEther(amount.toString());
      const durationSeconds = duration * 24 * 60 * 60; // Convert days to seconds
      
      const tx = await lockerContract.lockTokens(amountWei, durationSeconds);
      console.log('Lock transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Lock confirmed:', receipt);
      
      // Refresh all data after successful lock
      await Promise.all([
        fetchUserTokenData(),
        refetch()
      ]);
      
    } catch (error: any) {
      console.error('Lock failed:', error);
      throw error;
    } finally {
      setIsProcessingLock(false);
    }
  };

  // Real unlock function
  const unlockTokens = async (lockId: number): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log(`Unlocking position ${lockId}...`);
      
      const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, signer);
      const tx = await lockerContract.unlockTokens(lockId);
      console.log('Unlock transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Unlock confirmed:', receipt);
      
      // Refresh data after unlock
      await refetch();
      
    } catch (error: any) {
      console.error('Unlock failed:', error);
      throw error;
    }
  };

  // Real claim rewards function
  const claimRewards = async (): Promise<void> => {
    if (!signer || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('Claiming rewards...');
      
      const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, signer);
      const tx = await lockerContract.claimRewards();
      console.log('Claim transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Claim confirmed:', receipt);
      
      // Refresh data after claim
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
    determineLockTier,
    calculateEarlyUnlockPenalty,
    calculateLockWeight,
    calculateUserWeight,
    calculateAPYRange,
    
    // Actions
    lockTokens,
    unlockTokens,
    claimRewards,
    approveTokens,
    fetchUserTokenData
  };
};
