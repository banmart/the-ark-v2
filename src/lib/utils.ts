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
