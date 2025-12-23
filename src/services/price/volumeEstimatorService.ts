import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../../utils/constants';
import { PulseXPairData } from './types';
import { graphqlPriceService } from './graphqlPriceService';

export class VolumeEstimatorService {
  // Use real volume from GraphQL when available, fallback to estimate
  async estimateVolume24h(pairData: PulseXPairData): Promise<number> {
    try {
      // Try to get real volume from GraphQL first
      const graphqlData = await graphqlPriceService.fetchPriceData();
      
      if (graphqlData && graphqlData.volume24hUSD > 0) {
        console.log('Using real 24h volume from GraphQL:', graphqlData.volume24hUSD);
        return graphqlData.volume24hUSD;
      }
      
      // Fallback: Estimate based on reserves (less accurate)
      console.log('GraphQL volume unavailable, using estimate');
      const { token0, reserve0, reserve1 } = pairData;
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      const arkReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve0 : reserve1));
      
      // Estimate daily volume as 75% of ARK reserve
      const estimatedDailyTurnover = 0.75;
      return arkReserve * estimatedDailyTurnover;
    } catch (error) {
      console.error('Error estimating volume:', error);
      return 0;
    }
  }

  // Use real liquidity from GraphQL when available
  calculateLiquidity(pairData: PulseXPairData, arkPriceUSD: number): number {
    try {
      // Try to use cached GraphQL liquidity if available
      const cachedData = graphqlPriceService.getCachedPrice();
      // Note: We can't access liquidityUSD directly here without async
      // So we calculate from reserves as fallback
      
      const { token0, reserve0, reserve1 } = pairData;
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      
      const arkReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve0 : reserve1));
      const plsReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve1 : reserve0));
      
      // For ARK/PLS pair, calculate USD value of both sides
      const arkLiquidityUSD = arkReserve * arkPriceUSD;
      // PLS side value approximately equals ARK side in a balanced pool
      const plsLiquidityUSD = arkLiquidityUSD; 
      
      return arkLiquidityUSD + plsLiquidityUSD;
    } catch (error) {
      console.error('Error calculating liquidity:', error);
      return 0;
    }
  }

  // New method to get liquidity directly from GraphQL (async)
  async getLiquidityUSD(): Promise<number> {
    try {
      const graphqlData = await graphqlPriceService.fetchPriceData();
      if (graphqlData && graphqlData.liquidityUSD > 0) {
        return graphqlData.liquidityUSD;
      }
      return 0;
    } catch (error) {
      console.error('Error getting GraphQL liquidity:', error);
      return 0;
    }
  }
}
