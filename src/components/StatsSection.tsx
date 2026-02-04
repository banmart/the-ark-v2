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
      
      {/* Glass card */}
      <div className={`relative h-full p-6 
        bg-white/[0.02] backdrop-blur-xl 
        border border-white/[0.06] ${accentClasses.border}
        rounded-2xl
        transition-all duration-500 ease-out
        group-hover:bg-white/[0.04]
        group-hover:shadow-2xl ${accentClasses.glow}
        group-hover:-translate-y-1
      `}>
        {/* Top edge highlight */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
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
    cyan: { icon: 'text-cyan-400', glow: 'shadow-cyan-500/20', border: 'group-hover:border-cyan-500/40' },
    emerald: { icon: 'text-emerald-400', glow: 'shadow-emerald-500/20', border: 'group-hover:border-emerald-500/40' },
    blue: { icon: 'text-blue-400', glow: 'shadow-blue-500/20', border: 'group-hover:border-blue-500/40' },
    violet: { icon: 'text-violet-400', glow: 'shadow-violet-500/20', border: 'group-hover:border-violet-500/40' },
    amber: { icon: 'text-amber-400', glow: 'shadow-amber-500/20', border: 'group-hover:border-amber-500/40' },
    orange: { icon: 'text-orange-400', glow: 'shadow-orange-500/20', border: 'group-hover:border-orange-500/40' }
  };
  return colors[color] || colors.cyan;
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
        label: 'MARKET CAP',
        value: hasData ? `$${formatNumber(arkData.marketCap)}` : null,
        subtitle: `${arkData?.dataSource || 'ARK/PLS PulseX'} • Circulating supply`,
        placeholder: '$---.--M',
        accentColor: 'cyan'
      },
      {
        id: 'price',
        icon: TrendingUp,
        label: 'PRICE FEED',
        value: hasData ? `$${arkData.price.toFixed(6)}` : null,
        subtitle: `${arkData?.dataSource || 'ARK/PLS PulseX'} • Live price`,
        placeholder: '$--.----',
        accentColor: 'emerald'
      },
      {
        id: 'tvl',
        icon: Layers,
        label: 'TVL',
        value: protocolStats.totalLockedTokens ? `${formatTVL(protocolStats.totalLockedTokens)} ARK` : null,
        subtitle: 'Total Tokens Locked',
        placeholder: '$---.--M',
        accentColor: 'blue'
      },
      {
        id: 'totalSupply',
        icon: Coins,
        label: 'TOTAL SUPPLY',
        value: hasData ? formatNumber(arkData.totalSupply) : null,
        subtitle: 'Maximum token supply',
        placeholder: '---.--B',
        accentColor: 'violet'
      },
      {
        id: 'circulating',
        icon: Activity,
        label: 'CIRCULATING',
        value: hasData ? formatNumber(arkData.circulatingSupply) : null,
        subtitle: 'Tokens in active circulation',
        placeholder: '---.--B',
        accentColor: 'amber'
      },
      {
        id: 'burned',
        icon: Flame,
        label: 'BURNED',
        value: hasData ? formatNumber(arkData.burnedTokens) : null,
        subtitle: 'Tokens permanently removed',
        placeholder: '---.--M',
        accentColor: 'orange'
      }
    ];
  }, [arkData, arkLoading, protocolStats.totalLockedTokens, formatNumber, formatTVL]);

  // Derived state for visibility (rule: rerender-derived-state)
  const isVisible = statsPhase >= 2;
  const showHeader = statsPhase >= 1;

  return (
    <section id="stats" className="relative z-30 py-16 md:py-24 lg:py-32 px-4 md:px-6 overflow-hidden">
      {/* Premium Background Layers */}
      
      {/* Deep vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[150px]" />
      
      {/* Film grain texture */}
      <div className="absolute inset-0 opacity-[0.015] film-grain pointer-events-none" />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />

      {/* Floating particles - hoisted static JSX (rule: rendering-hoist-jsx) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.key}
            className="absolute w-1 h-1 rounded-full particle-drift"
            style={{
              left: particle.left,
              top: particle.top,
              background: particle.background,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 transition-all duration-1000 ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="space-y-2">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 tracking-wider drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              PROTOCOL METRICS
            </h2>
            {/* Accent line */}
            <div className="h-px w-32 bg-gradient-to-r from-cyan-500/60 via-cyan-400/30 to-transparent" />
            {arkData && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground/60 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 animate-pulse" />
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
              text-cyan-400/80 hover:text-cyan-300
              hover:bg-white/[0.06] hover:border-cyan-500/30
              transition-all duration-500 ease-out
              shadow-lg shadow-black/20
              hover:shadow-cyan-500/10" 
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
