
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DEX_ROUTER_ABI } from '../utils/constants';

interface SwapQuote {
  amountOut: string;
  priceImpact: number;
  minimumReceived: string;
}

class SwapService {
  private provider: ethers.JsonRpcProvider;
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://rpc.pulsechain.com');
  }

  async getSwapQuote(amountIn: string, slippage: number): Promise<SwapQuote | null> {
    try {
      const router = new ethers.Contract(
        CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
        DEX_ROUTER_ABI,
        this.provider
      );

      const amountInWei = ethers.parseEther(amountIn);
      const path = [CONTRACT_ADDRESSES.WPLS, CONTRACT_ADDRESSES.ARK_TOKEN];

      console.log('Getting swap quote for:', {
        amountIn,
        amountInWei: amountInWei.toString(),
        path,
        router: CONTRACT_ADDRESSES.PULSEX_V2_ROUTER
      });

      const amounts = await router.getAmountsOut(amountInWei, path);
      const amountOut = amounts[1];
      
      // Calculate minimum received with slippage
      const slippageBasisPoints = slippage * 100; // Convert to basis points
      const minimumReceived = amountOut * BigInt(10000 - slippageBasisPoints) / BigInt(10000);

      return {
        amountOut: ethers.formatEther(amountOut),
        priceImpact: 0, // TODO: Calculate real price impact
        minimumReceived: ethers.formatEther(minimumReceived)
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      return null;
    }
  }

  async executeSwap(
    amountIn: string,
    slippage: number,
    signer: ethers.JsonRpcSigner,
    recipient: string
  ): Promise<any> {
    try {
      const router = new ethers.Contract(
        CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
        DEX_ROUTER_ABI,
        signer
      );

      const amountInWei = ethers.parseEther(amountIn);
      const path = [CONTRACT_ADDRESSES.WPLS, CONTRACT_ADDRESSES.ARK_TOKEN];

      // Get expected output amount
      const amounts = await router.getAmountsOut(amountInWei, path);
      const amountOut = amounts[1];
      
      // Calculate minimum received with slippage
      const slippageBasisPoints = slippage * 100;
      const amountOutMin = amountOut * BigInt(10000 - slippageBasisPoints) / BigInt(10000);

      // Set deadline to 20 minutes from now
      const deadline = Math.floor(Date.now() / 1000) + 1200;

      console.log('Executing swap:', {
        amountIn,
        amountInWei: amountInWei.toString(),
        amountOutMin: amountOutMin.toString(),
        path,
        recipient,
        deadline
      });

      const tx = await router.swapExactETHForTokens(
        amountOutMin,
        path,
        recipient,
        deadline,
        { value: amountInWei }
      );

      console.log('Swap transaction sent:', tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      return {
        hash: receipt.hash,
        success: true,
        amountIn,
        amountOut: ethers.formatEther(amountOut),
        amountOutMin: ethers.formatEther(amountOutMin)
      };
    } catch (error) {
      console.error('Swap execution error:', error);
      throw error;
    }
  }

  async checkPairExists(): Promise<boolean> {
    try {
      const router = new ethers.Contract(
        CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
        DEX_ROUTER_ABI,
        this.provider
      );

      const amountInWei = ethers.parseEther('0.001'); // Small test amount
      const path = [CONTRACT_ADDRESSES.WPLS, CONTRACT_ADDRESSES.ARK_TOKEN];

      await router.getAmountsOut(amountInWei, path);
      return true;
    } catch (error) {
      console.warn('ARK/WPLS pair might not exist or have liquidity:', error);
      return false;
    }
  }
}

export const swapService = new SwapService();
