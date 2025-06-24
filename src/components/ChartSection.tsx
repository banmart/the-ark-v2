import React, { useState } from 'react';
import { RefreshCw, BarChart3 } from 'lucide-react';
import { useChartData } from '../hooks/useChartData';
import TrendChart from './charts/TrendChart';

const ChartSection = () => {
  const {
    timeSeriesData,
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
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-black text-cyan-400">
              Live Blockchain Analytics
            </h2>
            <BarChart3 className="w-10 h-10 text-cyan-400 ml-3" />
          </div>
          
          <p className="text-gray-300 text-lg mb-6 max-w-4xl mx-auto leading-relaxed">
            Real-time price data from ARK Token Contract on PulseChain
            <br />
            <code className="text-cyan-400 text-sm bg-black/30 px-3 py-1 rounded-lg mt-2 inline-block">
              0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
            </code>
          </p>
          
          {/* Refresh Controls */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Last Updated: {lastUpdated?.toLocaleTimeString()}</span>
            </div>
            <button 
              onClick={handleRefresh} 
              disabled={refreshing} 
              className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 hover:bg-cyan-400/10 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Price Chart - Full Width */}
        <div className="mb-8">
          <TrendChart data={timeSeriesData} />
        </div>

        {/* Data Source Info */}
        <div className="text-center">
          <div className="bg-black/20 backdrop-blur-sm border border-gray-500/20 rounded-xl p-6 inline-block max-w-2xl">
            <div className="flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="text-lg font-semibold text-white">Live Price Data Source</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              📊 Price data sourced directly from PulseChain blockchain • Updates every 30 seconds
            </p>
            <div className="bg-black/40 rounded-lg p-3 mt-3">
              <p className="text-xs text-gray-500 font-mono">
                Contract: 0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartSection;
