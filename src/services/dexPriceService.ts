
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORKS } from '../utils/constants';
import { priceOracleService, PriceOracleData } from './priceOracleService';

interface PulseXPairData {
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
}

interface DexPriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  lastUpdated: Date;
  dataSource: string;
  plsPriceSource: string;
}

// PulseX V2 Factory and Router addresses
const PULSEX_V2_FACTORY = '0x1715a3E4A142d8b698131108995174F37aEBA10D';
const WPLS_ADDRESS = '0xA1077a294dDE1B09bB078844df40758a5D0f9a27';

// PulseX V2 Factory ABI (minimal for getPair function)
const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];

// PulseX V2 Pair ABI (minimal for reserves)
const PAIR_ABI = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function totalSupply() external view returns (uint256)'
];

class DexPriceService {
  private provider: ethers.JsonRpcProvider;
  private priceHistory: { timestamp: number; price: number }[] = [];
  private currentPLSOracleData: PriceOracleData | null = null;
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
  }

  async getARKPairAddress(): Promise<string | null> {
    try {
      const factory = new ethers.Contract(PULSEX_V2_FACTORY, FACTORY_ABI, this.provider);
      const pairAddress = await factory.getPair(CONTRACT_ADDRESSES.ARK_TOKEN, WPLS_ADDRESS);
      
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        console.warn('ARK/WPLS pair not found on PulseX');
        return null;
      }
      
      console.log('ARK/WPLS pair found:', pairAddress);
      return pairAddress;
    } catch (error) {
      console.error('Error getting ARK pair address:', error);
      return null;
    }
  }

  async getPairData(pairAddress: string): Promise<PulseXPairData | null> {
    try {
      const pair = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
      
      const [reserves, token0, token1, totalSupply] = await Promise.all([
        pair.getReserves(),
        pair.token0(),
        pair.token1(),
        pair.totalSupply()
      ]);

      return {
        token0,
        token1,
        reserve0: reserves[0].toString(),
        reserve1: reserves[1].toString(),
        totalSupply: totalSupply.toString()
      };
    } catch (error) {
      console.error('Error getting pair data:', error);
      return null;
    }
  }

  async calculatePrice(pairData: PulseXPairData): Promise<{ arkPriceUSD: number; plsUsdPrice: number; source: string }> {
    try {
      // Get real PLS/USD price from oracle
      this.currentPLSOracleData = await priceOracleService.getPLSUSDPrice();
      const plsUsdPrice = this.currentPLSOracleData.plsUsdPrice;
      
      const { token0, token1, reserve0, reserve1 } = pairData;
      
      // Determine which token is ARK and which is WPLS
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      
      const arkReserve = isToken0ARK ? reserve0 : reserve1;
      const plsReserve = isToken0ARK ? reserve1 : reserve0;
      
      // Convert to numbers (both tokens have 18 decimals)
      const arkAmount = parseFloat(ethers.formatEther(arkReserve));
      const plsAmount = parseFloat(ethers.formatEther(plsReserve));
      
      if (arkAmount === 0) {
        return { arkPriceUSD: 0, plsUsdPrice, source: this.currentPLSOracleData.source };
      }
      
      // Price of ARK in PLS
      const arkPriceInPLS = plsAmount / arkAmount;
      
      // Convert to USD using real PLS price
      const arkPriceUSD = arkPriceInPLS * plsUsdPrice;
      
      console.log('Price calculation:', {
        arkAmount: arkAmount.toFixed(2),
        plsAmount: plsAmount.toFixed(2),
        arkPriceInPLS: arkPriceInPLS.toFixed(8),
        plsUsdPrice: plsUsdPrice.toFixed(8),
        arkPriceUSD: arkPriceUSD.toFixed(8),
        source: this.currentPLSOracleData.source
      });
      
      return { arkPriceUSD, plsUsdPrice, source: this.currentPLSOracleData.source };
    } catch (error) {
      console.error('Error calculating price:', error);
      const fallbackPLS = priceOracleService.getCachedPrice();
      return { arkPriceUSD: 0, plsUsdPrice: fallbackPLS, source: 'Error' };
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

  addPriceToHistory(price: number) {
    const now = Date.now();
    this.priceHistory.push({ timestamp: now, price });
    
    // Keep only last 30 days of price history
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    this.priceHistory = this.priceHistory.filter(p => p.timestamp >= thirtyDaysAgo);
  }

  async estimateVolume24h(pairData: PulseXPairData): Promise<number> {
    try {
      // Estimate volume based on reserves and typical trading activity
      const { reserve0, reserve1 } = pairData;
      const arkReserve = parseFloat(ethers.formatEther(reserve0));
      const plsReserve = parseFloat(ethers.formatEther(reserve1));
      
      // Estimate daily volume as a percentage of liquidity (typically 50-200% for active pairs)
      const totalLiquidityARK = arkReserve;
      const estimatedDailyTurnover = 0.75; // 75% daily turnover estimate
      
      return totalLiquidityARK * estimatedDailyTurnover;
    } catch (error) {
      console.error('Error estimating volume:', error);
      return 0;
    }
  }

  async getLivePrice(): Promise<DexPriceData> {
    try {
      console.log('Fetching live ARK price data...');
      
      const pairAddress = await this.getARKPairAddress();
      
      if (!pairAddress) {
        throw new Error('ARK/WPLS pair not found');
      }

      const pairData = await this.getPairData(pairAddress);
      
      if (!pairData) {
        throw new Error('Failed to get pair data');
      }

      const { arkPriceUSD, plsUsdPrice, source } = await this.calculatePrice(pairData);
      
      if (arkPriceUSD > 0) {
        this.addPriceToHistory(arkPriceUSD);
      }
      
      const priceChange24h = this.calculate24hChange();
      
      // Calculate real liquidity using both reserves
      const { token0, token1, reserve0, reserve1 } = pairData;
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      
      const arkReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve0 : reserve1));
      const plsReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve1 : reserve0));
      
      const arkLiquidityUSD = arkReserve * arkPriceUSD;
      const plsLiquidityUSD = plsReserve * plsUsdPrice;
      const totalLiquidityUSD = arkLiquidityUSD + plsLiquidityUSD;
      
      // Estimate 24h volume
      const volume24h = await this.estimateVolume24h(pairData);
      
      console.log('Live price data retrieved:', {
        arkPriceUSD: arkPriceUSD.toFixed(8),
        priceChange24h: priceChange24h.toFixed(2),
        volume24h: volume24h.toFixed(2),
        totalLiquidityUSD: totalLiquidityUSD.toFixed(2),
        plsPriceSource: source
      });
      
      return {
        price: arkPriceUSD,
        priceChange24h,
        volume24h,
        liquidity: totalLiquidityUSD,
        lastUpdated: new Date(),
        dataSource: 'PulseX',
        plsPriceSource: source
      };
    } catch (error) {
      console.error('Error getting live price from PulseX:', error);
      
      // Return error state with cached data if available
      const cachedPrice = this.priceHistory.length > 0 
        ? this.priceHistory[this.priceHistory.length - 1].price 
        : 0;
        
      return {
        price: cachedPrice,
        priceChange24h: 0,
        volume24h: 0,
        liquidity: 0,
        lastUpdated: new Date(),
        dataSource: 'Error',
        plsPriceSource: 'None'
      };
    }
  }
}

export const dexPriceService = new DexPriceService();
export type { DexPriceData };
