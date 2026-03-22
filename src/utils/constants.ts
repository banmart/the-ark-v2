
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
    rpcUrls: ['https://xtailgacbmhdtdxnqjdv.supabase.co/functions/v1/rpc-proxy'],
    blockExplorerUrls: ['https://scan.pulsechain.com/'],
  },
};

export const CONTRACT_ADDRESSES = {
  ARK_TOKEN: '0xF4a370e64DD4673BAA250C5435100FA98661Db4C',
  LOCKER: '0x6cA6624aEdCF03F16b29DD217447c478feC2C096',
  PULSEX_V2_ROUTER: '0x165C3410fC91EF562C50559f7d2289fEbed552d9',
  WPLS: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
  USDC: '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07',
  DAI: '0xefD766cCb38EaF1dfd701853BFCe31359239F305',
  ARK_DAI_PAIR: '', // Will be discovered on-chain via PAIR()
  ARK_PLS_PAIR: '', // Will be discovered on-chain via PAIR()
  BURN_ADDRESS: '0x0000000000000000000000000000000000000369',
  DEAD_ADDRESS: '0x0000000000000000000000000000000000000369',
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

// Locker vault contract address
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
  MIN_LOCK_DURATION_DAYS: 30,
  MAX_LOCK_DURATION_DAYS: 1826,
  BASIS_POINTS: 10000,
  EARLY_UNLOCK_PENALTY: 5000,
  MAX_EARLY_PENALTY: 7500,
  PENALTY_BURN_SHARE: 5000,
  PENALTY_REWARD_SHARE: 5000,
  
  TIER_MULTIPLIERS: {
    BRONZE: 10000,
    SILVER: 15000,
    GOLD: 20000,
    DIAMOND: 30000,
    PLATINUM: 50000,
    LEGENDARY: 80000
  }
};

// Updated ARK Token ABI matching the new contract
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
  
  // Fee structure (mutable via updateFees)
  'function liquidityFee() view returns (uint256)',
  'function lockerFee() view returns (uint256)',
  'function burnFee() view returns (uint256)',
  'function daoFee() view returns (uint256)',
  'function DIVIDER() view returns (uint256)',
  'function MAX_TOTAL_FEE() view returns (uint256)',
  
  // Immutable getters
  'function PAIR() view returns (address)',
  'function BURN() view returns (address)',
  'function USDC() view returns (address)',
  'function ARKDAO() view returns (address)',
  'function ARKLocker() view returns (address)',
  
  // Contract settings
  'function swapThreshold() view returns (uint256)',
  'function pulseXRouter() view returns (address)',
  
  // Admin functions
  'function updateFees(uint256 _liquidityFee, uint256 _lockerFee, uint256 _burnFee, uint256 _daoFee)',
  'function updateSwapThreshold(uint256 amount)',
  'function excludedWalletFromFee(address wallet, bool status)',
  'function updateLiquidityPair(address pair, bool status)',
  'function setARKLocker(address newAddress)',
  'function distributeLockerRewards()',
  'function sendDAORewards()',
  'function recoverPLS()',
  'function recoverTokens(address tokenAddress, uint256 amount)',
  
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

// Contract constants - UPDATED TO MATCH NEW CONTRACT
export const CONTRACT_CONSTANTS = {
  TOKEN_ADDRESS: CONTRACT_ADDRESSES.ARK_TOKEN,
  LOCKER_ADDRESS: CONTRACT_ADDRESSES.LOCKER,
  RPC_URL: NETWORKS.PULSECHAIN.rpcUrls[0],
  
  // Fee structure from new contract (mutable but defaults)
  LIQUIDITY_FEE: 400, // 4%
  LOCKER_FEE: 400,    // 4%
  BURN_FEE: 100,      // 1%
  DAO_FEE: 100,        // 1%
  TOTAL_FEES: 1000,    // 10%
  DIVIDER: 10000,      // Basis points
  
  // Swap settings
  DEFAULT_SWAP_THRESHOLD: 50000,
  MIN_SWAP_THRESHOLD: 1000,
  
  // Token supply
  TOTAL_SUPPLY: 1000000000,
  DECIMALS: 18,
};
