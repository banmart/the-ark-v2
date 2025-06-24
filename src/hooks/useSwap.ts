
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { swapService } from '../services/swapService';

interface SwapState {
  fromAmount: string;
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
    toAmount: '',
    isLoading: false,
    slippage: 2, // 2% default slippage
    priceImpact: 0,
    minimumReceived: '',
    pairExists: false,
  });

  // Check if pair exists on mount
  useEffect(() => {
    const checkPair = async () => {
      const exists = await swapService.checkPairExists();
      setSwapState(prev => ({ ...prev, pairExists: exists }));
    };
    checkPair();
  }, []);

  // Calculate swap output using real DEX data
  const calculateSwapOutput = useCallback(async (inputAmount: string) => {
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
      console.log('Calculating swap output for:', inputAmount);
      
      const quote = await swapService.getSwapQuote(inputAmount, swapState.slippage);
      
      if (quote) {
        setSwapState(prev => ({ 
          ...prev, 
          toAmount: quote.amountOut,
          priceImpact: quote.priceImpact,
          minimumReceived: quote.minimumReceived
        }));
      } else {
        // Fallback if quote fails - use approximate calculation
        const approximateRate = 6500; // Approximate PLS:ARK rate
        const output = (parseFloat(inputAmount) * approximateRate).toString();
        setSwapState(prev => ({ 
          ...prev, 
          toAmount: output,
          priceImpact: 0,
          minimumReceived: (parseFloat(output) * (100 - swapState.slippage) / 100).toString()
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
      throw new Error('ARK/WPLS pair not found on PulseX. Please check if liquidity exists.');
    }

    setSwapState(prev => ({ ...prev, isLoading: true }));

    try {
      console.log('Executing real swap:', {
        fromAmount: swapState.fromAmount,
        toAmount: swapState.toAmount,
        slippage: swapState.slippage,
        minimumReceived: swapState.minimumReceived,
      });

      const result = await swapService.executeSwap(
        swapState.fromAmount,
        swapState.slippage,
        signer,
        account
      );

      console.log('Swap completed:', result);

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
    calculateSwapOutput(amount);
  };

  // Set slippage and recalculate if needed
  const setSlippage = (slippage: number) => {
    setSwapState(prev => ({ ...prev, slippage }));
    if (swapState.fromAmount) {
      calculateSwapOutput(swapState.fromAmount);
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
    setSlippage,
    executeSwap,
    canSwap,
  };
};
