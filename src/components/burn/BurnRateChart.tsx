import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BurnTransaction } from '../../hooks/useBurnAnalytics';
import { format } from 'date-fns';
import { Flame } from 'lucide-react';

interface BurnRateChartProps {
  data: BurnTransaction[];
}

const BurnRateChart = ({ data }: BurnRateChartProps) => {
  const chartData = data.map(tx => ({
    date: format(new Date(tx.timestamp), 'MM/dd'),
    amount: tx.amount,
    volume: tx.volume24h,
    burnRate: (tx.amount / tx.volume24h) * 100 // Burn rate as percentage of volume
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="relative">
          <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-orange-500/30 via-red-500/20 to-orange-500/30 blur-sm" />
          <div className="relative backdrop-blur-2xl bg-black/90 p-4 rounded-lg border border-orange-500/30">
            <p className="text-orange-400 font-semibold mb-2">{label}</p>
            <p className="text-white">
              Burned: <span className="text-orange-300 font-medium">{data.amount.toLocaleString()}</span> ARK
            </p>
            <p className="text-white/60 text-sm">
              Rate: {data.burnRate.toFixed(4)}% of volume
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
      <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-orange-500/20 via-red-500/10 to-orange-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-[-2px] rounded bg-orange-500/30 blur-sm animate-pulse" />
              <Flame className="relative h-5 w-5 text-orange-400" />
            </div>
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Daily Burn Rate
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="burnLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.4)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.4)"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="url(#burnLineGradient)"
                strokeWidth={3}
                dot={{ 
                  fill: '#f97316', 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: '#f97316',
                  filter: 'drop-shadow(0 0 4px rgba(249,115,22,0.8))'
                }}
                activeDot={{ 
                  r: 6, 
                  fill: '#f97316',
                  stroke: '#fff',
                  strokeWidth: 2,
                  filter: 'drop-shadow(0 0 8px rgba(249,115,22,1))'
                }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.5))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BurnRateChart;
