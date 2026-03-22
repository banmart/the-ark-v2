
import { LockedPosition, PenaltyCalculation, LockTierInfo, ContractConstants } from './types';

export const determineLockTier = (days: number, lockTiers: LockTierInfo[]): LockTierInfo => {
  return lockTiers.find(tier => days >= tier.minDays && days <= tier.maxDays) || lockTiers[0];
};

export const calculateEarlyUnlockPenalty = (
  lockPosition: LockedPosition, 
  CONTRACT_CONSTANTS: ContractConstants
): PenaltyCalculation => {
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

export const calculateLockWeight = (
  lockPosition: LockedPosition, 
  lockTiers: LockTierInfo[],
  CONTRACT_CONSTANTS: ContractConstants
): number => {
  const now = Date.now() / 1000;
  if (!lockPosition.active || now >= lockPosition.unlockTime) return 0;

  const timeRemaining = lockPosition.unlockTime - now;
  const tierMultiplier = lockTiers[lockPosition.tier].multiplier;
  
  return (lockPosition.amount * timeRemaining * tierMultiplier) / CONTRACT_CONSTANTS.BASIS_POINTS;
};

export const calculateUserWeight = (
  positions: LockedPosition[], 
  lockTiers: LockTierInfo[],
  CONTRACT_CONSTANTS: ContractConstants
): number => {
  return positions.reduce((total, position) => {
    return total + calculateLockWeight(position, lockTiers, CONTRACT_CONSTANTS);
  }, 0);
};

export const calculateAPYRange = (
  lockTiers: LockTierInfo[],
  CONTRACT_CONSTANTS: ContractConstants
): { min: number; max: number } => {
  const baseAPY = 15;
  const minAPY = baseAPY * (lockTiers[0].multiplier / CONTRACT_CONSTANTS.BASIS_POINTS);
  const maxAPY = baseAPY * (lockTiers[lockTiers.length - 1].multiplier / CONTRACT_CONSTANTS.BASIS_POINTS);
  
  return { min: minAPY, max: maxAPY };
};
