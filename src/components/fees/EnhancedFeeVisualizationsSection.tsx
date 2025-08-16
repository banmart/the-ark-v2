import React from 'react';
import { motion } from 'framer-motion';
import { useFeeMetrics } from '../../hooks/useFeeMetrics';
import { useARKTokenData } from '../../hooks/useARKTokenData';
import { useContractData } from '../../hooks/useContractData';
import { Card, CardContent } from '../ui/card';
import { Flame, Sparkles, Waves, Vault } from 'lucide-react';
import BurnProtocolVisualization from './BurnProtocolVisualization';
import LockerRewardsVisualization from './LockerRewardsVisualization';
import ReflectionMatrixMeter from './ReflectionMatrixMeter';
import AutoLiquidityMeter from '../AutoLiquidityMeter';

const EnhancedFeeVisualizationsSection = () => {
  const { data: arkData } = useARKTokenData();
  const volume24h = typeof arkData?.volume24h === 'number' ? arkData.volume24h : 0;
  const { feeMetrics, loading, error } = useFeeMetrics(volume24h);
  const { data: contractData, loading: contractLoading } = useContractData();

  if (loading || contractLoading) {
    return (
      <section className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted/20 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !feeMetrics) {
    return null;
  }

  const formatAmount = (amount: number) => {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`;
    return amount.toFixed(2);
  };

  const feeCards = [
    {
      title: 'Burn Protocol',
      icon: <Flame className="h-8 w-8 text-destructive" />,
      daily: feeMetrics.feesCollected.burn.dailyFees,
      total: feeMetrics.feesCollected.burn.totalCollected,
      efficiency: feeMetrics.efficiency.burn || 0,
      gradient: 'from-destructive/20 via-destructive/10 to-transparent',
      border: 'border-destructive/30',
      visualization: (
        <BurnProtocolVisualization
          dailyBurn={feeMetrics.feesCollected.burn.dailyFees}
          totalBurned={feeMetrics.feesCollected.burn.totalCollected}
          efficiency={feeMetrics.efficiency.burn || 0}
        />
      )
    },
    {
      title: 'Reflection Matrix',
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      daily: feeMetrics.feesCollected.reflection.dailyFees,
      total: feeMetrics.feesCollected.reflection.totalCollected,
      efficiency: feeMetrics.efficiency.reflection || 0,
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      border: 'border-primary/30',
      visualization: <ReflectionMatrixMeter />
    },
    {
      title: 'Liquidity Engine',
      icon: <Waves className="h-8 w-8 text-accent" />,
      daily: feeMetrics.feesCollected.liquidity.dailyFees,
      total: feeMetrics.feesCollected.liquidity.totalCollected,
      efficiency: feeMetrics.efficiency.liquidity || 0,
      gradient: 'from-accent/20 via-accent/10 to-transparent',
      border: 'border-accent/30',
      visualization: contractData && (
        <AutoLiquidityMeter
          currentAccumulation={parseFloat(contractData.liquidityData.currentAccumulation) || 0}
          threshold={parseFloat(contractData.swapSettings.threshold) || 1000000}
          loading={contractLoading}
          isThresholdReached={contractData.liquidityData.isThresholdReached || false}
          isPendingSwap={contractData.liquidityData.isPendingSwap || false}
          lastSwapTimestamp={contractData.liquidityData.lastSwapTimestamp || 0}
          estimatedNextSwap={contractData.liquidityData.estimatedNextSwap || null}
        />
      )
    },
    {
      title: 'Locker Rewards',
      icon: <Vault className="h-8 w-8 text-secondary" />,
      daily: feeMetrics.feesCollected.locker.dailyFees,
      total: feeMetrics.feesCollected.locker.totalCollected,
      efficiency: feeMetrics.efficiency.locker || 0,
      gradient: 'from-secondary/20 via-secondary/10 to-transparent',
      border: 'border-secondary/30',
      visualization: (
        <LockerRewardsVisualization
          dailyRewards={feeMetrics.feesCollected.locker.dailyFees}
          totalLocked={feeMetrics.feesCollected.locker.totalCollected}
          efficiency={feeMetrics.efficiency.locker || 0}
        />
      )
    }
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Section Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Live Fee Protocol Visualizations
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Real-time blockchain fee mechanics with immersive visualizations
          </p>
        </motion.div>

        {/* Enhanced Fee Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {feeCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <Card className={`
                relative overflow-hidden h-80 backdrop-blur-sm
                bg-gradient-to-br ${card.gradient}
                border-2 ${card.border}
                transition-all duration-500
                hover:shadow-2xl hover:shadow-primary/20
                group-hover:border-opacity-60
              `}>
                <CardContent className="p-6 h-full flex flex-col relative">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background/20 backdrop-blur-sm">
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        {(card.efficiency * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex justify-between mb-4 relative z-10">
                    <div>
                      <div className="text-sm text-muted-foreground">Daily</div>
                      <div className="text-lg font-semibold text-foreground">
                        {formatAmount(card.daily)} ARK
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="text-lg font-semibold text-foreground">
                        {formatAmount(card.total)} ARK
                      </div>
                    </div>
                  </div>

                  {/* Visualization Area */}
                  <div className="flex-1 relative min-h-0">
                    {card.visualization}
                  </div>

                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Real-time Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-primary font-medium">Live Data • Updates Every 15s</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedFeeVisualizationsSection;