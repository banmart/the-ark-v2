import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BurnEfficiencyGaugeProps {
  efficiency: number;
  trend: number;
}

const BurnEfficiencyGauge = ({ efficiency, trend }: BurnEfficiencyGaugeProps) => {
  const getEfficiencyColor = (eff: number) => {
    if (eff >= 90) return 'text-green-500';
    if (eff >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getEfficiencyStatus = (eff: number) => {
    if (eff >= 90) return 'Excellent';
    if (eff >= 70) return 'Good';
    if (eff >= 50) return 'Fair';
    return 'Poor';
  };

  const getTrendIcon = () => {
    if (trend > 0.5) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < -0.5) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-white/70" />;
  };

  const getTrendText = () => {
    if (trend > 0.5) return `+${trend.toFixed(1)}%`;
    if (trend < -0.5) return `${trend.toFixed(1)}%`;
    return 'Stable';
  };

  // Calculate the arc path for the gauge
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * Math.PI; // Half circle
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (efficiency / 100) * circumference;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Burn Efficiency</span>
          <Badge variant={efficiency >= 70 ? 'default' : 'destructive'}>
            {getEfficiencyStatus(efficiency)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {/* Gauge SVG */}
        <div className="relative">
          <svg
            height={radius}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background arc */}
            <path
              d={`M ${strokeWidth} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d={`M ${strokeWidth} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
              fill="none"
              stroke={efficiency >= 70 ? 'hsl(var(--video-cyan))' : efficiency >= 50 ? '#eab308' : 'hsl(var(--destructive))'}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getEfficiencyColor(efficiency)}`}>
              {efficiency.toFixed(1)}%
            </span>
            <span className="text-xs text-white/70">efficiency</span>
          </div>
        </div>

        {/* Trend indicator */}
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className="text-sm text-white/70">
            7-day trend: {getTrendText()}
          </span>
        </div>

        {/* Efficiency breakdown */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Theoretical Max:</span>
            <span className="text-white">100%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Current:</span>
            <span className={getEfficiencyColor(efficiency)}>{efficiency.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Gap:</span>
            <span className="text-white/70">{(100 - efficiency).toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BurnEfficiencyGauge;