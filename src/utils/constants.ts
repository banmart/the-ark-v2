
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
  ARK_TOKEN: '0x1234567890abcdef1234567890abcdef12345678',
  DEX_ROUTER: '0xabcdef1234567890abcdef1234567890abcdef12',
  DEAD_ADDRESS: '0x000000000000000000000000000000000000dEaD',
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

export const DEX_ROUTER_ABI = [
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
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
  MAX_TOTAL_FEES: 10,
  MIN_SWAP_THRESHOLD: 1000, // in tokens (before decimals)
  MAX_SWAP_THRESHOLD: 50000, // in tokens (before decimals)
  MAX_SLIPPAGE: 500, // 5% in basis points
  DEFAULT_SLIPPAGE: 200, // 2% in basis points
};
