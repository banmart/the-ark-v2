
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DEX_ROUTER_ABI } from '../utils/constants';

interface SwapQuote {
  amountOut: string;
  priceImpact: number;
  minimumReceived: string;
}

class SwapService {
  private provider: ethers.JsonRpcProvider;
  private erc20Abi = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)'
  ];
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://rpc.pulsechain.com');
  }

  async getTokenDecimals(tokenAddress: string): Promise<number> {
    try {
      const token = new ethers.Contract(tokenAddress, ['function decimals() view returns (uint8)'], this.provider);
      return await token.decimals();
    } catch (error) {
      console.warn('Error fetching decimals, defaulting to 18:', error);
      return 18;
    }
  }

  async getSwapQuote(amountIn: string, slippage: number, fromToken: string = 'PLS'): Promise<SwapQuote | null> {
    try {
      const router = new ethers.Contract(
        CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
        DEX_ROUTER_ABI,
        this.provider
      );

      const fromTokenAddress = fromToken === 'PLS' ? CONTRACT_ADDRESSES.WPLS : CONTRACT_ADDRESSES[fromToken as keyof typeof CONTRACT_ADDRESSES];
      const decimals = fromToken === 'PLS' ? 18 : await this.getTokenDecimals(fromTokenAddress);
      
      const amountInWei = ethers.parseUnits(amountIn, decimals);
      const path = [fromTokenAddress, CONTRACT_ADDRESSES.ARK_TOKEN];

      console.log('Getting swap quote for:', {
        amountIn,
        fromToken,
        fromTokenAddress,
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
    recipient: string,
    fromToken: string = 'PLS'
  ): Promise<any> {
    try {
      const router = new ethers.Contract(
        CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
        DEX_ROUTER_ABI,
        signer
      );

      const fromTokenAddress = fromToken === 'PLS' ? CONTRACT_ADDRESSES.WPLS : CONTRACT_ADDRESSES[fromToken as keyof typeof CONTRACT_ADDRESSES];
      const decimals = fromToken === 'PLS' ? 18 : await this.getTokenDecimals(fromTokenAddress);
      const amountInWei = ethers.parseUnits(amountIn, decimals);
      const path = [fromTokenAddress, CONTRACT_ADDRESSES.ARK_TOKEN];

      // Handle Approval for ERC20
      if (fromToken !== 'PLS') {
        const tokenContract = new ethers.Contract(
          fromTokenAddress,
          ['function approve(address spender, uint256 amount) returns (bool)', 'function allowance(address owner, address spender) view returns (uint256)'],
          signer
        );
        
        const allowance = await tokenContract.allowance(recipient, CONTRACT_ADDRESSES.PULSEX_V2_ROUTER);
        if (allowance < amountInWei) {
          console.log('Approving token...');
          const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.PULSEX_V2_ROUTER, ethers.MaxUint256);
          await approveTx.wait();
          console.log('Approval confirmed');
        }
      }

      // Get expected output amount
      const amounts = await router.getAmountsOut(amountInWei, path);
      const amountOut = amounts[1];
      
      // Calculate minimum received with slippage
      const slippageBasisPoints = slippage * 100;
      const amountOutMin = amountOut * BigInt(10000 - slippageBasisPoints) / BigInt(10000);

      // Set deadline to 20 minutes from now
      const deadline = Math.floor(Date.now() / 1000) + 1200;

      let tx;
      if (fromToken === 'PLS') {
        // Swap PLS for ARK
        tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
          amountOutMin,
          path,
          recipient,
          deadline,
          { value: amountInWei }
        );
      } else {
        // Swap ERC20 for ARK
        tx = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
          amountInWei,
          amountOutMin,
          path,
          recipient,
          deadline
        );
      }

      console.log('Swap transaction sent:', tx.hash);
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

  async checkPairExists(fromToken: string = 'PLS'): Promise<boolean> {
    try {
      const fromTokenAddress = fromToken === 'PLS' ? CONTRACT_ADDRESSES.WPLS : CONTRACT_ADDRESSES[fromToken as keyof typeof CONTRACT_ADDRESSES];
      const decimals = fromToken === 'PLS' ? 18 : await this.getTokenDecimals(fromTokenAddress);
      
      const router = new ethers.Contract(
        CONTRACT_ADDRESSES.PULSEX_V2_ROUTER,
        DEX_ROUTER_ABI,
        this.provider
      );

      const amountInWei = ethers.parseUnits('0.001', decimals);
      const path = [fromTokenAddress, CONTRACT_ADDRESSES.ARK_TOKEN];

      await router.getAmountsOut(amountInWei, path);
      return true;
    } catch (error) {
      console.warn(`Pair for ${fromToken} might not exist or have liquidity:`, error);
      return false;
    }
  }
}

export const swapService = new SwapService();
