import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode, useMemo } from 'react';
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
  
  // Contract State
  liquidityFeeTotal: number;
  lockerFeeTotal: number;
  daoFeeTotal: number;
  swapThreshold: number;
  
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

// Lazy provider initialization (rule: rerender-lazy-state-init)
let providerInstance: ethers.JsonRpcProvider | null = null;
const getProvider = () => {
  if (!providerInstance) {
    providerInstance = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
  }
  return providerInstance;
};

export function ARKDataProvider({ children }: { children: ReactNode }) {
  // Initial state from localStorage (rule: rerender-lazy-state-init)
  const [data, setData] = useState<ARKData | null>(() => {
    const cached = localStorage.getItem('ark-protocol-stats');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return { ...parsed, lastUpdated: new Date(parsed.lastUpdated) };
      } catch (e) { return null; }
    }
    return null;
  });

  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const initialFetchDone = useRef(false);

  const fetchBlockchainData = useCallback(async () => {
    const provider = getProvider();
    const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);

    const [totalSupply, decimals, burnData, holderCount, liquidityFeeTotal, lockerFeeTotal, daoFeeTotal, swapThreshold] = await Promise.all([
      arkToken.totalSupply(),
      arkToken.decimals(),
      blockchainDataService.calculateBurnRate(),
      blockchainDataService.calculateHolderCount(),
      arkToken.liquidityFeeTotal(),
      arkToken.lockerFeeTotal(),
      arkToken.daoFeeTotal(),
      arkToken.swapThreshold()
    ]);

    const totalSupplyFormatted = parseFloat(ethers.formatUnits(totalSupply, decimals));
    const burnedTokensNum = parseFloat(burnData.totalBurned);
    const circulatingSupplyNum = totalSupplyFormatted - burnedTokensNum;

    return {
      totalSupply: totalSupplyFormatted,
      circulatingSupply: circulatingSupplyNum,
      burnedTokens: burnedTokensNum,
      holders: holderCount,
      dailyBurnRate: burnData.dailyBurnRate,
      liquidityFeeTotal: parseFloat(ethers.formatUnits(liquidityFeeTotal, decimals)),
      lockerFeeTotal: parseFloat(ethers.formatUnits(lockerFeeTotal, decimals)),
      daoFeeTotal: parseFloat(ethers.formatUnits(daoFeeTotal, decimals)),
      swapThreshold: parseFloat(ethers.formatUnits(swapThreshold, decimals))
    };
  }, []);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setError(null);
      
      // Show loading if no data or if manually refreshing
      if (!initialFetchDone.current && (!data || forceRefresh)) {
        setLoading(true);
      }

      // Parallel fetch for speed
      const [marketData, blockchainData] = await Promise.all([
        dexPriceService.getLivePrice(),
        fetchBlockchainData()
      ]);

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
        liquidityFeeTotal: blockchainData.liquidityFeeTotal,
        lockerFeeTotal: blockchainData.lockerFeeTotal,
        daoFeeTotal: blockchainData.daoFeeTotal,
        swapThreshold: blockchainData.swapThreshold,
        lastUpdated: new Date(),
        isStale: false
      };

      setData(newData);
      localStorage.setItem('ark-protocol-stats', JSON.stringify(newData));
      initialFetchDone.current = true;
    } catch (err: any) {
      console.error('Error fetching ARK data:', err);
      setError(err.message || 'Failed to fetch data');
      setData(prev => prev ? { ...prev, isStale: true } : null);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [fetchBlockchainData, data]);

  // Initial fetch only if no data
  useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, [fetchData, data]);

  // Background refresh removed as per request for manual only


  // Stable callback for refetch (rule: rerender-functional-setstate)
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Memoize context value to prevent re-renders (rule: rerender-memo)
  const contextValue = useMemo<ARKDataContextValue>(() => ({
    data,
    loading,
    error,
    refetch
  }), [data, loading, error, refetch]);

  return (
    <ARKDataContext.Provider value={contextValue}>
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
