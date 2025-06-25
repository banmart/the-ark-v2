import { useState, useEffect, useMemo } from 'react';
import { useARKTokenData } from './useARKTokenData';
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

export const useChartData = () => {
  const { data: arkTokenData, loading } = useARKTokenData();
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [priceHistory, setPriceHistory] = useState<{ timestamp: number; price: number }[]>([]);
  const [currentPriceInfo, setCurrentPriceInfo] = useState<{
    dataSource: string;
    plsPriceSource: string;
    lastUpdated: Date;
  }>({
    dataSource: 'Loading',
    plsPriceSource: 'Loading',
    lastUpdated: new Date()
  });

  // Fetch live price data and build history
  useEffect(() => {
    const fetchLivePriceData = async () => {
      try {
        console.log('Fetching enhanced live price data for chart...');
        
        // Get current live price with enhanced data
        const priceData = await dexPriceService.getLivePrice();
        const currentTime = Date.now();
        
        // Update price info
        setCurrentPriceInfo({
          dataSource: priceData.dataSource,
          plsPriceSource: priceData.plsPriceSource,
          lastUpdated: priceData.lastUpdated
        });
        
        // Add current price to history if valid
        if (priceData.price > 0) {
          setPriceHistory(prev => {
            const updated = [...prev, { timestamp: currentTime, price: priceData.price }];
            
            // Keep only last 50 data points for chart (about 25 minutes of data)
            const maxPoints = 50;
            if (updated.length > maxPoints) {
              return updated.slice(-maxPoints);
            }
            
            return updated;
          });
        }
        
        console.log('Enhanced price data updated:', {
          price: priceData.price.toFixed(8),
          source: priceData.dataSource,
          plsSource: priceData.plsPriceSource
        });
      } catch (error) {
        console.error('Error fetching enhanced price data:', error);
        setCurrentPriceInfo(prev => ({
          ...prev,
          dataSource: 'Error',
          plsPriceSource: 'Error'
        }));
      }
    };

    if (!loading && arkTokenData) {
      fetchLivePriceData();
      
      // Update price every 30 seconds for live data
      const interval = setInterval(fetchLivePriceData, 30000);
      return () => clearInterval(interval);
    }
  }, [arkTokenData, loading]);

  // Convert price history to chart format
  useEffect(() => {
    if (priceHistory.length > 0) {
      const chartData: TimeSeriesData[] = priceHistory.map((point, index) => {
        const date = new Date(point.timestamp);
        return {
          time: priceHistory.length > 20 
            ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          price: point.price
        };
      });
      
      setTimeSeriesData(chartData);
    }
  }, [priceHistory]);

  // Token Distribution Data - using real contract data
  const tokenDistribution = useMemo((): ChartDataPoint[] => {
    if (!arkTokenData) return [];
    
    const total = parseFloat(arkTokenData.totalSupply.replace(/,/g, ''));
    const burned = parseFloat(arkTokenData.burnedTokens.replace(/,/g, ''));
    const circulating = parseFloat(arkTokenData.circulatingSupply.replace(/,/g, ''));
    
    if (total === 0) return [];
    
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
  }, [arkTokenData]);

  // Fee Distribution Data - using contract fee structure
  const feeDistribution = useMemo((): ChartDataPoint[] => {
    return [
      {
        name: 'Burn Fee',
        value: 3,
        color: '#ff6b35'
      },
      {
        name: 'Reflection Fee',
        value: 2,
        color: '#00ffff'
      },
      {
        name: 'Liquidity Fee',
        value: 2,
        color: '#3b82f6'
      },
      {
        name: 'Locker Fee',
        value: 2,
        color: '#8b5cf6'
      }
    ];
  }, []);

  // Metric Cards with live data
  const metricCards = useMemo((): MetricCard[] => {
    if (!arkTokenData) return [];
    
    return [
      {
        title: 'Market Cap',
        value: `$${arkTokenData.marketCap}`,
        change: arkTokenData.priceChange24h + '%',
        icon: '💰',
        color: 'cyan'
      },
      {
        title: 'Total Holders',
        value: arkTokenData.holders,
        change: '+1.8%',
        icon: '👥',
        color: 'blue'
      },
      {
        title: 'Burned Tokens',
        value: arkTokenData.burnedTokens,
        change: '+0.12%',
        icon: '🔥',
        color: 'orange'
      },
      {
        title: '24h Volume',
        value: arkTokenData.volume24h ? `${arkTokenData.volume24h} ARK` : 'N/A',
        change: arkTokenData.volumeChange24h ? arkTokenData.volumeChange24h + '%' : '0%',
        icon: '📊',
        color: 'purple'
      }
    ];
  }, [arkTokenData]);

  return {
    tokenDistribution,
    feeDistribution,
    timeSeriesData,
    metricCards,
    loading,
    lastUpdated: arkTokenData?.lastUpdated,
    dataSource: currentPriceInfo.dataSource,
    plsPriceSource: currentPriceInfo.plsPriceSource,
    priceDataPoints: priceHistory.length
  };
};
