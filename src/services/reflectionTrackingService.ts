import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS } from '../utils/constants';

export interface ReflectionData {
  currentReflectionPool: number;
  totalHolders: number;
  dailyReflectionRate: number;
  userReflections: number;
  lastReflectionUpdate: number;
}

class ReflectionTrackingService {
  private provider: ethers.JsonRpcProvider;
  private arkContract: ethers.Contract;
  private cache: ReflectionData | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 seconds

  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    this.arkContract = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, this.provider);
  }

  async getCurrentReflectionData(userAddress?: string): Promise<ReflectionData> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cache && (now - this.lastFetch) < this.CACHE_DURATION) {
      if (userAddress) {
        // Update user-specific data
        const userReflections = await this.getUserReflections(userAddress);
        return {
          ...this.cache,
          userReflections
        };
      }
      return this.cache;
    }

    try {
      console.log('Fetching reflection data...');

      // Get reflection pool data (simplified calculation)
      const [totalSupply, circulatingSupply] = await Promise.all([
        this.arkContract.totalSupply(),
        this.getCirculatingSupply()
      ]);

      // Estimate reflection pool based on recent transaction volume
      const reflectionPool = await this.estimateReflectionPool();
      const totalHolders = await this.estimateHolderCount();
      const dailyReflectionRate = await this.calculateDailyReflectionRate();
      
      const userReflections = userAddress ? await this.getUserReflections(userAddress) : 0;

      const reflectionData: ReflectionData = {
        currentReflectionPool: reflectionPool,
        totalHolders,
        dailyReflectionRate,
        userReflections,
        lastReflectionUpdate: now
      };

      // Cache the result
      this.cache = reflectionData;
      this.lastFetch = now;

      console.log('Reflection data updated:', reflectionData);
      return reflectionData;

    } catch (error) {
      console.error('Error fetching reflection data:', error);
      
      // Return cached data if available, otherwise return default values
      return this.cache || {
        currentReflectionPool: 50000,
        totalHolders: 2500,
        dailyReflectionRate: 10000,
        userReflections: 0,
        lastReflectionUpdate: now
      };
    }
  }

  private async getCirculatingSupply(): Promise<number> {
    try {
      const [totalSupply, burnedBalance] = await Promise.all([
        this.arkContract.totalSupply(),
        this.arkContract.balanceOf(CONTRACT_ADDRESSES.DEAD_ADDRESS)
      ]);

      const total = parseFloat(ethers.formatEther(totalSupply));
      const burned = parseFloat(ethers.formatEther(burnedBalance));
      
      return total - burned;
    } catch (error) {
      console.error('Error getting circulating supply:', error);
      return 850000000; // Default estimate
    }
  }

  private async estimateReflectionPool(): Promise<number> {
    try {
      // Get recent block range for analysis
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 1000); // Last ~1000 blocks

      // Get transfer events to estimate reflection activity
      const filter = this.arkContract.filters.Transfer();
      const events = await this.arkContract.queryFilter(filter, fromBlock, currentBlock);

      // Estimate reflection pool based on transaction volume
      let totalVolume = 0;
      events.forEach(event => {
        if (event.args) {
          const amount = parseFloat(ethers.formatEther(event.args.amount));
          totalVolume += amount;
        }
      });

      // 2% of total volume goes to reflections
      const estimatedReflections = totalVolume * 0.02;
      
      return Math.max(estimatedReflections, 25000); // Minimum 25k reflection pool
    } catch (error) {
      console.error('Error estimating reflection pool:', error);
      return 50000; // Default reflection pool
    }
  }

  private async estimateHolderCount(): Promise<number> {
    try {
      // Get recent transfer events to estimate unique holders
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 5000); // Larger range for holder estimation

      const filter = this.arkContract.filters.Transfer();
      const events = await this.arkContract.queryFilter(filter, fromBlock, currentBlock);

      const uniqueAddresses = new Set<string>();
      events.forEach(event => {
        if (event.args) {
          uniqueAddresses.add(event.args.from.toLowerCase());
          uniqueAddresses.add(event.args.to.toLowerCase());
        }
      });

      // Exclude burn address and zero address
      uniqueAddresses.delete(CONTRACT_ADDRESSES.DEAD_ADDRESS.toLowerCase());
      uniqueAddresses.delete('0x0000000000000000000000000000000000000000');

      // Estimate total holders based on recent activity (rough approximation)
      const recentActiveHolders = uniqueAddresses.size;
      const estimatedTotalHolders = Math.max(recentActiveHolders * 10, 2000); // Assume 10x more holders than recent active

      return Math.min(estimatedTotalHolders, 10000); // Cap at reasonable maximum
    } catch (error) {
      console.error('Error estimating holder count:', error);
      return 2500; // Default holder count
    }
  }

  private async calculateDailyReflectionRate(): Promise<number> {
    try {
      // Get 24-hour transaction volume estimate
      const currentBlock = await this.provider.getBlockNumber();
      const blocksPerDay = 24 * 60 * 60 / 10; // Assuming 10 second blocks
      const fromBlock = Math.max(0, currentBlock - Math.floor(blocksPerDay));

      const filter = this.arkContract.filters.Transfer();
      const events = await this.arkContract.queryFilter(filter, fromBlock, currentBlock);

      let dailyVolume = 0;
      events.forEach(event => {
        if (event.args) {
          const amount = parseFloat(ethers.formatEther(event.args.amount));
          dailyVolume += amount;
        }
      });

      // 2% of daily volume becomes reflections
      const dailyReflections = dailyVolume * 0.02;
      
      return Math.max(dailyReflections, 5000); // Minimum 5k daily reflections
    } catch (error) {
      console.error('Error calculating daily reflection rate:', error);
      return 10000; // Default daily reflection rate
    }
  }

  private async getUserReflections(userAddress: string): Promise<number> {
    try {
      // Get user's token balance
      const userBalance = await this.arkContract.balanceOf(userAddress);
      const balance = parseFloat(ethers.formatEther(userBalance));

      if (balance === 0) return 0;

      // Get total supply and reflection data
      const totalSupply = parseFloat(ethers.formatEther(await this.arkContract.totalSupply()));
      const holdingPercentage = balance / totalSupply;

      // Estimate user's share of daily reflections
      const dailyReflections = await this.calculateDailyReflectionRate();
      const userDailyReflections = dailyReflections * holdingPercentage;

      return userDailyReflections;
    } catch (error) {
      console.error('Error calculating user reflections:', error);
      return 0;
    }
  }

  // Get reflection rate per token (for calculator)
  async getReflectionRate(): Promise<number> {
    try {
      const data = await this.getCurrentReflectionData();
      const circulatingSupply = await this.getCirculatingSupply();
      
      // Reflections per token per day
      return data.dailyReflectionRate / circulatingSupply;
    } catch (error) {
      console.error('Error getting reflection rate:', error);
      return 0.00001; // Default rate
    }
  }

  // Clear cache (useful for manual refresh)
  clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
  }
}

export const reflectionTrackingService = new ReflectionTrackingService();