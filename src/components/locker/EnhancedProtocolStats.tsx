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
  return <div className="space-y-8">
      {/* System Status Header */}
      

      {/* Protocol Statistics */}
      
    </div>;
};
export default EnhancedProtocolStats;