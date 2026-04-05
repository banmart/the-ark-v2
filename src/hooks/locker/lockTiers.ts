
import { LockTierInfo, ContractConstants } from './types';

export const DEFAULT_CONSTANTS: ContractConstants = {
  MIN_LOCK_DURATION: 30,
  MAX_LOCK_DURATION: 1460,
  BASIS_POINTS: 10000,
  EARLY_UNLOCK_PENALTY: 5000,
  MAX_EARLY_PENALTY: 7500,
  PENALTY_BURN_SHARE: 5000,
  PENALTY_REWARD_SHARE: 5000
};

export const createLockTiers = (CONTRACT_CONSTANTS: ContractConstants): LockTierInfo[] => [
  {
    name: 'Bronze',
    minDuration: 30,
    multiplier: 10000,
    color: '#CD7F32',
    icon: '⛵',
    minDays: 30,
    maxDays: 89,
    label: '30 DAYS'
  },
  {
    name: 'Silver',
    minDuration: 90,
    multiplier: 15000,
    color: '#C0C0C0',
    icon: '🛡️',
    minDays: 90,
    maxDays: 179,
    label: '90 DAYS'
  },
  {
    name: 'Gold',
    minDuration: 180,
    multiplier: 20000,
    color: '#FFD700',
    icon: '👑',
    minDays: 180,
    maxDays: 364,
    label: '180 DAYS'
  },
  {
    name: 'Diamond',
    minDuration: 365,
    multiplier: 30000,
    color: '#B9F2FF',
    icon: '💎',
    minDays: 365,
    maxDays: 729,
    label: '1 YEAR'
  },
  {
    name: 'Platinum',
    minDuration: 730,
    multiplier: 40000,
    color: '#E5E4E2',
    icon: '⭐',
    minDays: 730,
    maxDays: 1094,
    label: '2 YEARS'
  },
  {
    name: 'Mythic',
    minDuration: 1095,
    multiplier: 50000,
    color: '#9B59B6',
    icon: '🔮',
    minDays: 1095,
    maxDays: 1459,
    label: '3 YEARS'
  },
  {
    name: 'Legendary',
    minDuration: 1460,
    multiplier: 70000,
    color: '#FF6B35',
    icon: '⚡',
    minDays: 1460,
    maxDays: 1460,
    label: '4 YEARS'
  }
];

// Export ContractConstants type for other files to use
export type { ContractConstants };
