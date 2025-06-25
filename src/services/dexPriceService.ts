import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORKS } from '../utils/constants';

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
  baseCurrency: string;
}

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
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
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

  async calculatePrice(pairData: PulseXPairData): Promise<number> {
    try {
      const { token0, token1, reserve0, reserve1 } = pairData;
      
      // Determine which token is ARK and which is DAI
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      
      const arkReserve = isToken0ARK ? reserve0 : reserve1;
      const daiReserve = isToken0ARK ? reserve1 : reserve0;
      
      // Convert to numbers (both tokens have 18 decimals)
      const arkAmount = parseFloat(ethers.formatEther(arkReserve));
      const daiAmount = parseFloat(ethers.formatEther(daiReserve));
      
      if (arkAmount === 0) {
        return 0;
      }
      
      // Price of ARK in USD (since DAI ≈ USD)
      const arkPriceUSD = daiAmount / arkAmount;
      
      console.log('ARK/DAI price calculation:', {
        arkAmount: arkAmount.toFixed(2),
        daiAmount: daiAmount.toFixed(2),
        arkPriceUSD: arkPriceUSD.toFixed(8)
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

  async getLivePrice(): Promise<DexPriceData> {
    try {
      console.log('Fetching live ARK/DAI price data...');
      
      const pairAddress = CONTRACT_ADDRESSES.ARK_DAI_PAIR;
      const pairData = await this.getPairData(pairAddress);
      
      if (!pairData) {
        throw new Error('Failed to get ARK/DAI pair data');
      }

      const arkPriceUSD = await this.calculatePrice(pairData);
      
      if (arkPriceUSD > 0) {
        this.addPriceToHistory(arkPriceUSD);
      }
      
      const priceChange24h = this.calculate24hChange();
      
      // Calculate real liquidity using both reserves
      const { token0, reserve0, reserve1 } = pairData;
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      
      const arkReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve0 : reserve1));
      const daiReserve = parseFloat(ethers.formatEther(isToken0ARK ? reserve1 : reserve0));
      
      const arkLiquidityUSD = arkReserve * arkPriceUSD;
      const daiLiquidityUSD = daiReserve; // DAI ≈ USD
      const totalLiquidityUSD = arkLiquidityUSD + daiLiquidityUSD;
      
      // Estimate 24h volume
      const volume24h = await this.estimateVolume24h(pairData);
      
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
        baseCurrency: 'DAI'
      };
    }
  }
}

export const dexPriceService = new DexPriceService();
export type { DexPriceData };
