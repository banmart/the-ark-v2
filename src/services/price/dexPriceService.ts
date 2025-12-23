import { CONTRACT_ADDRESSES } from '../../utils/constants';
import { PairDataService } from './pairDataService';
import { PriceCalculatorService } from './priceCalculatorService';
import { VolumeEstimatorService } from './volumeEstimatorService';
import { graphqlPriceService } from './graphqlPriceService';
import { DexPriceData } from './types';

class DexPriceService {
  private pairDataService: PairDataService;
  private priceCalculatorService: PriceCalculatorService;
  private volumeEstimatorService: VolumeEstimatorService;
  
  constructor() {
    this.pairDataService = new PairDataService();
    this.priceCalculatorService = new PriceCalculatorService();
    this.volumeEstimatorService = new VolumeEstimatorService();
  }

  async getLivePrice(pairAddress?: string): Promise<DexPriceData> {
    try {
      console.log('Fetching live ARK price data via GraphQL...');
      
      // Primary: Use GraphQL for comprehensive data
      const graphqlData = await graphqlPriceService.getLivePrice();
      
      if (graphqlData.price > 0 && graphqlData.dataSource !== 'Error') {
        console.log('GraphQL price data retrieved:', {
          arkPriceUSD: graphqlData.price.toFixed(8),
          priceChange24h: graphqlData.priceChange24h.toFixed(2),
          volume24h: graphqlData.volume24h.toFixed(2),
          liquidity: graphqlData.liquidity.toFixed(2),
          dataSource: graphqlData.dataSource
        });
        
        // Store price in history for consistency
        if (graphqlData.price > 0 && graphqlData.price < 1) {
          this.priceCalculatorService.addPriceToHistory(graphqlData.price);
        }
        
        return graphqlData;
      }
      
      // Fallback: Use RPC-based pricing
      console.log('GraphQL failed, falling back to RPC pricing...');
      return await this.getRPCPrice(pairAddress);
      
    } catch (error) {
      console.error('Error getting live price:', error);
      
      // Try RPC fallback
      try {
        return await this.getRPCPrice(pairAddress);
      } catch (rpcError) {
        console.error('RPC fallback also failed:', rpcError);
        
        // Return cached data if available
        const cachedPrice = this.priceCalculatorService.getCachedPrice() || graphqlPriceService.getCachedPrice();
        
        return {
          price: cachedPrice,
          priceChange24h: 0,
          volume24h: 0,
          liquidity: 0,
          lastUpdated: new Date(),
          dataSource: 'Error',
          baseCurrency: 'USD'
        };
      }
    }
  }

  // RPC-based price fetching (fallback)
  private async getRPCPrice(pairAddress?: string): Promise<DexPriceData> {
    const targetPairAddress = pairAddress || CONTRACT_ADDRESSES.ARK_PLS_PAIR;
    const pairData = await this.pairDataService.getPairData(targetPairAddress);
    
    if (!pairData) {
      throw new Error('Failed to get ARK pair data via RPC');
    }

    const arkPriceUSD = await this.priceCalculatorService.calculatePrice(pairData);
    
    console.log('RPC price calculation details:', {
      pairAddress: targetPairAddress,
      arkPriceUSD: arkPriceUSD.toFixed(8),
    });
    
    if (arkPriceUSD > 0 && arkPriceUSD < 1) {
      this.priceCalculatorService.addPriceToHistory(arkPriceUSD);
    }
    
    const priceChange24h = this.priceCalculatorService.calculate24hChange();
    const totalLiquidityUSD = this.volumeEstimatorService.calculateLiquidity(pairData, arkPriceUSD);
    const volume24h = await this.volumeEstimatorService.estimateVolume24h(pairData);
    
    return {
      price: arkPriceUSD,
      priceChange24h,
      volume24h,
      liquidity: totalLiquidityUSD,
      lastUpdated: new Date(),
      dataSource: 'ARK/PLS RPC Fallback',
      baseCurrency: 'USD'
    };
  }
}

export const dexPriceService = new DexPriceService();
export type { DexPriceData };