import React, { useMemo, useState } from 'react';
import { RefreshCw, BarChart3, Database, Activity } from 'lucide-react';
import { useChartData } from '../hooks/useChartData';
import TrendChart from './charts/TrendChart';
const ChartSection = () => {
  const {
    timeSeriesData,
    loading,
    lastUpdated,
    dataSource,
    baseCurrency,
    priceDataPoints
  } = useChartData();

  // Memoize daily candles from raw timeSeriesData
  const dailyData = useMemo(() => {
    if (!Array.isArray(timeSeriesData)) return [];
    // Group by YYYY-MM-DD and take last price of the day
    const byDay = new Map();
    for (const p of timeSeriesData) {
      const t = typeof p.time === 'number' ? new Date(p.time) : new Date(p.time);
      const key = `${t.getUTCFullYear()}-${String(t.getUTCMonth()+1).padStart(2,'0')}-${String(t.getUTCDate()).padStart(2,'0')}`;
      if (!byDay.has(key)) byDay.set(key, p);
      // always keep the latest within the day (assuming ascending or carry max time)
      else byDay.set(key, p);
    }
    // Sort by date
    const out = Array.from(byDay.entries())
      .sort((a,b) => (a[0] < b[0] ? -1 : 1))
      .map(([k, v]) => ({ ...v, time: new Date(k + 'T00:00:00Z').getTime() }));
    return out;
  }, [timeSeriesData]);
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };
  return <section id="chart" className="relative z-0 py-20 px-6 overflow-hidden">
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
              <span className="font-mono text-cyan-400 text-sm tracking-wider">ARK/DAI_LIVE_PRICE_ORACLE</span>
              <Database className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
        
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-black text-cyan-400 font-mono">
              [LIVE_PRICE_MATRIX]
            </h2>
            <BarChart3 className="w-10 h-10 text-cyan-400 ml-3" />
          </div>
        
          <p className="text-gray-300 text-lg mb-6 max-w-4xl mx-auto leading-relaxed font-mono">
            Direct ARK/DAI pair pricing for accurate USD valuation
            <br />
            <code className="text-cyan-400 text-sm bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg mt-2 inline-block border border-cyan-500/20">
              PulseX DEX • ARK/DAI Pair • Real-time Updates
            </code>
          </p>
        
          {/* Enhanced System Controls */}
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Data Source Status */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${dataSource === 'PulseX' ? 'bg-green-400 animate-pulse' : dataSource === 'Error' ? 'bg-red-400 animate-pulse' : 'bg-yellow-400 animate-pulse'}`}></div>
                  <span className="font-mono text-cyan-400 text-sm">ARK: {dataSource}</span>
                </div>
              </div>
            
              {/* Base Currency */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="font-mono text-cyan-400 text-sm">BASE: {baseCurrency}</span>
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
                <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg hover:border-cyan-500/60 hover:bg-cyan-400/10 transition-all duration-300 disabled:opacity-50 font-mono text-sm">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'SYNCING...' : 'SYNC_DATA'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Price Chart as background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* gradient overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 via-black/20 to-black/60" />
          <div className="absolute inset-0 opacity-60">
            <TrendChart
              data={dailyData}
              dataSource={dataSource}
              baseCurrency={baseCurrency}
              priceDataPoints={priceDataPoints}
            />
          </div>
        </div>

        {/* Enhanced Data Source Info */}
      
      </div>
    </section>;
};
export default ChartSection;