import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BurnTransaction, BurnProjection } from '../../hooks/useBurnAnalytics';

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
        <div className="glass-card p-4 rounded-lg border border-video-cyan/20">
          <p className="text-video-cyan font-semibold">Transaction Impact</p>
          <p className="text-foreground">
            Volume: ${(data.volume * 1000000).toLocaleString()}
          </p>
          <p className="text-foreground">
            Burned: {(data.burnAmount * 1000).toLocaleString()} ARK
          </p>
          <p className="text-muted-foreground">
            Efficiency: {data.efficiency?.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const ProjectionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 rounded-lg border border-orange-500/20">
          <p className="text-orange-500 font-semibold">Projection</p>
          <p className="text-foreground">
            Volume: ${(data.volume * 1000000).toLocaleString()}
          </p>
          <p className="text-foreground">
            Projected Burn: {(data.projectedBurn * 1000).toLocaleString()} ARK
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-foreground">Transaction Volume vs Burn Impact</CardTitle>
        <p className="text-sm text-muted-foreground">
          Historical burn amounts (blue) vs projected burns (orange) based on transaction volume
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              dataKey="volume" 
              name="Volume (M $)"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(1)}M`}
            />
            <YAxis 
              type="number" 
              dataKey="burnAmount" 
              name="Burn Amount (K ARK)"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${value.toFixed(0)}K`}
            />
            
            {/* Historical data scatter */}
            <Scatter 
              name="Historical Burns" 
              data={scatterData} 
              fill="hsl(var(--video-cyan))"
              fillOpacity={0.7}
            />
            
            {/* Projection line scatter */}
            <Scatter 
              name="Projections" 
              data={projectionData} 
              fill="hsl(var(--orange-500))"
              fillOpacity={0.9}
              shape="diamond"
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines for better visualization */}
            {scatterData.length > 0 && (
              <ReferenceLine 
                x={scatterData[scatterData.length - 1]?.volume} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="2 2"
                label={{ value: "Current", position: "top" }}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionImpactChart;