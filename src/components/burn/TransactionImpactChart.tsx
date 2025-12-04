import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BurnTransaction, BurnProjection } from '../../hooks/useBurnAnalytics';
import { Activity } from 'lucide-react';

interface TransactionImpactChartProps {
  burnHistory: BurnTransaction[];
  burnProjections: BurnProjection[];
}

const TransactionImpactChart = ({ burnHistory, burnProjections }: TransactionImpactChartProps) => {
  // Prepare scatter plot data
  const scatterData = burnHistory.map(tx => ({
    volume: tx.volume24h / 1000000, // Convert to millions for readability
    burnAmount: tx.amount / 1000, // Convert to thousands for readability
    efficiency: (tx.amount / (tx.volume24h * 0.02)) * 100 // Calculate efficiency
  }));

  // Prepare projection line data
  const projectionData = burnProjections.map(proj => ({
    volume: proj.volume / 1000000,
    projectedBurn: proj.projectedBurn / 1000,
    efficiency: proj.efficiency
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="relative">
          <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-cyan-500/30 blur-sm" />
          <div className="relative backdrop-blur-2xl bg-black/90 p-4 rounded-lg border border-cyan-500/30">
            <p className="text-cyan-400 font-semibold mb-2">Transaction Impact</p>
            <p className="text-white">
              Volume: <span className="text-cyan-300 font-medium">${(data.volume * 1000000).toLocaleString()}</span>
            </p>
            <p className="text-white">
              Burned: <span className="text-orange-300 font-medium">{(data.burnAmount * 1000).toLocaleString()}</span> ARK
            </p>
            <p className="text-white/60 text-sm">
              Efficiency: {data.efficiency?.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const ProjectionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="relative">
          <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-orange-500/30 blur-sm" />
          <div className="relative backdrop-blur-2xl bg-black/90 p-4 rounded-lg border border-orange-500/30">
            <p className="text-orange-400 font-semibold mb-2">Projection</p>
            <p className="text-white">
              Volume: <span className="text-orange-300 font-medium">${(data.volume * 1000000).toLocaleString()}</span>
            </p>
            <p className="text-white">
              Projected Burn: <span className="text-amber-300 font-medium">{(data.projectedBurn * 1000).toLocaleString()}</span> ARK
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative group">
      {/* Outer glow ring */}
      <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-cyan-500/20 via-orange-500/10 to-cyan-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-[-2px] rounded bg-cyan-500/30 blur-sm animate-pulse" />
              <Activity className="relative h-5 w-5 text-cyan-400" />
            </div>
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Transaction Volume vs Burn Impact
            </span>
          </CardTitle>
          <p className="text-sm text-white/40 mt-1">
            Historical burn amounts (<span className="text-cyan-400">cyan</span>) vs projected burns (<span className="text-orange-400">orange</span>) based on transaction volume
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="glowOrange" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                type="number" 
                dataKey="volume" 
                name="Volume (M $)"
                stroke="rgba(255,255,255,0.4)"
                fontSize={12}
                tickFormatter={(value) => `$${value.toFixed(1)}M`}
                tickLine={false}
              />
              <YAxis 
                type="number" 
                dataKey="burnAmount" 
                name="Burn Amount (K ARK)"
                stroke="rgba(255,255,255,0.4)"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(0)}K`}
                tickLine={false}
              />
              
              {/* Historical data scatter with glow */}
              <Scatter 
                name="Historical Burns" 
                data={scatterData} 
                fill="#22d3ee"
                fillOpacity={0.8}
                filter="url(#glowCyan)"
              />
              
              {/* Projection line scatter with glow */}
              <Scatter 
                name="Projections" 
                data={projectionData} 
                fill="#f97316"
                fillOpacity={0.9}
                shape="diamond"
                filter="url(#glowOrange)"
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference lines for better visualization */}
              {scatterData.length > 0 && (
                <ReferenceLine 
                  x={scatterData[scatterData.length - 1]?.volume} 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeDasharray="2 2"
                  label={{ value: "Current", position: "top", fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Premium Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="text-sm text-white/60">Historical Burns</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-3 h-3 rotate-45 bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="text-sm text-white/60">Projections</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionImpactChart;
