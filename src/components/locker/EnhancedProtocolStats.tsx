import React from 'react';
import { TrendingUp, Users, DollarSign, Lock, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLockerContractData } from '../../hooks/useLockerContractData';

const EnhancedProtocolStats = () => {
  const {
    protocolStats,
    emergencyMode,
    contractPaused,
    earlyUnlockSettings,
    loading
  } = useLockerContractData();

  const stats = [
    {
      title: 'Total Value Locked',
      value: protocolStats.totalLockedTokens,
      unit: 'ARK',
      emoji: '🏛️',
      icon: Lock,
      colorRGB: '34, 211, 238',
      description: 'Total tokens locked across all tiers',
    },
    {
      title: 'Active Lockers',
      value: protocolStats.totalActiveLockers,
      unit: 'Users',
      emoji: '👥',
      icon: Users,
      colorRGB: '74, 222, 128',
      description: 'Unique addresses with active locks',
    },
    {
      title: 'Reward Pool',
      value: protocolStats.rewardPool,
      unit: 'ARK',
      emoji: '💰',
      icon: DollarSign,
      colorRGB: '250, 204, 21',
      description: 'Available rewards for distribution',
    },
    {
      title: 'Total Distributed',
      value: protocolStats.totalRewardsDistributed,
      unit: 'ARK',
      emoji: '📈',
      icon: TrendingUp,
      colorRGB: '167, 139, 250',
      description: 'Lifetime rewards distributed',
    }
  ];

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

  return (
    <div className="space-y-8">
      {/* Premium System Status Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-lg"></div>
                <div className="relative p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Protocol Statistics</h2>
                <p className="text-sm text-gray-400">Real-time metrics from the blockchain</p>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                emergencyMode 
                  ? 'bg-red-500/10 border-red-500/40 text-red-400' 
                  : 'bg-green-500/10 border-green-500/40 text-green-400'
              }`}>
                {emergencyMode ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                <span className="text-sm font-semibold">{emergencyMode ? 'Emergency' : 'Normal'}</span>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                earlyUnlockSettings.enabled 
                  ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400' 
                  : 'bg-gray-500/10 border-gray-500/40 text-gray-400'
              }`}>
                <span className="text-sm font-semibold">
                  Early Unlock: {earlyUnlockSettings.enabled ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={stat.title}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Outer glow */}
              <div 
                className="absolute -inset-0.5 rounded-2xl blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: `rgba(${stat.colorRGB}, 0.5)` }}
              ></div>
              
              {/* Card */}
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all duration-500 overflow-hidden">
                {/* Inner gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ 
                    background: `radial-gradient(ellipse at top, rgba(${stat.colorRGB}, 0.08) 0%, transparent 60%)`
                  }}
                ></div>
                
                <div className="relative z-10">
                  {/* Icon and emoji */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <div 
                        className="absolute inset-0 blur-xl opacity-40"
                        style={{ background: `rgba(${stat.colorRGB}, 0.5)` }}
                      ></div>
                      <div 
                        className="relative p-3 rounded-xl border"
                        style={{ 
                          background: `rgba(${stat.colorRGB}, 0.1)`,
                          borderColor: `rgba(${stat.colorRGB}, 0.3)`
                        }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: `rgb(${stat.colorRGB})` }} />
                      </div>
                    </div>
                    <span className="text-3xl">{stat.emoji}</span>
                  </div>
                  
                  {/* Title */}
                  <div className="text-sm text-gray-400 mb-2">{stat.title}</div>
                  
                  {/* Value with gradient */}
                  <div 
                    className="text-2xl md:text-3xl font-black font-mono mb-1"
                    style={{ color: `rgb(${stat.colorRGB})` }}
                  >
                    {loading ? '...' : formatValue(stat.value, stat.unit)}
                  </div>
                  
                  {/* Unit */}
                  <div className="text-xs text-gray-500 font-mono">{stat.unit}</div>
                </div>

                {/* Scan line effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden rounded-2xl">
                  <div 
                    className="absolute top-0 left-0 w-full h-0.5 animate-[statScan_2s_ease-in-out_infinite]"
                    style={{ background: `linear-gradient(to right, transparent, rgba(${stat.colorRGB}, 0.6), transparent)` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes statScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedProtocolStats;
