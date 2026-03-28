
import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useSwap } from '../../hooks/useSwap';

interface SwapContextType {
  fromAmount: string;
  fromToken: string;
  toAmount: string;
  isLoading: boolean;
  slippage: number;
  canSwap: boolean;
  priceImpact: number;
  minimumReceived: string;
  pairExists: boolean;
  setFromAmount: (amount: string) => void;
  setFromToken: (token: string) => void;
  setSlippage: (slippage: number) => void;
  handleSwap: () => Promise<void>;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const useSwapContext = () => {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error('useSwapContext must be used within a SwapProvider');
  }
  return context;
};

interface SwapProviderProps {
  children: ReactNode;
}

export const SwapProvider = ({ children }: SwapProviderProps) => {
  const {
    fromAmount,
    fromToken,
    toAmount,
    isLoading,
    slippage,
    priceImpact,
    minimumReceived,
    pairExists,
    setFromAmount,
    setFromToken,
    setSlippage,
    executeSwap,
    canSwap,
  } = useSwap();

  const handleSwap = async () => {
    try {
      if (!pairExists) {
        toast({
          variant: "destructive",
          title: "Pair Not Available",
          description: `${fromToken}/ARK trading pair not found on PulseX. Please check if liquidity exists.`
        });
        return;
      }

      const result = await executeSwap();
      toast({
        title: "Swap Successful!",
        description: `Swapped ${result.amountIn} ${fromToken} for ${parseFloat(result.amountOut).toFixed(2)} ARK. TX: ${result.hash.slice(0, 10)}...`
      });
    } catch (error: any) {
      console.error("Swap error:", error);
      
      let errorMessage = "Failed to execute swap";
      if (error.message?.includes("insufficient funds")) {
        errorMessage = `Insufficient ${fromToken} balance for swap + gas fees`;
      } else if (error.message?.includes("slippage")) {
        errorMessage = "Price changed too much. Try increasing slippage tolerance.";
      } else if (error.message?.includes("liquidity")) {
        errorMessage = "Insufficient liquidity for this trade size";
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction was rejected";
      }
      
      toast({
        variant: "destructive",
        title: "Swap Failed",
        description: errorMessage
      });
    }
  };

  const value = {
    fromAmount,
    fromToken,
    toAmount,
    isLoading,
    slippage,
    canSwap,
    priceImpact,
    minimumReceived,
    pairExists,
    setFromAmount,
    setFromToken,
    setSlippage,
    handleSwap,
  };

  return (
    <SwapContext.Provider value={value}>
      {children}
    </SwapContext.Provider>
  );
};
