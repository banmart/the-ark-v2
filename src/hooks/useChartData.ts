import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useARKData } from '../contexts/ARKDataContext';
import { dexPriceService } from '../services/dexPriceService';

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
  price: number;
}

// Hoist static fee distribution (rule: rendering-hoist-jsx)
const STATIC_FEE_DISTRIBUTION: ChartDataPoint[] = [
  { name: 'Burn Fee', value: 3, color: '#ff6b35' },
  { name: 'Reflection Fee', value: 2, color: '#00ffff' },
  { name: 'Liquidity Fee', value: 2, color: '#3b82f6' },
  { name: 'Locker Fee', value: 2, color: '#8b5cf6' }
];

export const useChartData = () => {
  // Use centralized data context instead of redundant hooks (rule: client-swr-dedup)
  const { data: arkData, loading } = useARKData();
  
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [priceHistory, setPriceHistory] = useState<{ timestamp: number; price: number }[]>([]);
  const [currentPriceInfo, setCurrentPriceInfo] = useState({
    dataSource: 'Loading',
    baseCurrency: 'DAI',
    lastUpdated: new Date()
  });
  
  // Use ref for interval cleanup (rule: advanced-init-once)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Fetch live price data - memoized callback (rule: rerender-functional-setstate)
  const fetchLivePriceData = useCallback(async () => {
    // Debounce: don't fetch more than once per 25 seconds
    const now = Date.now();
    if (now - lastFetchRef.current < 25000) return;
    lastFetchRef.current = now;

    try {
      console.log('Fetching live PLS/ARK price data for chart...');
      
      const priceData = await dexPriceService.getLivePrice();
      
      // Defer dynamic import for non-critical data (rule: bundle-defer-third-party)
      import('../services/price/historicalDataService').then(({ historicalDataService }) => {
        historicalDataService.addPriceData(priceData);
      });
      
      const currentTime = Date.now();
      
      // Update price info
      setCurrentPriceInfo({
        dataSource: priceData.dataSource,
        baseCurrency: priceData.baseCurrency,
        lastUpdated: priceData.lastUpdated
      });
      
      // Add current price to history if valid (rule: rerender-functional-setstate)
      if (priceData.price > 0) {
        setPriceHistory(prev => {
          const updated = [...prev, { timestamp: currentTime, price: priceData.price }];
          // Keep only last 50 data points (rule: js-length-check-first)
          return updated.length > 50 ? updated.slice(-50) : updated;
        });
      }
      
      console.log('PLS/ARK price data updated:', {
        price: priceData.price.toFixed(8),
        source: priceData.dataSource,
        baseCurrency: priceData.baseCurrency
      });
    } catch (error) {
      console.error('Error fetching price data:', error);
      setCurrentPriceInfo(prev => ({ ...prev, dataSource: 'Error' }));
    }
  }, []);

  // Effect with proper cleanup and primitive dependencies (rule: rerender-dependencies)
  const hasData = arkData !== null;
  const isLoading = loading;
  
  useEffect(() => {
    if (isLoading || !hasData) return;
    
    fetchLivePriceData();
    
    // Update price every 30 seconds for live data
    intervalRef.current = setInterval(fetchLivePriceData, 30000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasData, isLoading, fetchLivePriceData]);

  // Convert price history to chart format - optimized single pass (rule: js-combine-iterations)
  useEffect(() => {
    const historyLength = priceHistory.length;
    if (historyLength === 0) return;
    
    const useShortFormat = historyLength > 20;
    
    const chartData: TimeSeriesData[] = new Array(historyLength);
    for (let i = 0; i < historyLength; i++) {
      const point = priceHistory[i];
      const date = new Date(point.timestamp);
      chartData[i] = {
        time: useShortFormat 
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        price: point.price
      };
    }
    
    setTimeSeriesData(chartData);
  }, [priceHistory]);

  // Token Distribution Data - memoized with early exit (rule: js-early-exit)
  const tokenDistribution = useMemo((): ChartDataPoint[] => {
    if (!arkData) return [];
    
    const total = arkData.totalSupply;
    if (total === 0) return [];
    
    const burned = arkData.burnedTokens;
    const circulating = arkData.circulatingSupply;
    
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
  }, [arkData]);

  // Static fee distribution - hoisted (rule: rendering-hoist-jsx)
  const feeDistribution = STATIC_FEE_DISTRIBUTION;

  // Metric Cards with live data - memoized
  const metricCards = useMemo((): MetricCard[] => {
    if (!arkData) return [];
    
    return [
      {
        title: 'Market Cap',
        value: `$${arkData.marketCap.toLocaleString()}`,
        change: `${arkData.priceChange24h > 0 ? '+' : ''}${arkData.priceChange24h.toFixed(1)}%`,
        icon: '💰',
        color: 'cyan'
      },
      {
        title: 'Total Holders',
        value: arkData.holders.toLocaleString(),
        change: '+1.8%',
        icon: '👥',
        color: 'blue'
      },
      {
        title: 'Burned Tokens',
        value: arkData.burnedTokens.toLocaleString(),
        change: '+0.12%',
        icon: '🔥',
        color: 'orange'
      },
      {
        title: '24h Volume',
        value: arkData.volume24h ? `${arkData.volume24h.toLocaleString()} ARK` : 'N/A',
        change: '0%',
        icon: '📊',
        color: 'purple'
      }
    ];
  }, [arkData]);

  return {
    tokenDistribution,
    feeDistribution,
    timeSeriesData,
    metricCards,
    loading,
    lastUpdated: arkData?.lastUpdated,
    dataSource: currentPriceInfo.dataSource,
    baseCurrency: currentPriceInfo.baseCurrency,
    priceDataPoints: priceHistory.length
  };
};
