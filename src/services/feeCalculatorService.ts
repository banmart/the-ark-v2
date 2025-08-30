import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS, CONTRACT_CONSTANTS } from '../utils/constants';
import { blockchainDataService } from './blockchainDataService';

export interface FeesCollected {
  burn: {
    dailyFees: number;
    totalCollected: number;
    rate: number; // percentage of daily volume
  };
  reflection: {
    dailyFees: number;
    totalCollected: number;
    rate: number;
  };
  liquidity: {
    dailyFees: number;
    totalCollected: number;
    rate: number;
  };
  locker: {
    dailyFees: number;
    totalCollected: number;
    rate: number;
  };
  total: {
    dailyFees: number;
    totalCollected: number;
    rate: number;
  };
}

export interface FeeMetrics {
  volume24h: number;
  feesCollected: FeesCollected;
  efficiency: {
    burn: number; // percentage of theoretical maximum
    reflection: number;
    liquidity: number;
    locker: number;
    overall: number;
  };
  trends: {
    hourlyChange: number;
    dailyChange: number;
    weeklyChange: number;
  };
  lastUpdated: Date;
}

class FeeCalculatorService {
  private provider: ethers.JsonRpcProvider;
  private arkContract: ethers.Contract;
  private lockerContract: ethers.Contract;
  private feeHistory: FeeMetrics[] = [];
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    
    // Define a minimal ERC20 ABI for Transfer events
    const erc20ABI = [
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address account) view returns (uint256)"
    ];
    
    // Define a minimal Locker ABI for burn events
    const lockerABI = [
      "event EarlyUnlockPenalty(address indexed user, uint256 amount, uint256 penalty)",
      "event TokensLocked(address indexed user, uint256 amount, uint256 duration)",
      "event TokensUnlocked(address indexed user, uint256 amount)"
    ];
    
    this.arkContract = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, erc20ABI, this.provider);
    this.lockerContract = new ethers.Contract(CONTRACT_ADDRESSES.LOCKER, lockerABI, this.provider);
  }

  async calculateDailyFees(volume24h: number): Promise<FeesCollected> {
    try {
      // Calculate theoretical daily fees based on volume and fixed rates
      const burnDaily = volume24h * (CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER);
      const reflectionDaily = volume24h * (CONTRACT_CONSTANTS.REFLECTION_FEE / CONTRACT_CONSTANTS.DIVIDER);
      const liquidityDaily = volume24h * (CONTRACT_CONSTANTS.LIQUIDITY_FEE / CONTRACT_CONSTANTS.DIVIDER);
      const lockerDaily = volume24h * (CONTRACT_CONSTANTS.LOCKER_FEE / CONTRACT_CONSTANTS.DIVIDER);
      const totalDaily = burnDaily + reflectionDaily + liquidityDaily + lockerDaily;

      // Get actual fee collection data from blockchain events
      const actualBurnFees = await this.getActualBurnFees();
      const actualLiquidityFees = await this.getActualLiquidityFees();
      
      return {
        burn: {
          dailyFees: burnDaily,
          totalCollected: actualBurnFees.total,
          rate: (CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER) * 100
        },
        reflection: {
          dailyFees: reflectionDaily,
          totalCollected: reflectionDaily * 30, // Estimate monthly
          rate: (CONTRACT_CONSTANTS.REFLECTION_FEE / CONTRACT_CONSTANTS.DIVIDER) * 100
        },
        liquidity: {
          dailyFees: liquidityDaily,
          totalCollected: actualLiquidityFees.total,
          rate: (CONTRACT_CONSTANTS.LIQUIDITY_FEE / CONTRACT_CONSTANTS.DIVIDER) * 100
        },
        locker: {
          dailyFees: lockerDaily,
          totalCollected: lockerDaily * 30, // Estimate monthly
          rate: (CONTRACT_CONSTANTS.LOCKER_FEE / CONTRACT_CONSTANTS.DIVIDER) * 100
        },
        total: {
          dailyFees: totalDaily,
          totalCollected: actualBurnFees.total + actualLiquidityFees.total + (reflectionDaily * 30) + (lockerDaily * 30),
          rate: (CONTRACT_CONSTANTS.TOTAL_FEES / CONTRACT_CONSTANTS.DIVIDER) * 100
        }
      };
    } catch (error) {
      console.error('Error calculating daily fees:', error);
      return this.getDefaultFees();
    }
  }

  async getActualBurnFees(): Promise<{ daily: number; total: number }> {
    try {
      // Get burn events from the last 24 hours
      const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
      const currentBlock = await this.provider.getBlockNumber();
      
      // Estimate blocks in last 24 hours (assuming ~3 second block time)
      const blocksPerDay = Math.floor(24 * 60 * 60 / 3);
      const startBlock = Math.max(0, currentBlock - blocksPerDay);
      
      const DEAD_ADDRESS = '0x0000000000000000000000000000000000000369';
      const transferFilter = this.arkContract.filters.Transfer(null, DEAD_ADDRESS);
      const burnEvents = await this.arkContract.queryFilter(transferFilter, startBlock, currentBlock);
      
      let dailyBurnAmount = 0;
      for (const event of burnEvents) {
        if ('args' in event && event.args) {
          const amount = parseFloat(ethers.formatEther(event.args.value || '0'));
          dailyBurnAmount += amount;
        }
      }
      
      // Get total burned amount
      const totalBurned = await this.arkContract.balanceOf(DEAD_ADDRESS);
      const totalBurnedAmount = parseFloat(ethers.formatEther(totalBurned));
      
      return {
        daily: dailyBurnAmount,
        total: totalBurnedAmount
      };
    } catch (error) {
      console.error('Error getting actual burn fees:', error);
      return { daily: 0, total: 0 };
    }
  }

  async getActualLiquidityFees(): Promise<{ daily: number; total: number }> {
    try {
      // Get liquidity accumulation data
      const currentAccumulation = await this.arkContract.balanceOf(CONTRACT_ADDRESSES.ARK_TOKEN);
      const liquidityAmount = parseFloat(ethers.formatEther(currentAccumulation));
      
      // Estimate daily liquidity fees based on current accumulation
      const dailyEstimate = liquidityAmount * 0.1; // Rough estimate
      
      return {
        daily: dailyEstimate,
        total: liquidityAmount
      };
    } catch (error) {
      console.error('Error getting actual liquidity fees:', error);
      return { daily: 0, total: 0 };
    }
  }

  calculateFeeEfficiency(theoretical: FeesCollected, actual: FeesCollected): FeeMetrics['efficiency'] {
    const calcEfficiency = (actualVal: number, theoreticalVal: number): number => {
      if (theoreticalVal === 0) return 0;
      return Math.min(100, (actualVal / theoreticalVal) * 100);
    };

    return {
      burn: calcEfficiency(actual.burn.totalCollected, theoretical.burn.totalCollected),
      reflection: calcEfficiency(actual.reflection.totalCollected, theoretical.reflection.totalCollected),
      liquidity: calcEfficiency(actual.liquidity.totalCollected, theoretical.liquidity.totalCollected),
      locker: calcEfficiency(actual.locker.totalCollected, theoretical.locker.totalCollected),
      overall: calcEfficiency(actual.total.totalCollected, theoretical.total.totalCollected)
    };
  }

  async getFeeMetrics(volume24h: number): Promise<FeeMetrics> {
    try {
      const feesCollected = await this.calculateDailyFees(volume24h);
      const theoreticalFees = await this.calculateDailyFees(volume24h);
      const efficiency = this.calculateFeeEfficiency(theoreticalFees, feesCollected);
      
      // Calculate trends (placeholder for now)
      const trends = {
        hourlyChange: Math.random() * 10 - 5, // -5% to +5%
        dailyChange: Math.random() * 20 - 10, // -10% to +10%
        weeklyChange: Math.random() * 50 - 25 // -25% to +25%
      };

      const metrics: FeeMetrics = {
        volume24h,
        feesCollected,
        efficiency,
        trends,
        lastUpdated: new Date()
      };

      // Store in history
      this.feeHistory.push(metrics);
      if (this.feeHistory.length > 100) {
        this.feeHistory = this.feeHistory.slice(-100);
      }

      return metrics;
    } catch (error) {
      console.error('Error getting fee metrics:', error);
      return this.getDefaultMetrics(volume24h);
    }
  }

  private getDefaultFees(): FeesCollected {
    return {
      burn: { dailyFees: 0, totalCollected: 0, rate: 2 },
      reflection: { dailyFees: 0, totalCollected: 0, rate: 2 },
      liquidity: { dailyFees: 0, totalCollected: 0, rate: 3 },
      locker: { dailyFees: 0, totalCollected: 0, rate: 2 },
      total: { dailyFees: 0, totalCollected: 0, rate: 9 }
    };
  }

  private getDefaultMetrics(volume24h: number): FeeMetrics {
    return {
      volume24h,
      feesCollected: this.getDefaultFees(),
      efficiency: {
        burn: 0,
        reflection: 0,
        liquidity: 0,
        locker: 0,
        overall: 0
      },
      trends: {
        hourlyChange: 0,
        dailyChange: 0,
        weeklyChange: 0
      },
      lastUpdated: new Date()
    };
  }

  getFeeHistory(): FeeMetrics[] {
    return [...this.feeHistory];
  }

  async getBurnTransactionHistory(): Promise<Array<{timestamp: number; amount: number; txHash: string; volume24h: number}>> {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      console.log('Current block:', currentBlock);
      
      // Go back 20,000 blocks (roughly 48-72 hours on PulseChain)
      const fromBlock = Math.max(currentBlock - 20000, 0);
      console.log('Querying from block:', fromBlock, 'to latest');
      
      // Query Transfer events to DEAD_ADDRESS from Token contract (using the address directly)
      const DEAD_ADDRESS = '0x0000000000000000000000000000000000000369';
      const tokenFilter = this.arkContract.filters.Transfer(null, DEAD_ADDRESS);
      const tokenEvents = await this.arkContract.queryFilter(tokenFilter, fromBlock, 'latest');
      console.log('Found', tokenEvents.length, 'token burn events');
      
      // Also monitor Locker contract for penalty burns (using the address directly)
      let lockerEvents: any[] = [];
      try {
        const LOCKER_ADDRESS = '0x3ba44a1de77025b78d7430449569dd1112ac4473';
        const lockerContract = new ethers.Contract(
          LOCKER_ADDRESS, 
          ['event PenaltyBurn(address indexed user, uint256 amount, uint256 timestamp)'],
          this.provider
        );
        const penaltyFilter = lockerContract.filters.PenaltyBurn();
        lockerEvents = await lockerContract.queryFilter(penaltyFilter, fromBlock, 'latest');
        console.log('Found', lockerEvents.length, 'locker penalty burn events');
      } catch (err) {
        console.log('Locker penalty events not available or no events found');
      }
      
      // Combine all burn events
      const allEvents = [...tokenEvents, ...lockerEvents];
      
      // Process events and get block details with better error handling
      const transactions = [];
      
      for (const event of allEvents.slice(-100)) {
        try {
          if ('args' in event && event.args && event.blockNumber) {
            const block = await this.provider.getBlock(event.blockNumber);
            const amount = parseFloat(ethers.formatEther(event.args?.value || event.args?.amount || '0'));
            
            if (amount > 0 && block) {
              transactions.push({
                timestamp: block.timestamp * 1000, // Convert to milliseconds
                amount,
                txHash: event.transactionHash,
                volume24h: amount * 10, // Rough estimate based on burn amount
                type: event.args?.user ? 'penalty' : 'transaction'
              });
            }
          }
        } catch (err) {
          console.error('Error processing burn event:', err);
        }
      }
      
      // Sort by timestamp (newest first)
      const sortedTransactions = transactions.sort((a, b) => b.timestamp - a.timestamp);
      console.log('Processed', sortedTransactions.length, 'valid burn transactions');
      
      return sortedTransactions;
      
    } catch (error) {
      console.error('Error fetching burn transaction history:', error);
      return [];
    }
  }

  getLatestMetrics(): FeeMetrics | null {
    return this.feeHistory.length > 0 ? this.feeHistory[this.feeHistory.length - 1] : null;
  }
}

export const feeCalculatorService = new FeeCalculatorService();