import { useState, useEffect } from 'react';
import { useLockerContractData } from './useLockerContractData';
import { useWallet } from './useWallet';

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
  const { account } = useWallet();
  const { 
    protocolStats: contractProtocolStats,
    userStats: contractUserStats,
    userLocks: contractUserLocks,
    userWeight: contractUserWeight,
    emergencyMode,
    contractPaused,
    loading,
    error
  } = useLockerContractData(account || undefined);

  // Updated tier definitions to support 1-day minimum
  const lockTiers: LockTierInfo[] = [
    {
      name: 'Bronze',
      minDuration: 1, // UPDATED: Now starts from 1 day
      multiplier: 10000,
      color: '#CD7F32',
      icon: '⛵',
      minDays: 1,
      maxDays: 29
    },
    {
      name: 'Silver',
      minDuration: 30,
      multiplier: 15000,
      color: '#C0C0C0',
      icon: '🛡️',
      minDays: 30,
      maxDays: 89
    },
    {
      name: 'Gold',
      minDuration: 90,
      multiplier: 20000,
      color: '#FFD700',
      icon: '👑',
      minDays: 90,
      maxDays: 179
    },
    {
      name: 'Diamond',
      minDuration: 180,
      multiplier: 30000,
      color: '#B9F2FF',
      icon: '💎',
      minDays: 180,
      maxDays: 364
    },
    {
      name: 'Platinum',
      minDuration: 365,
      multiplier: 50000,
      color: '#E5E4E2',
      icon: '⭐',
      minDays: 365,
      maxDays: 1094
    },
    {
      name: 'Legendary',
      minDuration: 1095,
      multiplier: 80000,
      color: '#FF6B35',
      icon: '⚡',
      minDays: 1095,
      maxDays: 1826
    }
  ];

  // Updated contract constants
  const CONTRACT_CONSTANTS = {
    MIN_LOCK_DURATION: 1, // UPDATED: Now 1 day minimum
    MAX_LOCK_DURATION: 1826,
    BASIS_POINTS: 10000,
    EARLY_UNLOCK_PENALTY: 5000,
    PENALTY_BURN_SHARE: 5000,
    PENALTY_REWARD_SHARE: 5000
  };

  // Transform contract data to match UI expectations with live data
  const protocolStats: ProtocolStats = {
    totalLockedTokens: contractProtocolStats.totalLockedTokens,
    totalRewardsDistributed: contractProtocolStats.totalRewardsDistributed,
    totalActiveLockers: contractProtocolStats.totalActiveLockers,
    averageAPY: 82.5 // Calculate from live data if available
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
      penaltyRate: penaltyRate / 100
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
    const baseAPY = 15;
    const minAPY = baseAPY * (lockTiers[0].multiplier / CONTRACT_CONSTANTS.BASIS_POINTS);
    const maxAPY = baseAPY * (lockTiers[5].multiplier / CONTRACT_CONSTANTS.BASIS_POINTS);
    
    return { min: minAPY, max: maxAPY };
  };

  return {
    protocolStats,
    userStats,
    userLocks,
    lockTiers,
    loading,
    emergencyMode,
    contractPaused,
    error,
    CONTRACT_CONSTANTS,
    determineLockTier,
    calculateEarlyUnlockPenalty,
    calculateLockWeight,
    calculateUserWeight,
    calculateAPYRange,
    
    // Actions for actual contract interactions
    lockTokens: async (amount: number, duration: number) => {
      console.log(`Locking ${amount} tokens for ${duration} days`);
      // Implementation would call contract
    },
    unlockTokens: async (lockId: number) => {
      console.log(`Unlocking position ${lockId}`);
      // Implementation would call contract
    },
    claimRewards: async () => {
      console.log('Claiming rewards');
      // Implementation would call contract
    }
  };
};
