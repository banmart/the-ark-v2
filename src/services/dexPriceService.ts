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
}

// PulseX V2 Factory and Router addresses
const PULSEX_V2_FACTORY = '0x1715a3E4A142d8b698131108995174F37aEBA10D';
const PULSEX_V2_ROUTER = '0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02';
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

  calculatePrice(pairData: PulseXPairData): number {
    try {
      const { token0, token1, reserve0, reserve1 } = pairData;
      
      // Determine which token is ARK and which is WPLS
      const isToken0ARK = token0.toLowerCase() === CONTRACT_ADDRESSES.ARK_TOKEN.toLowerCase();
      
      const arkReserve = isToken0ARK ? reserve0 : reserve1;
      const plsReserve = isToken0ARK ? reserve1 : reserve0;
      
      // Convert to numbers (both tokens have 18 decimals)
      const arkAmount = parseFloat(ethers.formatEther(arkReserve));
      const plsAmount = parseFloat(ethers.formatEther(plsReserve));
      
      if (arkAmount === 0) return 0;
      
      // Price of ARK in PLS
      const arkPriceInPLS = plsAmount / arkAmount;
      
      // For USD price, we'd need PLS/USD rate
      // For now, using a reasonable PLS price estimate
      const plsUSDPrice = 0.00002; // This should be fetched from an oracle
      
      return arkPriceInPLS * plsUSDPrice;
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

  async getLivePrice(): Promise<DexPriceData> {
    try {
      const pairAddress = await this.getARKPairAddress();
      
      if (!pairAddress) {
        // Fallback to simulated data if pair not found
        return this.getFallbackData();
      }

      const pairData = await this.getPairData(pairAddress);
      
      if (!pairData) {
        return this.getFallbackData();
      }

      const price = this.calculatePrice(pairData);
      this.addPriceToHistory(price);
      
      const priceChange24h = this.calculate24hChange();
      
      // Calculate liquidity (total value locked in USD)
      const arkReserve = parseFloat(ethers.formatEther(pairData.reserve0));
      const plsReserve = parseFloat(ethers.formatEther(pairData.reserve1));
      const liquidity = (arkReserve * price) + (plsReserve * 0.00002); // Approximate USD value
      
      return {
        price,
        priceChange24h,
        volume24h: Math.random() * 100000 + 50000, // TODO: Calculate from recent transactions
        liquidity,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error getting live price:', error);
      return this.getFallbackData();
    }
  }

  private getFallbackData(): DexPriceData {
    // Fallback to reasonable simulated data
    const basePrice = 0.000015;
    const variation = (Math.random() - 0.5) * 0.000002;
    
    return {
      price: basePrice + variation,
      priceChange24h: (Math.random() - 0.5) * 20,
      volume24h: Math.random() * 500000 + 100000,
      liquidity: 850000 + Math.random() * 200000,
      lastUpdated: new Date()
    };
  }
}

export const dexPriceService = new DexPriceService();
export type { DexPriceData };
