
export interface ContractData {
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

export interface ContractDataHookReturn {
  data: ContractData;
  loading: boolean;
  error: string | null;
}
