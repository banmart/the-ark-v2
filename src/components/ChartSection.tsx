
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useChartData } from '../hooks/useChartData';
import MetricCards from './charts/MetricCards';
import TokenDistributionChart from './charts/TokenDistributionChart';
import FeeDistributionChart from './charts/FeeDistributionChart';
import TrendChart from './charts/TrendChart';

const ChartSection = () => {
  const { 
    tokenDistribution, 
    feeDistribution, 
    timeSeriesData, 
    metricCards, 
    loading, 
    lastUpdated 
  } = useChartData();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <section id="chart" className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Live Blockchain Analytics
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            Real-time data from ARK Token Contract: 0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
          </p>
          
          {/* Refresh Controls */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>Last Updated: {lastUpdated?.toLocaleTimeString()}</span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1 glass-card rounded-lg hover:bg-cyan-400/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <MetricCards metrics={metricCards} loading={loading} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TokenDistributionChart data={tokenDistribution} />
          <FeeDistributionChart data={feeDistribution} />
        </div>

        {/* Trend Chart */}
        <div className="grid grid-cols-1 gap-6">
          <TrendChart data={timeSeriesData} />
        </div>

        {/* Data Source Info */}
        <div className="mt-8 text-center">
          <div className="glass-card rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-400">
              📊 Data sourced directly from PulseChain blockchain • Updates every 30 seconds
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contract: 0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartSection;
