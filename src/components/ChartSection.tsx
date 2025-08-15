import React, { useState } from 'react';
import { RefreshCw, BarChart3, Database, Activity, Zap, Shield } from 'lucide-react';
import { useChartData } from '../hooks/useChartData';
import HistoricalChart from './charts/HistoricalChart';
import BackgroundChart from './charts/BackgroundChart';
const ChartSection = () => {
  const {
    timeSeriesData,
    loading,
    lastUpdated,
    dataSource,
    baseCurrency,
    priceDataPoints
  } = useChartData();
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };
  return <section id="chart" className="relative z-10 py-12 px-6 overflow-hidden min-h-screen">
      {/* Background Chart */}
      <BackgroundChart className="z-0" type="area" opacity={0.8} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Pricing Data Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-cyan-500/20 rounded mb-2"></div>
                  <div className="h-6 bg-cyan-500/20 rounded mb-1"></div>
                  <div className="h-3 bg-cyan-500/20 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            timeSeriesData.length > 0 && (
              <>
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-cyan-400 text-sm">CURRENT PRICE</span>
                  </div>
                  <p className="text-cyan-300 font-mono text-lg font-bold">
                    ${timeSeriesData[timeSeriesData.length - 1]?.price?.toFixed(6) || '0.000000'}
                  </p>
                  <p className="text-cyan-400 font-mono text-xs">PLS/ARK</p>
                </div>
                
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-cyan-400 text-sm">24H CHANGE</span>
                  </div>
                  <p className="text-cyan-300 font-mono text-lg font-bold">
                    {timeSeriesData.length > 1 ? 
                      `${(((timeSeriesData[timeSeriesData.length - 1]?.price || 0) - (timeSeriesData[0]?.price || 0)) / (timeSeriesData[0]?.price || 1) * 100).toFixed(2)}%`
                      : '0.00%'
                    }
                  </p>
                  <p className="text-cyan-400 font-mono text-xs">Price Movement</p>
                </div>
                
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-cyan-400 text-sm">DATA POINTS</span>
                  </div>
                  <p className="text-cyan-300 font-mono text-lg font-bold">{priceDataPoints}</p>
                  <p className="text-cyan-400 font-mono text-xs">Live Samples</p>
                </div>
                
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-cyan-400 text-sm">LAST UPDATE</span>
                  </div>
                  <p className="text-cyan-300 font-mono text-lg font-bold">
                    {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...'}
                  </p>
                  <p className="text-cyan-400 font-mono text-xs">{dataSource || 'DEX Oracle'}</p>
                </div>
              </>
            )
          )}
        </div>
        
      </div>
    </section>;
};
export default ChartSection;