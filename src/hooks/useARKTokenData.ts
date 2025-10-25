import { useState, useEffect } from 'react';
import { supabaseCacheService } from '../services/supabaseCacheService';

interface ARKTokenData {
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
}

export const useARKTokenData = () => {
  const [data, setData] = useState<ARKTokenData>({
    totalSupply: '0',
    marketCap: '0',
    holders: '0',
    price: '0',
    priceChange24h: '0',
    circulatingSupply: '0',
    burnedTokens: '0',
    volume24h: '0',
    volumeChange24h: '0',
    liquidity: '0',
    dailyBurnRate: '0',
    lastUpdated: new Date(),
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching ARK token data from cache...');

      // Get all cached data
      const { blockchain, market } = await supabaseCacheService.getAllData();

      if (!blockchain || !market) {
        console.log('Cache miss, data will be refreshed by edge function');
        setError('Data is being refreshed, please wait...');
        return;
      }

      console.log('Cache data retrieved:', { blockchain, market });

      // Calculate market cap
      const totalSupplyNum = parseFloat(blockchain.totalSupply);
      const burnedTokensNum = parseFloat(blockchain.burnedTokens);
      const circulatingSupplyNum = parseFloat(blockchain.circulatingSupply);
      const marketCapNum = market.marketCap;

      setData({
        totalSupply: totalSupplyNum.toFixed(2),
        marketCap: marketCapNum.toFixed(2),
        holders: blockchain.holders.toString(),
        price: market.price.toString(),
        priceChange24h: market.priceChange24h > 0 
          ? `+${market.priceChange24h.toFixed(1)}` 
          : market.priceChange24h.toFixed(1),
        circulatingSupply: circulatingSupplyNum.toString(),
        burnedTokens: burnedTokensNum.toString(),
        volume24h: market.volume24h.toString(),
        volumeChange24h: '0',
        liquidity: market.liquidity.toString(),
        dailyBurnRate: blockchain.dailyBurnRate.toString(),
        lastUpdated: new Date(blockchain.lastUpdated),
      });

      console.log('ARK token data updated from cache');
    } catch (err: any) {
      console.error('Error fetching ARK token data:', err);
      setError(err.message || 'Failed to fetch token data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
    
    // Check for updates every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchTokenData,
  };
};
