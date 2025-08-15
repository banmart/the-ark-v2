import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BurnTransaction } from '../../hooks/useBurnAnalytics';
import { format } from 'date-fns';

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
        <div className="glass-card p-4 rounded-lg border border-destructive/20">
          <p className="text-destructive font-semibold">{label}</p>
          <p className="text-foreground">
            Burned: {data.amount.toLocaleString()} ARK
          </p>
          <p className="text-muted-foreground">
            Rate: {data.burnRate.toFixed(4)}% of volume
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center space-x-2">
          <span>Daily Burn Rate</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--destructive))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BurnRateChart;