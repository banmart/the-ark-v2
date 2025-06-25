
import { ethers } from 'ethers';
import { NETWORKS } from '../../utils/constants';
import { PulseXPairData, PAIR_ABI } from './types';

export class PairDataService {
  private provider: ethers.JsonRpcProvider;
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
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
}
