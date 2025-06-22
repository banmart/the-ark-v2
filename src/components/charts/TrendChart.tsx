
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesData } from '../../hooks/useChartData';

interface TrendChartProps {
  data: TimeSeriesData[];
}

const TrendChart = ({ data }: TrendChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-lg border border-cyan-400/20">
          <p className="text-cyan-400 font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-xl p-6 col-span-2">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">
        30-Day Trend Analysis
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="#ffffff"
            fontSize={10}
          />
          <YAxis stroke="#ffffff" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#ffffff' }}
            formatter={(value) => <span style={{ color: '#ffffff' }}>{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="burned" 
            stroke="#ff6b35" 
            strokeWidth={3}
            name="Burned Tokens"
            dot={{ fill: '#ff6b35', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="holders" 
            stroke="#00ffff" 
            strokeWidth={3}
            name="Total Holders"
            dot={{ fill: '#00ffff', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
