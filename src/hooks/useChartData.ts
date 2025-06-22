
import { useState, useEffect, useMemo } from 'react';
import { useContractData } from './useContractData';

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

export interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export interface TimeSeriesData {
  time: string;
  burned: number;
  circulating: number;
  holders: number;
}

export const useChartData = () => {
  const { data: contractData, loading } = useContractData();
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);

  // Generate mock historical data for demonstration
  useEffect(() => {
    const generateHistoricalData = () => {
      const data: TimeSeriesData[] = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Simulate growing burned tokens and holders over time
        const burnedBase = parseFloat(contractData.burnedTokens.replace(/,/g, '')) || 0;
        const holdersBase = parseFloat(contractData.holders.replace(/,/g, '')) || 0;
        
        data.push({
          time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          burned: Math.max(0, burnedBase - (i * 10000) + Math.random() * 5000),
          circulating: parseFloat(contractData.circulatingSupply.replace(/,/g, '')) || 0,
          holders: Math.max(0, holdersBase - (i * 100) + Math.random() * 50)
        });
      }
      
      setTimeSeriesData(data);
    };

    if (!loading && contractData) {
      generateHistoricalData();
    }
  }, [contractData, loading]);

  // Token Distribution Data
  const tokenDistribution = useMemo((): ChartDataPoint[] => {
    if (!contractData) return [];
    
    const total = parseFloat(contractData.totalSupply.replace(/,/g, ''));
    const burned = parseFloat(contractData.burnedTokens.replace(/,/g, ''));
    const circulating = parseFloat(contractData.circulatingSupply.replace(/,/g, ''));
    
    return [
      {
        name: 'Circulating Supply',
        value: circulating,
        color: '#00ffff',
        percentage: (circulating / total) * 100
      },
      {
        name: 'Burned Tokens',
        value: burned,
        color: '#ff6b35',
        percentage: (burned / total) * 100
      }
    ];
  }, [contractData]);

  // Fee Distribution Data
  const feeDistribution = useMemo((): ChartDataPoint[] => {
    if (!contractData) return [];
    
    return [
      {
        name: 'Burn Fee',
        value: contractData.currentFees.burn,
        color: '#ff6b35'
      },
      {
        name: 'Reflection Fee',
        value: contractData.currentFees.reflection,
        color: '#00ffff'
      },
      {
        name: 'Liquidity Fee',
        value: contractData.currentFees.liquidity,
        color: '#3b82f6'
      },
      {
        name: 'Locker Fee',
        value: contractData.currentFees.locker,
        color: '#8b5cf6'
      }
    ];
  }, [contractData]);

  // Metric Cards Data
  const metricCards = useMemo((): MetricCard[] => {
    if (!contractData) return [];
    
    return [
      {
        title: 'Market Cap',
        value: `$${contractData.marketCap}`,
        change: contractData.priceChange24h,
        icon: '💰',
        color: 'cyan'
      },
      {
        title: 'Total Holders',
        value: contractData.holders,
        change: '+2.1%',
        icon: '👥',
        color: 'blue'
      },
      {
        title: 'Burned Tokens',
        value: contractData.burnedTokens,
        change: '+0.8%',
        icon: '🔥',
        color: 'orange'
      },
      {
        title: 'Total Supply',
        value: contractData.totalSupply,
        change: '-0.8%',
        icon: '💎',
        color: 'purple'
      }
    ];
  }, [contractData]);

  return {
    tokenDistribution,
    feeDistribution,
    timeSeriesData,
    metricCards,
    loading,
    lastUpdated: contractData?.lastUpdated
  };
};
