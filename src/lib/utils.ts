import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLargeNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
  if (isNaN(numValue)) return '0';
  
  if (numValue >= 1000000000) {
    return `${(numValue / 1000000000).toFixed(1)}B`;
  } else if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K`;
  }
  return numValue < 1000 ? numValue.toFixed(2) : numValue.toFixed(0);
}

export function formatTokenAmount(amount: string | number, decimals: number = 18): string {
  const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numValue)) return '0';
  
  // For display, maintain precision but format appropriately
  if (numValue >= 1000000000) {
    return `${(numValue / 1000000000).toFixed(2)}B`;
  } else if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(2)}M`;
  } else if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(2)}K`;
  }
  return numValue.toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  });
}

export function formatPrice(price: string | number, decimals: number = 18): string {
  const numValue = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numValue) || numValue === 0) return '0.000000';
  
  // Bounds checking for obviously wrong prices
  if (numValue > 100) {
    console.warn('Price seems too high:', numValue);
    return 'Error';
  }
  
  // For very small prices like $0.0002049, use significant digits for better readability
  if (numValue >= 1) {
    return numValue.toFixed(6);
  } else if (numValue >= 0.001) {
    return numValue.toFixed(8);
  } else if (numValue >= 0.00001) {
    // For prices like 0.0002049, show 7 decimal places to maintain precision
    return numValue.toFixed(7);
  } else {
    // For extremely small prices, show up to 12 decimal places
    return numValue.toFixed(12);
  }
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0.00%';
  const percentage = (value / total) * 100;
  
  if (percentage < 0.01) {
    return '<0.01%';
  } else if (percentage < 1) {
    return percentage.toFixed(2) + '%';
  } else {
    return percentage.toFixed(1) + '%';
  }
}

export function formatPoolSharePercentage(value: number, total: number): string {
  if (total === 0) return '0.00% of pool';
  const percentage = (value / total) * 100;
  
  if (percentage < 0.01) {
    return '<0.01% of pool';
  } else if (percentage < 1) {
    return percentage.toFixed(2) + '% of pool';
  } else {
    return percentage.toFixed(1) + '% of pool';
  }
}

export function formatTokenPoolShare(userLocked: number, totalLocked: number): string {
  if (totalLocked === 0) return '0.00% of tokens';
  const percentage = (userLocked / totalLocked) * 100;
  
  if (percentage < 0.01) {
    return '<0.01% of tokens';
  } else if (percentage < 1) {
    return percentage.toFixed(2) + '% of tokens';
  } else {
    return percentage.toFixed(1) + '% of tokens';
  }
}

// Number formatting utilities for token locking
export function formatLockAmount(value: string | number, maxDecimals: number = 6): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '';
  
  // Round to max decimals to prevent precision issues
  const rounded = Math.floor(numValue * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  return rounded.toString();
}

export function validateLockAmount(value: string): { isValid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Invalid number format' };
  }
  
  if (numValue <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  // Check for too many decimal places
  const decimalPart = value.split('.')[1];
  if (decimalPart && decimalPart.length > 6) {
    return { isValid: false, error: 'Maximum 6 decimal places allowed' };
  }
  
  return { isValid: true };
}

export function formatPercentageAmount(balance: number, percentage: number): string {
  const amount = balance * percentage;
  return formatLockAmount(amount, 6);
}
