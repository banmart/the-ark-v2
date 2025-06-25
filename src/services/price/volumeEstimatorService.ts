
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../../utils/constants';
import { PulseXPairData } from './types';

export class VolumeEstimatorService {
  async estimateVolume24h(pairData: PulseXPairData): Promise<number> {
    try {
      // Estimate volume based on reserves and typical trading activity
      const { token0, reserve0, reserve1 } = pairData;
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      const arkReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve0 : reserve1));
      
      // Estimate daily volume as a percentage of liquidity (typically 50-200% for active pairs)
      const estimatedDailyTurnover = 0.75; // 75% daily turnover estimate
      
      return arkReserve * estimatedDailyTurnover;
    } catch (error) {
      console.error('Error estimating volume:', error);
      return 0;
    }
  }

  calculateLiquidity(pairData: PulseXPairData, arkPriceUSD: number): number {
    try {
      const { token0, reserve0, reserve1 } = pairData;
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      
      const arkReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve0 : reserve1));
      const daiReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve1 : reserve0));
      
      const arkLiquidityUSD = arkReserve * arkPriceUSD;
      const daiLiquidityUSD = daiReserve; // DAI ≈ USD
      
      return arkLiquidityUSD + daiLiquidityUSD;
    } catch (error) {
      console.error('Error calculating liquidity:', error);
      return 0;
    }
  }
}
