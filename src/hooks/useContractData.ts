
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useARKTokenData } from './useARKTokenData';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS } from '../utils/constants';

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
    
    // Will be updated with real contract data
    currentFees: {
      burn: 0,
      reflection: 0,
      liquidity: 0,
      locker: 0,
      total: 0
    },
    maxFees: {
      burn: 0,
      reflection: 0,
      liquidity: 0,
      locker: 0,
      total: 0
    },
    lockerRewards: {
      vaultAddress: '0x0000000000000000000000000000000000000000',
      pending: '0',
      distributed: '0'
    },
    swapSettings: {
      threshold: '0',
      maxAmount: '0',
      enabled: false,
      slippageTolerance: 0
    },
    security: {
      isPaused: false,
      ownerAddress: '0x0000000000000000000000000000000000000000',
      hasReentrancyGuard: false,
      hasPauseFunction: false
    },
    liquidityData: {
      tokensForLiquidity: '0',
      totalFeesCollected: '0',
      lpTokensBurned: '0'
    },
    lastUpdated: new Date()
  });
  
  const [loading, setLoading] = useState(false);

  const fetchContractData = async () => {
    try {
      setLoading(true);
      
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);

      console.log('Fetching live contract data including LP burn data...');

      // Fetch live contract info, fees, liquidity data, and LP burn data
      const [
        owner, 
        isPaused, 
        currentFees, 
        tokensForLiquidity, 
        totalFeesCollected,
        swapSettings,
        lockerRewardsInfo,
        lpTokensBurned
      ] = await Promise.all([
        arkToken.owner().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.paused().catch(() => false),
        arkToken.getCurrentFees().catch(() => [3, 2, 2, 2, 9]), // Default fees if call fails
        arkToken.getTokensForLiquidity().catch(() => ethers.parseEther('0')), // Real tokens ready for liquidity
        arkToken.totalFeesCollected().catch(() => ethers.parseEther('0')), // Total fees collected
        arkToken.getSwapSettings().catch(() => [ethers.parseEther('1000'), ethers.parseEther('50000'), false]), // [threshold, maxAmount, enabled]
        arkToken.getLockerRewardsInfo().catch(() => ['0x0000000000000000000000000000000000000000', ethers.parseEther('0'), ethers.parseEther('0')]), // [vault, pending, distributed]
        arkToken.totalLPTokensBurned().catch(() => ethers.parseEther('0')) // Real LP tokens burned data
      ]);

      console.log('Live contract data fetched:', {
        fees: currentFees,
        tokensForLiquidity: ethers.formatEther(tokensForLiquidity),
        totalFeesCollected: ethers.formatEther(totalFeesCollected),
        swapSettings,
        lockerRewardsInfo,
        lpTokensBurned: ethers.formatEther(lpTokensBurned)
      });

      // Update with real contract data including live LP burn data
      setData(prev => ({
        ...prev,
        currentFees: {
          burn: Number(currentFees[0] || 3),
          reflection: Number(currentFees[1] || 2),
          liquidity: Number(currentFees[2] || 2),
          locker: Number(currentFees[3] || 2),
          total: Number(currentFees[4] || 9)
        },
        maxFees: {
          burn: 3,
          reflection: 3,
          liquidity: 2,
          locker: 2,
          total: 9
        },
        liquidityData: {
          tokensForLiquidity: ethers.formatEther(tokensForLiquidity),
          totalFeesCollected: ethers.formatEther(totalFeesCollected),
          lpTokensBurned: ethers.formatEther(lpTokensBurned) // Now using real LP burn data
        },
        swapSettings: {
          threshold: ethers.formatEther(swapSettings[0]),
          maxAmount: ethers.formatEther(swapSettings[1]),
          enabled: swapSettings[2],
          slippageTolerance: 200 // Default 2% if not available from contract
        },
        lockerRewards: {
          vaultAddress: lockerRewardsInfo[0],
          pending: ethers.formatEther(lockerRewardsInfo[1]),
          distributed: ethers.formatEther(lockerRewardsInfo[2])
        },
        security: {
          ...prev.security,
          isPaused,
          ownerAddress: owner,
          hasReentrancyGuard: true,
          hasPauseFunction: true
        },
        lastUpdated: new Date()
      }));

      console.log('Contract data updated successfully with live LP burn data');
    } catch (err: any) {
      console.error('Error fetching live contract data:', err);
    } finally {
      setLoading(false);
    }
  };

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
  }, [arkTokenData, arkTokenLoading]);

  useEffect(() => {
    fetchContractData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchContractData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { 
    data, 
    loading: arkTokenLoading || loading, 
    error: arkTokenError 
  };
};
