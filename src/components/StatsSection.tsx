import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Layers, Coins, Activity, Flame, RefreshCw } from 'lucide-react';
import { useLockerData } from '../hooks/useLockerData';
import { useARKData } from '../contexts/ARKDataContext';

interface StatsSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const StatsSection = ({ contractData, contractLoading }: StatsSectionProps) => {
  const [statsPhase, setStatsPhase] = useState(0);
  const { protocolStats } = useLockerData();
  const { data: arkData, loading: arkLoading, refetch, error } = useARKData();

  useEffect(() => {
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 800, phase: 2 },
      { delay: 1400, phase: 3 }
    ];
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setStatsPhase(phase), delay);
    });
  }, []);

  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000) return `${(tvl / 1000000).toFixed(2)}M`;
    if (tvl >= 1000) return `${(tvl / 1000).toFixed(2)}K`;
    return tvl.toFixed(2);
  };

  const formatNumber = (num: string | number) => {
    const numValue = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    if (isNaN(numValue)) return '0';
    if (numValue >= 1000000000) return `${(numValue / 1000000000).toFixed(2)}B`;
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(2)}M`;
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(2)}K`;
    return numValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const statsCards = [
    { id: 'marketCap', icon: DollarSign, label: 'MARKET CAP', value: arkLoading || !arkData ? null : `$${formatNumber(arkData.marketCap)}`, subtitle: 'Circulating supply', placeholder: '$---.--M' },
    { id: 'price', icon: TrendingUp, label: 'PRICE', value: arkLoading || !arkData ? null : `$${arkData.price.toFixed(6)}`, subtitle: 'Live price feed', placeholder: '$--.----' },
    { id: 'tvl', icon: Layers, label: 'TVL', value: protocolStats.totalLockedTokens ? `${formatTVL(protocolStats.totalLockedTokens)} ARK` : null, subtitle: 'Total locked', placeholder: '$---.--M' },
    { id: 'totalSupply', icon: Coins, label: 'TOTAL SUPPLY', value: arkLoading || !arkData ? null : formatNumber(arkData.totalSupply), subtitle: 'Maximum supply', placeholder: '---.--B' },
    { id: 'circulating', icon: Activity, label: 'CIRCULATING', value: arkLoading || !arkData ? null : formatNumber(arkData.circulatingSupply), subtitle: 'Active circulation', placeholder: '---.--B' },
    { id: 'burned', icon: Flame, label: 'BURNED', value: arkLoading || !arkData ? null : formatNumber(arkData.burnedTokens), subtitle: 'Permanently removed', placeholder: '---.--M' }
  ];

  return (
    <section id="stats" className="relative z-30 py-20 md:py-32 px-4 md:px-6 overflow-hidden bg-ark-obsidian">
      {/* Subtle texture */}
      <div className="absolute inset-0 stone-texture opacity-30" />
      
      {/* Gold accent glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-ark-gold/5 rounded-full blur-[150px] animate-gold-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Editorial Style */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="w-16 h-1 bg-ark-gold mb-6" />
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-ark-ivory tracking-tight">
              PROTOCOL<br />
              <span className="text-ark-gold">METRICS</span>
            </h2>
          </div>
          
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 border border-ark-stone/30 text-ark-stone hover:text-ark-gold hover:border-ark-gold/50 transition-colors duration-300 self-start md:self-auto"
          >
            <RefreshCw size={16} />
            <span className="text-brutal-label">REFRESH</span>
          </button>
        </div>
        
        {/* Stats Grid - Brutalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={stat.id}
              className={`group relative bg-ark-charcoal/80 border-l-4 border-ark-gold p-6
                transition-all duration-500 hover:translate-x-1 hover:-translate-y-1
                shadow-brutal hover:shadow-brutal-gold
                opacity-0 ${statsPhase >= 1 ? 'animate-reveal-up' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-ark-stone/20 group-hover:border-ark-gold/30 transition-colors" />
              
              {/* Icon & Label */}
              <div className="flex items-center gap-3 mb-4">
                <stat.icon className="w-5 h-5 text-ark-gold" />
                <span className="text-brutal-label text-ark-stone">{stat.label}</span>
              </div>
              
              {/* Value - Large Display */}
              <div className="text-stat-display text-ark-ivory mb-2">
                {stat.value || stat.placeholder}
              </div>
              
              {/* Subtitle */}
              <p className="font-serif text-sm text-ark-stone italic">{stat.subtitle}</p>
              
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-4 right-0 h-px bg-gradient-to-r from-ark-gold/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
