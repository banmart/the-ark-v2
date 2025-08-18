
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useARKTokenData } from './useARKTokenData';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS, CONTRACT_CONSTANTS } from '../utils/constants';

interface ContractData {
  // Token basics (from live data and contract)
  totalSupply: string;
  marketCap: string;
  holders: string;
  price: string;
  priceChange24h: string;
  circulatingSupply: string;
  burnedTokens: string;
  
  // Fixed fees from contract (immutable)
  currentFees: {
    burn: number;
    reflection: number;
    liquidity: number;
    locker: number;
    total: number;
  };
  
  // Same structure for consistency (but values are fixed)
  maxFees: {
    burn: number;
    reflection: number;
    liquidity: number;
    locker: number;
    total: number;
  };
  
  // Locker integration
  lockerRewards: {
    vaultAddress: string;
    pending: string;
    distributed: string;
  };
  
  // Swap settings from contract
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
    currentAccumulation: string;
  };
  
  // Additional contract data
  contractAddresses: {
    arkLocker: string;
    pulseXPair: string;
    pulseXRouter: string;
    burnAddress: string;
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
    
    // Fixed fees from contract constants
    currentFees: {
      burn: CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER * 100, // 2%
      reflection: CONTRACT_CONSTANTS.REFLECTION_FEE / CONTRACT_CONSTANTS.DIVIDER * 100, // 2%
      liquidity: CONTRACT_CONSTANTS.LIQUIDITY_FEE / CONTRACT_CONSTANTS.DIVIDER * 100, // 3%
      locker: CONTRACT_CONSTANTS.LOCKER_FEE / CONTRACT_CONSTANTS.DIVIDER * 100, // 2%
      total: CONTRACT_CONSTANTS.TOTAL_FEES / CONTRACT_CONSTANTS.DIVIDER * 100 // 9%
    },
    maxFees: {
      burn: CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER * 100, // Same as current (immutable)
      reflection: CONTRACT_CONSTANTS.REFLECTION_FEE / CONTRACT_CONSTANTS.DIVIDER * 100,
      liquidity: CONTRACT_CONSTANTS.LIQUIDITY_FEE / CONTRACT_CONSTANTS.DIVIDER * 100,
      locker: CONTRACT_CONSTANTS.LOCKER_FEE / CONTRACT_CONSTANTS.DIVIDER * 100,
      total: CONTRACT_CONSTANTS.TOTAL_FEES / CONTRACT_CONSTANTS.DIVIDER * 100
    },
    lockerRewards: {
      vaultAddress: '0x0000000000000000000000000000000000000000',
      pending: '0',
      distributed: '0'
    },
    swapSettings: {
      threshold: '0',
      maxAmount: '0',
      enabled: true, // Assumed enabled in contract
      slippageTolerance: 200 // Default 2%
    },
    security: {
      isPaused: false,
      ownerAddress: '0x0000000000000000000000000000000000000000',
      hasReentrancyGuard: true, // Based on contract code
      hasPauseFunction: false // No pause function in new contract
    },
    liquidityData: {
      tokensForLiquidity: '0',
      totalFeesCollected: '0',
      lpTokensBurned: '0',
      currentAccumulation: '0'
    },
    contractAddresses: {
      arkLocker: '0x0000000000000000000000000000000000000000',
      pulseXPair: '0x0000000000000000000000000000000000000000',
      pulseXRouter: CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
      burnAddress: CONTRACT_ADDRESSES.DEAD_ADDRESS
    },
    lastUpdated: new Date()
  });
  
  const [loading, setLoading] = useState(false);

  const fetchContractData = async () => {
    try {
      setLoading(true);
      
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);

      console.log('Fetching ARK contract data...');

      // Fetch contract data using actual available functions
      const [
        owner,
        swapThreshold,
        arkLockerAddress,
        pulseXPair,
        burnAddress,
        burnedBalance,
        contractTokenBalance
      ] = await Promise.all([
        arkToken.owner().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.swapThreshold().catch(() => ethers.parseEther(CONTRACT_CONSTANTS.DEFAULT_SWAP_THRESHOLD.toString())),
        arkToken.ARKLocker().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.pulseXPair().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.burnAddress().catch(() => CONTRACT_ADDRESSES.DEAD_ADDRESS),
        arkToken.balanceOf(CONTRACT_ADDRESSES.DEAD_ADDRESS).catch(() => ethers.parseEther('0')),
        arkToken.balanceOf(CONTRACT_ADDRESSES.ARK_TOKEN).catch(() => ethers.parseEther('0'))
      ]);

      console.log('ARK contract data fetched:', {
        owner,
        swapThreshold: ethers.formatEther(swapThreshold),
        arkLockerAddress,
        pulseXPair,
        burnAddress,
        burnedBalance: ethers.formatEther(burnedBalance)
      });

      // Update with real contract data
      setData(prev => ({
        ...prev,
        swapSettings: {
          ...prev.swapSettings,
          threshold: ethers.formatEther(swapThreshold),
          maxAmount: ethers.formatEther(swapThreshold), // Use threshold as max for now
          enabled: true
        },
        security: {
          ...prev.security,
          ownerAddress: owner,
          isPaused: false // No pause function in new contract
        },
        liquidityData: {
          ...prev.liquidityData,
          tokensForLiquidity: ethers.formatEther(swapThreshold), // Tokens ready for swap
          totalFeesCollected: '0', // Would need to calculate from events
          lpTokensBurned: ethers.formatEther(burnedBalance),
          currentAccumulation: ethers.formatEther(contractTokenBalance)
        },
        contractAddresses: {
          arkLocker: arkLockerAddress,
          pulseXPair: pulseXPair,
          pulseXRouter: CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
          burnAddress: burnAddress
        },
        lockerRewards: {
          vaultAddress: arkLockerAddress,
          pending: '0', // Would need locker contract integration
          distributed: '0' // Would need locker contract integration
        },
        lastUpdated: new Date()
      }));

      console.log('ARK contract data updated successfully');
    } catch (err: any) {
      console.error('Error fetching ARK contract data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate burned tokens from dead address balance
  const fetchBurnedTokens = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);
      
      const [burnedBalance, totalSupply, decimals] = await Promise.all([
        arkToken.balanceOf(CONTRACT_ADDRESSES.DEAD_ADDRESS),
        arkToken.totalSupply(),
        arkToken.decimals()
      ]);
      
      // Format with proper decimals
      const burnedAmount = parseFloat(ethers.formatUnits(burnedBalance, decimals));
      const totalSupplyAmount = parseFloat(ethers.formatUnits(totalSupply, decimals));
      const circulatingAmount = totalSupplyAmount - burnedAmount;
      
      setData(prev => ({
        ...prev,
        burnedTokens: burnedAmount.toString(),
        circulatingSupply: circulatingAmount.toString(),
        totalSupply: totalSupplyAmount.toString()
      }));
    } catch (error) {
      console.error('Error fetching burned tokens:', error);
    }
  };

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
        // Don't override burned tokens if we have contract data
        burnedTokens: prev.burnedTokens !== '0' ? prev.burnedTokens : arkTokenData.burnedTokens,
        lastUpdated: arkTokenData.lastUpdated,
      }));
    }
  }, [arkTokenData, arkTokenLoading]);

  useEffect(() => {
    fetchContractData();
    fetchBurnedTokens();
    
    // Auto-refresh every 30 seconds for more responsive data
    const interval = setInterval(() => {
      fetchContractData();
      fetchBurnedTokens();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { 
    data, 
    loading: arkTokenLoading || loading, 
    error: arkTokenError 
  };
};
