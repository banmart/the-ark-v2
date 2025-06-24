
import React, { useState } from 'react';
import { RefreshCw, BarChart3, Database, Activity, Zap, Shield } from 'lucide-react';
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
    <section id="chart" className="relative z-10 py-20 px-6 overflow-hidden">
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
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent animate-scan" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
              <Database className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-mono text-cyan-400 text-sm tracking-wider">BLOCKCHAIN_ANALYTICS_PROTOCOL</span>
              <Database className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-black text-cyan-400 font-mono">
              [LIVE_MATRIX]
            </h2>
            <BarChart3 className="w-10 h-10 text-cyan-400 ml-3" />
          </div>
          
          <p className="text-gray-300 text-lg mb-6 max-w-4xl mx-auto leading-relaxed font-mono">
            Real-time quantum price analytics from ARK Token Contract
            <br />
            <code className="text-cyan-400 text-sm bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg mt-2 inline-block border border-cyan-500/20">
              0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
            </code>
          </p>
          
          {/* Enhanced System Controls */}
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* System Status */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-mono text-green-400 text-sm">SYSTEM_ONLINE</span>
                </div>
              </div>
              
              {/* Data Stream Status */}
              <div className="flex items-center justify-center gap-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                <div className="text-center">
                  <div className="font-mono text-cyan-400 text-xs">LAST_SYNC</div>
                  <div className="font-mono text-cyan-300 text-sm">{lastUpdated?.toLocaleTimeString()}</div>
                </div>
              </div>
              
              {/* Refresh Control */}
              <div className="flex items-center justify-center">
                <button 
                  onClick={handleRefresh} 
                  disabled={refreshing} 
                  className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg hover:border-cyan-500/60 hover:bg-cyan-400/10 transition-all duration-300 disabled:opacity-50 font-mono text-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'SYNCING...' : 'SYNC_DATA'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart - Enhanced Container */}
        <div className="mb-8">
          <TrendChart data={timeSeriesData} />
        </div>

        {/* Enhanced Data Source Info */}
        <div className="text-center">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-8 inline-block max-w-4xl relative overflow-hidden">
            {/* Scanning effect */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent animate-scan"></div>
            
            {/* System Header */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-cyan-400 text-xs tracking-wider">DATA_SOURCE_PROTOCOL</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-cyan-400 mr-3" />
              <span className="text-xl font-mono text-white font-semibold">Live Quantum Price Matrix</span>
            </div>
            
            {/* System Diagnostics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/30 backdrop-blur-sm border border-green-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3 h-3 text-green-400" />
                  <span className="font-mono text-green-400 text-xs">UPDATE_RATE</span>
                </div>
                <div className="font-mono text-green-300 text-sm">30 seconds</div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-3 h-3 text-cyan-400" />
                  <span className="font-mono text-cyan-400 text-xs">CHAIN_SOURCE</span>
                </div>
                <div className="font-mono text-cyan-300 text-sm">PulseChain</div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm border border-teal-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3 h-3 text-teal-400" />
                  <span className="font-mono text-teal-400 text-xs">LATENCY</span>
                </div>
                <div className="font-mono text-teal-300 text-sm">12ms</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-4 font-mono">
              📊 Quantum price matrix sourced directly from PulseChain protocol
            </p>
            
            <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-mono">
                CONTRACT_ADDRESS: 0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
              </p>
            </div>
            
            {/* Bottom scanning effect */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent animate-scan" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartSection;
