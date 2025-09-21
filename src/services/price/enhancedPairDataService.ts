import { ethers } from 'ethers';
import { NETWORKS } from '../../utils/constants';
import { PulseXPairData, PAIR_ABI } from './types';

export interface ARKTradingPair {
  name: string;
  address: string;
  token0: string;
  token1: string;
  baseToken: string; // ARK or the other token
}

export interface PairSwapEvent {
  pairAddress: string;
  pairName: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  sender: string;
  amount0In: string;
  amount1In: string;
  amount0Out: string;
  amount1Out: string;
  to: string;
  arkAmount: number; // ARK tokens involved in swap
  volumeUSD?: number;
}

export class EnhancedPairDataService {
  private provider: ethers.JsonRpcProvider;
  private pairs: ARKTradingPair[];
  private swapEventCache: Map<string, PairSwapEvent[]> = new Map();
  
  // ARK trading pairs on PulseChain
  public static readonly ARK_PAIRS: ARKTradingPair[] = [
    { name: 'ARK/PLS', address: '0x5f49421c0f74873bc02d0a912f171a030008f2c9', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/HEX', address: '0xf90276729dafdb7a062038ee562b9930a25b2a68', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/INC', address: '0xb5772bd25d4f0ddfd0a397220704105f34e9acf7', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/PLSX', address: '0x0910125f1ca4ab5a377bff38818807d1962fbbe8', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/TEDDY', address: '0xc37210b14aca22e91cf61e483047915c8e692989', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/pDAI', address: '0xedb427b249529f0b46248873f448ffd532806245', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/MOST', address: '0x81af294f7bc4afdfca4457042f99d4a3dd012b40', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/WBTC', address: '0x1c54b2ddfc95eee20f0a6963d82324e3458e51b7', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/HEX2', address: '0xe8d37c38b2c93f814de5b6f49b6c663eae2139c7', token0: '', token1: '', baseToken: 'ARK' },
    { name: 'ARK/DAI', address: '0x10897bf6bd7cb45691b614691284d3cda14a04da', token0: '', token1: '', baseToken: 'ARK' }
  ];

  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    this.pairs = [...EnhancedPairDataService.ARK_PAIRS];
  }

  async initializePairs(): Promise<void> {
    try {
      // Get token addresses for each pair
      for (const pair of this.pairs) {
        const pairContract = new ethers.Contract(pair.address, PAIR_ABI, this.provider);
        const [token0, token1] = await Promise.all([
          pairContract.token0(),
          pairContract.token1()
        ]);
        
        pair.token0 = token0.toLowerCase();
        pair.token1 = token1.toLowerCase();
      }
    } catch (error) {
      console.error('Error initializing pairs:', error);
    }
  }

  async getPairSwapEvents(
    pairAddress: string, 
    fromBlock: number = -20000,
    toBlock: number | string = 'latest'
  ): Promise<PairSwapEvent[]> {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const startBlock = fromBlock < 0 ? Math.max(0, currentBlock + fromBlock) : fromBlock;
      
      // Swap event ABI for PulseX V2
      const SWAP_ABI = [
        'event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)'
      ];
      
      const pairContract = new ethers.Contract(pairAddress, SWAP_ABI, this.provider);
      const swapFilter = pairContract.filters.Swap();
      
      const swapEvents = await pairContract.queryFilter(swapFilter, startBlock, toBlock);
      
      const pair = this.pairs.find(p => p.address.toLowerCase() === pairAddress.toLowerCase());
      const pairName = pair?.name || 'Unknown';
      
      const processedEvents: PairSwapEvent[] = [];
      
      for (const event of swapEvents.slice(-50)) { // Limit to last 50 events per pair
        try {
          if ('args' in event && event.args && event.blockNumber) {
            const block = await this.provider.getBlock(event.blockNumber);
            
            if (block) {
              const arkAmount = this.calculateARKAmount(event.args, pair);
              
              processedEvents.push({
                pairAddress,
                pairName,
                txHash: event.transactionHash,
                blockNumber: event.blockNumber,
                timestamp: block.timestamp * 1000,
                sender: event.args.sender,
                amount0In: event.args.amount0In.toString(),
                amount1In: event.args.amount1In.toString(),
                amount0Out: event.args.amount0Out.toString(),
                amount1Out: event.args.amount1Out.toString(),
                to: event.args.to,
                arkAmount
              });
            }
          }
        } catch (err) {
          console.error('Error processing swap event:', err);
        }
      }
      
      // Cache the results
      this.swapEventCache.set(pairAddress, processedEvents);
      
      return processedEvents.sort((a, b) => b.timestamp - a.timestamp);
      
    } catch (error) {
      console.error(`Error getting swap events for pair ${pairAddress}:`, error);
      return [];
    }
  }

  async getAllPairSwapEvents(): Promise<Map<string, PairSwapEvent[]>> {
    const allSwapEvents = new Map<string, PairSwapEvent[]>();
    
    // Process all pairs in parallel for efficiency
    const swapPromises = this.pairs.map(async (pair) => {
      const events = await this.getPairSwapEvents(pair.address);
      return { pairAddress: pair.address, events };
    });
    
    const results = await Promise.allSettled(swapPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allSwapEvents.set(result.value.pairAddress, result.value.events);
      } else {
        console.error(`Failed to get events for pair ${this.pairs[index].name}:`, result.reason);
        allSwapEvents.set(this.pairs[index].address, []);
      }
    });
    
    return allSwapEvents;
  }

  private calculateARKAmount(swapArgs: any, pair?: ARKTradingPair): number {
    try {
      // Determine which token is ARK based on pair configuration
      const amount0 = parseFloat(ethers.formatEther(swapArgs.amount0In || swapArgs.amount0Out || '0'));
      const amount1 = parseFloat(ethers.formatEther(swapArgs.amount1In || swapArgs.amount1Out || '0'));
      
      // For now, take the larger amount as it's likely the ARK amount
      // This is a simplification - in production you'd check token addresses
      return Math.max(amount0, amount1);
    } catch (error) {
      console.error('Error calculating ARK amount:', error);
      return 0;
    }
  }

  async getPairData(pairAddress: string): Promise<PulseXPairData | null> {
    try {
      const pair = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
      
      const [reserves, token0, token1, totalSupply] = await Promise.all([
        pair.getReserves(),
        pair.token0(),
        pair.token1(),
        pair.totalSupply()
      ]);

      return {
        token0,
        token1,
        reserve0: reserves[0].toString(),
        reserve1: reserves[1].toString(),
        totalSupply: totalSupply.toString()
      };
    } catch (error) {
      console.error('Error getting pair data:', error);
      return null;
    }
  }

  getPairs(): ARKTradingPair[] {
    return [...this.pairs];
  }

  clearCache(): void {
    this.swapEventCache.clear();
  }
}

export const enhancedPairDataService = new EnhancedPairDataService();