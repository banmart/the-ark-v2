
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { NETWORKS, CONTRACT_ADDRESSES, ARK_TOKEN_ABI } from '../utils/constants';

interface WalletState {
  isConnected: boolean;
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  plsBalance: string;
  arkBalance: string;
  tokenBalances: Record<string, string>;
  chainId: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    plsBalance: '0',
    arkBalance: '0',
    tokenBalances: {},
    chainId: null,
  });

  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected
  const checkConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          const network = await provider.getNetwork();
          
          setWalletState(prev => ({
            ...prev,
            isConnected: true,
            account,
            provider,
            signer,
            chainId: `0x${network.chainId.toString(16)}`,
          }));

          await updateBalances(provider, account);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  }, []);

  // Update balances
  const updateBalances = async (provider: ethers.BrowserProvider, account: string) => {
    try {
      // Get PLS balance
      const plsBalanceWei = await provider.getBalance(account);
      const formattedPlsBalance = ethers.formatEther(plsBalanceWei);

      // Get ARK balance
      const arkContract = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);
      const arkBalanceWei = await arkContract.balanceOf(account);
      const formattedArkBalance = ethers.formatEther(arkBalanceWei);

      // Get other token balances (WPLS, USDC, DAI, WETH, WBTC)
      const tokensToFetch = ['WPLS', 'USDC', 'DAI', 'WETH', 'WBTC'];
      const newTokenBalances: Record<string, string> = {};
      
      const erc20Abi = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
      
      for (const symbol of tokensToFetch) {
        try {
          const address = CONTRACT_ADDRESSES[symbol as keyof typeof CONTRACT_ADDRESSES];
          if (address) {
            const contract = new ethers.Contract(address, erc20Abi, provider);
            const balanceWei = await contract.balanceOf(account);
            const decimals = await contract.decimals();
            newTokenBalances[symbol] = ethers.formatUnits(balanceWei, decimals);
          }
        } catch (e) {
          console.warn(`Error fetching balance for ${symbol}:`, e);
          newTokenBalances[symbol] = '0';
        }
      }

      setWalletState(prev => ({
        ...prev,
        plsBalance: formattedPlsBalance,
        arkBalance: formattedArkBalance,
        tokenBalances: newTokenBalances
      }));
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      // Switch to PulseChain if not already on it
      const chainId = `0x${network.chainId.toString(16)}`;
      if (chainId !== NETWORKS.PULSECHAIN.chainId) {
        await switchToPulseChain();
      }

      setWalletState(prev => ({
        ...prev,
        isConnected: true,
        account,
        provider,
        signer,
        chainId,
      }));

      await updateBalances(provider, account);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to PulseChain
  const switchToPulseChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.PULSECHAIN.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORKS.PULSECHAIN],
          });
        } catch (addError) {
          console.error('Error adding PulseChain:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to PulseChain:', switchError);
        throw switchError;
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      plsBalance: '0',
      arkBalance: '0',
      tokenBalances: {},
      chainId: null,
    });
  };

  // Event listeners
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check connection on mount
      checkConnection();

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkConnection]);

  return {
    ...walletState,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToPulseChain,
    updateBalances: () => walletState.provider && walletState.account && updateBalances(walletState.provider, walletState.account),
  };
};
