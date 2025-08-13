import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Database, 
  Filter,
  Download,
  Maximize2
} from 'lucide-react';
import { TIMEFRAMES, PriceFilter, historicalDataService } from '../../services/price/historicalDataService';
import { cn } from '../../lib/utils';

interface HistoricalChartProps {
  dataSource?: string;
  baseCurrency?: string;
  className?: string;
}

interface ChartData {
  time: string;
  price: number;
  volume?: number;
}

const HistoricalChart = ({ 
  dataSource = 'PLS/ARK', 
  baseCurrency = 'PLS',
  className 
}: HistoricalChartProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [showVolume, setShowVolume] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PriceFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  // Get data for current timeframe
  const chartData = historicalDataService.getFormattedTimeSeriesData(selectedTimeframe, activeFilter);
  const stats = historicalDataService.getTimeframeStats(selectedTimeframe);
  
  const isPositiveChange = stats.changePercent >= 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="font-mono text-cyan-400 text-xs tracking-wider">PLS/ARK_DATA</span>
          </div>
          <p className="text-cyan-400 font-mono text-sm font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-mono text-xs" style={{ color: entry.color }}>
              PRICE: {entry.value.toFixed(8)} PLS
            </p>
          ))}
          {showVolume && payload[1] && (
            <p className="font-mono text-xs text-muted-foreground">
              VOLUME: {payload[1].value?.toFixed(2) || 'N/A'}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const exportData = () => {
    const csvContent = chartData.map(d => 
      `${d.time},${d.price},${d.volume || 0}`
    ).join('\n');
    
    const blob = new Blob([`Time,Price,Volume\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ark-pls-${selectedTimeframe.toLowerCase()}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Quantum Field Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-background to-background"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="pulse-grid bg-grid bg-grid-size animate-pulse"></div>
        </div>
        <div className="floating-orb orb1 bg-gradient-radial from-cyan-500/5 to-transparent blur-3xl"></div>
        <div className="floating-orb orb2 bg-gradient-radial from-yellow-400/5 to-transparent blur-3xl"></div>
      </div>

      {/* Main Chart Container */}
      <Card className="relative z-10 bg-black/40 backdrop-blur-xl border-cyan-500/30 overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-black/60 backdrop-blur-sm border-b border-cyan-500/20 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Database className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400 tracking-wider">PLS/ARK_HISTORICAL_MATRIX</span>
              </div>
              <h3 className="text-xl font-mono text-cyan-400 font-semibold">
                PLS/ARK Historical Analysis
              </h3>
            </div>
            
            {/* Stats Display */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={isPositiveChange ? "default" : "destructive"} className="gap-1">
                  {isPositiveChange ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stats.changePercent.toFixed(2)}%
                </Badge>
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                H: {stats.high.toFixed(8)} | L: {stats.low.toFixed(8)}
              </div>
            </div>
          </div>

          {/* Timeframe Selection */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1">
              {TIMEFRAMES.map(tf => (
                <Button
                  key={tf.key}
                  variant={selectedTimeframe === tf.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(tf.key)}
                  className="text-xs font-mono"
                >
                  {tf.label}
                </Button>
              ))}
            </div>

            {/* Chart Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={chartType === 'line' ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType('line')}
                className="text-xs"
              >
                Line
              </Button>
              <Button
                variant={chartType === 'area' ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType('area')}
                className="text-xs"
              >
                Area
              </Button>
              <Button
                variant={showVolume ? "default" : "outline"}
                size="sm"
                onClick={() => setShowVolume(!showVolume)}
                className="text-xs"
              >
                <Activity className="w-3 h-3 mr-1" />
                Volume
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs"
              >
                <Filter className="w-3 h-3 mr-1" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className="text-xs"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>

            {/* Filter Panel */}
          {showFilters && (
            <Card className="mt-4 p-4 bg-black/20 border-cyan-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Min Price</label>
                  <input
                    type="number"
                    step="0.00000001"
                    placeholder="0.00000000"
                    className="w-full mt-1 px-2 py-1 bg-black/40 border border-cyan-500/20 rounded text-xs font-mono"
                    onChange={(e) => setActiveFilter(prev => ({ 
                      ...prev, 
                      minPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Max Price</label>
                  <input
                    type="number"
                    step="0.00000001"
                    placeholder="0.00000000"
                    className="w-full mt-1 px-2 py-1 bg-black/40 border border-cyan-500/20 rounded text-xs font-mono"
                    onChange={(e) => setActiveFilter(prev => ({ 
                      ...prev, 
                      maxPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Volatility %</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    className="w-full mt-1 px-2 py-1 bg-black/40 border border-cyan-500/20 rounded text-xs font-mono"
                    onChange={(e) => setActiveFilter(prev => ({ 
                      ...prev, 
                      volatilityThreshold: e.target.value ? parseFloat(e.target.value) : undefined,
                      showOnlySignificantMoves: !!e.target.value
                    }))}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Chart Area */}
        <div className="p-6 relative bg-black/40">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-scan"></div>
          
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00ffff" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="2 2" 
                  stroke="rgba(0, 255, 255, 0.15)" 
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="time" 
                  stroke="#00ffff"
                  fontSize={10}
                  fontFamily="monospace"
                  tickLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                  axisLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                />
                <YAxis 
                  stroke="#00ffff" 
                  fontSize={10}
                  fontFamily="monospace"
                  tickFormatter={(value) => value.toFixed(8)}
                  tickLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                  axisLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00ffff" 
                  fill="url(#priceGradient)"
                  strokeWidth={2}
                  dot={{ fill: '#00ffff', strokeWidth: 2, r: 2 }}
                  activeDot={{ 
                    r: 4, 
                    fill: '#ffd700',
                    stroke: '#000000',
                    strokeWidth: 2
                  }}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="2 2" 
                  stroke="rgba(0, 255, 255, 0.15)" 
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="time" 
                  stroke="#00ffff"
                  fontSize={10}
                  fontFamily="monospace"
                  tickLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                  axisLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                />
                <YAxis 
                  stroke="#00ffff" 
                  fontSize={10}
                  fontFamily="monospace"
                  tickFormatter={(value) => value.toFixed(8)}
                  tickLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                  axisLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00ffff" 
                  strokeWidth={2}
                  dot={{ fill: '#00ffff', strokeWidth: 2, r: 2 }}
                  activeDot={{ 
                    r: 4, 
                    fill: '#ffd700',
                    stroke: '#000000',
                    strokeWidth: 2
                  }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Enhanced Diagnostics Panel */}
        <div className="bg-black/60 backdrop-blur-sm border-t border-cyan-500/20 p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs font-mono text-muted-foreground">TIMEFRAME</div>
                <div className="text-sm font-mono text-yellow-400">{selectedTimeframe}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-mono text-muted-foreground">PAIR_SOURCE</div>
                <div className="text-sm font-mono text-cyan-400">PLS/ARK</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-mono text-muted-foreground">DATA_POINTS</div>
                <div className="text-sm font-mono text-cyan-400">{chartData.length}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs font-mono text-muted-foreground">24H_HIGH</div>
                <div className="text-sm font-mono text-yellow-400">{stats.high.toFixed(8)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <div>
                <div className="text-xs font-mono text-muted-foreground">24H_LOW</div>
                <div className="text-sm font-mono text-destructive">{stats.low.toFixed(8)}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HistoricalChart;