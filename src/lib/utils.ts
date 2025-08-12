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
  if (isNaN(numValue)) return '0.000000';
  
  // Convert from wei (18 decimals) to actual price
  const priceInEther = numValue / Math.pow(10, decimals);
  
  // For very small prices, use exponential notation
  if (priceInEther < 0.000001) {
    return priceInEther.toExponential(4);
  }
  // For small prices, show more decimal places
  else if (priceInEther < 0.01) {
    return priceInEther.toFixed(8);
  }
  // For medium prices, show 6 decimal places
  else if (priceInEther < 1) {
    return priceInEther.toFixed(6);
  }
  // For larger prices, show fewer decimals
  else {
    return priceInEther.toFixed(4);
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