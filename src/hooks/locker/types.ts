
export enum LockTier {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
  DIAMOND = 3,
  PLATINUM = 4,
  MYTHIC = 5,
  LEGENDARY = 6
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
  readyToUnlockCount: number;
  inProgressCount: number;
}

export interface ProtocolStats {
  totalLockedTokens: number;
  totalRewardsDistributed: number;
  totalActiveLockers: number;
  rewardPool: number;
  averageAPY: number;
}

export interface PenaltyCalculation {
  penalty: number;
  userReceives: number;
  penaltyRate: number;
}

export interface ContractConstants {
  MIN_LOCK_DURATION: number;
  MAX_LOCK_DURATION: number;
  BASIS_POINTS: number;
  EARLY_UNLOCK_PENALTY: number;
  MAX_EARLY_PENALTY: number;
  PENALTY_BURN_SHARE: number;
  PENALTY_REWARD_SHARE: number;
}
