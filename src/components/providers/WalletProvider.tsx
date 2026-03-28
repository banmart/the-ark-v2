
import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useWallet } from '../../hooks/useWallet';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  plsBalance: string;
  arkBalance: string;
  tokenBalances: Record<string, string>;
  isConnecting: boolean;
  handleConnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const {
    isConnected,
    account,
    plsBalance,
    arkBalance,
    tokenBalances,
    isConnecting,
    connectWallet,
  } = useWallet();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Connected!",
        description: `Wallet connected successfully`
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet"
      });
    }
  };

  const value = {
    isConnected,
    account,
    plsBalance,
    arkBalance,
    tokenBalances,
    isConnecting,
    handleConnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
