
// Network and contract configurations
export const NETWORKS = {
  PULSECHAIN: {
    chainId: '0x171', // 369 in hex
    chainName: 'PulseChain',
    nativeCurrency: {
      name: 'Pulse',
      symbol: 'PLS',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.pulsechain.com'],
    blockExplorerUrls: ['https://scan.pulsechain.com/'],
  },
};

export const CONTRACT_ADDRESSES = {
  ARK_TOKEN: '0xACC15eF8fa2e702d0138c3662A9E7d696f40F021',
  PULSEX_V2_ROUTER: '0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02', // Real PulseX V2 Router
  WPLS: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27', // Wrapped PLS
  DEAD_ADDRESS: '0x000000000000000000000000000000000000dEaD',
};

// Complete SimplifiedLockerVault ABI from the contract
export const LOCKER_VAULT_ABI = [
  // View functions
  'function totalLockedTokens() view returns (uint256)',
  'function totalRewardsDistributed() view returns (uint256)',
  'function totalActiveLockers() view returns (uint256)',
  'function getUserLocks(address user) view returns (tuple(uint256 amount, uint256 lockTime, uint256 unlockTime, uint256 lockPeriod, uint8 tier, uint256 totalRewardsEarned, bool active)[])',
  'function getUserActiveLocks(address user) view returns (tuple(uint256 amount, uint256 lockTime, uint256 unlockTime, uint256 lockPeriod, uint8 tier, uint256 totalRewardsEarned, bool active)[])',
  'function calculateUserWeight(address user) view returns (uint256)',
  'function calculateEarlyUnlockPenalty(address user, uint256 lockId) view returns (uint256 penaltyAmount, uint256 userReceives)',
  'function getProtocolStats() view returns (uint256 _totalLockedTokens, uint256 _totalRewardsDistributed, uint256 _totalActiveLockers)',
  'function getLockTierInfo(uint8 tier) view returns (tuple(uint256 minDuration, uint256 multiplier, string name))',
  'function pendingRewards(address user) view returns (uint256)',
  'function userStats(address user) view returns (tuple(uint256 totalLocked, uint256 totalRewardsEarned, uint256 pendingRewards, uint256 activeLocksCount))',
  
  // State variables
  'function emergencyMode() view returns (bool)',
  'function paused() view returns (bool)',
  'function earlyUnlockEnabled() view returns (bool)',
  'function earlyUnlockPenalty() view returns (uint256)',
  'function penaltyBurnShare() view returns (uint256)',
  'function penaltyRewardShare() view returns (uint256)',
  
  // Constants
  'function MIN_LOCK_DURATION() view returns (uint256)',
  'function MAX_LOCK_DURATION() view returns (uint256)',
  'function BASIS_POINTS() view returns (uint256)',
  'function MAX_EARLY_PENALTY() view returns (uint256)',
  'function DEAD_ADDRESS() view returns (address)',
  
  // User functions
  'function lockTokens(uint256 amount, uint256 lockDuration)',
  'function unlockTokens(uint256 lockId)',
  'function claimRewards()',
  
  // Events
  'event TokensLocked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 unlockTime)',
  'event TokensUnlocked(address indexed user, uint256 amount)',
  'event RewardsDistributed(uint256 totalRewards, uint256 totalRecipients)',
  'event RewardsClaimed(address indexed user, uint256 amount)',
  'event EarlyUnlockPenalty(address indexed user, uint256 lockId, uint256 penaltyAmount)',
];

// Locker vault contract address - UPDATED TO LIVE ADDRESS
export const LOCKER_VAULT_ADDRESS = '0x6774a0386ae6f39509533698Fbf9b73EE5C06187';

// Lock tier enumeration matching the contract
export const LOCK_TIERS = {
  BRONZE: 0,
  SILVER: 1,
  GOLD: 2,
  DIAMOND: 3,
  PLATINUM: 4,
  LEGENDARY: 5
};

// Locker contract constants matching the smart contract
export const LOCKER_CONSTANTS = {
  MIN_LOCK_DURATION_DAYS: 1,
  MAX_LOCK_DURATION_DAYS: 1826, // 5 years
  BASIS_POINTS: 10000,
  EARLY_UNLOCK_PENALTY: 5000, // 50% max penalty
  MAX_EARLY_PENALTY: 7500, // 75% maximum
  PENALTY_BURN_SHARE: 5000, // 50% burned
  PENALTY_REWARD_SHARE: 5000, // 50% to lockers
  
  // Tier multipliers (in basis points)
  TIER_MULTIPLIERS: {
    BRONZE: 10000,   // 1x
    SILVER: 15000,   // 1.5x
    GOLD: 20000,     // 2x
    DIAMOND: 30000,  // 3x
    PLATINUM: 50000, // 5x
    LEGENDARY: 80000 // 8x
  }
};

// Complete ARK Token ABI from the contract
export const ARK_TOKEN_ABI = [
  // Standard ERC20 functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) returns (bool)',
  
  // Reflection functions
  'function isExcluded(address account) view returns (bool)',
  'function totalFeesCollected() view returns (uint256)',
  'function tokenFromReflection(uint256 rAmount) view returns (uint256)',
  'function reflectionFromToken(uint256 tAmount, bool deductTransferFee) view returns (uint256)',
  
  // Fee and tokenomics functions
  'function getCurrentFees() view returns (uint256 burnFee, uint256 reflectionFee, uint256 liquidityFee, uint256 lockerFee, uint256 totalFees)',
  'function getMaxFees() view returns (uint256 maxBurn, uint256 maxReflection, uint256 maxLiquidity, uint256 maxLocker, uint256 maxTotal)',
  'function updateFees(uint256 _burnFee, uint256 _reflectionFee, uint256 _liquidityFee, uint256 _lockerFee)',
  
  // Locker vault functions
  'function getLockerRewardsInfo() view returns (address vault, uint256 pending, uint256 distributed)',
  'function setLockerVault(address _vault)',
  'function distributeLockerRewards()',
  
  // Swap and liquidity functions
  'function getSwapSettings() view returns (uint256 threshold, uint256 maxAmount, bool enabled)',
  'function updateSwapSettings(uint256 _threshold, uint256 _maxAmount)',
  'function setSwapEnabled(bool _enabled)',
  'function updateSlippageTolerance(uint256 _slippage)',
  'function getTokensForLiquidity() view returns (uint256)',
  'function manualSwapAndLiquify()',
  'function manualBurnLP()',
  
  // LP burn tracking function - NEW
  'function totalLPTokensBurned() view returns (uint256)',
  
  // Security functions
  'function pause()',
  'function unpause()',
  'function paused() view returns (bool)',
  'function owner() view returns (address)',
  
  // Account management
  'function excludeAccount(address account)',
  'function includeAccount(address account)',
  
  // Events
  'event SwapAndLiquify(uint256 tokensSwapped, uint256 plsReceived, uint256 tokensIntoLiquidity)',
  'event LPTokensBurned(uint256 amount)',
  'event FeesUpdated(uint256 burnFee, uint256 reflectionFee, uint256 liquidityFee, uint256 lockerFee)',
  'event SwapSettingsUpdated(uint256 threshold, uint256 maxAmount)',
  'event LockerRewardsDistributed(uint256 amount)',
];

// Real PulseX V2 Router ABI
export const DEX_ROUTER_ABI = [
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)',
  'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',
  'function WPLS() external pure returns (address)',
  'function factory() external pure returns (address)',
];

// Contract constants from the Solidity code
export const CONTRACT_CONSTANTS = {
  MAX_BURN_FEE: 3,
  MAX_REFLECTION_FEE: 3,
  MAX_LIQUIDITY_FEE: 2,
  MAX_LOCKER_FEE: 2,
  MAX_TOTAL_FEES: 9,
  MIN_SWAP_THRESHOLD: 1000, // in tokens (before decimals)
  MAX_SWAP_THRESHOLD: 50000, // in tokens (before decimals)
  MAX_SLIPPAGE: 500, // 5% in basis points
  DEFAULT_SLIPPAGE: 200, // 2% in basis points
};
