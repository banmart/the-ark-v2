import { useState, useEffect } from 'react';
import { dexPriceService } from '../services/dexPriceService';
import { useContractData } from './useContractData';
import { DexPriceData } from '../services/price/types';

export const useARKPriceData = () => {
  const { data: contractData } = useContractData();
  const [priceData, setPriceData] = useState<DexPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use ARK/PLS pair from contract if available
      const pairAddress = contractData?.contractAddresses?.pulseXPair && 
                          contractData.contractAddresses.pulseXPair !== '0x0000000000000000000000000000000000000000'
                          ? contractData.contractAddresses.pulseXPair
                          : undefined;
      
      console.log('Fetching price with pair address:', pairAddress);
      
      const data = await dexPriceService.getLivePrice(pairAddress);
      setPriceData(data);
    } catch (err: any) {
      console.error('Error fetching ARK price data:', err);
      setError(err.message || 'Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initially
    fetchPriceData();
    
    // Set up interval for regular updates
    const interval = setInterval(fetchPriceData, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [contractData?.contractAddresses?.pulseXPair]);

  return {
    priceData,
    loading,
    error,
    refetch: fetchPriceData
  };
};