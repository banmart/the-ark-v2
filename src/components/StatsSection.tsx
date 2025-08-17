import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, Layers, Coins, Activity, Flame } from 'lucide-react';
import { useLockerData } from '../hooks/useLockerData';
import { useARKPriceData } from '../hooks/useARKPriceData';
import { formatTokenAmount, formatPrice } from '../lib/utils';

interface StatsSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  contractData,
  contractLoading
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { protocolStats } = useLockerData();
  const { priceData, loading: priceLoading } = useARKPriceData();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: string | number): string => {
    const numValue = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    if (isNaN(numValue)) return '0';
    if (numValue >= 1000000000) {
      return `${(numValue / 1000000000).toFixed(2)}B`;
    } else if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(2)}K`;
    }
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const formatTVL = (tvl: number): string => {
    if (tvl >= 1000000) {
      return `${(tvl / 1000000).toFixed(2)}M`;
    } else if (tvl >= 1000) {
      return `${(tvl / 1000).toFixed(2)}K`;
    }
    return tvl.toFixed(2);
  };

  const statsData = useMemo(() => [
    {
      id: 'marketcap',
      title: 'Market Cap',
      icon: DollarSign,
      value: `$${formatNumber(contractData?.marketCap || '0')}`,
      description: 'Based on current price & supply',
      color: 'from-green-500/20 to-emerald-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-300',
      glowColor: 'shadow-green-500/20'
    },
    {
      id: 'price',
      title: 'Price Feed',
      icon: TrendingUp,
      value: `$${formatPrice(priceData?.price || 0)}`,
      description: 'Real-time market price',
      color: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-300',
      glowColor: 'shadow-blue-500/20'
    },
    {
      id: 'tvl',
      title: 'TVL',
      icon: Layers,
      value: `${formatTVL(protocolStats.totalLockedTokens || 0)} ARK`,
      description: 'Total Value Locked',
      color: 'from-purple-500/20 to-violet-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-300',
      glowColor: 'shadow-purple-500/20'
    },
    {
      id: 'supply',
      title: 'Total Supply',
      icon: Coins,
      value: formatNumber(contractData?.totalSupply || '0'),
      description: 'Maximum token supply',
      color: 'from-yellow-500/20 to-amber-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-300',
      glowColor: 'shadow-yellow-500/20'
    },
    {
      id: 'circulating',
      title: 'Circulating',
      icon: Activity,
      value: formatNumber(contractData?.circulatingSupply || '0'),
      description: 'Tokens in active circulation',
      color: 'from-cyan-500/20 to-teal-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-300',
      glowColor: 'shadow-cyan-500/20'
    },
    {
      id: 'burned',
      title: 'Burned',
      icon: Flame,
      value: formatNumber(contractData?.burnedTokens || '0'),
      description: 'Tokens permanently removed',
      color: 'from-red-500/20 to-orange-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-300',
      glowColor: 'shadow-red-500/20'
    }
  ], [contractData, priceData, protocolStats]);

  interface StatCardProps {
    stat: typeof statsData[0];
    index: number;
  }

  const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const IconComponent = stat.icon;

    return (
      <div
        className={`
          relative group transition-all duration-700 ease-out transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          hover:scale-105 hover:-translate-y-2
        `}
        style={{ transitionDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Container */}
        <div className={`
          relative h-40 rounded-2xl backdrop-blur-md border-2 overflow-hidden
          bg-gradient-to-br ${stat.color}
          ${stat.borderColor} hover:border-opacity-60
          transition-all duration-500 ease-out
          hover:${stat.glowColor}
        `}>

          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div
              className={`
                absolute inset-0 bg-gradient-to-br ${stat.color}
                transition-transform duration-1000 ease-out
                ${isHovered ? 'scale-110 rotate-1' : 'scale-100'}
              `}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  transition-transform duration-300
                  ${isHovered ? 'scale-110 rotate-12' : 'scale-100'}
                `}>
                  <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    {stat.title}
                  </h3>
                </div>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center gap-2">
                <div className={`
                  w-2 h-2 rounded-full bg-green-400
                  transition-all duration-1000
                  ${isHovered ? 'animate-pulse scale-125' : ''}
                `} />
                <span className="text-xs text-green-400 font-medium">LIVE</span>
              </div>
            </div>

            {/* Value Display */}
            <div className="text-center py-2">
              <div className={`
                text-2xl font-bold bg-gradient-to-r from-white to-gray-300
                bg-clip-text text-transparent transition-all duration-300 font-mono
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}>
                {contractLoading || priceLoading ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-24 mx-auto rounded" />
                ) : (
                  stat.value
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-center">
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                {stat.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`
                    h-full bg-gradient-to-r ${stat.color.replace('/20', '/60').replace('/10', '/40')}
                    rounded-full transition-all duration-1000 ease-out
                    ${isVisible ? 'w-full' : 'w-0'}
                  `}
                  style={{ transitionDelay: `${index * 150 + 600}ms` }}
                />
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-br ${stat.color.replace('/20', '/5').replace('/10', '/3')}
            opacity-0 group-hover:opacity-100 transition-opacity duration-500
            pointer-events-none
          `} />
        </div>
      </div>
    );
  };

  return (
    <section id="stats" className="relative py-16 px-6 overflow-hidden">

      {/* Subtle Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className={`
          text-center mb-12 transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm text-cyan-300 font-medium">Protocol Analytics</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ARK Statistics
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Real-time protocol metrics and token analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;