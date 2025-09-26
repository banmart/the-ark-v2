interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface ARKMarketData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  dataSource: string;
}

interface ARKBlockchainData {
  totalSupply: number;
  circulatingSupply: number;
  burnedTokens: number;
  holders: number;
  dailyBurnRate: number;
}

export interface ConsolidatedARKData {
  market: ARKMarketData;
  blockchain: ARKBlockchainData;
  lastUpdated: Date;
  isStale: boolean;
}

class ARKDataCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  
  // Cache TTL constants (in milliseconds)
  private readonly PRICE_TTL = 2 * 60 * 1000; // 2 minutes for price data
  private readonly BLOCKCHAIN_TTL = 5 * 60 * 1000; // 5 minutes for blockchain data
  private readonly STALE_THRESHOLD = 30 * 1000; // 30 seconds stale threshold

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  isStale(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    
    return Date.now() - entry.timestamp > this.STALE_THRESHOLD;
  }

  setMarketData(data: ARKMarketData): void {
    this.set('market', data, this.PRICE_TTL);
  }

  getMarketData(): ARKMarketData | null {
    return this.get<ARKMarketData>('market');
  }

  setBlockchainData(data: ARKBlockchainData): void {
    this.set('blockchain', data, this.BLOCKCHAIN_TTL);
  }

  getBlockchainData(): ARKBlockchainData | null {
    return this.get<ARKBlockchainData>('blockchain');
  }

  isMarketDataStale(): boolean {
    return this.isStale('market');
  }

  isBlockchainDataStale(): boolean {
    return this.isStale('blockchain');
  }

  clear(): void {
    this.cache.clear();
  }

  // Get all cached data with staleness indicators
  getConsolidatedData(): ConsolidatedARKData | null {
    const market = this.getMarketData();
    const blockchain = this.getBlockchainData();
    
    if (!market || !blockchain) return null;
    
    const isStale = this.isMarketDataStale() || this.isBlockchainDataStale();
    
    return {
      market,
      blockchain,
      lastUpdated: new Date(Math.min(
        this.cache.get('market')?.timestamp || 0,
        this.cache.get('blockchain')?.timestamp || 0
      )),
      isStale
    };
  }
}

export const arkDataCache = new ARKDataCacheService();