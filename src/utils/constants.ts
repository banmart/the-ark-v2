
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
  ARK_TOKEN: '0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67',
  LOCKER: '0x3ba44a1de77025b78d7430449569dd1112ac4473',
  PULSEX_V2_ROUTER: '0x636f6407B90661b73b1C0F7e24F4C79f624d0738', // Updated from contract
  WPLS: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27', // Wrapped PLS
  DAI: '0xefD766cCb38EaF1dfd701853BFCe31359239F305', // DAI token on PulseChain
  ARK_DAI_PAIR: '0x03f0bdb4f14e76a35a39ef0ffd87c8bb6d451366', // ARK/DAI pair
  ARK_PLS_PAIR: '0x5f49421c0f74873bc02d0a912f171a030008f2c9', // ARK/PLS pair (primary)
  BURN_ADDRESS: '0x0000000000000000000000000000000000000369', // Burn address
  DEAD_ADDRESS: '0x0000000000000000000000000000000000000369', // Updated from contract
};

// Complete SimplifiedLockerVault ABI - UPDATED FOR LATEST CONTRACT
export const LOCKER_VAULT_ABI = [
  // View functions
  'function totalLockedTokens() view returns (uint256)',
  'function totalRewardsDistributed() view returns (uint256)',
  'function totalActiveLockers() view returns (uint256)',
  'function rewardPool() view returns (uint256)',
  'function getUserLocks(address user) view returns (tuple(uint256 amount, uint256 lockTime, uint256 unlockTime, uint256 lockPeriod, uint8 tier, uint256 totalRewardsEarned, bool active)[])',
  'function getUserActiveLocks(address user) view returns (tuple(uint256 amount, uint256 lockTime, uint256 unlockTime, uint256 lockPeriod, uint8 tier, uint256 totalRewardsEarned, bool active)[])',
  'function calculateUserWeight(address user) view returns (uint256)',
  'function calculateEarlyUnlockPenalty(address user, uint256 lockId) view returns (uint256 penaltyAmount, uint256 userReceives)',
  'function getProtocolStats() view returns (uint256 _totalLockedTokens, uint256 _totalRewardsDistributed, uint256 _totalActiveLockers, uint256 _rewardPool)',
  'function getLockTierInfo(uint8 tier) view returns (tuple(uint256 minDuration, uint256 multiplier, string name))',
  'function pendingRewards(address user) view returns (uint256)',
  'function userStats(address user) view returns (tuple(uint256 totalLocked, uint256 totalRewardsEarned, uint256 pendingRewards, uint256 activeLocksCount))',
  'function getActiveLockers() view returns (address[])',
  
  // State variables
  'function emergencyMode() view returns (bool)',
  'function paused() view returns (bool)',
  'function earlyUnlockEnabled() view returns (bool)',
  'function earlyUnlockPenalty() view returns (uint256)',
  'function penaltyBurnShare() view returns (uint256)',
  'function penaltyRewardShare() view returns (uint256)',
  'function emergencyUnlockTime() view returns (uint256)',
  'function authorizedDistributor() view returns (address)',
  'function isActiveLocker(address) view returns (bool)',
  'function token() view returns (address)',
  
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
  
  // Admin functions
  'function receiveRewards(uint256 amount)',
  'function distributeRewards(uint256 amount)',
  'function updateEarlyUnlockSettings(uint256 _penalty, bool _enabled)',
  'function updatePenaltyDistribution(uint256 _burnShare, uint256 _rewardShare)',
  'function cleanupActiveLockers()',
  'function enableEmergencyMode()',
  'function disableEmergencyMode()',
  'function setAuthorizedDistributor(address _distributor)',
  'function pause()',
  'function unpause()',
  'function recoverTokens(address tokenAddress, uint256 amount)',
  
  // Events
  'event TokensLocked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 unlockTime)',
  'event TokensUnlocked(address indexed user, uint256 amount)',
  'event RewardsDistributed(uint256 totalRewards, uint256 totalRecipients)',
  'event RewardsClaimed(address indexed user, uint256 amount)',
  'event LockExtended(address indexed user, uint256 lockId, uint256 newUnlockTime)',
  'event EarlyUnlockPenalty(address indexed user, uint256 lockId, uint256 penaltyAmount)',
];

// Locker vault contract address - UPDATED TO LIVE ADDRESS
export const LOCKER_VAULT_ADDRESS = '0x3ba44a1de77025b78d7430449569dd1112ac4473';

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
  MIN_LOCK_DURATION_DAYS: 30, // Updated to match contract (30 days)
  MAX_LOCK_DURATION_DAYS: 1826, // 5 years (1826 days)
  BASIS_POINTS: 10000,
  EARLY_UNLOCK_PENALTY: 5000, // 50% max penalty
  MAX_EARLY_PENALTY: 7500, // 75% maximum
  PENALTY_BURN_SHARE: 5000, // 50% burned
  PENALTY_REWARD_SHARE: 5000, // 50% to lockers
  
  // Tier multipliers (in basis points) - Updated to match contract
  TIER_MULTIPLIERS: {
    BRONZE: 10000,   // 1x
    SILVER: 15000,   // 1.5x
    GOLD: 20000,     // 2x
    DIAMOND: 30000,  // 3x
    PLATINUM: 50000, // 5x
    LEGENDARY: 80000 // 8x
  }
};

// Updated ARK Token ABI matching the actual contract
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
  'function isExcludedFromReward(address account) view returns (bool)',
  'function tokenFromReflection(uint256 rAmount) view returns (uint256)',
  
  // Fee structure (immutable values)
  'function liquidityFee() view returns (uint256)',
  'function reflectionFee() view returns (uint256)',
  'function lockerFee() view returns (uint256)',
  'function burnFee() view returns (uint256)',
  'function divider() view returns (uint256)',
  
  // Contract settings
  'function swapThreshold() view returns (uint256)',
  'function ARKLocker() view returns (address)',
  'function pulseXPair() view returns (address)',
  'function pulseXRouter() view returns (address)',
  'function burnAddress() view returns (address)',
  
  // Admin functions
  'function excludeFromReward(address account)',
  'function includeInReward(address account)',
  'function updateSwapThreshold(uint256 amount)',
  'function excludeWalletFromFee(address wallet, bool status)',
  'function setLiquidityPair(address pair, bool status)',
  'function setARKLocker(address newAddress)',
  
  // State variables
  'function isExcludedFromFee(address) view returns (bool)',
  'function isLiquidityPair(address) view returns (bool)',
  'function owner() view returns (address)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event SwapThresholdUpdated(uint256 amount)',
  'event WalletExcludeFromFee(address indexed wallet, bool status)',
  'event LiquidityPairUpdated(address indexed pair, bool status)',
  'event ARKLockerUpdated(address indexed newAddress)',
  'event ExcludedFromReward(address indexed account)',
  'event IncludedInReward(address indexed account)',
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

// Contract constants from the Solidity code - UPDATED TO MATCH ACTUAL CONTRACT
export const CONTRACT_CONSTANTS = {
  // Contract addresses
  TOKEN_ADDRESS: CONTRACT_ADDRESSES.ARK_TOKEN,
  LOCKER_ADDRESS: CONTRACT_ADDRESSES.LOCKER,
  RPC_URL: NETWORKS.PULSECHAIN.rpcUrls[0],
  
  // Fixed fee structure from contract (immutable values)
  LIQUIDITY_FEE: 300, // 3%
  REFLECTION_FEE: 200, // 2%
  LOCKER_FEE: 200, // 2%
  BURN_FEE: 200, // 2%
  TOTAL_FEES: 900, // 9%
  DIVIDER: 10000, // Basis points
  
  // Swap settings
  DEFAULT_SWAP_THRESHOLD: 50000, // 50,000 tokens
  MIN_SWAP_THRESHOLD: 1000, // 1,000 tokens minimum
  
  // Token supply
  TOTAL_SUPPLY: 1000000000, // 1 billion tokens
  DECIMALS: 18,
};
