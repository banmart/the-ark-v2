
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
              Price: ${entry.value.toFixed(6)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">
        ARK Token Price History (30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="#ffffff"
            fontSize={10}
          />
          <YAxis 
            stroke="#ffffff" 
            fontSize={12}
            tickFormatter={(value) => `$${value.toFixed(6)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#00ffff" 
            strokeWidth={3}
            name="Price (USD)"
            dot={{ fill: '#00ffff', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#00ffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
