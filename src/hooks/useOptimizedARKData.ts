import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS } from '../utils/constants';
import { dexPriceService } from '../services/dexPriceService';
import { blockchainDataService } from '../services/blockchainDataService';
import { arkDataCache, ConsolidatedARKData } from '../services/arkDataCacheService';

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
  isStale: boolean;
}

export const useOptimizedARKData = () => {
  const [data, setData] = useState<OptimizedARKData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const formatData = useCallback((consolidated: ConsolidatedARKData): OptimizedARKData => {
    return {
      totalSupply: consolidated.blockchain.totalSupply.toFixed(2),
      marketCap: consolidated.market.marketCap.toFixed(2),
      holders: consolidated.blockchain.holders.toString(),
      price: consolidated.market.price.toString(),
      priceChange24h: consolidated.market.priceChange24h > 0 
        ? `+${consolidated.market.priceChange24h.toFixed(1)}` 
        : consolidated.market.priceChange24h.toFixed(1),
      circulatingSupply: consolidated.blockchain.circulatingSupply.toString(),
      burnedTokens: consolidated.blockchain.burnedTokens.toString(),
      volume24h: consolidated.market.volume24h.toString(),
      volumeChange24h: '0', // TODO: Implement volume change calculation
      liquidity: consolidated.market.liquidity.toString(),
      dailyBurnRate: consolidated.blockchain.dailyBurnRate.toString(),
      lastUpdated: consolidated.lastUpdated,
      dataSource: consolidated.market.dataSource,
      isStale: consolidated.isStale
    };
  }, []);

  const fetchMarketData = async () => {
    console.log('Fetching fresh market data...');
    const priceData = await dexPriceService.getLivePrice();
    
    const marketData = {
      price: priceData.price,
      priceChange24h: priceData.priceChange24h,
      marketCap: 0, // Will be calculated after blockchain data
      volume24h: priceData.volume24h,
      liquidity: priceData.liquidity,
      dataSource: priceData.dataSource
    };
    
    arkDataCache.setMarketData(marketData);
    return marketData;
  };

  const fetchBlockchainData = async () => {
    console.log('Fetching fresh blockchain data...');
    const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);

    const [
      [totalSupply, decimals],
      burnData,
      holderCount
    ] = await Promise.all([
      Promise.all([
        arkToken.totalSupply(),
        arkToken.decimals()
      ]),
      blockchainDataService.calculateBurnRate(),
      blockchainDataService.calculateHolderCount()
    ]);

    const totalSupplyFormatted = parseFloat(ethers.formatUnits(totalSupply, decimals));
    const burnedTokensNum = parseFloat(burnData.totalBurned);
    const circulatingSupplyNum = totalSupplyFormatted - burnedTokensNum;

    const blockchainData = {
      totalSupply: totalSupplyFormatted,
      circulatingSupply: circulatingSupplyNum,
      burnedTokens: burnedTokensNum,
      holders: holderCount,
      dailyBurnRate: burnData.dailyBurnRate
    };

    arkDataCache.setBlockchainData(blockchainData);
    return blockchainData;
  };

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setError(null);
      
      // Try to get cached data first
      const cached = arkDataCache.getConsolidatedData();
      if (cached && !forceRefresh) {
        console.log('Using cached ARK data');
        setData(formatData(cached));
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      // Show cached data immediately if available while fetching fresh data
      if (cached) {
        setData(formatData(cached));
        setLoading(false);
      }

      console.log('Fetching fresh ARK data...');

      // Determine what data needs refreshing
      const needsMarketRefresh = forceRefresh || arkDataCache.isMarketDataStale();
      const needsBlockchainRefresh = forceRefresh || arkDataCache.isBlockchainDataStale();

      // Fetch only what's needed
      const promises: Promise<any>[] = [];
      
      if (needsMarketRefresh) {
        promises.push(fetchMarketData());
      }
      
      if (needsBlockchainRefresh) {
        promises.push(fetchBlockchainData());
      }

      // Wait for fresh data
      if (promises.length > 0) {
        await Promise.all(promises);
        
        // Get updated consolidated data
        const freshData = arkDataCache.getConsolidatedData();
        if (freshData) {
          // Calculate market cap with fresh data
          freshData.market.marketCap = freshData.blockchain.circulatingSupply * freshData.market.price;
          arkDataCache.setMarketData(freshData.market); // Update cache with calculated market cap
          
          setData(formatData(freshData));
          console.log('ARK data updated with fresh information');
        }
      }

    } catch (err: any) {
      console.error('Error fetching ARK data:', err);
      setError(err.message || 'Failed to fetch data');
      
      // Try to show cached data on error
      const cached = arkDataCache.getConsolidatedData();
      if (cached) {
        setData(formatData(cached));
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [formatData]);

  useEffect(() => {
    // Initial fetch
    fetchData();
    
    // Set up optimized refresh intervals
    const priceInterval = setInterval(() => {
      if (arkDataCache.isMarketDataStale()) {
        fetchData();
      }
    }, 90000); // Check every 90 seconds for price updates
    
    const blockchainInterval = setInterval(() => {
      if (arkDataCache.isBlockchainDataStale()) {
        fetchData();
      }
    }, 180000); // Check every 3 minutes for blockchain updates
    
    return () => {
      clearInterval(priceInterval);
      clearInterval(blockchainInterval);
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    isStale: data?.isStale || false
  };
};