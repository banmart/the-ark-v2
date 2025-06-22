import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Lock, 
  Database,
  BarChart3,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Info
} from 'lucide-react';

const ProtocolStats = () => {
  const [animatedValues, setAnimatedValues] = useState({
    totalLocked: 0,
    activeLockers: 0,
    rewardsPool: 0,
    avgAPY: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      id: 'totalLocked',
      title: 'Total Value Locked',
      value: '12.5M',
      rawValue: 12500000,
      unit: 'ARK',
      emoji: '🏛️',
      icon: Lock,
      color: 'cyan',
      description: 'Total tokens locked in all tiers',
      change: 8.5,
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      border: 'border-cyan-500/30'
    },
    {
      id: 'activeLockers',
      title: 'Active Lockers',
      value: '2,847',
      rawValue: 2847,
      unit: 'Users',
      emoji: '👥',
      icon: Users,
      color: 'green',
      description: 'Unique addresses with active locks',
      change: 12.3,
      gradient: 'from-green-500/20 via-emerald-500/10 to-transparent',
      border: 'border-green-500/30'
    },
    {
      id: 'rewardsPool',
      title: 'Pending Rewards',
      value: '850K',
      rawValue: 850000,
      unit: 'ARK',
      emoji: '💰',
      icon: DollarSign,
      color: 'yellow',
      description: 'Ready for distribution to lockers',
      change: -2.1,
      gradient: 'from-yellow-500/20 via-orange-500/10 to-transparent',
      border: 'border-yellow-500/30'
    },
    {
      id: 'avgAPY',
      title: 'APY Range',
      value: '15-150%',
      rawValue: 82.5,
      unit: 'APY',
      emoji: '📈',
      icon: TrendingUp,
      color: 'purple',
      description: 'Annual percentage yield across all tiers',
      change: 0,
      gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      border: 'border-purple-500/30'
    }
  ];

  // Animate numbers on component mount
  useEffect(() => {
    setIsVisible(true);
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    stats.forEach((stat) => {
      let currentStep = 0;
      const targetValue = stat.rawValue;
      
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentValue = Math.floor(targetValue * easeOutProgress);
        
        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: currentValue
        }));

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues(prev => ({
            ...prev,
            [stat.id]: targetValue
          }));
        }
      }, stepDuration);
    });
  }, []);

  const formatAnimatedValue = (statId: string, stat: any) => {
    const animatedValue = animatedValues[statId];
    
    switch (statId) {
      case 'totalLocked':
        if (animatedValue >= 1000000) {
          return `${(animatedValue / 1000000).toFixed(1)}M`;
        }
        return animatedValue.toLocaleString();
      
      case 'activeLockers':
        return animatedValue.toLocaleString();
      
      case 'rewardsPool':
        if (animatedValue >= 1000) {
          return `${Math.floor(animatedValue / 1000)}K`;
        }
        return animatedValue.toLocaleString();
      
      case 'avgAPY':
        return stat.value; // Keep original format for APY range
      
      default:
        return animatedValue.toLocaleString();
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-3 h-3" />;
    if (change < 0) return <ArrowDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-cyan-400 mr-3" />
          Protocol Statistics
          <Activity className="w-8 h-8 text-blue-400 ml-3" />
        </h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real-time metrics showing the health and growth of the ARK ecosystem
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          
          return (
            <div
              key={stat.id}
              className={`relative bg-gradient-to-br ${stat.gradient} border-2 ${stat.border} rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 group overflow-hidden`}
            >
              {/* Background glow effect */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-${stat.color}-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon Section */}
                <div className="flex items-center justify-center mb-4">
                  <div className="text-4xl mr-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.emoji}
                  </div>
                  <IconComponent 
                    className={`w-6 h-6 text-${stat.color}-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110`}
                  />
                </div>

                {/* Title */}
                <div className={`text-${stat.color}-400 text-sm uppercase tracking-wider mb-3 font-semibold`}>
                  {stat.title}
                </div>

                {/* Value */}
                <div className="mb-3">
                  <div className={`text-3xl font-black text-white transition-all duration-300 ${
                    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                  }`}>
                    {formatAnimatedValue(stat.id, stat)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {stat.unit}
                  </div>
                </div>

                {/* Change Indicator */}
                {stat.change !== 0 && (
                  <div className={`flex items-center justify-center text-sm font-semibold ${getChangeColor(stat.change)} mb-3`}>
                    {getChangeIcon(stat.change)}
                    <span className="ml-1">
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">24h</span>
                  </div>
                )}

                {/* Description */}
                <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.description}
                </div>

                {/* Bottom accent line */}
                <div className={`mt-4 h-1 bg-gradient-to-r from-transparent via-${stat.color}-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Lock Duration */}
        <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Database className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-blue-400 font-semibold">Avg Lock Duration</span>
            </div>
            <div className="text-2xl font-bold text-white">247 days</div>
          </div>
          <div className="text-sm text-gray-400">
            Average time users lock their tokens
          </div>
        </div>

        {/* Total Rewards Distributed */}
        <div className="bg-black/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-green-400 mr-2" />
              <span className="text-green-400 font-semibold">Total Distributed</span>
            </div>
            <div className="text-2xl font-bold text-white">3.2M ARK</div>
          </div>
          <div className="text-sm text-gray-400">
            Lifetime rewards paid to lockers
          </div>
        </div>

        {/* Protocol Health Score */}
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Activity className="w-6 h-6 text-purple-400 mr-2" />
              <span className="text-purple-400 font-semibold">Health Score</span>
            </div>
            <div className="text-2xl font-bold text-green-400">98/100</div>
          </div>
          <div className="text-sm text-gray-400">
            Overall protocol performance
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-2">
              Understanding Protocol Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <span className="text-cyan-400 font-semibold">Total Value Locked:</span> Sum of all tokens currently locked across all tiers, representing user commitment to the protocol.
              </div>
              <div>
                <span className="text-green-400 font-semibold">Active Lockers:</span> Number of unique wallet addresses with at least one active lock position.
              </div>
              <div>
                <span className="text-yellow-400 font-semibold">Pending Rewards:</span> Accumulated transaction fees ready for distribution to lock participants.
              </div>
              <div>
                <span className="text-purple-400 font-semibold">APY Range:</span> Annual yield varies by tier - longer locks earn exponentially higher rewards.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolStats;