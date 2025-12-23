import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS } from '../utils/constants';
import { dexPriceService } from '../services/dexPriceService';
import { blockchainDataService } from '../services/blockchainDataService';

interface ARKData {
  // Market data
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  dataSource: string;
  
  // Blockchain data
  totalSupply: number;
  circulatingSupply: number;
  burnedTokens: number;
  holders: number;
  dailyBurnRate: number;
  
  // Meta
  lastUpdated: Date;
  isStale: boolean;
}

interface ARKDataContextValue {
  data: ARKData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ARKDataContext = createContext<ARKDataContextValue | undefined>(undefined);

// Cache TTLs
const MARKET_CACHE_TTL = 60 * 1000; // 1 minute
const BLOCKCHAIN_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// Cached data store
interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

let marketCache: CacheEntry<any> | null = null;
let blockchainCache: CacheEntry<any> | null = null;

export function ARKDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ARKData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const initialFetchDone = useRef(false);

  const fetchMarketData = async () => {
    const now = Date.now();
    
    // Check cache
    if (marketCache && (now - marketCache.cachedAt) < MARKET_CACHE_TTL) {
      console.log('Using cached market data');
      return marketCache.data;
    }
    
    console.log('Fetching fresh market data...');
    const priceData = await dexPriceService.getLivePrice();
    
    const result = {
      price: priceData.price,
      priceChange24h: priceData.priceChange24h,
      volume24h: priceData.volume24h,
      liquidity: priceData.liquidity,
      dataSource: priceData.dataSource
    };
    
    marketCache = { data: result, cachedAt: now };
    return result;
  };

  const fetchBlockchainData = async () => {
    const now = Date.now();
    
    // Check cache
    if (blockchainCache && (now - blockchainCache.cachedAt) < BLOCKCHAIN_CACHE_TTL) {
      console.log('Using cached blockchain data');
      return blockchainCache.data;
    }
    
    console.log('Fetching fresh blockchain data...');
    const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);

    // Parallel fetch for maximum speed
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

    const result = {
      totalSupply: totalSupplyFormatted,
      circulatingSupply: circulatingSupplyNum,
      burnedTokens: burnedTokensNum,
      holders: holderCount,
      dailyBurnRate: burnData.dailyBurnRate
    };

    blockchainCache = { data: result, cachedAt: now };
    return result;
  };

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setError(null);
      
      // For non-initial fetches, show current data while loading
      if (initialFetchDone.current) {
        // Don't set loading to true for background refreshes
      } else {
        setLoading(true);
      }

      // Clear cache if force refresh
      if (forceRefresh) {
        marketCache = null;
        blockchainCache = null;
      }

      // Fetch both in parallel
      const [marketData, blockchainData] = await Promise.all([
        fetchMarketData(),
        fetchBlockchainData()
      ]);

      // Calculate market cap
      const marketCap = blockchainData.circulatingSupply * marketData.price;

      const newData: ARKData = {
        price: marketData.price,
        priceChange24h: marketData.priceChange24h,
        marketCap,
        volume24h: marketData.volume24h,
        liquidity: marketData.liquidity,
        dataSource: marketData.dataSource,
        totalSupply: blockchainData.totalSupply,
        circulatingSupply: blockchainData.circulatingSupply,
        burnedTokens: blockchainData.burnedTokens,
        holders: blockchainData.holders,
        dailyBurnRate: blockchainData.dailyBurnRate,
        lastUpdated: new Date(),
        isStale: false
      };

      setData(newData);
      initialFetchDone.current = true;
      console.log('ARK data updated successfully');
    } catch (err: any) {
      console.error('Error fetching ARK data:', err);
      setError(err.message || 'Failed to fetch data');
      
      // Mark data as stale on error if we have existing data
      if (data) {
        setData({ ...data, isStale: true });
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [data]);

  // Warm up edge functions on mount
  useEffect(() => {
    const warmUp = async () => {
      try {
        // Ping the RPC proxy to wake it up
        fetch('https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/rpc-proxy', {
          method: 'OPTIONS'
        }).catch(() => {}); // Ignore errors
      } catch {
        // Ignore warm-up errors
      }
    };
    warmUp();
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Background refresh intervals
  useEffect(() => {
    const marketInterval = setInterval(() => {
      const now = Date.now();
      if (!marketCache || (now - marketCache.cachedAt) >= MARKET_CACHE_TTL) {
        fetchData();
      }
    }, MARKET_CACHE_TTL);

    const blockchainInterval = setInterval(() => {
      const now = Date.now();
      if (!blockchainCache || (now - blockchainCache.cachedAt) >= BLOCKCHAIN_CACHE_TTL) {
        fetchData();
      }
    }, BLOCKCHAIN_CACHE_TTL);

    return () => {
      clearInterval(marketInterval);
      clearInterval(blockchainInterval);
    };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return (
    <ARKDataContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </ARKDataContext.Provider>
  );
}

export function useARKData(): ARKDataContextValue {
  const context = useContext(ARKDataContext);
  if (context === undefined) {
    throw new Error('useARKData must be used within an ARKDataProvider');
  }
  return context;
}
