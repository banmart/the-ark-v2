
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartDataPoint } from '../../hooks/useChartData';

interface TokenDistributionChartProps {
  data: ChartDataPoint[];
}

const TokenDistributionChart = ({ data }: TokenDistributionChartProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="glass-card p-4 rounded-lg border border-video-cyan/20">
          <p className="text-video-cyan font-semibold">{data.name}</p>
          <p className="text-foreground">
            Value: {data.value.toLocaleString()}
          </p>
          <p className="text-muted-foreground">
            Percentage: {data.payload.percentage?.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-bold text-video-cyan mb-4 text-center">
        Token Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenDistributionChart;
