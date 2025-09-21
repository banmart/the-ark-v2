import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Flame, Activity, Users, Zap } from 'lucide-react';
import { PoolBurnMetrics } from '../../services/perPoolBurnAnalyticsService';

interface PoolBurnCardProps {
  pool: PoolBurnMetrics;
  onClick?: () => void;
  isSelected?: boolean;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const PoolBurnCard: React.FC<PoolBurnCardProps> = ({ pool, onClick, isSelected = false }) => {
  const trendIcon = pool.trends.previousPeriodComparison >= 0 ? TrendingUp : TrendingDown;
  const trendColor = pool.trends.previousPeriodComparison >= 0 ? 'text-green-400' : 'text-red-400';
  const TrendIcon = trendIcon;

  const efficiencyColor = pool.burnEfficiency >= 5 ? 'text-green-400' : 
                         pool.burnEfficiency >= 2 ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card 
      className={`
        bg-black/30 backdrop-blur-sm border transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'border-video-cyan bg-video-cyan/10' 
          : 'border-white/10 hover:border-video-cyan/50 hover:bg-black/40'
        }
      `}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            {pool.poolName}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`
              text-xs border-0
              ${pool.burnCount24h > 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
              }
            `}
          >
            {pool.burnCount24h > 0 ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Flame className="w-3 h-3 text-video-cyan" />
              <span className="text-xs text-white/70">24h Burned</span>
            </div>
            <p className="text-lg font-bold text-video-cyan">
              {formatNumber(pool.totalBurned24h)} ARK
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-video-gold" />
              <span className="text-xs text-white/70">Volume</span>
            </div>
            <p className="text-lg font-bold text-video-gold">
              {formatNumber(pool.totalSwapVolume24h)} ARK
            </p>
          </div>
        </div>

        {/* Efficiency Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-video-blue" />
              <span className="text-xs text-white/70">Burn Efficiency</span>
            </div>
            <span className={`text-xs font-bold ${efficiencyColor}`}>
              {pool.burnEfficiency.toFixed(2)}%
            </span>
          </div>
          <Progress 
            value={Math.min(pool.burnEfficiency, 10)} 
            max={10}
            className="h-2"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-white/70">Burns</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {pool.burnCount24h}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className="text-xs text-white/70">Trend</span>
            </div>
            <p className={`text-sm font-semibold ${trendColor}`}>
              {pool.trends.previousPeriodComparison >= 0 ? '+' : ''}
              {pool.trends.previousPeriodComparison.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Average Burn */}
        {pool.avgBurnPerSwap > 0 && (
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">Avg Burn/Swap</span>
              <span className="text-xs font-bold text-white">
                {formatNumber(pool.avgBurnPerSwap)} ARK
              </span>
            </div>
          </div>
        )}

        {/* Top Burner */}
        {pool.topBurner && (
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">Top Burner</span>
              <span className="text-xs font-mono text-video-cyan">
                {pool.topBurner.slice(0, 6)}...{pool.topBurner.slice(-4)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoolBurnCard;