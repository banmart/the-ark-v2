import React from 'react';
import { TrendingUp, Users, DollarSign, Lock, Database, BarChart3, Activity, Zap, Flame, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLockerContractData } from '../../hooks/useLockerContractData';
const EnhancedProtocolStats = () => {
  const {
    protocolStats,
    emergencyMode,
    contractPaused,
    earlyUnlockSettings,
    loading
  } = useLockerContractData();
  const stats = [{
    title: 'Total Value Locked',
    value: protocolStats.totalLockedTokens,
    unit: 'ARK',
    emoji: '🏛️',
    icon: Lock,
    color: 'cyan',
    description: 'Total tokens locked across all tiers',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    border: 'border-cyan-500/30'
  }, {
    title: 'Active Lockers',
    value: protocolStats.totalActiveLockers,
    unit: 'Users',
    emoji: '👥',
    icon: Users,
    color: 'green',
    description: 'Unique addresses with active locks',
    gradient: 'from-green-500/20 via-emerald-500/10 to-transparent',
    border: 'border-green-500/30'
  }, {
    title: 'Reward Pool',
    value: protocolStats.rewardPool,
    unit: 'ARK',
    emoji: '💰',
    icon: DollarSign,
    color: 'yellow',
    description: 'Available rewards for distribution',
    gradient: 'from-yellow-500/20 via-orange-500/10 to-transparent',
    border: 'border-yellow-500/30'
  }, {
    title: 'Total Distributed',
    value: protocolStats.totalRewardsDistributed,
    unit: 'ARK',
    emoji: '📈',
    icon: TrendingUp,
    color: 'purple',
    description: 'Lifetime rewards distributed',
    gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    border: 'border-purple-500/30'
  }];
  const formatValue = (value: number, unit: string) => {
    if (unit === 'ARK') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toFixed(0);
    }
    return value.toString();
  };
  if (loading) {
    return <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gradient-to-br from-background/50 to-background/30 border border-border/50 rounded-xl animate-pulse" />)}
        </div>
      </div>;
  }
  return <div className="space-y-8">
      {/* System Status Header */}
      

      {/* Protocol Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
        const Icon = stat.icon;
        return <div key={stat.title} className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-xl p-6 group hover:scale-[1.02] transition-all duration-300`}>
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{stat.emoji}</span>
                    <Icon className={`h-5 w-5 text-${stat.color}-500`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatValue(stat.value, stat.unit)}
                    </span>
                    <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/70">{stat.description}</p>
                </div>
              </div>
            </div>;
      })}
      </div>
    </div>;
};
export default EnhancedProtocolStats;