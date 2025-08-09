
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS } from '../utils/constants';
import { dexPriceService, DexPriceData } from '../services/dexPriceService';
import { blockchainDataService } from '../services/blockchainDataService';

interface ARKTokenData {
  totalSupply: string;
  marketCap: string;
  holders: string;
  price: string;
  priceChange24h: string;
  circulatingSupply: string;
  burnedTokens: string;
  volume24h: string;
  volumeChange24h: string;
  liquidity: string;
  dailyBurnRate: string;
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
    volume24h: '0',
    volumeChange24h: '0',
    liquidity: '0',
    dailyBurnRate: '0',
    lastUpdated: new Date(),
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching live ARK token data...');

      // Connect to PulseChain RPC
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);

      // Fetch all data in parallel
      const [
        [totalSupply, name, symbol, decimals],
        priceData,
        burnData,
        volumeData,
        holderCount,
        recentEvents
      ] = await Promise.all([
        Promise.all([
          arkToken.totalSupply(),
          arkToken.name(),
          arkToken.symbol(),
          arkToken.decimals(),
        ]),
        dexPriceService.getLivePrice(),
        blockchainDataService.calculateBurnRate(),
        blockchainDataService.getVolumeData(),
        blockchainDataService.calculateHolderCount(),
        blockchainDataService.getRecentEvents(-1000)
      ]);

      console.log('Live data fetched:', { 
        priceData, 
        burnData, 
        volumeData, 
        holderCount,
        eventsCount: recentEvents.length 
      });

      // Format total supply with proper precision
      const totalSupplyFormatted = ethers.formatUnits(totalSupply, decimals);
      
      // Use live burned tokens from blockchain data  
      const burnedTokensFormatted = burnData.totalBurned;
      
      // Calculate circulating supply maintaining precision
      const totalSupplyNum = parseFloat(totalSupplyFormatted);
      const burnedTokensNum = parseFloat(burnedTokensFormatted);
      const circulatingSupplyNum = totalSupplyNum - burnedTokensNum;

      // Calculate market cap with full precision
      const marketCapNum = circulatingSupplyNum * priceData.price;

      setData({
        totalSupply: totalSupplyNum.toString(),
        marketCap: marketCapNum.toString(),
        holders: holderCount.toString(),
        price: priceData.price.toFixed(6),
        priceChange24h: priceData.priceChange24h > 0 
          ? `+${priceData.priceChange24h.toFixed(1)}` 
          : priceData.priceChange24h.toFixed(1),
        circulatingSupply: circulatingSupplyNum.toString(),
        burnedTokens: burnedTokensNum.toString(),
        volume24h: volumeData.volume24h.toString(),
        volumeChange24h: volumeData.volumeChange > 0 
          ? `+${volumeData.volumeChange.toFixed(1)}` 
          : volumeData.volumeChange.toFixed(1),
        liquidity: priceData.liquidity.toString(),
        dailyBurnRate: burnData.dailyBurnRate.toString(),
        lastUpdated: new Date(),
      });

      console.log('ARK token data updated successfully with live blockchain data');
    } catch (err: any) {
      console.error('Error fetching live ARK token data:', err);
      setError(err.message || 'Failed to fetch token data');
      
      // Set fallback data on error
      setData(prev => ({
        ...prev,
        lastUpdated: new Date(),
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
    
    // Auto-refresh every 30 seconds for live data
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
