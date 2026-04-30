import { useState, useEffect, useMemo } from 'react';
import { CONTRACT_CONSTANTS } from '../utils/constants';
import { feeCalculatorService } from '../services/feeCalculatorService';

export interface BurnTransaction {
  timestamp: number;
  amount: number;
  txHash: string;
  volume24h: number;
  wallet?: string;
  type?: string;
}

export interface BurnMetrics {
  dailyBurnAmount: number;
  totalBurned: number;
  burnRate: number; // tokens burned per hour
  efficiency: number; // actual vs theoretical burn percentage
}

export interface BurnProjection {
  volume: number;
  projectedBurn: number;
  efficiency: number;
}

export const useBurnAnalytics = (volume24h?: number) => {
  const [burnMetrics, setBurnMetrics] = useState<BurnMetrics | null>(null);
  const [burnHistory, setBurnHistory] = useState<BurnTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate theoretical burn amount based on volume
  const calculateTheoreticalBurn = (volume: number): number => {
    const burnRatePercentage = CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER;
    return volume * burnRatePercentage;
  };

  // Generate burn projections for different volume scenarios
  const burnProjections = useMemo((): BurnProjection[] => {
    if (!volume24h || !burnMetrics) return [];

    const baseVolume = volume24h;
    const scenarios = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5];

    return scenarios.map(multiplier => ({
      volume: baseVolume * multiplier,
      projectedBurn: calculateTheoreticalBurn(baseVolume * multiplier),
      efficiency: burnMetrics.efficiency
    }));
  }, [volume24h, burnMetrics]);

  // Calculate burn rate trend (burns per transaction over time)
  const burnTrend = useMemo(() => {
    if (burnHistory.length < 2) return 0;

    const recent = burnHistory.slice(-7); // Last 7 days
    const older = burnHistory.slice(-14, -7); // Previous 7 days

    if (older.length === 0) return 0;

    const recentAvg = recent.reduce((sum, tx) => sum + tx.amount, 0) / recent.length;
    const olderAvg = older.reduce((sum, tx) => sum + tx.amount, 0) / older.length;

    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }, [burnHistory]);

  // Fetch burn analytics data
  const fetchBurnAnalytics = async (volume: number) => {
    try {
      setLoading(true);
      setError(null);

      // Get fee metrics which includes burn data
      const feeMetrics = await feeCalculatorService.getFeeMetrics(volume);
      
      if (!feeMetrics) {
        throw new Error('Failed to fetch fee metrics');
      }

      // Calculate additional burn metrics
      const theoreticalDailyBurn = calculateTheoreticalBurn(volume);
      const actualDailyBurn = feeMetrics.feesCollected.burn.dailyFees;
      
      const metrics: BurnMetrics = {
        dailyBurnAmount: actualDailyBurn,
        totalBurned: feeMetrics.feesCollected.burn.totalCollected,
        burnRate: actualDailyBurn / 24, // Burns per hour
        efficiency: feeMetrics.efficiency.burn,
      };

      setBurnMetrics(metrics);

      // Get real burn transaction history from blockchain
      const realBurnHistory = await feeCalculatorService.getBurnTransactionHistory();
      setBurnHistory(realBurnHistory);

    } catch (err) {
      console.error('Error fetching burn analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch burn analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (volume24h && volume24h > 0) {
      fetchBurnAnalytics(volume24h);
    }
  }, [volume24h]);

  const refetch = () => {
    if (volume24h && volume24h > 0) {
      fetchBurnAnalytics(volume24h);
    }
  };

  return {
    burnMetrics,
    burnHistory,
    burnProjections,
    burnTrend,
    loading,
    error,
    refetch,
    calculateTheoreticalBurn
  };
};