import { supabase } from '@/integrations/supabase/client';

export interface CachedBlockchainData {
  totalSupply: string;
  decimals: number;
  burnedTokens: string;
  circulatingSupply: string;
  holders: number;
  dailyBurnRate: number;
  lastUpdated: string;
}

export interface CachedMarketData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  arkReserve: number;
  plsReserve: number;
  dataSource: string;
  lastUpdated: string;
}

export interface CachedLockerData {
  totalLockedTokens: string;
  totalRewardsDistributed: string;
  activeLockerCount: number;
  rewardPool: string;
  totalProtocolWeight: number;
  emergencyMode: boolean;
  contractPaused: boolean;
  lastUpdated: string;
}

interface CacheEntry {
  data_type: string;
  data: any;
  expires_at: string;
  updated_at: string;
}

class SupabaseCacheService {
  private readonly CACHE_REFRESH_THRESHOLD = 14 * 60 * 1000; // 14 minutes in ms

  async getBlockchainData(): Promise<CachedBlockchainData | null> {
    return this.getCacheData<CachedBlockchainData>('blockchain');
  }

  async getMarketData(): Promise<CachedMarketData | null> {
    return this.getCacheData<CachedMarketData>('market');
  }

  async getLockerData(): Promise<CachedLockerData | null> {
    return this.getCacheData<CachedLockerData>('locker');
  }

  async getAllData() {
    const [blockchain, market, locker] = await Promise.all([
      this.getBlockchainData(),
      this.getMarketData(),
      this.getLockerData(),
    ]);

    return { blockchain, market, locker };
  }

  private async getCacheData<T>(dataType: string): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from('ark_token_cache')
        .select('*')
        .eq('data_type', dataType)
        .single();

      if (error) {
        console.error(`Error fetching ${dataType} cache:`, error);
        return null;
      }

      if (!data) return null;

      const cacheEntry = data as CacheEntry;
      const expiresAt = new Date(cacheEntry.expires_at).getTime();
      const now = Date.now();

      // Check if expired
      if (now > expiresAt) {
        console.log(`${dataType} cache expired, triggering refresh...`);
        this.triggerCacheRefresh(); // Non-blocking refresh
        return null;
      }

      // Check if approaching expiry (14+ minutes old)
      const updatedAt = new Date(cacheEntry.updated_at).getTime();
      if (now - updatedAt > this.CACHE_REFRESH_THRESHOLD) {
        console.log(`${dataType} cache is stale, triggering background refresh...`);
        this.triggerCacheRefresh(); // Non-blocking background refresh
      }

      return cacheEntry.data as T;
    } catch (error) {
      console.error(`Error in getCacheData for ${dataType}:`, error);
      return null;
    }
  }

  async triggerCacheRefresh(waitForCompletion = false): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('update-ark-cache', {
        body: { manual: true },
      });

      if (error) {
        console.error('Error triggering cache refresh:', error);
      } else if (waitForCompletion) {
        console.log('Cache refresh completed:', data);
      } else {
        console.log('Cache refresh triggered in background');
      }
    } catch (error) {
      console.error('Error invoking cache refresh function:', error);
    }
  }

  async isCacheStale(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('ark_token_cache')
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return true;

      const updatedAt = new Date(data.updated_at).getTime();
      const now = Date.now();
      const ageMinutes = (now - updatedAt) / (60 * 1000);

      return ageMinutes > 15;
    } catch (error) {
      console.error('Error checking cache staleness:', error);
      return true;
    }
  }

  async manualRefresh(): Promise<void> {
    console.log('Manual cache refresh requested...');
    await this.triggerCacheRefresh(true);
  }
}

export const supabaseCacheService = new SupabaseCacheService();
