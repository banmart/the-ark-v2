import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS } from '../utils/constants';

export interface LiquiditySwapEvent {
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
  tokensSwapped: string;
  plsReceived: string;
  lpTokensBurned: string;
}

export interface LiquidityAccumulation {
  currentAccumulation: string;
  accumulationSinceLastSwap: string;
  lastSwapTimestamp: number;
  lastSwapBlock: number;
  isThresholdReached: boolean;
  isPendingSwap: boolean;
  estimatedNextSwap: number | null;
}

class LiquidityTrackingService {
  private provider: ethers.JsonRpcProvider;
  private arkToken: ethers.Contract;
  private cache: Map<string, any> = new Map();
  private CACHE_DURATION = 15000; // 15 seconds

  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    this.arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, this.provider);
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Get the last swap event from blockchain
  async getLastSwapEvent(): Promise<LiquiditySwapEvent | null> {
    const cacheKey = 'lastSwapEvent';
    const cached = this.getCachedData<LiquiditySwapEvent>(cacheKey);
    if (cached) return cached;

    try {
      // Look for SwapAndLiquify events or similar
      // For now, we'll track Transfer events from contract to detect swaps
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 50000); // Look back ~7 days

      // Get transfers from contract that indicate liquidity swaps
      const filter = this.arkToken.filters.Transfer(CONTRACT_ADDRESSES.ARK_TOKEN, null);
      const events = await this.arkToken.queryFilter(filter, fromBlock, currentBlock);

      // Find the most recent large transfer that indicates a swap
      const swapEvents = events.filter(event => {
        if ('args' in event && event.args) {
          const amount = parseFloat(ethers.formatEther(event.args.value || '0'));
          return amount > 1000; // Threshold for detecting swaps
        }
        return false;
      });

      if (swapEvents.length === 0) return null;

      const lastEvent = swapEvents[swapEvents.length - 1];
      const block = await this.provider.getBlock(lastEvent.blockNumber);

      const swapEvent: LiquiditySwapEvent = {
        transactionHash: lastEvent.transactionHash,
        blockNumber: lastEvent.blockNumber,
        timestamp: block?.timestamp || 0,
        tokensSwapped: 'args' in lastEvent && lastEvent.args ? ethers.formatEther(lastEvent.args.value || '0') : '0',
        plsReceived: '0', // Would need to parse transaction details
        lpTokensBurned: '0' // Would need additional tracking
      };

      this.setCachedData(cacheKey, swapEvent);
      return swapEvent;
    } catch (error) {
      console.error('Error getting last swap event:', error);
      return null;
    }
  }

  // Calculate current liquidity fee accumulation
  async getCurrentAccumulation(): Promise<LiquidityAccumulation> {
    const cacheKey = 'currentAccumulation';
    const cached = this.getCachedData<LiquidityAccumulation>(cacheKey);
    if (cached) return cached;

    try {
      const [contractBalance, swapThreshold, lastSwap] = await Promise.all([
        this.arkToken.balanceOf(CONTRACT_ADDRESSES.ARK_TOKEN),
        this.arkToken.swapThreshold(),
        this.getLastSwapEvent()
      ]);

      const currentAccumulation = ethers.formatEther(contractBalance);
      const threshold = ethers.formatEther(swapThreshold);
      const isThresholdReached = parseFloat(currentAccumulation) >= parseFloat(threshold);

      // Estimate accumulation since last swap
      let accumulationSinceLastSwap = currentAccumulation;
      if (lastSwap) {
        // This would ideally track the balance at the time of last swap
        // For now, we'll use the current balance as approximation
        accumulationSinceLastSwap = currentAccumulation;
      }

      // Check if a swap is currently pending (threshold reached but no recent swap)
      const isPendingSwap = isThresholdReached && lastSwap && 
        (Date.now() / 1000 - lastSwap.timestamp) < 3600; // Within last hour

      // Estimate next swap time based on accumulation rate
      let estimatedNextSwap: number | null = null;
      if (!isThresholdReached && lastSwap) {
        const timeSinceLastSwap = Date.now() / 1000 - lastSwap.timestamp;
        const accumulationRate = parseFloat(currentAccumulation) / timeSinceLastSwap;
        const remainingTokens = parseFloat(threshold) - parseFloat(currentAccumulation);
        
        if (accumulationRate > 0) {
          estimatedNextSwap = Date.now() + (remainingTokens / accumulationRate) * 1000;
        }
      }

      const result: LiquidityAccumulation = {
        currentAccumulation,
        accumulationSinceLastSwap,
        lastSwapTimestamp: lastSwap?.timestamp || 0,
        lastSwapBlock: lastSwap?.blockNumber || 0,
        isThresholdReached,
        isPendingSwap,
        estimatedNextSwap
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error getting current accumulation:', error);
      return {
        currentAccumulation: '0',
        accumulationSinceLastSwap: '0',
        lastSwapTimestamp: 0,
        lastSwapBlock: 0,
        isThresholdReached: false,
        isPendingSwap: false,
        estimatedNextSwap: null
      };
    }
  }

  // Check for recent swap activity
  async checkForRecentSwaps(sinceTimestamp: number): Promise<LiquiditySwapEvent[]> {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 1000); // Look back ~3 hours

      const filter = this.arkToken.filters.Transfer(CONTRACT_ADDRESSES.ARK_TOKEN, null);
      const events = await this.arkToken.queryFilter(filter, fromBlock, currentBlock);

      const recentSwaps: LiquiditySwapEvent[] = [];
      
      for (const event of events) {
        const block = await this.provider.getBlock(event.blockNumber);
        if (block && block.timestamp > sinceTimestamp && 'args' in event && event.args) {
          const amount = parseFloat(ethers.formatEther(event.args.value || '0'));
          
          if (amount > 1000) { // Threshold for detecting swaps
            recentSwaps.push({
              transactionHash: event.transactionHash,
              blockNumber: event.blockNumber,
              timestamp: block.timestamp,
              tokensSwapped: ethers.formatEther(event.args.value || '0'),
              plsReceived: '0',
              lpTokensBurned: '0'
            });
          }
        }
      }

      return recentSwaps.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error checking for recent swaps:', error);
      return [];
    }
  }

  // Get swap threshold from contract
  async getSwapThreshold(): Promise<string> {
    const cacheKey = 'swapThreshold';
    const cached = this.getCachedData<string>(cacheKey);
    if (cached) return cached;

    try {
      const threshold = await this.arkToken.swapThreshold();
      const result = ethers.formatEther(threshold);
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error getting swap threshold:', error);
      return '50000'; // Default threshold
    }
  }

  // Clear cache (useful for forcing fresh data)
  clearCache(): void {
    this.cache.clear();
  }
}

export const liquidityTrackingService = new LiquidityTrackingService();