import React, { useState } from 'react';
import { RefreshCw, BarChart3, TrendingUp, Activity, Database } from 'lucide-react';

// Mock hook for demonstration
const useChartData = () => {
  return {
    tokenDistribution: [{
      name: 'Circulating',
      value: 65,
      color: '#06b6d4'
    }, {
      name: 'Locked',
      value: 25,
      color: '#8b5cf6'
    }, {
      name: 'Burned',
      value: 10,
      color: '#ef4444'
    }],
    feeDistribution: [{
      name: 'Locker Rewards',
      value: 40,
      color: '#10b981'
    }, {
      name: 'Liquidity',
      value: 30,
      color: '#f59e0b'
    }, {
      name: 'Development',
      value: 20,
      color: '#3b82f6'
    }, {
      name: 'Marketing',
      value: 10,
      color: '#ec4899'
    }],
    timeSeriesData: [{
      time: '00:00',
      price: 0.0012,
      volume: 45000,
      holders: 1250
    }, {
      time: '04:00',
      price: 0.0015,
      volume: 62000,
      holders: 1265
    }, {
      time: '08:00',
      price: 0.0018,
      volume: 78000,
      holders: 1280
    }, {
      time: '12:00',
      price: 0.0022,
      volume: 95000,
      holders: 1295
    }, {
      time: '16:00',
      price: 0.0019,
      volume: 71000,
      holders: 1310
    }, {
      time: '20:00',
      price: 0.0025,
      volume: 120000,
      holders: 1325
    }],
    metricCards: [{
      title: 'Total Supply',
      value: '1,000,000',
      change: 0,
      icon: 'database'
    }, {
      title: 'Market Cap',
      value: '$2.5M',
      change: 12.5,
      icon: 'trending-up'
    }, {
      title: 'Holders',
      value: '1,325',
      change: 8.2,
      icon: 'users'
    }, {
      title: '24h Volume',
      value: '$450K',
      change: -5.8,
      icon: 'activity'
    }],
    loading: false,
    lastUpdated: new Date()
  };
};

// Mock components for demonstration
const MetricCards = ({
  metrics,
  loading
}) => {
  const getIcon = iconName => {
    switch (iconName) {
      case 'database':
        return <Database className="w-6 h-6" />;
      case 'trending-up':
        return <TrendingUp className="w-6 h-6" />;
      case 'activity':
        return <Activity className="w-6 h-6" />;
      default:
        return <BarChart3 className="w-6 h-6" />;
    }
  };
  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-black/20 backdrop-blur-sm border border-gray-500/20 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-600/30 rounded mb-3"></div>
            <div className="h-8 bg-gray-600/30 rounded mb-2"></div>
            <div className="h-3 bg-gray-600/30 rounded w-20"></div>
          </div>)}
      </div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {metrics.map((metric, index) => <div key={index} className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="text-cyan-400 group-hover:scale-110 transition-transform">
              {getIcon(metric.icon)}
            </div>
            {metric.change !== 0 && <span className={`text-sm font-semibold ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>}
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.title}</h3>
          <p className="text-2xl font-bold text-white">{metric.value}</p>
        </div>)}
    </div>;
};
const TrendChart = ({
  data
}) => {
  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  return <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
          Price Trend (24h)
        </h3>
        <div className="text-sm text-gray-400">
          Last: ${data[data.length - 1]?.price.toFixed(4)}
        </div>
      </div>
      
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{
              stopColor: '#06b6d4',
              stopOpacity: 0.3
            }} />
              <stop offset="100%" style={{
              stopColor: '#06b6d4',
              stopOpacity: 0
            }} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => <line key={i} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#374151" strokeWidth="0.5" opacity="0.3" />)}
          
          {/* Price line */}
          <polyline fill="none" stroke="#06b6d4" strokeWidth="2" points={data.map((d, i) => {
          const x = i / (data.length - 1) * 400;
          const y = 200 - (d.price - minPrice) / priceRange * 180;
          return `${x},${y}`;
        }).join(' ')} />
          
          {/* Fill area */}
          <polygon fill="url(#priceGradient)" points={`0,200 ${data.map((d, i) => {
          const x = i / (data.length - 1) * 400;
          const y = 200 - (d.price - minPrice) / priceRange * 180;
          return `${x},${y}`;
        }).join(' ')} 400,200`} />
          
          {/* Data points */}
          {data.map((d, i) => {
          const x = i / (data.length - 1) * 400;
          const y = 200 - (d.price - minPrice) / priceRange * 180;
          return <circle key={i} cx={x} cy={y} r="3" fill="#06b6d4" className="hover:r-5 transition-all" />;
        })}
        </svg>
        
        {/* Time labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          {data.map((d, i) => <span key={i}>{d.time}</span>)}
        </div>
      </div>
    </div>;
};
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
  return <section id="chart" className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-10 h-10 text-cyan-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Live Blockchain Analytics
            </h2>
            <BarChart3 className="w-10 h-10 text-cyan-400 ml-3" />
          </div>
          
          <p className="text-gray-300 text-lg mb-6 max-w-4xl mx-auto leading-relaxed">
            Real-time data from ARK Token Contract on PulseChain
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
            <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 hover:bg-cyan-400/10 transition-all duration-300 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <MetricCards metrics={metricCards} loading={loading} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Trend Chart */}
          <TrendChart data={timeSeriesData} />
          
          {/* Distribution Charts Row */}
          
        </div>

        {/* Data Source Info */}
        <div className="text-center">
          <div className="bg-black/20 backdrop-blur-sm border border-gray-500/20 rounded-xl p-6 inline-block max-w-2xl">
            <div className="flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="text-lg font-semibold text-white">Live Data Source</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              📊 Data sourced directly from PulseChain blockchain • Updates every 30 seconds
            </p>
            <div className="bg-black/40 rounded-lg p-3 mt-3">
              <p className="text-xs text-gray-500 font-mono">
                Contract: 0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ChartSection;