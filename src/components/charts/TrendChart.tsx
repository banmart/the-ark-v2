
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from '../../hooks/useChartData';
import { Activity, Database, Wifi, Zap } from 'lucide-react';

interface TrendChartProps {
  data: TimeSeriesData[];
}

const TrendChart = ({ data }: TrendChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="font-mono text-cyan-400 text-xs tracking-wider">DATA_POINT</span>
          </div>
          <p className="text-cyan-400 font-mono text-sm font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-mono text-xs" style={{ color: entry.color }}>
              PRICE: ${entry.value.toFixed(6)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 z-0">
        {/* Base quantum gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-900/10 via-black to-black"></div>
        
        {/* Animated quantum grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="pulse-grid bg-grid bg-grid-size animate-pulse"></div>
        </div>
        
        {/* Floating quantum orbs */}
        <div className="floating-orb orb1 bg-gradient-radial from-cyan-500/5 to-transparent blur-3xl"></div>
        <div className="floating-orb orb2 bg-gradient-radial from-teal-500/5 to-transparent blur-3xl"></div>
      </div>

      {/* Main Chart Container */}
      <div className="relative z-10 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl overflow-hidden">
        {/* System Header */}
        <div className="bg-black/60 backdrop-blur-sm border-b border-cyan-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Database className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400 tracking-wider">PRICE_ANALYTICS</span>
              </div>
              <h3 className="text-lg font-mono text-cyan-400 font-semibold">
                ARK Token Price Matrix
              </h3>
            </div>
            
            {/* System Status Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-green-400">LIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400">SYNC</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-teal-400" />
                <span className="text-xs font-mono text-teal-400">{data.length} PTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="p-6 relative">
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent animate-scan"></div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                tickFormatter={(value) => `$${value.toFixed(6)}`}
                tickLine={{ stroke: '#00ffff', strokeWidth: 1 }}
                axisLine={{ stroke: '#00ffff', strokeWidth: 1 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#00ffff" 
                strokeWidth={2}
                name="Price (USD)"
                dot={{ fill: '#00ffff', strokeWidth: 2, r: 3 }}
                activeDot={{ 
                  r: 5, 
                  fill: '#00ffff',
                  stroke: '#ffffff',
                  strokeWidth: 2
                }}
                filter="drop-shadow(0 0 6px rgba(0, 255, 255, 0.6))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System Diagnostics Panel */}
        <div className="bg-black/60 backdrop-blur-sm border-t border-cyan-500/20 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs font-mono text-gray-400">UPDATE_FREQ</div>
                <div className="text-sm font-mono text-yellow-400">30s</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs font-mono text-gray-400">DATA_POINTS</div>
                <div className="text-sm font-mono text-blue-400">{data.length}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs font-mono text-gray-400">STATUS</div>
                <div className="text-sm font-mono text-green-400">OPTIMAL</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-mono text-gray-400">LATENCY</div>
                <div className="text-sm font-mono text-cyan-400">12ms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scanning effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent animate-scan" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
};

export default TrendChart;
