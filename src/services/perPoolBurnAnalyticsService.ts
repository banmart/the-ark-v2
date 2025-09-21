import { ethers } from 'ethers';
import { NETWORKS, CONTRACT_ADDRESSES } from '../utils/constants';
import { enhancedPairDataService, PairSwapEvent, ARKTradingPair } from './price/enhancedPairDataService';

export interface PoolBurnEvent {
  poolAddress: string;
  poolName: string;
  txHash: string;
  timestamp: number;
  burnAmount: number;
  swapAmount: number;
  wallet: string;
  blockNumber: number;
  burnEfficiency: number; // burn amount / swap amount
}

export interface PoolBurnMetrics {
  poolAddress: string;
  poolName: string;
  totalBurned24h: number;
  totalSwapVolume24h: number;
  burnCount24h: number;
  avgBurnPerSwap: number;
  burnEfficiency: number; // percentage
  lastBurnTimestamp?: number;
  topBurner?: string;
  trends: {
    hourlyChange: number;
    previousPeriodComparison: number;
  };
}

export interface AggregatedBurnData {
  totalBurnedAllPools: number;
  totalVolumeAllPools: number;
  overallEfficiency: number;
  mostActivePools: PoolBurnMetrics[];
  recentBurnEvents: PoolBurnEvent[];
  poolComparison: PoolBurnMetrics[];
}

export class PerPoolBurnAnalyticsService {
  private provider: ethers.JsonRpcProvider;
  private arkContract: ethers.Contract;
  private burnEventsCache: Map<string, PoolBurnEvent[]> = new Map();
  private metricsCache: Map<string, PoolBurnMetrics> = new Map();
  private lastUpdateTime: number = 0;
  private readonly BURN_ADDRESS = '0x0000000000000000000000000000000000000369';
  private readonly CACHE_DURATION = 30000; // 30 seconds

  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    
    // ARK Token contract for burn tracking
    const arkABI = [
      'event Transfer(address indexed from, address indexed to, uint256 value)',
      'function balanceOf(address account) view returns (uint256)'
    ];
    
    this.arkContract = new ethers.Contract(
      CONTRACT_ADDRESSES.ARK_TOKEN, 
      arkABI, 
      this.provider
    );
  }

  async initialize(): Promise<void> {
    await enhancedPairDataService.initializePairs();
  }

  async getPerPoolBurnMetrics(): Promise<PoolBurnMetrics[]> {
    try {
      // Check cache first
      if (Date.now() - this.lastUpdateTime < this.CACHE_DURATION && this.metricsCache.size > 0) {
        return Array.from(this.metricsCache.values());
      }

      const pairs = enhancedPairDataService.getPairs();
      const metrics: PoolBurnMetrics[] = [];
      
      // Process each pool
      for (const pair of pairs) {
        const poolMetrics = await this.calculatePoolMetrics(pair);
        metrics.push(poolMetrics);
        this.metricsCache.set(pair.address, poolMetrics);
      }
      
      this.lastUpdateTime = Date.now();
      return metrics.sort((a, b) => b.totalBurned24h - a.totalBurned24h);
      
    } catch (error) {
      console.error('Error getting per-pool burn metrics:', error);
      return [];
    }
  }

  private async calculatePoolMetrics(pair: ARKTradingPair): Promise<PoolBurnMetrics> {
    try {
      // Get swap events for this pool
      const swapEvents = await enhancedPairDataService.getPairSwapEvents(pair.address);
      
      // Get burn events correlated with swaps from this pool
      const correlatedBurns = await this.getCorrelatedBurnEvents(pair.address, swapEvents);
      
      // Calculate 24h metrics
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      const recent24hBurns = correlatedBurns.filter(burn => burn.timestamp >= oneDayAgo);
      const recent24hSwaps = swapEvents.filter(swap => swap.timestamp >= oneDayAgo);
      
      const totalBurned24h = recent24hBurns.reduce((sum, burn) => sum + burn.burnAmount, 0);
      const totalSwapVolume24h = recent24hSwaps.reduce((sum, swap) => sum + swap.arkAmount, 0);
      const burnCount24h = recent24hBurns.length;
      
      const avgBurnPerSwap = burnCount24h > 0 ? totalBurned24h / burnCount24h : 0;
      const burnEfficiency = totalSwapVolume24h > 0 ? (totalBurned24h / totalSwapVolume24h) * 100 : 0;
      
      // Calculate trends
      const previousDayBurns = correlatedBurns.filter(burn => 
        burn.timestamp >= (oneDayAgo - 24 * 60 * 60 * 1000) && burn.timestamp < oneDayAgo
      );
      const previousDayTotal = previousDayBurns.reduce((sum, burn) => sum + burn.burnAmount, 0);
      const previousPeriodComparison = previousDayTotal > 0 ? 
        ((totalBurned24h - previousDayTotal) / previousDayTotal) * 100 : 0;
      
      // Find top burner
      const walletBurns = new Map<string, number>();
      recent24hBurns.forEach(burn => {
        const current = walletBurns.get(burn.wallet) || 0;
        walletBurns.set(burn.wallet, current + burn.burnAmount);
      });
      
      const topBurner = walletBurns.size > 0 ? 
        Array.from(walletBurns.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0] : undefined;
      
      return {
        poolAddress: pair.address,
        poolName: pair.name,
        totalBurned24h,
        totalSwapVolume24h,
        burnCount24h,
        avgBurnPerSwap,
        burnEfficiency,
        lastBurnTimestamp: recent24hBurns.length > 0 ? Math.max(...recent24hBurns.map(b => b.timestamp)) : undefined,
        topBurner,
        trends: {
          hourlyChange: 0, // Simplified for now
          previousPeriodComparison
        }
      };
      
    } catch (error) {
      console.error(`Error calculating metrics for pool ${pair.name}:`, error);
      return this.getEmptyPoolMetrics(pair);
    }
  }

  private async getCorrelatedBurnEvents(
    poolAddress: string, 
    swapEvents: PairSwapEvent[]
  ): Promise<PoolBurnEvent[]> {
    try {
      // Check cache first
      const cached = this.burnEventsCache.get(poolAddress);
      if (cached) {
        return cached;
      }

      const correlatedBurns: PoolBurnEvent[] = [];
      
      // Get recent burn transactions
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 20000); // Last ~2-3 days
      
      const transferFilter = this.arkContract.filters.Transfer(null, this.BURN_ADDRESS);
      const burnEvents = await this.arkContract.queryFilter(transferFilter, fromBlock, 'latest');
      
      // Correlate burns with swaps by transaction hash and timing
      for (const burnEvent of burnEvents) {
        try {
          if ('args' in burnEvent && burnEvent.args && burnEvent.blockNumber) {
            const burnTxHash = burnEvent.transactionHash;
            const burnAmount = parseFloat(ethers.formatEther(burnEvent.args.value || '0'));
            
            // Find corresponding swap event (same transaction or within same block)
            const relatedSwap = swapEvents.find(swap => 
              swap.txHash === burnTxHash || 
              Math.abs(swap.blockNumber - burnEvent.blockNumber) <= 1
            );
            
            if (relatedSwap || swapEvents.length > 0) {
              const block = await this.provider.getBlock(burnEvent.blockNumber);
              
              if (block && burnAmount > 0) {
                const swapAmount = relatedSwap?.arkAmount || 0;
                const burnEfficiency = swapAmount > 0 ? (burnAmount / swapAmount) * 100 : 0;
                
                correlatedBurns.push({
                  poolAddress,
                  poolName: enhancedPairDataService.getPairs().find(p => p.address === poolAddress)?.name || 'Unknown',
                  txHash: burnTxHash,
                  timestamp: block.timestamp * 1000,
                  burnAmount,
                  swapAmount,
                  wallet: burnEvent.args.from || 'Unknown',
                  blockNumber: burnEvent.blockNumber,
                  burnEfficiency
                });
              }
            }
          }
        } catch (err) {
          console.error('Error processing burn event correlation:', err);
        }
      }
      
      // Sort by timestamp (newest first)
      const sortedBurns = correlatedBurns.sort((a, b) => b.timestamp - a.timestamp);
      
      // Cache the results
      this.burnEventsCache.set(poolAddress, sortedBurns);
      
      return sortedBurns;
      
    } catch (error) {
      console.error(`Error getting correlated burn events for pool ${poolAddress}:`, error);
      return [];
    }
  }

  async getAggregatedBurnData(): Promise<AggregatedBurnData> {
    try {
      const poolMetrics = await this.getPerPoolBurnMetrics();
      
      const totalBurnedAllPools = poolMetrics.reduce((sum, pool) => sum + pool.totalBurned24h, 0);
      const totalVolumeAllPools = poolMetrics.reduce((sum, pool) => sum + pool.totalSwapVolume24h, 0);
      const overallEfficiency = totalVolumeAllPools > 0 ? (totalBurnedAllPools / totalVolumeAllPools) * 100 : 0;
      
      // Get most active pools (top 5 by burn amount)
      const mostActivePools = poolMetrics
        .filter(pool => pool.totalBurned24h > 0)
        .slice(0, 5);
      
      // Get recent burn events from all pools
      const allBurnEvents: PoolBurnEvent[] = [];
      for (const pool of poolMetrics.slice(0, 5)) { // Limit to top 5 pools for performance
        const poolEvents = this.burnEventsCache.get(pool.poolAddress) || [];
        allBurnEvents.push(...poolEvents.slice(0, 20)); // Max 20 events per pool
      }
      
      const recentBurnEvents = allBurnEvents
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 100); // Show max 100 recent events
      
      return {
        totalBurnedAllPools,
        totalVolumeAllPools,
        overallEfficiency,
        mostActivePools,
        recentBurnEvents,
        poolComparison: poolMetrics
      };
      
    } catch (error) {
      console.error('Error getting aggregated burn data:', error);
      return this.getEmptyAggregatedData();
    }
  }

  private getEmptyPoolMetrics(pair: ARKTradingPair): PoolBurnMetrics {
    return {
      poolAddress: pair.address,
      poolName: pair.name,
      totalBurned24h: 0,
      totalSwapVolume24h: 0,
      burnCount24h: 0,
      avgBurnPerSwap: 0,
      burnEfficiency: 0,
      trends: {
        hourlyChange: 0,
        previousPeriodComparison: 0
      }
    };
  }

  private getEmptyAggregatedData(): AggregatedBurnData {
    return {
      totalBurnedAllPools: 0,
      totalVolumeAllPools: 0,
      overallEfficiency: 0,
      mostActivePools: [],
      recentBurnEvents: [],
      poolComparison: []
    };
  }

  clearCache(): void {
    this.burnEventsCache.clear();
    this.metricsCache.clear();
    this.lastUpdateTime = 0;
  }

  // Get burn events for a specific pool
  async getPoolBurnEvents(poolAddress: string): Promise<PoolBurnEvent[]> {
    const swapEvents = await enhancedPairDataService.getPairSwapEvents(poolAddress);
    return this.getCorrelatedBurnEvents(poolAddress, swapEvents);
  }
}

export const perPoolBurnAnalyticsService = new PerPoolBurnAnalyticsService();