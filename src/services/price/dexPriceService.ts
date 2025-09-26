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

  async getLivePrice(pairAddress?: string): Promise<DexPriceData> {
    try {
      console.log('Fetching live ARK price data...');
      
      // Use ARK/PLS pair by default for most accurate pricing
      const targetPairAddress = pairAddress || CONTRACT_ADDRESSES.ARK_PLS_PAIR;
      const pairData = await this.pairDataService.getPairData(targetPairAddress);
      
      if (!pairData) {
        throw new Error('Failed to get ARK pair data');
      }

      const arkPriceInPair = await this.priceCalculatorService.calculatePrice(pairData);
      
      // The price calculator now handles PLS to USD conversion internally
      const arkPriceUSD = arkPriceInPair;
      
      // Determine the actual base currency and data source
      const isARKPLSPair = targetPairAddress.toLowerCase() === CONTRACT_ADDRESSES.ARK_PLS_PAIR.toLowerCase();
      const baseCurrency = 'USD'; // Always convert to USD for consistency
      const dataSource = isARKPLSPair ? 'ARK/PLS PulseX' : `PulseX Pair`;
      
      console.log('ARK price calculation details:', {
        pairAddress: targetPairAddress,
        arkPriceUSD: arkPriceUSD.toFixed(8),
        isARKPLSPair,
        dataSource
      });
      
      // Bounds checking - flag obviously wrong prices
      if (arkPriceUSD > 1 || arkPriceUSD < 0.00000001) {
        console.warn('Price out of expected bounds:', arkPriceUSD);
      }
      
      if (arkPriceUSD > 0 && arkPriceUSD < 1) {
        this.priceCalculatorService.addPriceToHistory(arkPriceUSD);
      }
      
      const priceChange24h = this.priceCalculatorService.calculate24hChange();
      const totalLiquidityUSD = this.volumeEstimatorService.calculateLiquidity(pairData, arkPriceUSD);
      const volume24h = await this.volumeEstimatorService.estimateVolume24h(pairData);
      
      console.log('Live ARK price data retrieved:', {
        arkPriceUSD: arkPriceUSD.toFixed(8),
        priceChange24h: priceChange24h.toFixed(2),
        volume24h: volume24h.toFixed(2),
        totalLiquidityUSD: totalLiquidityUSD.toFixed(2),
        dataSource
      });
      
      return {
        price: arkPriceUSD,
        priceChange24h,
        volume24h,
        liquidity: totalLiquidityUSD,
        lastUpdated: new Date(),
        dataSource,
        baseCurrency
      };
    } catch (error) {
      console.error('Error getting live price:', error);
      
      // Return error state with cached data if available
      const cachedPrice = this.priceCalculatorService.getCachedPrice();
        
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

export const dexPriceService = new DexPriceService();
export type { DexPriceData };