import React from 'react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { useChartData } from '../../hooks/useChartData';

interface BackgroundChartProps {
  className?: string;
  type?: 'area' | 'line';
  opacity?: number;
}

const BackgroundChart: React.FC<BackgroundChartProps> = ({ 
  className = '', 
  type = 'area',
  opacity = 0.8 
}) => {
  const { timeSeriesData, loading } = useChartData();

  if (loading || !timeSeriesData || timeSeriesData.length === 0) {
    return null;
  }

  const gradientId = `backgroundGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={timeSeriesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--cyan))" stopOpacity={opacity} />
                <stop offset="50%" stopColor="hsl(var(--cyan))" stopOpacity={opacity * 0.5} />
                <stop offset="100%" stopColor="hsl(var(--cyan))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--cyan))"
              strokeWidth={1}
              fill={`url(#${gradientId})`}
              strokeOpacity={opacity}
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        ) : (
          <LineChart data={timeSeriesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--cyan))"
              strokeWidth={1}
              strokeOpacity={opacity}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default BackgroundChart;