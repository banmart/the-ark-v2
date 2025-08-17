import React, { memo, useMemo, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useARKTokenData } from '../../hooks/useARKTokenData';
import { useContractData } from '../../hooks/useContractData';
import { useReflectionData } from '../../hooks/useReflectionData';
import { useLockerData } from '../../hooks/useLockerData';
import { Card, CardContent } from '../ui/card';
import { Flame, Grid3X3, Waves, Vault, TrendingUp, Shield, Zap, Lock } from 'lucide-react';

// Lazy load visualization components for better initial load
const BurnVisualization = lazy(() => import('./BurnVisualization'));
const ReflectionVisualization = lazy(() => import('./ReflectionVisualization'));
const LiquidityVisualization = lazy(() => import('./LiquidityVisualization'));
const LockerVisualization = lazy(() => import('./LockerVisualization'));

// Memoized loading skeleton component
const VisualizationSkeleton = memo(() => (
  <div className="flex-1 flex items-center justify-center">
    <div className="w-full h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg animate-pulse" />
  </div>
));

// Memoized fee card component for better performance
const FeeCard = memo(({ card, index, contractData }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 120,
        damping: 20
      }
    }
  };

  const hoverVariants = {
    hover: { 
      scale: 1.03,
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      className="group"
    >
      <Card className={`
        relative overflow-hidden h-[420px] backdrop-blur-md
        bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80
        border-2 ${card.border}
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-cyan-500/25
        group-hover:border-cyan-400/70
        before:absolute before:inset-0 before:bg-gradient-to-br before:${card.gradient} before:opacity-0 before:transition-opacity before:duration-500
        hover:before:opacity-100
      `}>
        <CardContent className="p-0 h-full flex flex-col relative z-10">
          {/* Enhanced Header with Better Visual Hierarchy */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-cyan-500/40 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <motion.div 
                  className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                >
                  {(card.efficiency * 100).toFixed(1)}%
                </motion.div>
                <div className="text-xs text-gray-400 font-medium">Efficiency</div>
              </div>
            </div>

            {/* Enhanced Data Display with Better Visual Appeal */}
            <motion.div 
              className="relative p-5 rounded-xl bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm border border-cyan-500/40 shadow-inner"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl" />
              <div className="relative z-10 text-center">
                <motion.div 
                  className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                >
                  {card.formattedAmount}
                </motion.div>
                <div className="text-sm font-semibold text-cyan-300 mb-2 flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4" />
                  {card.realData.label}
                </div>
                <div className="text-xs text-gray-300 leading-relaxed">
                  {card.realData.description}
                </div>
              </div>
              
              {/* Animated progress bar */}
              <div className="mt-4 h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${card.efficiency * 100}%` }}
                  transition={{ delay: index * 0.1 + 1, duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>

          {/* Optimized Visualization Area */}
          <div className="flex-1 relative min-h-0 p-6 pt-2">
            <Suspense fallback={<VisualizationSkeleton />}>
              {card.type === 'burn' && <BurnVisualization amount={card.realData.amount} />}
              {card.type === 'reflection' && <ReflectionVisualization amount={card.realData.amount} />}
              {card.type === 'liquidity' && <LiquidityVisualization 
                amount={card.realData.amount} 
                threshold={parseFloat(contractData?.swapSettings?.threshold || '1000000')}
              />}
              {card.type === 'locker' && <LockerVisualization amount={card.realData.amount} />}
            </Suspense>
          </div>

          {/* Enhanced Hover Effects */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            initial={false}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse" />
          </motion.div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </CardContent>
      </Card>
    </motion.div>
  );
});

const App = () => {
  const { data: arkData } = useARKTokenData();
  const { data: contractData, loading: contractLoading } = useContractData();
  const { data: reflectionData, loading: reflectionLoading } = useReflectionData();
  const { protocolStats, loading: lockerLoading } = useLockerData();

  // Memoized calculations for better performance
  const calculations = useMemo(() => {
    const formatAmount = (amount) => {
      if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
      if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
      if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`;
      return amount.toFixed(2);
    };

    const burnedTokens = parseFloat(contractData?.burnedTokens?.toString() || '0');
    const reflectionPool = parseFloat(reflectionData?.totalReflectionPool?.toString() || '0');
    const liquidityAccumulation = parseFloat(contractData?.liquidityData?.currentAccumulation?.toString() || '0');
    const totalLocked = parseFloat(protocolStats?.totalLockedTokens?.toString() || '0');
    
    const totalSupply = parseFloat(contractData?.totalSupply?.toString() || '1000000000');
    const burnEfficiency = Math.min(100, (burnedTokens / (totalSupply * 0.05)) * 100);
    const reflectionEfficiency = Math.min(100, (reflectionPool / (totalSupply * 0.02)) * 100);
    const liquidityEfficiency = Math.min(100, (liquidityAccumulation / (totalSupply * 0.01)) * 100);
    const lockerEfficiency = Math.min(100, (totalLocked / (totalSupply * 0.10)) * 100);

    return {
      formatAmount,
      burnedTokens,
      reflectionPool,
      liquidityAccumulation,
      totalLocked,
      burnEfficiency,
      reflectionEfficiency,
      liquidityEfficiency,
      lockerEfficiency
    };
  }, [contractData, reflectionData, protocolStats]);

  // Memoized fee cards data
  const feeCards = useMemo(() => [
    {
      title: '🔥 Burn Protocol',
      icon: <Flame className="h-8 w-8 text-red-400" />,
      realData: {
        amount: calculations.burnedTokens,
        label: 'Total Burned',
        description: 'Tokens permanently removed from circulation, reducing supply forever'
      },
      formattedAmount: calculations.formatAmount(calculations.burnedTokens),
      efficiency: calculations.burnEfficiency / 100,
      gradient: 'from-red-500/20 via-orange-500/10 to-transparent',
      border: 'border-red-500/40',
      type: 'burn'
    },
    {
      title: '💎 Reflection Matrix',
      icon: <Grid3X3 className="h-8 w-8 text-blue-400" />,
      realData: {
        amount: calculations.reflectionPool,
        label: 'Active Pool',
        description: 'Reflections ready for distribution to all token holders'
      },
      formattedAmount: calculations.formatAmount(calculations.reflectionPool),
      efficiency: calculations.reflectionEfficiency / 100,
      gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
      border: 'border-blue-500/40',
      type: 'reflection'
    },
    {
      title: '🌊 Liquidity Engine',
      icon: <Waves className="h-8 w-8 text-cyan-400" />,
      realData: {
        amount: calculations.liquidityAccumulation,
        label: 'Accumulation',
        description: 'Tokens collected for next liquidity swap, strengthening the pool'
      },
      formattedAmount: calculations.formatAmount(calculations.liquidityAccumulation),
      efficiency: calculations.liquidityEfficiency / 100,
      gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
      border: 'border-cyan-500/40',
      type: 'liquidity'
    },
    {
      title: '🔒 Locker Rewards',
      icon: <Vault className="h-8 w-8 text-purple-400" />,
      realData: {
        amount: calculations.totalLocked,
        label: 'Total Locked',
        description: 'Tokens secured in locker protocol, earning additional rewards'
      },
      formattedAmount: calculations.formatAmount(calculations.totalLocked),
      efficiency: calculations.lockerEfficiency / 100,
      gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
      border: 'border-purple-500/40',
      type: 'locker'
    }
  ], [calculations]);

  const isLoading = contractLoading || reflectionLoading || lockerLoading;

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6"
          >
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-300 font-medium">PulseChain Token Features</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Quantum Fee Distribution
          </h2>
          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed">
            Experience real-time blockchain fee mechanics with immersive visualizations showcasing our 9% maximum fee structure
          </p>
          
          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 inline-flex items-center gap-2 text-cyan-400"
            >
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading live data...</span>
            </motion.div>
          )}
        </motion.div>

        {/* Optimized Fee Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {feeCards.map((card, index) => (
            <FeeCard 
              key={card.title} 
              card={card} 
              index={index} 
              contractData={contractData}
            />
          ))}
        </div>

        {/* Enhanced Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/40 backdrop-blur-sm">
            <motion.div 
              className="w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Lock className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-300 font-semibold">Live PulseChain Data • Updates Every 3 Minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default App;