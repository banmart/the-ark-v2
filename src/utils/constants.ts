
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
};

export const ARK_TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

export const DEX_ROUTER_ABI = [
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
];
