import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../../utils/constants';
import { PulseXPairData, PriceHistoryPoint } from './types';

export class PriceCalculatorService {
  private priceHistory: PriceHistoryPoint[] = [];

  async calculatePrice(pairData: PulseXPairData): Promise<number> {
    try {
      const { token0, token1, reserve0, reserve1 } = pairData;
      
      console.log('Raw pair data:', {
        token0,
        token1,
        reserve0,
        reserve1
      });
      
      // Determine which token is ARK 
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      const isWPLS = token0.toLowerCase() === CONTRACT_ADDRESSES.WPLS.toLowerCase() || 
                     token1.toLowerCase() === CONTRACT_ADDRESSES.WPLS.toLowerCase();
      
      const arkReserve = isToken0ARK ? reserve0 : reserve1;
      const otherReserve = isToken0ARK ? reserve1 : reserve0;
      const otherToken = isToken0ARK ? token1 : token0;
      
      // Convert to numbers (both tokens have 18 decimals)
      const arkAmount = parseFloat(ethers.formatEther(arkReserve));
      const otherAmount = parseFloat(ethers.formatEther(otherReserve));
      
      if (arkAmount === 0) {
        console.warn('ARK amount is zero');
        return 0;
      }
      
      // Price of ARK in terms of the other token (PLS, DAI, etc.)
      const arkPriceInOtherToken = otherAmount / arkAmount;
      
      // Convert to USD if the pair is ARK/PLS
      let arkPriceUSD = arkPriceInOtherToken;
      
      if (isWPLS) {
        // ARK/PLS pair - convert PLS to USD
        try {
          const { priceOracleService } = await import('../priceOracleService');
          const plsData = await priceOracleService.getPLSUSDPrice();
          arkPriceUSD = arkPriceInOtherToken * plsData.plsUsdPrice;
          
          console.log('ARK/PLS price conversion:', {
            arkPriceInPLS: arkPriceInOtherToken.toFixed(8),
            plsUsdPrice: plsData.plsUsdPrice.toFixed(8),
            arkPriceUSD: arkPriceUSD.toFixed(8),
            plsSource: plsData.source
          });
        } catch (error) {
          console.warn('Failed to fetch PLS price, using fallback:', error);
          arkPriceUSD = arkPriceInOtherToken * 0.00002; // Fallback PLS price
        }
      }
      
      console.log('Price calculation:', {
        arkAmount: arkAmount.toFixed(2),
        otherAmount: otherAmount.toFixed(2),
        otherToken,
        arkPriceInOtherToken: arkPriceInOtherToken.toFixed(8),
        arkPriceUSD: arkPriceUSD.toFixed(8),
        isToken0ARK,
        isWPLS
      });
      
      return arkPriceUSD;
    } catch (error) {
      console.error('Error calculating price:', error);
      return 0;
    }
  }

  calculate24hChange(): number {
    if (this.priceHistory.length < 2) return 0;
    
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    // Find price closest to 24h ago
    const oldPrice = this.priceHistory.find(p => p.timestamp >= oneDayAgo);
    const currentPrice = this.priceHistory[this.priceHistory.length - 1];
    
    if (!oldPrice || !currentPrice || oldPrice.price === 0) return 0;
    
    return ((currentPrice.price - oldPrice.price) / oldPrice.price) * 100;
  }

  addPriceToHistory(price: number): void {
    const now = Date.now();
    this.priceHistory.push({ timestamp: now, price });
    
    // Keep only last 30 days of price history
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    this.priceHistory = this.priceHistory.filter(p => p.timestamp >= thirtyDaysAgo);
  }

  getPriceHistory(): PriceHistoryPoint[] {
    return [...this.priceHistory];
  }

  getCachedPrice(): number {
    return this.priceHistory.length > 0 
      ? this.priceHistory[this.priceHistory.length - 1].price 
      : 0;
  }
}
