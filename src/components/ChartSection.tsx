import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { RefreshCw, Database, Activity, Zap, Shield } from 'lucide-react';
import { useChartData } from '../hooks/useChartData';
import HistoricalChart from './charts/HistoricalChart';
import BackgroundChart from './charts/BackgroundChart';

// Memoized loading skeleton (rule: rendering-hoist-jsx)
const LoadingSkeleton = memo(() => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-cyan-500/20 rounded mb-2" />
          <div className="h-6 bg-cyan-500/20 rounded mb-1" />
          <div className="h-3 bg-cyan-500/20 rounded w-2/3" />
        </div>
      </div>
    ))}
  </>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Memoized data card component (rule: rerender-memo)
const DataCard = memo(({ 
  icon: Icon, 
  label, 
  value, 
  subtitle 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string; 
  subtitle: string;
}) => (
  <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-cyan-400" />
      <span className="font-mono text-cyan-400 text-sm">{label}</span>
    </div>
    <p className="text-cyan-300 font-mono text-lg font-bold">{value}</p>
    <p className="text-cyan-400 font-mono text-xs">{subtitle}</p>
  </div>
));

DataCard.displayName = 'DataCard';

const ChartSection = memo(() => {
  const {
    timeSeriesData,
    loading,
    lastUpdated,
    dataSource,
    baseCurrency,
    priceDataPoints
  } = useChartData();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Stable callback (rule: rerender-functional-setstate)
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Derived values with memoization (rule: rerender-derived-state-no-effect)
  const chartValues = useMemo(() => {
    if (timeSeriesData.length === 0) return null;
    
    const lastPrice = timeSeriesData[timeSeriesData.length - 1]?.price ?? 0;
    const firstPrice = timeSeriesData[0]?.price ?? 0;
    const priceChange = firstPrice > 0 
      ? ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2) 
      : '0.00';
    
    return {
      currentPrice: lastPrice.toFixed(6),
      priceChange: `${priceChange}%`,
      lastUpdateTime: lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...'
    };
  }, [timeSeriesData, lastUpdated]);

  // Use ternary for conditional rendering (rule: rendering-conditional-render)
  return (
    <section id="chart" className="relative z-10 py-12 px-6 overflow-hidden min-h-screen">
      {/* Background Chart */}
      <BackgroundChart className="z-0" type="area" opacity={0.8} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Pricing Data Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            chartValues !== null ? (
              <>
                <DataCard 
                  icon={Activity}
                  label="CURRENT PRICE"
                  value={`$${chartValues.currentPrice}`}
                  subtitle="PLS/ARK"
                />
                <DataCard 
                  icon={Zap}
                  label="24H CHANGE"
                  value={chartValues.priceChange}
                  subtitle="Price Movement"
                />
                <DataCard 
                  icon={Shield}
                  label="DATA POINTS"
                  value={String(priceDataPoints)}
                  subtitle="Live Samples"
                />
                <DataCard 
                  icon={Database}
                  label="LAST UPDATE"
                  value={chartValues.lastUpdateTime}
                  subtitle={dataSource || 'DEX Oracle'}
                />
              </>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
});

ChartSection.displayName = 'ChartSection';

export default ChartSection;
