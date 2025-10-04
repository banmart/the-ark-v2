import { formatUnits } from 'ethers';

const TOKEN_DECIMALS = 18;

/**
 * Format bigint token amount to a readable string
 */
export const formatTokenAmount = (amount: bigint | number, decimals: number = TOKEN_DECIMALS): string => {
  if (typeof amount === 'number') return amount.toLocaleString();
  try {
    return Number(formatUnits(amount, decimals)).toLocaleString(undefined, {
      maximumFractionDigits: 2
    });
  } catch {
    return '0';
  }
};

/**
 * Format bigint to fixed decimal places
 */
export const formatBigIntFixed = (amount: bigint | number, decimals: number = 0): string => {
  if (typeof amount === 'number') return amount.toFixed(decimals);
  try {
    return Number(formatUnits(amount, TOKEN_DECIMALS)).toFixed(decimals);
  } catch {
    return '0';
  }
};

/**
 * Convert bigint to number safely
 */
export const bigIntToNumber = (value: bigint | number): number => {
  if (typeof value === 'number') return value;
  try {
    return Number(value);
  } catch {
    return 0;
  }
};
