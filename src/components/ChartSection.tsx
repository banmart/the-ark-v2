import React, { useState } from 'react';
import { RefreshCw, BarChart3, Database, Activity, Zap, Shield } from 'lucide-react';
import { useChartData } from '../hooks/useChartData';
import HistoricalChart from './charts/HistoricalChart';
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
  return <section id="chart" className="relative z-10 py-20 px-6 overflow-hidden">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 z-0">
        {/* Base quantum gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-900/10 via-black to-black"></div>
        
        {/* Animated quantum grid */}
        <div className="absolute inset-0 opacity-15">
          <div className="pulse-grid bg-grid bg-grid-size animate-pulse"></div>
        </div>
        
        {/* Floating quantum orbs */}
        <div className="floating-orb orb1 bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl"></div>
        <div className="floating-orb orb2 bg-gradient-radial from-teal-500/10 to-transparent blur-3xl"></div>
        
        {/* Scanning lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-scan"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent animate-scan" style={{
        animationDelay: '2s'
      }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
            <Database className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-mono text-cyan-400 text-xs sm:text-sm tracking-wider break-words">PLS/ARK_HISTORICAL_ORACLE</span>
            <Database className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400 mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-cyan-400 font-mono break-words">
              [PLS/ARK_HISTORICAL_MATRIX]
            </h2>
            <BarChart3 className="w-10 h-10 text-cyan-400 ml-3" />
          </div>
          
          <p className="text-cyan-400 text-sm sm:text-base lg:text-lg mb-6 max-w-4xl mx-auto leading-relaxed font-mono">
            Historical PLS/ARK price analysis with advanced filtering and timeframe selection
            <br />
            Real-time data with persistent storage for long-term trend analysis
          </p>
          
          {/* Enhanced System Controls */}
          
        </div>

        {/* Enhanced Historical Chart */}
        <div className="mb-8">
          <HistoricalChart dataSource={dataSource} baseCurrency={baseCurrency} />
        </div>

        {/* Enhanced Data Source Info */}
        
      </div>
    </section>;
};
export default ChartSection;