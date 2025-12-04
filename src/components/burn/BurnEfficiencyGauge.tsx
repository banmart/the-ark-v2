import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus, Gauge } from 'lucide-react';

interface BurnEfficiencyGaugeProps {
  efficiency: number;
  trend: number;
}

const BurnEfficiencyGauge = ({ efficiency, trend }: BurnEfficiencyGaugeProps) => {
  const getEfficiencyColor = (eff: number) => {
    if (eff >= 90) return 'from-green-400 to-emerald-400';
    if (eff >= 70) return 'from-yellow-400 to-amber-400';
    return 'from-red-400 to-orange-400';
  };

  const getEfficiencyGlowColor = (eff: number) => {
    if (eff >= 90) return 'rgba(34,197,94,0.6)';
    if (eff >= 70) return 'rgba(234,179,8,0.6)';
    return 'rgba(239,68,68,0.6)';
  };

  const getEfficiencyStatus = (eff: number) => {
    if (eff >= 90) return 'Excellent';
    if (eff >= 70) return 'Good';
    if (eff >= 50) return 'Fair';
    return 'Poor';
  };

  const getTrendIcon = () => {
    if (trend > 0.5) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend < -0.5) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-white/40" />;
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

  const getStrokeColor = (eff: number) => {
    if (eff >= 90) return '#22c55e';
    if (eff >= 70) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="relative group">
      {/* Outer glow ring */}
      <div 
        className="absolute inset-[-1px] rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ 
          background: `linear-gradient(to right, ${getStrokeColor(efficiency)}33, transparent, ${getStrokeColor(efficiency)}33)` 
        }}
      />
      
      <Card className="relative backdrop-blur-2xl bg-white/[0.02] border-white/[0.08]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-[-2px] rounded bg-cyan-500/30 blur-sm" />
                <Gauge className="relative h-5 w-5 text-cyan-400" />
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Burn Efficiency
              </span>
            </div>
            <div className="relative">
              <div 
                className="absolute inset-[-2px] rounded-full blur-sm opacity-60"
                style={{ backgroundColor: `${getStrokeColor(efficiency)}40` }}
              />
              <Badge 
                variant={efficiency >= 70 ? 'default' : 'destructive'}
                className={`relative backdrop-blur-xl ${efficiency >= 70 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}
              >
                {getEfficiencyStatus(efficiency)}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {/* Premium Gauge SVG */}
          <div className="relative">
            {/* Animated glow ring */}
            <div 
              className="absolute inset-[-8px] rounded-full blur-md opacity-40 animate-pulse"
              style={{ 
                background: `radial-gradient(circle, ${getStrokeColor(efficiency)}40, transparent)`,
                animationDuration: '3s'
              }}
            />
            
            <svg
              height={radius}
              width={radius * 2}
              className="transform -rotate-90 relative z-10"
            >
              {/* Background arc */}
              <path
                d={`M ${strokeWidth} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Progress arc with glow */}
              <path
                d={`M ${strokeWidth} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
                fill="none"
                stroke={getStrokeColor(efficiency)}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 8px ${getEfficiencyGlowColor(efficiency)})` }}
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span 
                className={`text-3xl font-bold bg-gradient-to-r ${getEfficiencyColor(efficiency)} bg-clip-text text-transparent`}
                style={{ filter: `drop-shadow(0 0 8px ${getEfficiencyGlowColor(efficiency)})` }}
              >
                {efficiency.toFixed(1)}%
              </span>
              <span className="text-xs text-white/40">efficiency</span>
            </div>
          </div>

          {/* Premium trend indicator */}
          <div className="relative group/trend">
            <div className="absolute inset-[-1px] rounded-full bg-white/5 blur-sm opacity-0 group-hover/trend:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center space-x-2 px-3 py-1 rounded-full backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
              {getTrendIcon()}
              <span className="text-sm text-white/60">
                7-day trend: <span className={trend > 0.5 ? 'text-green-400' : trend < -0.5 ? 'text-red-400' : 'text-white/40'}>{getTrendText()}</span>
              </span>
            </div>
          </div>

          {/* Premium efficiency breakdown */}
          <div className="w-full space-y-2">
            {[
              { label: 'Theoretical Max:', value: '100%', color: 'text-white' },
              { label: 'Current:', value: `${efficiency.toFixed(1)}%`, color: getEfficiencyColor(efficiency) },
              { label: 'Gap:', value: `${(100 - efficiency).toFixed(1)}%`, color: 'text-white/40' }
            ].map((item, index) => (
              <div 
                key={item.label}
                className="flex justify-between text-sm p-2 rounded-lg backdrop-blur-xl bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.08] transition-colors duration-300"
              >
                <span className="text-white/50">{item.label}</span>
                <span className={item.color.includes('from-') ? `bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-medium` : item.color}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BurnEfficiencyGauge;
