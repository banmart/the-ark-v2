
import { CONTRACT_ADDRESSES } from '../../utils/constants';
import { PairDataService } from './pairDataService';
import { PriceCalculatorService } from './priceCalculatorService';
import { VolumeEstimatorService } from './volumeEstimatorService';
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

  async getLivePrice(): Promise<DexPriceData> {
    try {
      console.log('Fetching live ARK/DAI price data...');
      
      const pairAddress = CONTRACT_ADDRESSES.ARK_DAI_PAIR;
      const pairData = await this.pairDataService.getPairData(pairAddress);
      
      if (!pairData) {
        throw new Error('Failed to get ARK/DAI pair data');
      }

      const arkPriceUSD = await this.priceCalculatorService.calculatePrice(pairData);
      
      if (arkPriceUSD > 0) {
        this.priceCalculatorService.addPriceToHistory(arkPriceUSD);
      }
      
      const priceChange24h = this.priceCalculatorService.calculate24hChange();
      const totalLiquidityUSD = this.volumeEstimatorService.calculateLiquidity(pairData, arkPriceUSD);
      const volume24h = await this.volumeEstimatorService.estimateVolume24h(pairData);
      
      console.log('Live ARK/DAI price data retrieved:', {
        arkPriceUSD: arkPriceUSD.toFixed(8),
        priceChange24h: priceChange24h.toFixed(2),
        volume24h: volume24h.toFixed(2),
        totalLiquidityUSD: totalLiquidityUSD.toFixed(2)
      });
      
      return {
        price: arkPriceUSD,
        priceChange24h,
        volume24h,
        liquidity: totalLiquidityUSD,
        lastUpdated: new Date(),
        dataSource: 'PulseX',
        baseCurrency: 'DAI'
      };
    } catch (error) {
      console.error('Error getting live price from ARK/DAI pair:', error);
      
      // Return error state with cached data if available
      const cachedPrice = this.priceCalculatorService.getCachedPrice();
        
      return {
        price: cachedPrice,
        priceChange24h: 0,
        volume24h: 0,
        liquidity: 0,
        lastUpdated: new Date(),
        dataSource: 'Error',
        baseCurrency: 'DAI'
      };
    }
  }
}

export const dexPriceService = new DexPriceService();
export type { DexPriceData };
