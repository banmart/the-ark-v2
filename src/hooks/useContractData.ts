
import { useEffect } from 'react';
import { useARKTokenData } from './useARKTokenData';
import { useContractState } from './contract/useContractState';
import { useContractFetch } from './contract/useContractFetch';
import { ContractDataHookReturn } from './contract/types';

export const useContractData = (): ContractDataHookReturn => {
  const { data: arkTokenData, loading: arkTokenLoading, error: arkTokenError } = useARKTokenData();
  const { data, setData, loading, setLoading } = useContractState();
  const { fetchContractData } = useContractFetch();

  // Update contract data when ARK token data changes (now includes volume, liquidity etc.)
  useEffect(() => {
    if (!arkTokenLoading && arkTokenData) {
      setData(prev => ({
        ...prev,
        totalSupply: arkTokenData.totalSupply,
        marketCap: arkTokenData.marketCap,
        holders: arkTokenData.holders,
        price: arkTokenData.price,
        priceChange24h: arkTokenData.priceChange24h,
        circulatingSupply: arkTokenData.circulatingSupply,
        burnedTokens: arkTokenData.burnedTokens,
        volume24h: arkTokenData.volume24h,
        volumeChange24h: arkTokenData.volumeChange24h,
        liquidity: arkTokenData.liquidity,
        dailyBurnRate: arkTokenData.dailyBurnRate,
        lastUpdated: arkTokenData.lastUpdated,
      }));
    }
  }, [arkTokenData, arkTokenLoading, setData]);

  useEffect(() => {
    fetchContractData(setData, setLoading);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchContractData(setData, setLoading), 30000);
    
    return () => clearInterval(interval);
  }, [fetchContractData, setData, setLoading]);

  return { 
    data, 
    loading: arkTokenLoading || loading, 
    error: arkTokenError 
  };
};
