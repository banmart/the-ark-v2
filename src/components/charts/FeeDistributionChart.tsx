
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../../hooks/useChartData';

interface FeeDistributionChartProps {
  data: ChartDataPoint[];
}

const FeeDistributionChart = ({ data }: FeeDistributionChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-lg border border-cyan-400/20">
          <p className="text-cyan-400 font-semibold">{label}</p>
          <p className="text-white">
            Fee: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">
        Fee Structure
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#ffffff"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#ffffff" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="url(#feeGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeeDistributionChart;
