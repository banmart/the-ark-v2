import { useState, useEffect } from 'react';
import { supabaseCacheService } from '../services/supabaseCacheService';

interface OptimizedARKData {
  totalSupply: string;
  marketCap: string;
  holders: string;
  price: string;
  priceChange24h: string;
  circulatingSupply: string;
  burnedTokens: string;
  volume24h: string;
  volumeChange24h: string;
  liquidity: string;
  dailyBurnRate: string;
  lastUpdated: Date;
  dataSource: string;
}

export const useOptimizedARKData = (forceRefresh: boolean = false) => {
  const [data, setData] = useState<OptimizedARKData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Trigger manual refresh if forced
      if (forceRefresh) {
        await supabaseCacheService.manualRefresh();
      }

      // Get all cached data
      const { blockchain, market } = await supabaseCacheService.getAllData();

      if (!blockchain || !market) {
        setError('Cache data not available, refreshing...');
        return;
      }

      // Check if data is stale
      const stale = await supabaseCacheService.isCacheStale();
      setIsStale(stale);

      // Format data
      const totalSupplyNum = parseFloat(blockchain.totalSupply);
      const circulatingSupplyNum = parseFloat(blockchain.circulatingSupply);
      const burnedTokensNum = parseFloat(blockchain.burnedTokens);

      const formattedData: OptimizedARKData = {
        totalSupply: totalSupplyNum.toFixed(2),
        circulatingSupply: circulatingSupplyNum.toString(),
        burnedTokens: burnedTokensNum.toString(),
        holders: blockchain.holders.toString(),
        price: market.price.toString(),
        priceChange24h: market.priceChange24h > 0 
          ? `+${market.priceChange24h.toFixed(1)}` 
          : market.priceChange24h.toFixed(1),
        marketCap: market.marketCap.toFixed(2),
        volume24h: market.volume24h.toString(),
        volumeChange24h: '0',
        liquidity: market.liquidity.toString(),
        dailyBurnRate: blockchain.dailyBurnRate.toString(),
        lastUpdated: new Date(blockchain.lastUpdated),
        dataSource: market.dataSource,
      };

      setData(formattedData);
    } catch (err: any) {
      console.error('Error fetching optimized ARK data:', err);
      setError(err.message || 'Failed to fetch ARK data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [forceRefresh]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isStale
  };
};
