
export interface PulseXPairData {
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
}

export interface DexPriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  lastUpdated: Date;
  dataSource: string;
  baseCurrency: string;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

// PulseX V2 Pair ABI (minimal for reserves)
export const PAIR_ABI = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function totalSupply() external view returns (uint256)'
];
