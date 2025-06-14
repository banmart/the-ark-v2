
import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useSwap } from '../../hooks/useSwap';

interface SwapContextType {
  fromAmount: string;
  toAmount: string;
  isLoading: boolean;
  slippage: number;
  canSwap: boolean;
  setFromAmount: (amount: string) => void;
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
    toAmount,
    isLoading,
    slippage,
    setFromAmount,
    setSlippage,
    executeSwap,
    canSwap,
  } = useSwap();

  const handleSwap = async () => {
    try {
      const result = await executeSwap();
      toast({
        title: "Swap Successful!",
        description: `Transaction hash: ${result.hash.slice(0, 10)}...`
      });
    } catch (error: any) {
      console.error("Swap error:", error);
      toast({
        variant: "destructive",
        title: "Swap Failed",
        description: error.message || "Failed to execute swap"
      });
    }
  };

  const value = {
    fromAmount,
    toAmount,
    isLoading,
    slippage,
    canSwap,
    setFromAmount,
    setSlippage,
    handleSwap,
  };

  return (
    <SwapContext.Provider value={value}>
      {children}
    </SwapContext.Provider>
  );
};
