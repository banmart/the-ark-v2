import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { useARKData } from '../contexts/ARKDataContext';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS, CONTRACT_CONSTANTS } from '../utils/constants';
import { liquidityTrackingService, LiquidityAccumulation } from '../services/liquidityTrackingService';

interface ContractData {
  totalSupply: string;
  marketCap: string;
  holders: string;
  price: string;
  priceChange24h: string;
  circulatingSupply: string;
  burnedTokens: string;
  
  currentFees: {
    burn: number;
    dao: number;
    liquidity: number;
    locker: number;
    total: number;
  };
  
  maxFees: {
    burn: number;
    dao: number;
    liquidity: number;
    locker: number;
    total: number;
  };
  
  lockerRewards: {
    vaultAddress: string;
    pending: string;
    distributed: string;
  };
  
  swapSettings: {
    threshold: string;
    maxAmount: string;
    enabled: boolean;
    slippageTolerance: number;
  };
  
  security: {
    isPaused: boolean;
    ownerAddress: string;
    hasReentrancyGuard: boolean;
    hasPauseFunction: boolean;
  };
  
  liquidityData: {
    tokensForLiquidity: string;
    totalFeesCollected: string;
    lpTokensBurned: string;
    currentAccumulation: string;
    accumulationSinceLastSwap: string;
    isThresholdReached: boolean;
    isPendingSwap: boolean;
    lastSwapTimestamp: number;
    estimatedNextSwap: number | null;
  };
  
  contractAddresses: {
    arkLocker: string;
    arkDao: string;
    pulseXPair: string;
    pulseXRouter: string;
    burnAddress: string;
  };
  
  lastUpdated: Date;
}

const STATIC_FEES = {
  burn: CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER * 100,
  dao: CONTRACT_CONSTANTS.DAO_FEE / CONTRACT_CONSTANTS.DIVIDER * 100,
  liquidity: CONTRACT_CONSTANTS.LIQUIDITY_FEE / CONTRACT_CONSTANTS.DIVIDER * 100,
  locker: CONTRACT_CONSTANTS.LOCKER_FEE / CONTRACT_CONSTANTS.DIVIDER * 100,
  total: CONTRACT_CONSTANTS.TOTAL_FEES / CONTRACT_CONSTANTS.DIVIDER * 100
};

let providerInstance: ethers.JsonRpcProvider | null = null;
const getProvider = () => {
  if (!providerInstance) {
    providerInstance = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
  }
  return providerInstance;
};

const createInitialState = (): ContractData => ({
  totalSupply: '0',
  marketCap: '0',
  holders: '0',
  price: '0',
  priceChange24h: '0',
  circulatingSupply: '0',
  burnedTokens: '0',
  currentFees: STATIC_FEES,
  maxFees: STATIC_FEES,
  lockerRewards: {
    vaultAddress: '0x0000000000000000000000000000000000000000',
    pending: '0',
    distributed: '0'
  },
  swapSettings: {
    threshold: '0',
    maxAmount: '0',
    enabled: true,
    slippageTolerance: 200
  },
  security: {
    isPaused: false,
    ownerAddress: '0x0000000000000000000000000000000000000000',
    hasReentrancyGuard: true,
    hasPauseFunction: false
  },
  liquidityData: {
    tokensForLiquidity: '0',
    totalFeesCollected: '0',
    lpTokensBurned: '0',
    currentAccumulation: '0',
    accumulationSinceLastSwap: '0',
    isThresholdReached: false,
    isPendingSwap: false,
    lastSwapTimestamp: 0,
    estimatedNextSwap: null
  },
  contractAddresses: {
    arkLocker: '0x0000000000000000000000000000000000000000',
    arkDao: '0x0000000000000000000000000000000000000000',
    pulseXPair: '0x0000000000000000000000000000000000000000',
    pulseXRouter: CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
    burnAddress: CONTRACT_ADDRESSES.DEAD_ADDRESS
  },
  lastUpdated: new Date()
});

export const useContractData = () => {
  const { data: arkData, loading: arkLoading, error: arkError } = useARKData();
  
  const [data, setData] = useState<ContractData>(createInitialState);
  const [loading, setLoading] = useState(false);
  
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef(0);

  const fetchContractData = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < 10000) return;
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    lastFetchRef.current = now;
    
    try {
      setLoading(true);
      
      const provider = getProvider();
      const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);

      console.log('Fetching ARK contract data...');

      const [
        owner,
        swapThreshold,
        arkLockerAddress,
        pulseXPair,
        burnAddress,
        arkDaoAddress,
        burnedBalance,
        liquidityAccumulation
      ] = await Promise.all([
        arkToken.owner().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.swapThreshold().catch(() => ethers.parseEther(CONTRACT_CONSTANTS.DEFAULT_SWAP_THRESHOLD.toString())),
        arkToken.ARKLocker().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.PAIR().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.BURN().catch(() => CONTRACT_ADDRESSES.DEAD_ADDRESS),
        arkToken.ARKDAO().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.balanceOf(CONTRACT_ADDRESSES.DEAD_ADDRESS).catch(() => ethers.parseEther('0')),
        liquidityTrackingService.getCurrentAccumulation().catch(() => ({
          currentAccumulation: '0',
          accumulationSinceLastSwap: '0',
          lastSwapTimestamp: 0,
          lastSwapBlock: 0,
          isThresholdReached: false,
          isPendingSwap: false,
          estimatedNextSwap: null
        }))
      ]);

      const formattedThreshold = ethers.formatEther(swapThreshold);
      const formattedBurned = ethers.formatEther(burnedBalance);

      console.log('ARK contract data fetched:', {
        owner,
        swapThreshold: formattedThreshold,
        arkLockerAddress,
        pulseXPair,
        arkDaoAddress
      });

      setData(prev => ({
        ...prev,
        swapSettings: {
          ...prev.swapSettings,
          threshold: formattedThreshold,
          maxAmount: formattedThreshold,
          enabled: true
        },
        security: {
          ...prev.security,
          ownerAddress: owner,
          isPaused: false
        },
        liquidityData: {
          ...prev.liquidityData,
          tokensForLiquidity: formattedThreshold,
          lpTokensBurned: formattedBurned,
          currentAccumulation: liquidityAccumulation.currentAccumulation,
          accumulationSinceLastSwap: liquidityAccumulation.accumulationSinceLastSwap,
          isThresholdReached: liquidityAccumulation.isThresholdReached,
          isPendingSwap: liquidityAccumulation.isPendingSwap,
          lastSwapTimestamp: liquidityAccumulation.lastSwapTimestamp,
          estimatedNextSwap: liquidityAccumulation.estimatedNextSwap
        },
        contractAddresses: {
          arkLocker: arkLockerAddress,
          arkDao: arkDaoAddress,
          pulseXPair: pulseXPair,
          pulseXRouter: CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
          burnAddress: burnAddress
        },
        lockerRewards: {
          vaultAddress: arkLockerAddress,
          pending: '0',
          distributed: '0'
        },
        lastUpdated: new Date()
      }));

      console.log('ARK contract data updated successfully');
    } catch (err: any) {
      console.error('Error fetching ARK contract data:', err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const hasArkData = arkData !== null;
  const arkPrice = arkData?.price ?? 0;
  const arkMarketCap = arkData?.marketCap ?? 0;
  const arkTotalSupply = arkData?.totalSupply ?? 0;
  const arkCirculating = arkData?.circulatingSupply ?? 0;
  const arkBurned = arkData?.burnedTokens ?? 0;
  const arkHolders = arkData?.holders ?? 0;
  const arkPriceChange = arkData?.priceChange24h ?? 0;

  useEffect(() => {
    if (!arkLoading && hasArkData) {
      setData(prev => ({
        ...prev,
        totalSupply: arkTotalSupply.toString(),
        marketCap: arkMarketCap.toString(),
        holders: arkHolders.toString(),
        price: arkPrice.toString(),
        priceChange24h: arkPriceChange > 0 ? `+${arkPriceChange.toFixed(1)}` : arkPriceChange.toFixed(1),
        circulatingSupply: arkCirculating.toString(),
        burnedTokens: prev.burnedTokens !== '0' ? prev.burnedTokens : arkBurned.toString(),
        lastUpdated: new Date()
      }));
    }
  }, [arkLoading, hasArkData, arkPrice, arkMarketCap, arkTotalSupply, arkCirculating, arkBurned, arkHolders, arkPriceChange]);

  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 15000);
    return () => clearInterval(interval);
  }, [fetchContractData]);

  return { 
    data, 
    loading: arkLoading || loading, 
    error: arkError 
  };
};
