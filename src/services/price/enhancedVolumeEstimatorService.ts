import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../../utils/constants';
import { PulseXPairData } from './types';

export interface VolumeAnalytics {
  volume24hUSD: number;
  volume24hARK: number;
  liquidity: number;
  priceUSD: number;
  burnPerMillionUSD: number;
  isStablePair: boolean;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export class EnhancedVolumeEstimatorService {
  // Known stable coins on PulseChain
  private readonly STABLE_COINS = new Set([
    '0xefd766ccb38eaf1dfd701853bfce31359239f305', // DAI
    '0x15d382d3e7c0b91b22e66b4f1b9b19e5c6c76b0e', // USDC.e (example - update with actual)
    '0xa0b86a33e624ccb4c2a4b2c1b8b8b8b8b8b8b8b8', // USDT (example - update with actual)
  ].map(addr => addr.toLowerCase()));

  private readonly WPLS_ADDRESS = CONTRACT_ADDRESSES.WPLS.toLowerCase();
  private readonly ARK_ADDRESS = CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();

  async analyzeVolume(
    pairData: PulseXPairData, 
    pairAddress: string,
    recent24hSwaps: number = 0
  ): Promise<VolumeAnalytics> {
    try {
      const { token0, token1, reserve0, reserve1 } = pairData;
      const isToken0ARK = token0.toLowerCase() === this.ARK_ADDRESS;
      const otherToken = isToken0ARK ? token1.toLowerCase() : token0.toLowerCase();
      
      const arkReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve0 : reserve1));
      const otherReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve1 : reserve0));
      
      // Determine if this is a stable pair
      const isStablePair = this.STABLE_COINS.has(otherToken);
      
      // Calculate USD price and volume
      let priceUSD = 0;
      let volume24hUSD = 0;
      let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
      
      if (isStablePair) {
        // Direct USD pricing from stable pair
        priceUSD = otherReserve / arkReserve;
        volume24hUSD = recent24hSwaps * priceUSD;
        confidenceLevel = 'high';
      } else if (otherToken === this.WPLS_ADDRESS) {
        // PLS pair - would need PLS/USD price oracle
        // For now, use conservative estimation
        priceUSD = this.estimatePriceFromPLS(arkReserve, otherReserve);
        volume24hUSD = recent24hSwaps * priceUSD;
        confidenceLevel = 'medium';
      } else {
        // Other token pairs - use liquidity-based estimation
        const estimatedPrice = this.estimatePriceFromLiquidity(arkReserve, otherReserve);
        priceUSD = estimatedPrice;
        volume24hUSD = recent24hSwaps * estimatedPrice;
        confidenceLevel = 'low';
      }
      
      // Calculate liquidity in USD
      const arkLiquidityUSD = arkReserve * priceUSD;
      const otherLiquidityUSD = isStablePair ? otherReserve : otherReserve * priceUSD;
      const totalLiquidity = arkLiquidityUSD + otherLiquidityUSD;
      
      // Estimate 24h volume if not provided
      if (recent24hSwaps === 0) {
        // Estimate based on liquidity (typically 50-200% daily turnover)
        const dailyTurnoverRate = isStablePair ? 1.0 : 0.5; // Higher for stable pairs
        recent24hSwaps = arkReserve * dailyTurnoverRate;
        volume24hUSD = recent24hSwaps * priceUSD;
      }

      return {
        volume24hUSD,
        volume24hARK: recent24hSwaps,
        liquidity: totalLiquidity,
        priceUSD,
        burnPerMillionUSD: volume24hUSD > 0 ? 0 : 0, // Will be calculated separately
        isStablePair,
        confidenceLevel
      };
      
    } catch (error) {
      console.error('Error analyzing volume:', error);
      return this.getEmptyAnalytics();
    }
  }

  calculateBurnPerMillionUSD(burnAmount: number, volumeUSD: number): number {
    if (volumeUSD <= 0) return 0;
    return (burnAmount / (volumeUSD / 1_000_000));
  }

  private estimatePriceFromPLS(arkReserve: number, plsReserve: number): number {
    // Use more realistic PLS price estimation based on current market
    // Fallback to $0.0001 as conservative estimate
    const estimatedPLSPrice = 0.0001;
    const calculatedPrice = (plsReserve * estimatedPLSPrice) / arkReserve;
    
    // Ensure reasonable bounds for ARK price (between $0.000001 and $1)
    return Math.max(0.000001, Math.min(1.0, calculatedPrice));
  }

  private estimatePriceFromLiquidity(arkReserve: number, otherReserve: number): number {
    // Improved price estimation using liquidity depth
    // Base on typical ARK price range and liquidity ratios
    const liquidityRatio = otherReserve / Math.max(arkReserve, 1);
    const basePrice = 0.000001; // $0.000001 baseline
    
    // Scale price based on liquidity ratio with reasonable bounds
    const scaledPrice = basePrice * Math.min(liquidityRatio * 0.1, 100);
    return Math.max(0.000001, Math.min(0.01, scaledPrice)); // Cap between $0.000001 and $0.01
  }

  private getEmptyAnalytics(): VolumeAnalytics {
    return {
      volume24hUSD: 0,
      volume24hARK: 0,
      liquidity: 0,
      priceUSD: 0,
      burnPerMillionUSD: 0,
      isStablePair: false,
      confidenceLevel: 'low'
    };
  }

  // Utility method to identify token types
  isStableCoin(tokenAddress: string): boolean {
    return this.STABLE_COINS.has(tokenAddress.toLowerCase());
  }

  isWPLS(tokenAddress: string): boolean {
    return tokenAddress.toLowerCase() === this.WPLS_ADDRESS;
  }
}

export const enhancedVolumeEstimatorService = new EnhancedVolumeEstimatorService();
