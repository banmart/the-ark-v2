
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS } from '../utils/constants';

interface ARKTokenData {
  totalSupply: string;
  marketCap: string;
  holders: string;
  price: string;
  priceChange24h: string;
  circulatingSupply: string;
  burnedTokens: string;
  lastUpdated: Date;
}

export const useARKTokenData = () => {
  const [data, setData] = useState<ARKTokenData>({
    totalSupply: '0',
    marketCap: '0',
    holders: '0',
    price: '0',
    priceChange24h: '0',
    circulatingSupply: '0',
    burnedTokens: '0',
    lastUpdated: new Date(),
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Connect to PulseChain RPC
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      
      // Create contract instance
      const arkToken = new ethers.Contract(
        CONTRACT_ADDRESSES.ARK_TOKEN,
        ARK_TOKEN_ABI,
        provider
      );

      console.log('Fetching ARK token data from contract:', CONTRACT_ADDRESSES.ARK_TOKEN);

      // Fetch basic token data
      const [totalSupply, name, symbol, decimals] = await Promise.all([
        arkToken.totalSupply(),
        arkToken.name(),
        arkToken.symbol(),
        arkToken.decimals(),
      ]);

      console.log('Token info:', { name, symbol, decimals: decimals.toString() });

      // Format total supply
      const formattedTotalSupply = ethers.formatUnits(totalSupply, decimals);
      
      // Calculate burned tokens (tokens sent to dead address)
      const deadBalance = await arkToken.balanceOf(CONTRACT_ADDRESSES.DEAD_ADDRESS);
      const formattedBurnedTokens = ethers.formatUnits(deadBalance, decimals);
      
      // Calculate circulating supply
      const circulatingSupply = (parseFloat(formattedTotalSupply) - parseFloat(formattedBurnedTokens)).toString();

      // For now, we'll use placeholder values for price and holders
      // In a production environment, these would come from:
      // - PulseX API for price data
      // - Block explorer API for holder count
      const mockPrice = '0.00001';
      const mockHolders = '12,500';
      const mockPriceChange = '+5.2';
      
      // Calculate market cap
      const marketCap = (parseFloat(circulatingSupply) * parseFloat(mockPrice)).toFixed(0);

      setData({
        totalSupply: parseInt(formattedTotalSupply).toLocaleString(),
        marketCap: parseInt(marketCap).toLocaleString(),
        holders: mockHolders,
        price: mockPrice,
        priceChange24h: mockPriceChange,
        circulatingSupply: parseInt(circulatingSupply).toLocaleString(),
        burnedTokens: parseInt(formattedBurnedTokens).toLocaleString(),
        lastUpdated: new Date(),
      });

      console.log('ARK token data updated successfully');
    } catch (err: any) {
      console.error('Error fetching ARK token data:', err);
      setError(err.message || 'Failed to fetch token data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchTokenData,
  };
};
