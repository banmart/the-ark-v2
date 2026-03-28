
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { swapService } from '../services/swapService';

interface SwapState {
  fromAmount: string;
  fromToken: string;
  toAmount: string;
  isLoading: boolean;
  slippage: number;
  priceImpact: number;
  minimumReceived: string;
  pairExists: boolean;
}

export const useSwap = () => {
  const { provider, signer, account, isConnected } = useWallet();
  const [swapState, setSwapState] = useState<SwapState>({
    fromAmount: '',
    fromToken: 'PLS',
    toAmount: '',
    isLoading: false,
    slippage: 1, // 1% default slippage
    priceImpact: 0,
    minimumReceived: '',
    pairExists: false,
  });

  // Check if pair exists whenever fromToken changes
  useEffect(() => {
    const checkPair = async () => {
      const exists = await swapService.checkPairExists(swapState.fromToken);
      setSwapState(prev => ({ ...prev, pairExists: exists }));
    };
    checkPair();
  }, [swapState.fromToken]);

  // Calculate swap output using real DEX data
  const calculateSwapOutput = useCallback(async (inputAmount: string, token: string) => {
    if (!inputAmount || parseFloat(inputAmount) === 0) {
      setSwapState(prev => ({ 
        ...prev, 
        toAmount: '', 
        priceImpact: 0, 
        minimumReceived: '' 
      }));
      return;
    }

    try {
      console.log('Calculating swap output for:', inputAmount, token);
      
      const quote = await swapService.getSwapQuote(inputAmount, swapState.slippage, token);
      
      if (quote) {
        setSwapState(prev => ({ 
          ...prev, 
          toAmount: quote.amountOut,
          priceImpact: quote.priceImpact,
          minimumReceived: quote.minimumReceived
        }));
      } else {
        // Fallback if quote fails
        setSwapState(prev => ({ 
          ...prev, 
          toAmount: '0.00',
          priceImpact: 0,
          minimumReceived: '0.00'
        }));
      }
    } catch (error) {
      console.error('Error calculating swap output:', error);
      setSwapState(prev => ({ 
        ...prev, 
        toAmount: '', 
        priceImpact: 0, 
        minimumReceived: '' 
      }));
    }
  }, [swapState.slippage]);

  // Execute real swap
  const executeSwap = async () => {
    if (!signer || !account || !swapState.fromAmount) {
      throw new Error('Invalid swap parameters');
    }

    if (!swapState.pairExists) {
      throw new Error(`${swapState.fromToken}/ARK pair not found on PulseX. Please check if liquidity exists.`);
    }

    setSwapState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await swapService.executeSwap(
        swapState.fromAmount,
        swapState.slippage,
        signer,
        account,
        swapState.fromToken
      );

      // Reset form after successful swap
      setSwapState(prev => ({
        ...prev,
        fromAmount: '',
        toAmount: '',
        minimumReceived: '',
        priceImpact: 0,
        isLoading: false,
      }));

      return result;
    } catch (error) {
      console.error('Swap execution error:', error);
      setSwapState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Set input amount and calculate output
  const setFromAmount = (amount: string) => {
    setSwapState(prev => ({ ...prev, fromAmount: amount }));
    calculateSwapOutput(amount, swapState.fromToken);
  };

  // Set source token
  const setFromToken = (token: string) => {
    setSwapState(prev => ({ ...prev, fromToken: token }));
    if (swapState.fromAmount) {
      calculateSwapOutput(swapState.fromAmount, token);
    }
  };

  // Set slippage and recalculate if needed
  const setSlippage = (slippage: number) => {
    setSwapState(prev => ({ ...prev, slippage }));
    if (swapState.fromAmount) {
      calculateSwapOutput(swapState.fromAmount, swapState.fromToken);
    }
  };

  // Validate swap conditions
  const canSwap = isConnected && 
    parseFloat(swapState.fromAmount) > 0 && 
    parseFloat(swapState.toAmount) > 0 && 
    swapState.pairExists;

  return {
    ...swapState,
    setFromAmount,
    setFromToken,
    setSlippage,
    executeSwap,
    canSwap,
  };
};
