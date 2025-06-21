
import { useState, useEffect } from 'react';
import { useARKTokenData } from './useARKTokenData';

interface ContractData {
  // Token basics (now from live data)
  totalSupply: string;
  marketCap: string;
  holders: string;
  price: string;
  priceChange24h: string;
  circulatingSupply: string;
  burnedTokens: string;
  
  // Current fees (from getCurrentFees())
  currentFees: {
    burn: number;
    reflection: number;
    liquidity: number;
    locker: number;
    total: number;
  };
  
  // Maximum fees (from getMaxFees())
  maxFees: {
    burn: number;
    reflection: number;
    liquidity: number;
    locker: number;
    total: number;
  };
  
  // Locker rewards (from getLockerRewardsInfo())
  lockerRewards: {
    vaultAddress: string;
    pending: string;
    distributed: string;
  };
  
  // Swap settings (from getSwapSettings())
  swapSettings: {
    threshold: string;
    maxAmount: string;
    enabled: boolean;
    slippageTolerance: number;
  };
  
  // Security features
  security: {
    isPaused: boolean;
    ownerAddress: string;
    hasReentrancyGuard: boolean;
    hasPauseFunction: boolean;
  };
  
  // LP and liquidity data
  liquidityData: {
    tokensForLiquidity: string;
    totalFeesCollected: string;
    lpTokensBurned: string;
  };
  
  // Meta data
  lastUpdated: Date;
}

export const useContractData = () => {
  const { data: arkTokenData, loading: arkTokenLoading, error: arkTokenError } = useARKTokenData();
  
  const [data, setData] = useState<ContractData>({
    // Live token data
    totalSupply: '0',
    marketCap: '0',
    holders: '0',
    price: '0',
    priceChange24h: '0',
    circulatingSupply: '0',
    burnedTokens: '0',
    
    // Mock contract data (would be replaced with real contract calls)
    currentFees: {
      burn: 3,
      reflection: 2,
      liquidity: 2,
      locker: 2,
      total: 9
    },
    maxFees: {
      burn: 3,
      reflection: 3,
      liquidity: 2,
      locker: 2,
      total: 9
    },
    lockerRewards: {
      vaultAddress: '0x0000000000000000000000000000000000000000',
      pending: '850,000',
      distributed: '2,150,000'
    },
    swapSettings: {
      threshold: '100,000',
      maxAmount: '200,000',
      enabled: true,
      slippageTolerance: 2
    },
    security: {
      isPaused: false,
      ownerAddress: '0x0000000000000000000000000000000000000000',
      hasReentrancyGuard: true,
      hasPauseFunction: true
    },
    liquidityData: {
      tokensForLiquidity: '45,000',
      totalFeesCollected: '1,250,000',
      lpTokensBurned: '325,000'
    },
    lastUpdated: new Date()
  });
  
  const [loading, setLoading] = useState(false);

  // Update contract data when ARK token data changes
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
        lastUpdated: arkTokenData.lastUpdated,
      }));
    }
  }, [arkTokenData, arkTokenLoading]);

  return { 
    data, 
    loading: arkTokenLoading, 
    error: arkTokenError 
  };
};
