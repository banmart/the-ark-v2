import { useState, useEffect } from 'react';
import { feeCalculatorService, type FeeMetrics } from '../services/feeCalculatorService';

export const useFeeMetrics = (volume24h?: number) => {
  const [feeMetrics, setFeeMetrics] = useState<FeeMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeMetrics = async (volume: number) => {
    try {
      setLoading(true);
      setError(null);
      const metrics = await feeCalculatorService.getFeeMetrics(volume);
      setFeeMetrics(metrics);
    } catch (err) {
      console.error('Error fetching fee metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fee metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (volume24h && volume24h > 0) {
      fetchFeeMetrics(volume24h);

      // Update every 15 seconds for real-time data
      const interval = setInterval(() => {
        fetchFeeMetrics(volume24h);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [volume24h]);

  const refetch = () => {
    if (volume24h && volume24h > 0) {
      fetchFeeMetrics(volume24h);
    }
  };

  return {
    feeMetrics,
    loading,
    error,
    refetch
  };
};