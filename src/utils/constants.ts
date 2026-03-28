
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
  ARK_TOKEN: '0xF4a370e64DD4673BAA250C5435100FA98661Db4C',
  LOCKER: '0x6cA6624aEdCF03F16b29DD217447c478feC2C096',
  DAO: '0x52433bc0bbAd24ba29c1Efc299C4F1A86BDE2582',
  PULSEX_V2_ROUTER: '0x165C3410fC91EF562C50559f7d2289fEbed552d9',
  WPLS: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
  USDC: '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07',
  DAI: '0xefD766cCb38EaF1dfd701853BFCe31359239F305',
  WETH: '0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C',
  WBTC: '0xb17D901469B9208B17d916112988A3FeD19b5cA1',
  ARK_DAI_PAIR: '',
  ARK_PLS_PAIR: '',
  BURN_ADDRESS: '0x0000000000000000000000000000000000000369',
  DEAD_ADDRESS: '0x0000000000000000000000000000000000000369',
};

// Complete SimplifiedLockerVault ABI - UPDATED FOR LATEST CONTRACT
export const LOCKER_VAULT_ABI = [
  // Dashboard view functions
  'function getProtocolDashboard() view returns (tuple(uint256 minLockDuration, uint256 maxLockDuration, uint256 minLockAmount, uint256 earlyUnlockPenalty, uint256 maxEarlyPenalty, bool earlyUnlockEnabled, bool paused, bool emergencyMode, uint256 emergencyUnlockTime, uint256 penaltyBurnShare, uint256 penaltyRewardShare) _config, uint256 _totalLockedTokens, uint256 _totalRewardsDistributed, uint256 _totalActiveLockers, uint256 _rewardPool)',
  'function getUserDashboard(address locker) view returns (tuple(uint256 totalLocked, uint256 totalRewardEarned, uint256 activeLocksCount) _stats, tuple(address lockOwner, uint256 amount, uint256 lockTime, uint256 unlockTime, uint256 lockPeriod, uint8 tier, uint256 rewardDebt, uint256 amountWeight, uint256 rewardEarned, bool active)[] _locks)',
  'function getUserSummary(address locker) view returns (uint256 _totalLocked, uint256 _pendingRewards, uint256 _totalRewardsEarned, uint256 _activeLocksCount)',
  'function getActiveLocks(address locker) view returns (tuple(address lockOwner, uint256 amount, uint256 lockTime, uint256 unlockTime, uint256 lockPeriod, uint8 tier, uint256 rewardDebt, uint256 amountWeight, uint256 rewardEarned, bool active)[])',
  'function getAllLockTiersInfo() view returns (tuple(uint256 minDuration, uint256 multiplier, string name)[])',
  'function getTopLockers() view returns (tuple(uint256 locked, address locker)[])',
  
  // Individual view functions
  'function pendingReward(address locker, uint256 lockID) view returns (uint256)',
  'function pendingRewardsAll(address locker) view returns (uint256)',
  'function calculateEarlyUnlockPenalty(address locker, uint256 lockID) view returns (uint256 penaltyAmount, uint256 userReceives)',
  'function currentDay() view returns (uint256)',
  
  // State variables
  'function lockedTokens() view returns (uint256)',
  'function lockedWeight() view returns (uint256)',
  'function rewardsDistributed() view returns (uint256)',
  'function activeLockers() view returns (uint256)',
  'function undistributedRewards() view returns (uint256)',
  'function rewardPerWeight() view returns (uint256)',
  'function earlyUnlockPenalty() view returns (uint256)',
  'function penaltyBurnShare() view returns (uint256)',
  'function penaltyRewardShare() view returns (uint256)',
  'function emergencyUnlockTime() view returns (uint256)',
  'function minLockAmount() view returns (uint256)',
  'function emergencyMode() view returns (bool)',
  'function earlyUnlockEnabled() view returns (bool)',
  'function ARK() view returns (address)',
  'function BURN() view returns (address)',
  
  // Constants
  'function MIN_LOCK_DURATION() view returns (uint256)',
  'function MAX_LOCK_DURATION() view returns (uint256)',
  'function BASIS_POINTS() view returns (uint256)',
  'function MAX_EARLY_PENALTY() view returns (uint256)',
  'function PRECISION_FACTOR() view returns (uint256)',
  'function TOP_LOCKER() view returns (uint256)',
  
  // User functions
  'function lockTokens(uint256 amount, uint256 lockDuration)',
  'function lockTokenForOthers(uint256 amount, uint256 lockDuration, address lockOwner)',
  'function unlockTokens(uint256 lockID)',
  'function claimReward()',
  'function claimReward(uint256[] calldata lockIds)',
  'function forceUnlockMatured(uint256 dayToProcess, uint256 maxLocks)',
  
  // Admin functions
  'function distributeRewards(uint256 amount)',
  'function updateEarlyUnlockSettings(uint256 penalty, bool enabled)',
  'function updatePenaltyDistribution(uint256 burnShare, uint256 rewardShare)',
  'function updateMinLockAmount(uint256 newMinLockAmount)',
  'function enableEmergencyMode()',
  'function disableEmergencyMode()',
  'function pause()',
  'function unpause()',
  'function recoverTokens(address token)',
  
  // Events
  'event TokensLocked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 unlockTime)',
  'event TokensUnlocked(address indexed user, uint256 amount, uint256 penalty)',
  'event RewardsDistributed(uint256 totalRewards, uint256 totalRecipients)',
  'event RewardClaimed(address indexed user, uint256 amount)',
  'event ForceUnlockDayProcessed(uint256 indexed day, uint256 locksProcessed, uint256 newCursor, uint256 totalLocks)',
];

// Locker vault contract address
export const LOCKER_VAULT_ADDRESS = '0x6cA6624aEdCF03F16b29DD217447c478feC2C096';

// Lock tier enumeration matching the contract
export const LOCK_TIERS = {
  BRONZE: 0,
  SILVER: 1,
  GOLD: 2,
  DIAMOND: 3,
  PLATINUM: 4,
  MYTHIC: 5,
  LEGENDARY: 6
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
  MIN_LOCK_AMOUNT: 10000,
  
  TIER_MULTIPLIERS: {
    BRONZE: 10000,
    SILVER: 15000,
    GOLD: 20000,
    DIAMOND: 30000,
    PLATINUM: 40000,
    MYTHIC: 50000,
    LEGENDARY: 70000
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
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)',
  'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',
  'function WPLS() external pure returns (address)',
  'function factory() external pure returns (address)',
];

// ARKDAO ABI
export const ARKDAO_ABI = [
  'function totalProposals() view returns (uint256)',
  'function proposalState(uint256 proposalID) view returns (uint8)',
  'function getProposals(uint256[] proposalIDs) view returns (tuple(uint256 proposalID, string title, string description, uint256 requestedFund, uint256 claimedFund, uint256 votingStart, uint256 votingEnd, uint256 votesFor, uint256 votesAgainst, uint256 voterCount, bool fundsClaimed, address proposer, uint8 state)[])',
  'function getVotersForProposals(uint256[] proposalIDs) view returns (tuple(address voter, uint256 support)[][])',
  'function getVoteReceipt(uint256 proposalID, address voter) view returns (tuple(bool hasVoted, uint256 support))',
  'function latestProposalID(address) view returns (uint256)',
  'function USDC() view returns (address)',
  'function ARKLocker() view returns (address)',
  'function QUORUM() view returns (uint256)',
  'function MAX_FUND_REQUEST() view returns (uint256)',
  'function BASIS_POINTS() view returns (uint256)',
  'function MIN_PROPOSAL_DURATION() view returns (uint256)',
  'function MAX_PROPOSAL_DURATION() view returns (uint256)',
  'function createProposal(string title, string description, uint256 requestedFund, uint256 duration)',
  'function castVote(uint256 proposalID, uint256 support)',
  'function claimFund(uint256 proposalID)',
  'event ProposalCreated(uint256 proposalID, string proposalTitle, string proposalDescription, address indexed proposer, uint256 votingStartTime, uint256 votingEndTime, uint256 requestedFund)',
  'event VoteCast(address indexed voter, uint256 proposalID, uint256 support)',
  'event FundsClaimed(uint256 proposalID, address indexed proposer, uint256 claimedFund)',
];

// IsTopLocker check ABI (on ARKLocker contract)
export const ARK_LOCKER_TOP_CHECK_ABI = [
  'function isTopLocker(address locker) view returns (bool)',
];

// Contract constants - UPDATED TO MATCH NEW CONTRACT
export const CONTRACT_CONSTANTS = {
  TOKEN_ADDRESS: CONTRACT_ADDRESSES.ARK_TOKEN,
  LOCKER_ADDRESS: CONTRACT_ADDRESSES.LOCKER,
  DAO_ADDRESS: CONTRACT_ADDRESSES.DAO,
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
