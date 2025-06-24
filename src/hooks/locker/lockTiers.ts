
import { LockTierInfo, ContractConstants } from './types';

export const DEFAULT_CONSTANTS: ContractConstants = {
  MIN_LOCK_DURATION: 30,
  MAX_LOCK_DURATION: 1826,
  BASIS_POINTS: 10000,
  EARLY_UNLOCK_PENALTY: 5000,
  PENALTY_BURN_SHARE: 5000,
  PENALTY_REWARD_SHARE: 5000
};

export const createLockTiers = (CONTRACT_CONSTANTS: ContractConstants): LockTierInfo[] => [
  {
    name: 'Bronze',
    minDuration: 1,
    multiplier: 10000,
    color: '#CD7F32',
    icon: '⛵',
    minDays: CONTRACT_CONSTANTS.MIN_LOCK_DURATION,
    maxDays: 89
  },
  {
    name: 'Silver',
    minDuration: 90,
    multiplier: 15000,
    color: '#C0C0C0',
    icon: '🛡️',
    minDays: 90,
    maxDays: 179
  },
  {
    name: 'Gold',
    minDuration: 180,
    multiplier: 20000,
    color: '#FFD700',
    icon: '👑',
    minDays: 180,
    maxDays: 364
  },
  {
    name: 'Diamond',
    minDuration: 365,
    multiplier: 30000,
    color: '#B9F2FF',
    icon: '💎',
    minDays: 365,
    maxDays: 1094
  },
  {
    name: 'Platinum',
    minDuration: 1095,
    multiplier: 50000,
    color: '#E5E4E2',
    icon: '⭐',
    minDays: 1095,
    maxDays: 1459
  },
  {
    name: 'Legendary',
    minDuration: 1460,
    multiplier: 80000,
    color: '#FF6B35',
    icon: '⚡',
    minDays: 1460,
    maxDays: 1826
  }
];
