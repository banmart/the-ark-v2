import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { DollarSign, TrendingUp, Layers, Coins, Activity, Flame, RefreshCw } from 'lucide-react';
import { useLockerData } from '../hooks/useLockerData';
import { useARKData } from '../contexts/ARKDataContext';

interface StatsSectionProps {
  contractData: any;
  contractLoading: boolean;
}

// Memoized stat card component (rule: rerender-memo)
const StatCard = memo(({ 
  stat, 
  index, 
  isVisible 
}: { 
  stat: any; 
  index: number; 
  isVisible: boolean;
}) => {
  const Icon = stat.icon;
  const accentClasses = getAccentClasses(stat.accentColor);
  
  return (
    <div
      className={`group relative transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      {/* Outer glow ring on hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      {/* Glass card - Using global Liquid Glass Utility */}
      <div className={`relative h-full p-8 liquid-glass
        rounded-3xl
        transition-all duration-700 ease-out
        hover:bg-white/[0.04]
        group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        group-hover:-translate-y-2
      `}>
        {/* Top edge highlight highlight */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {/* Icon with glow */}
          <div className="relative p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] group-hover:border-white/[0.1] transition-all duration-500">
            <Icon className={`h-6 w-6 ${accentClasses.icon} transition-all duration-500 group-hover:scale-110`} />
            {/* Icon glow */}
            <div className={`absolute inset-0 rounded-xl ${accentClasses.icon} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500`} />
          </div>
          
          <p className="text-xs text-white/60 font-mono tracking-[0.2em] uppercase">
            {stat.label}
          </p>
        </div>
        
        {/* Value */}
        <div className="space-y-2">
          <p className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight transition-colors duration-300">
            {stat.value ?? <span className="animate-pulse text-white/40">{stat.placeholder}</span>}
          </p>
          <p className="text-xs text-white/50 font-mono tracking-wide">
            {stat.subtitle}
          </p>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-500" />
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

// Hoist static accent classes outside component (rule: rendering-hoist-jsx)
const getAccentClasses = (color: string) => {
  const colors: Record<string, { icon: string; glow: string; border: string }> = {
    gold: { icon: 'text-ark-gold-400', glow: 'shadow-ark-gold-500/20', border: 'group-hover:border-ark-gold-500/40' },
    emerald: { icon: 'text-emerald-400', glow: 'shadow-emerald-500/20', border: 'group-hover:border-emerald-500/40' },
    white: { icon: 'text-white/80', glow: 'shadow-white/20', border: 'group-hover:border-white/40' },
    violet: { icon: 'text-purple-400', glow: 'shadow-purple-500/20', border: 'group-hover:border-purple-500/40' },
    amber: { icon: 'text-ark-gold-400', glow: 'shadow-ark-gold-400/20', border: 'group-hover:border-ark-gold-400/40' },
    orange: { icon: 'text-ark-gold-600', glow: 'shadow-ark-gold-600/20', border: 'group-hover:border-ark-gold-600/40' }
  };
  return colors[color] || colors.gold;
};

// Hoist static particles outside component (rule: rendering-hoist-jsx)
const particles = [...Array(10)].map((_, i) => ({
  key: i,
  left: `${10 + (i * 9)}%`,
  top: `${20 + (i * 7) % 60}%`,
  background: i % 2 === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(251, 191, 36, 0.3)',
  animationDelay: `${i * 0.7}s`,
  animationDuration: `${8 + (i % 4)}s`
}));

const StatsSection = memo(({
  contractData,
  contractLoading
}: StatsSectionProps) => {
  const [statsPhase, setStatsPhase] = useState(0);
  const { protocolStats } = useLockerData();
  const { data: arkData, loading: arkLoading, refetch, error } = useARKData();

  // Use refs for transient animation values (rule: rerender-use-ref-transient-values)
  useEffect(() => {
    // Cinematic reveal sequence with cleanup
    const timeoutIds: NodeJS.Timeout[] = [];
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 800, phase: 2 },
      { delay: 1400, phase: 3 }
    ];
    phases.forEach(({ delay, phase }) => {
      const id = setTimeout(() => setStatsPhase(phase), delay);
      timeoutIds.push(id);
    });
    
    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  // Memoized formatters (rule: js-cache-function-results)
  const formatLastUpdated = useCallback((date: Date) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  }, []);

  const formatTVL = useCallback((tvl: number) => {
    if (tvl >= 1000000) return `${(tvl / 1000000).toFixed(2)}M`;
    if (tvl >= 1000) return `${(tvl / 1000).toFixed(2)}K`;
    return tvl.toFixed(2);
  }, []);

  const formatNumber = useCallback((num: string | number) => {
    const numValue = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    if (isNaN(numValue)) return '0';
    if (numValue >= 1000000000) return `${(numValue / 1000000000).toFixed(2)}B`;
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(2)}M`;
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(2)}K`;
    return numValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }, []);

  // Memoized stats cards (rule: rerender-memo)
  const statsCards = useMemo(() => {
    // Derive boolean from data to minimize re-renders (rule: rerender-derived-state)
    const hasData = !arkLoading && arkData !== null;
    
    return [
      {
        id: 'marketCap',
        icon: DollarSign,
        label: 'MARKET COVENANT',
        value: hasData ? `$${formatNumber(arkData.marketCap)}` : null,
        subtitle: `${arkData?.dataSource || 'ARK/PLS PulseX'} • Inscribed Value`,
        placeholder: '$---.--M',
        accentColor: 'gold'
      },
      {
        id: 'price',
        icon: TrendingUp,
        label: 'SACRED TENTH',
        value: hasData ? `$${arkData.price.toFixed(6)}` : null,
        subtitle: `${arkData?.dataSource || 'ARK/PLS PulseX'} • Oracle Feed`,
        placeholder: '$--.----',
        accentColor: 'emerald'
      },
      {
        id: 'tvl',
        icon: Layers,
        label: 'VAULTED SANCTITY',
        value: protocolStats.totalLockedTokens ? `${formatTVL(protocolStats.totalLockedTokens)} ARK` : null,
        subtitle: 'Tokens Bound by Covenant',
        placeholder: '---.--M',
        accentColor: 'white'
      },
      {
        id: 'totalSupply',
        icon: Coins,
        label: 'ETERNAL SUPPLY',
        value: hasData ? formatNumber(arkData.totalSupply) : null,
        subtitle: 'Statute Maxima',
        placeholder: '---.--B',
        accentColor: 'violet'
      },
      {
        id: 'circulating',
        icon: Activity,
        label: 'THE FAITHFUL',
        value: hasData ? formatNumber(arkData.circulatingSupply) : null,
        subtitle: 'Tokens in active stewardship',
        placeholder: '---.--B',
        accentColor: 'amber'
      },
      {
        id: 'burned',
        icon: Flame,
        label: 'SACRIFICED',
        value: hasData ? formatNumber(arkData.burnedTokens) : null,
        subtitle: 'Purified through the Void',
        placeholder: '---.--M',
        accentColor: 'orange'
      }
    ];
  }, [arkData, arkLoading, protocolStats.totalLockedTokens, formatNumber, formatTVL]);

  // Derived state for visibility (rule: rerender-derived-state)
  const isVisible = statsPhase >= 2;
  const showHeader = statsPhase >= 1;

  return (
    <section id="stats" className="relative z-30 py-24 md:py-32 px-4 md:px-6 bg-black">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Section Heading - Moved from Hero */}
        <div className={`text-center mb-24 transition-all duration-1000 ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-white text-lg md:text-2xl font-black tracking-[0.6em] uppercase">
            IMMUTABLE STATUTES OF WEALTH PRESERVATION
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="h-px w-24 bg-white/20" />
          </div>
        </div>

        {/* Protocol metrics header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 transition-all duration-1000 ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="space-y-2">
            <h3 className="text-white/40 tracking-[0.3em] font-mono text-[10px] md:text-xs uppercase">
              COVENANT METRICS
            </h3>
            {/* Accent line */}
            <div className="h-px w-32 bg-gradient-to-r from-ark-gold-400/60 via-ark-gold-500/30 to-transparent" />
            {arkData && (
              <div className="flex items-center gap-2 text-sm text-white/40 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-ark-gold-500/60 animate-pulse" />
                <span>Updated {formatLastUpdated(arkData.lastUpdated)}</span>
                {arkData.isStale && <span className="text-amber-400/80 text-xs">(stale)</span>}
              </div>
            )}
          </div>
          
          {/* Glassmorphism refresh button */}
          <button 
            onClick={refetch} 
            className="group flex items-center gap-2 px-4 py-2.5 
              bg-white/[0.03] backdrop-blur-xl 
              border border-white/[0.08] rounded-xl
              text-ark-gold-400/80 hover:text-ark-gold-300
              hover:bg-white/[0.06] hover:border-ark-gold-500/30
              transition-all duration-500 ease-out
              shadow-lg shadow-black/20
              hover:shadow-ark-gold-500/10" 
            disabled={arkLoading}
          >
            <RefreshCw className={`h-4 w-4 transition-transform duration-700 ${arkLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span className="text-sm font-medium tracking-wide">Refresh</span>
          </button>
        </div>

        {/* Premium Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {statsCards.map((stat, index) => (
            <StatCard 
              key={stat.id} 
              stat={stat} 
              index={index} 
              isVisible={isVisible} 
            />
          ))}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';

export default StatsSection;
