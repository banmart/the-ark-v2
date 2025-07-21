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
      <div className="bg-black/20 backdrop-blur-sm border border-gray-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-cyan-400">System Status</h3>
          </div>
          <div className="flex items-center gap-4">
            {/* Emergency Mode Status */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${emergencyMode ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-green-500/20 border-green-500/50 text-green-400'}`}>
              {emergencyMode ? <AlertTriangle className="w-4 h-4 animate-pulse" /> : <CheckCircle className="w-4 h-4" />}
              <span className="text-sm font-semibold">
                {emergencyMode ? 'Emergency Mode' : 'Normal Operation'}
              </span>
            </div>

            {/* Contract Paused Status */}
            {contractPaused && <div className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-orange-500/20 border-orange-500/50 text-orange-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-semibold">Contract Paused</span>
              </div>}
          </div>
        </div>

        {/* Early Unlock Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/30 rounded-lg p-3 border border-gray-600/50">
            <div className="flex items-center mb-1">
              <Flame className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-gray-400 text-sm">Early Unlock</span>
            </div>
            <div className={`font-semibold ${earlyUnlockSettings.enabled ? 'text-red-400' : 'text-gray-500'}`}>
              {earlyUnlockSettings.enabled ? 'Enabled' : 'Disabled'}
            </div>
            {earlyUnlockSettings.enabled && <div className="text-xs text-gray-500 mt-1">
                Max {earlyUnlockSettings.penaltyRate / 100}% penalty
              </div>}
          </div>
          
          <div className="bg-black/30 rounded-lg p-3 border border-gray-600/50">
            <div className="flex items-center mb-1">
              <Flame className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-gray-400 text-sm">Penalty Burn</span>
            </div>
            <div className="text-orange-400 font-semibold">
              {earlyUnlockSettings.burnShare / 100}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Of penalties burned
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-3 border border-gray-600/50">
            <div className="flex items-center mb-1">
              <Zap className="w-4 h-4 text-cyan-400 mr-2" />
              <span className="text-gray-400 text-sm">Penalty Rewards</span>
            </div>
            <div className="text-cyan-400 font-semibold">
              {earlyUnlockSettings.rewardShare / 100}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Distributed to lockers
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Statistics */}
      
    </div>;
};
export default EnhancedProtocolStats;