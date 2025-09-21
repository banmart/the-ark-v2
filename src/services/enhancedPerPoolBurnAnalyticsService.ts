import { ethers } from 'ethers';
import { NETWORKS, CONTRACT_ADDRESSES } from '../utils/constants';
import { enhancedPairDataService, PairSwapEvent, ARKTradingPair } from './price/enhancedPairDataService';
import { enhancedVolumeEstimatorService, VolumeAnalytics } from './price/enhancedVolumeEstimatorService';

export interface EnhancedPoolBurnEvent {
  poolAddress: string;
  poolName: string;
  txHash: string;
  timestamp: number;
  burnAmount: number;
  burnAddress: string;
  burnType: 'null' | 'dead' | 'burn' | 'penalty';
  swapAmount: number;
  wallet: string;
  blockNumber: number;
  burnEfficiency: number;
  volumeUSD: number;
  burnPerMillionUSD: number;
  penaltySource?: 'early_unlock' | 'regular_burn';
  burnAddressType?: string;
}

export interface EnhancedPoolBurnMetrics {
  poolAddress: string;
  poolName: string;
  totalBurned24h: number;
  totalSwapVolume24h: number;
  totalVolumeUSD24h: number;
  burnCount24h: number;
  avgBurnPerSwap: number;
  burnEfficiency: number;
  burnPerMillionUSD: number;
  lastBurnTimestamp?: number;
  topBurner?: string;
  volumeAnalytics: VolumeAnalytics;
  burnBreakdown: {
    nullAddress: number;
    deadAddress: number;
    burnAddress: number;
    penaltyBurns: number;
  };
  trends: {
    hourlyChange: number;
    previousPeriodComparison: number;
  };
  ranking: {
    byBurn: number;
    byEfficiency: number;
    byVolume: number;
  };
}

export interface EnhancedAggregatedBurnData {
  totalBurnedAllPools: number;
  totalVolumeAllPools: number;
  totalVolumeUSD: number;
  overallEfficiency: number;
  overallBurnPerMillionUSD: number;
  mostActivePools: EnhancedPoolBurnMetrics[];
  recentBurnEvents: EnhancedPoolBurnEvent[];
  poolComparison: EnhancedPoolBurnMetrics[];
  burnAddressBreakdown: {
    totalNullBurns: number;
    totalDeadBurns: number;
    totalBurnAddressBurns: number;
    totalPenaltyBurns: number;
  };
  topPerformers: {
    byEfficiency: EnhancedPoolBurnMetrics[];
    byVolume: EnhancedPoolBurnMetrics[];
    byBurnAmount: EnhancedPoolBurnMetrics[];
  };
}

export interface CSVExportData {
  pair: string;
  token0: string;
  token1: string;
  burn_raw: string;
  burn_human: string;
  volume_usd: string;
  burn_per_million_usd: string;
  efficiency_percentage: string;
  total_swaps: string;
  confidence_level: string;
}

export class EnhancedPerPoolBurnAnalyticsService {
  private provider: ethers.JsonRpcProvider;
  private arkContract: ethers.Contract;
  private lockerContract: ethers.Contract;
  private burnEventsCache: Map<string, EnhancedPoolBurnEvent[]> = new Map();
  private metricsCache: Map<string, EnhancedPoolBurnMetrics> = new Map();
  private penaltyEventsCache: Map<string, any[]> = new Map();
  private lastUpdateTime: number = 0;
  
  // Enhanced burn addresses monitoring
  private readonly BURN_ADDRESSES = {
    NULL_ADDRESS: CONTRACT_ADDRESSES.BURN_ADDRESSES.NULL_ADDRESS.toLowerCase(),
    DEAD_ADDRESS: CONTRACT_ADDRESSES.BURN_ADDRESSES.DEAD_ADDRESS.toLowerCase(),
    BURN_ADDRESS: CONTRACT_ADDRESSES.BURN_ADDRESSES.BURN_ADDRESS.toLowerCase()
  };
  
  private readonly CACHE_DURATION = 45000; // 45 seconds for more frequent updates
  private readonly HISTORICAL_BLOCKS = 200000; // Expanded to 200k blocks for comprehensive history

  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    
    const arkABI = [
      'event Transfer(address indexed from, address indexed to, uint256 value)',
      'function balanceOf(address account) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];
    
    const lockerABI = [
      'event EarlyUnlockPenalty(address indexed user, uint256 lockId, uint256 penaltyAmount, uint256 burnedAmount)'
    ];
    
    this.arkContract = new ethers.Contract(
      CONTRACT_ADDRESSES.ARK_TOKEN, 
      arkABI, 
      this.provider
    );

    this.lockerContract = new ethers.Contract(
      CONTRACT_ADDRESSES.LOCKER,
      lockerABI,
      this.provider
    );
  }

  async initialize(): Promise<void> {
    try {
      console.log('Enhanced burn analytics: initializing pair data service...');
      await enhancedPairDataService.initializePairs();
      console.log('Enhanced burn analytics: pair data service initialized successfully');
    } catch (error) {
      console.error('Enhanced burn analytics: failed to initialize pair data service:', error);
      throw error;
    }
  }

  async getEnhancedPerPoolBurnMetrics(): Promise<EnhancedPoolBurnMetrics[]> {
    try {
      console.log('Enhanced burn metrics: checking cache...', { 
        cacheSize: this.metricsCache.size, 
        timeSinceUpdate: Date.now() - this.lastUpdateTime 
      });
      
      if (Date.now() - this.lastUpdateTime < this.CACHE_DURATION && this.metricsCache.size > 0) {
        const cached = Array.from(this.metricsCache.values());
        console.log('Enhanced burn metrics: returning cached data', { count: cached.length });
        return cached;
      }

      const pairs = enhancedPairDataService.getPairs();
      console.log('Enhanced burn metrics: processing pairs', { pairCount: pairs.length });
      
      const metrics: EnhancedPoolBurnMetrics[] = [];
      
      for (const pair of pairs) {
        console.log(`Enhanced burn metrics: calculating for pool ${pair.address}`);
        const poolMetrics = await this.calculateEnhancedPoolMetrics(pair);
        console.log(`Enhanced burn metrics: pool ${pair.address} result:`, {
          totalBurned24h: poolMetrics.totalBurned24h,
          burnCount: poolMetrics.burnCount24h
        });
        metrics.push(poolMetrics);
        this.metricsCache.set(pair.address, poolMetrics);
      }
      
      // Add rankings
      this.addRankings(metrics);
      
      this.lastUpdateTime = Date.now();
      const sorted = metrics.sort((a, b) => b.totalBurned24h - a.totalBurned24h);
      console.log('Enhanced burn metrics: final result', { 
        totalPools: sorted.length, 
        activePools: sorted.filter(m => m.totalBurned24h > 0).length 
      });
      return sorted;
      
    } catch (error) {
      console.error('Error getting enhanced per-pool burn metrics:', error);
      return [];
    }
  }

  private async calculateEnhancedPoolMetrics(pair: ARKTradingPair): Promise<EnhancedPoolBurnMetrics> {
    try {
      const swapEvents = await enhancedPairDataService.getPairSwapEvents(pair.address);
      const correlatedBurns = await this.getEnhancedCorrelatedBurnEvents(pair.address, swapEvents);
      
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      const recent24hBurns = correlatedBurns.filter(burn => burn.timestamp >= oneDayAgo);
      const recent24hSwaps = swapEvents.filter(swap => swap.timestamp >= oneDayAgo);
      
      // Calculate basic metrics
      const totalBurned24h = recent24hBurns.reduce((sum, burn) => sum + burn.burnAmount, 0);
      const totalSwapVolume24h = recent24hSwaps.reduce((sum, swap) => sum + swap.arkAmount, 0);
      const totalVolumeUSD24h = recent24hBurns.reduce((sum, burn) => sum + burn.volumeUSD, 0);
      const burnCount24h = recent24hBurns.length;
      
      // Enhanced calculations
      const avgBurnPerSwap = burnCount24h > 0 ? totalBurned24h / burnCount24h : 0;
      const burnEfficiency = totalSwapVolume24h > 0 ? (totalBurned24h / totalSwapVolume24h) * 100 : 0;
      const burnPerMillionUSD = totalVolumeUSD24h > 0 ? 
        enhancedVolumeEstimatorService.calculateBurnPerMillionUSD(totalBurned24h, totalVolumeUSD24h) : 0;
      
      // Burn breakdown by address type
      const burnBreakdown = {
        nullAddress: recent24hBurns
          .filter(b => b.burnType === 'null')
          .reduce((sum, burn) => sum + burn.burnAmount, 0),
        deadAddress: recent24hBurns
          .filter(b => b.burnType === 'dead')
          .reduce((sum, burn) => sum + burn.burnAmount, 0),
        burnAddress: recent24hBurns
          .filter(b => b.burnType === 'burn')
          .reduce((sum, burn) => sum + burn.burnAmount, 0),
        penaltyBurns: recent24hBurns
          .filter(b => b.burnType === 'penalty')
          .reduce((sum, burn) => sum + burn.burnAmount, 0)
      };

      // Get volume analytics for this pair
      const pairData = await enhancedPairDataService.getPairData(pair.address);
      const volumeAnalytics = pairData ? 
        await enhancedVolumeEstimatorService.analyzeVolume(pairData, pair.address, totalSwapVolume24h) :
        enhancedVolumeEstimatorService['getEmptyAnalytics']();

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
        totalVolumeUSD24h,
        burnCount24h,
        avgBurnPerSwap,
        burnEfficiency,
        burnPerMillionUSD,
        lastBurnTimestamp: recent24hBurns.length > 0 ? Math.max(...recent24hBurns.map(b => b.timestamp)) : undefined,
        topBurner,
        volumeAnalytics,
        burnBreakdown,
        trends: {
          hourlyChange: 0, // Could be enhanced with hourly data
          previousPeriodComparison
        },
        ranking: {
          byBurn: 0, // Will be filled by addRankings
          byEfficiency: 0,
          byVolume: 0
        }
      };
      
    } catch (error) {
      console.error(`Error calculating enhanced metrics for pool ${pair.name}:`, error);
      return this.getEmptyEnhancedPoolMetrics(pair);
    }
  }

  private async getEnhancedCorrelatedBurnEvents(
    poolAddress: string, 
    swapEvents: PairSwapEvent[]
  ): Promise<EnhancedPoolBurnEvent[]> {
    try {
      const cached = this.burnEventsCache.get(poolAddress);
      if (cached) return cached;

      const correlatedBurns: EnhancedPoolBurnEvent[] = [];
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - this.HISTORICAL_BLOCKS);
      
      // Get penalty events for correlation
      const penaltyEvents = await this.getPenaltyEvents(fromBlock, currentBlock);
      
      // Query burns to all three addresses
      const burnAddresses = Object.values(this.BURN_ADDRESSES);
      
      for (const burnAddress of burnAddresses) {
        try {
          const transferFilter = this.arkContract.filters.Transfer(null, burnAddress);
          const burnEvents = await this.arkContract.queryFilter(transferFilter, fromBlock, 'latest');
          
          for (const burnEvent of burnEvents) {
            if ('args' in burnEvent && burnEvent.args && burnEvent.blockNumber) {
              const burnAmount = parseFloat(ethers.formatEther(burnEvent.args.value || '0'));
              if (burnAmount <= 0) continue;
              
              const relatedSwap = swapEvents.find(swap => 
                swap.txHash === burnEvent.transactionHash || 
                Math.abs(swap.blockNumber - burnEvent.blockNumber) <= 2
              );
              
              // Always include burn events, even without related swaps
              const block = await this.provider.getBlock(burnEvent.blockNumber);
              if (!block) continue;
              
              const swapAmount = relatedSwap?.arkAmount || 0;
              const burnEfficiency = swapAmount > 0 ? (burnAmount / swapAmount) * 100 : 0;
              
              // Get real price data for USD calculation
              const pairData = await enhancedPairDataService.getPairData(poolAddress);
              const volumeAnalytics = pairData ? 
                await enhancedVolumeEstimatorService.analyzeVolume(pairData, poolAddress, swapAmount) :
                enhancedVolumeEstimatorService['getEmptyAnalytics']();
              
              const volumeUSD = swapAmount * volumeAnalytics.priceUSD;
              const burnPerMillionUSD = enhancedVolumeEstimatorService.calculateBurnPerMillionUSD(burnAmount, volumeUSD);
                
              correlatedBurns.push({
                poolAddress,
                poolName: enhancedPairDataService.getPairs().find(p => p.address === poolAddress)?.name || 'Unknown',
                txHash: burnEvent.transactionHash,
                timestamp: block.timestamp * 1000,
                burnAmount,
                burnAddress,
                burnType: this.getBurnType(burnAddress, burnEvent.transactionHash, penaltyEvents),
                swapAmount,
                wallet: burnEvent.args.from || 'Unknown',
                blockNumber: burnEvent.blockNumber,
                burnEfficiency,
                volumeUSD,
                burnPerMillionUSD,
                penaltySource: this.getPenaltySource(burnEvent.transactionHash, penaltyEvents),
                burnAddressType: this.getBurnAddressType(burnAddress)
              });
            }
          }
        } catch (err) {
          console.error(`Error querying burns for address ${burnAddress}:`, err);
        }
      }
      
      const sortedBurns = correlatedBurns.sort((a, b) => b.timestamp - a.timestamp);
      this.burnEventsCache.set(poolAddress, sortedBurns);
      
      return sortedBurns;
      
    } catch (error) {
      console.error(`Error getting enhanced correlated burn events for pool ${poolAddress}:`, error);
      return [];
    }
  }

  private getBurnType(burnAddress: string, txHash: string, penaltyEvents: any[]): 'null' | 'dead' | 'burn' | 'penalty' {
    // Check if this burn is related to a penalty event
    const isPenaltyBurn = penaltyEvents.some(event => event.txHash === txHash);
    
    if (isPenaltyBurn) {
      return 'penalty';
    }
    
    switch (burnAddress.toLowerCase()) {
      case this.BURN_ADDRESSES.NULL_ADDRESS:
        return 'null';
      case this.BURN_ADDRESSES.DEAD_ADDRESS:
        return 'dead';
      case this.BURN_ADDRESSES.BURN_ADDRESS:
        return 'burn';
      default:
        return 'burn';
    }
  }

  private getPenaltySource(txHash: string, penaltyEvents: any[]): 'early_unlock' | 'regular_burn' | undefined {
    const penaltyEvent = penaltyEvents.find(event => event.txHash === txHash);
    return penaltyEvent ? 'early_unlock' : undefined;
  }

  private async getPenaltyEvents(fromBlock: number, toBlock: number): Promise<any[]> {
    try {
      const cacheKey = `${fromBlock}-${toBlock}`;
      const cached = this.penaltyEventsCache.get(cacheKey);
      if (cached) return cached;

      const penaltyFilter = this.lockerContract.filters.EarlyUnlockPenalty();
      const events = await this.lockerContract.queryFilter(penaltyFilter, fromBlock, toBlock);
      
      const formattedEvents = events.map(event => {
        const eventLog = event as ethers.EventLog;
        return {
          txHash: event.transactionHash,
          blockNumber: event.blockNumber,
          user: eventLog.args?.[0],
          lockId: eventLog.args?.[1],
          penaltyAmount: eventLog.args?.[2] ? parseFloat(ethers.formatEther(eventLog.args[2])) : 0,
          burnedAmount: eventLog.args?.[3] ? parseFloat(ethers.formatEther(eventLog.args[3])) : 0
        };
      });

      this.penaltyEventsCache.set(cacheKey, formattedEvents);
      return formattedEvents;
    } catch (error) {
      console.error('Error fetching penalty events:', error);
      return [];
    }
  }

  private addRankings(metrics: EnhancedPoolBurnMetrics[]): void {
    // Sort and rank by burn amount
    const byBurn = [...metrics].sort((a, b) => b.totalBurned24h - a.totalBurned24h);
    byBurn.forEach((metric, index) => {
      const original = metrics.find(m => m.poolAddress === metric.poolAddress);
      if (original) original.ranking.byBurn = index + 1;
    });

    // Sort and rank by efficiency
    const byEfficiency = [...metrics].sort((a, b) => b.burnEfficiency - a.burnEfficiency);
    byEfficiency.forEach((metric, index) => {
      const original = metrics.find(m => m.poolAddress === metric.poolAddress);
      if (original) original.ranking.byEfficiency = index + 1;
    });

    // Sort and rank by volume
    const byVolume = [...metrics].sort((a, b) => b.totalVolumeUSD24h - a.totalVolumeUSD24h);
    byVolume.forEach((metric, index) => {
      const original = metrics.find(m => m.poolAddress === metric.poolAddress);
      if (original) original.ranking.byVolume = index + 1;
    });
  }

  async getEnhancedAggregatedBurnData(): Promise<EnhancedAggregatedBurnData> {
    try {
      const poolMetrics = await this.getEnhancedPerPoolBurnMetrics();
      
      const totalBurnedAllPools = poolMetrics.reduce((sum, pool) => sum + pool.totalBurned24h, 0);
      const totalVolumeAllPools = poolMetrics.reduce((sum, pool) => sum + pool.totalSwapVolume24h, 0);
      const totalVolumeUSD = poolMetrics.reduce((sum, pool) => sum + pool.totalVolumeUSD24h, 0);
      const overallEfficiency = totalVolumeAllPools > 0 ? (totalBurnedAllPools / totalVolumeAllPools) * 100 : 0;
      const overallBurnPerMillionUSD = totalVolumeUSD > 0 ? 
        enhancedVolumeEstimatorService.calculateBurnPerMillionUSD(totalBurnedAllPools, totalVolumeUSD) : 0;
      
      // Burn address breakdown
      const burnAddressBreakdown = {
        totalNullBurns: poolMetrics.reduce((sum, pool) => sum + pool.burnBreakdown.nullAddress, 0),
        totalDeadBurns: poolMetrics.reduce((sum, pool) => sum + pool.burnBreakdown.deadAddress, 0),
        totalBurnAddressBurns: poolMetrics.reduce((sum, pool) => sum + pool.burnBreakdown.burnAddress, 0),
        totalPenaltyBurns: poolMetrics.reduce((sum, pool) => sum + pool.burnBreakdown.penaltyBurns, 0)
      };

      // Top performers
      const activePools = poolMetrics.filter(pool => pool.totalBurned24h > 0);
      const topPerformers = {
        byEfficiency: [...activePools].sort((a, b) => b.burnEfficiency - a.burnEfficiency).slice(0, 5),
        byVolume: [...activePools].sort((a, b) => b.totalVolumeUSD24h - a.totalVolumeUSD24h).slice(0, 5),
        byBurnAmount: [...activePools].sort((a, b) => b.totalBurned24h - a.totalBurned24h).slice(0, 5)
      };
      
      // Recent burn events from all pools and burn addresses
      const allBurnEvents: EnhancedPoolBurnEvent[] = [];
      for (const pool of poolMetrics) {
        const poolEvents = this.burnEventsCache.get(pool.poolAddress) || [];
        // Take more events per pool and add burn address info
        const enhancedEvents = poolEvents.slice(0, 50).map(event => ({
          ...event,
          burnAddressType: this.getBurnAddressType(event.burnAddress)
        }));
        allBurnEvents.push(...enhancedEvents);
      }
      
      // Sort all events by timestamp to get unified chronological order
      const recentBurnEvents = allBurnEvents
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 200); // Increased to show more recent activity
      
      return {
        totalBurnedAllPools,
        totalVolumeAllPools,
        totalVolumeUSD,
        overallEfficiency,
        overallBurnPerMillionUSD,
        mostActivePools: activePools.slice(0, 5),
        recentBurnEvents,
        poolComparison: poolMetrics,
        burnAddressBreakdown,
        topPerformers
      };
      
    } catch (error) {
      console.error('Error getting enhanced aggregated burn data:', error);
      return this.getEmptyEnhancedAggregatedData();
    }
  }

  // CSV Export functionality
  async exportToCSV(): Promise<CSVExportData[]> {
    try {
      const poolMetrics = await this.getEnhancedPerPoolBurnMetrics();
      
      return poolMetrics.map(pool => ({
        pair: pool.poolName,
        token0: pool.poolAddress, // Simplified - would need actual token addresses
        token1: pool.poolAddress,
        burn_raw: (pool.totalBurned24h * Math.pow(10, 18)).toFixed(0),
        burn_human: pool.totalBurned24h.toFixed(6),
        volume_usd: pool.totalVolumeUSD24h.toFixed(2),
        burn_per_million_usd: pool.burnPerMillionUSD.toFixed(6),
        efficiency_percentage: pool.burnEfficiency.toFixed(4),
        total_swaps: pool.burnCount24h.toString(),
        confidence_level: pool.volumeAnalytics.confidenceLevel
      }));
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      return [];
    }
  }

  private getEmptyEnhancedPoolMetrics(pair: ARKTradingPair): EnhancedPoolBurnMetrics {
    return {
      poolAddress: pair.address,
      poolName: pair.name,
      totalBurned24h: 0,
      totalSwapVolume24h: 0,
      totalVolumeUSD24h: 0,
      burnCount24h: 0,
      avgBurnPerSwap: 0,
      burnEfficiency: 0,
      burnPerMillionUSD: 0,
      volumeAnalytics: enhancedVolumeEstimatorService['getEmptyAnalytics'](),
      burnBreakdown: {
        nullAddress: 0,
        deadAddress: 0,
        burnAddress: 0,
        penaltyBurns: 0
      },
      trends: {
        hourlyChange: 0,
        previousPeriodComparison: 0
      },
      ranking: {
        byBurn: 0,
        byEfficiency: 0,
        byVolume: 0
      }
    };
  }

  private getEmptyEnhancedAggregatedData(): EnhancedAggregatedBurnData {
    return {
      totalBurnedAllPools: 0,
      totalVolumeAllPools: 0,
      totalVolumeUSD: 0,
      overallEfficiency: 0,
      overallBurnPerMillionUSD: 0,
      mostActivePools: [],
      recentBurnEvents: [],
      poolComparison: [],
      burnAddressBreakdown: {
        totalNullBurns: 0,
        totalDeadBurns: 0,
        totalBurnAddressBurns: 0,
        totalPenaltyBurns: 0
      },
      topPerformers: {
        byEfficiency: [],
        byVolume: [],
        byBurnAmount: []
      }
    };
  }

  private getBurnAddressType(burnAddress: string): string {
    if (burnAddress.toLowerCase() === this.BURN_ADDRESSES.NULL_ADDRESS.toLowerCase()) {
      return 'Null Address';
    } else if (burnAddress.toLowerCase() === this.BURN_ADDRESSES.DEAD_ADDRESS.toLowerCase()) {
      return 'Dead Address';
    } else if (burnAddress.toLowerCase() === this.BURN_ADDRESSES.BURN_ADDRESS.toLowerCase()) {
      return 'Burn Address';
    }
    return 'Unknown';
  }

  clearCache(): void {
    this.burnEventsCache.clear();
    this.metricsCache.clear();
    this.penaltyEventsCache.clear();
    this.lastUpdateTime = 0;
  }

  async getPoolBurnEvents(poolAddress: string): Promise<EnhancedPoolBurnEvent[]> {
    const swapEvents = await enhancedPairDataService.getPairSwapEvents(poolAddress);
    return this.getEnhancedCorrelatedBurnEvents(poolAddress, swapEvents);
  }
}

export const enhancedPerPoolBurnAnalyticsService = new EnhancedPerPoolBurnAnalyticsService();