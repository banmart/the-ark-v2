import { DexPriceData } from './types';

export interface GraphQLPriceData {
  arkPriceUSD: number;
  arkPricePLS: number;
  plsUsdPrice: number;
  volume24hUSD: number;
  liquidityUSD: number;
  priceChange24h: number;
  totalVolumeUSD: number;
  totalLiquidity: number;
  txCount: number;
  reserves: {
    reserve0: string;
    reserve1: string;
    token0: { id: string; symbol: string };
    token1: { id: string; symbol: string };
  } | null;
  priceHistory: Array<{
    date: number;
    priceUSD: number;
    volumeUSD: number;
  }>;
  volumeHistory: Array<{
    date: number;
    volumeUSD: number;
    liquidityUSD: number;
  }>;
  timestamp: number;
  source: string;
  cached?: boolean;
  stale?: boolean;
  error?: string;
}

const PULSEX_GRAPHQL_URL = 'https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/pulsex-graphql';

// Local cache for the service
let cachedData: GraphQLPriceData | null = null;
let lastFetchTime = 0;
const LOCAL_CACHE_TTL_MS = 15000; // 15 seconds local cache

class GraphQLPriceService {
  async fetchPriceData(): Promise<GraphQLPriceData | null> {
    // Check local cache first
    if (cachedData && (Date.now() - lastFetchTime) < LOCAL_CACHE_TTL_MS) {
      console.log('Using local GraphQL price cache');
      return cachedData;
    }

    try {
      console.log('Fetching price data from PulseX GraphQL...');
      
      const response = await fetch(PULSEX_GRAPHQL_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`GraphQL fetch failed: ${response.status}`);
      }

      const data: GraphQLPriceData = await response.json();
      
      if (data.error && !data.arkPriceUSD) {
        throw new Error(data.error);
      }

      // Update local cache
      cachedData = data;
      lastFetchTime = Date.now();
      
      console.log('GraphQL price data fetched:', {
        arkPriceUSD: data.arkPriceUSD?.toFixed(8),
        volume24hUSD: data.volume24hUSD?.toFixed(2),
        cached: data.cached,
      });

      return data;
    } catch (error) {
      console.error('GraphQL price service error:', error);
      
      // Return cached data if available
      if (cachedData) {
        console.log('Returning stale local cache due to error');
        return cachedData;
      }
      
      return null;
    }
  }

  async getLivePrice(): Promise<DexPriceData> {
    const data = await this.fetchPriceData();
    
    if (data && data.arkPriceUSD > 0) {
      return {
        price: data.arkPriceUSD,
        priceChange24h: data.priceChange24h || 0,
        volume24h: data.volume24hUSD || 0,
        liquidity: data.liquidityUSD || 0,
        lastUpdated: new Date(data.timestamp),
        dataSource: data.stale ? 'PulseX GraphQL (stale)' : 'PulseX GraphQL',
        baseCurrency: 'USD',
      };
    }

    // Return error state
    return {
      price: 0,
      priceChange24h: 0,
      volume24h: 0,
      liquidity: 0,
      lastUpdated: new Date(),
      dataSource: 'Error',
      baseCurrency: 'USD',
    };
  }

  async getPLSPrice(): Promise<number> {
    const data = await this.fetchPriceData();
    return data?.plsUsdPrice || 0;
  }

  async getPriceHistory(): Promise<Array<{ date: number; priceUSD: number }>> {
    const data = await this.fetchPriceData();
    return data?.priceHistory || [];
  }

  async getVolumeHistory(): Promise<Array<{ date: number; volumeUSD: number; liquidityUSD: number }>> {
    const data = await this.fetchPriceData();
    return data?.volumeHistory || [];
  }

  getCachedPrice(): number {
    return cachedData?.arkPriceUSD || 0;
  }

  getCachedPLSPrice(): number {
    return cachedData?.plsUsdPrice || 0;
  }
}

export const graphqlPriceService = new GraphQLPriceService();
