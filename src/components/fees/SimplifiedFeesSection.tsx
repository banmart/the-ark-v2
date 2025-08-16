import React from 'react';
import { useFeeMetrics } from '../../hooks/useFeeMetrics';
import { useARKTokenData } from '../../hooks/useARKTokenData';
import { useContractData } from '../../hooks/useContractData';
import FeeCard from './FeeCard';
import FeeCalculator from './FeeCalculator';
import AutoLiquidityMeter from '../AutoLiquidityMeter';
import ReflectionMatrixMeter from './ReflectionMatrixMeter';
import { motion } from 'framer-motion';

const SimplifiedFeesSection = () => {
  const { data: arkData } = useARKTokenData();
  const volume24h = typeof arkData?.volume24h === 'number' ? arkData.volume24h : 0;
  const { feeMetrics, loading, error } = useFeeMetrics(volume24h);
  const { data: contractData, loading: contractLoading } = useContractData();

  if (loading || contractLoading) {
    return (
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted/20 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !feeMetrics) {
    return null;
  }

  const feeTypes = [
    {
      type: 'burn',
      title: 'Burn Fee',
      data: {
        daily: feeMetrics.feesCollected.burn.dailyFees,
        total: feeMetrics.feesCollected.burn.totalCollected,
        rate: feeMetrics.feesCollected.burn.rate
      },
      color: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30',
      icon: '🔥'
    },
    {
      type: 'reflection',
      title: 'Reflection',
      data: {
        daily: feeMetrics.feesCollected.reflection.dailyFees,
        total: feeMetrics.feesCollected.reflection.totalCollected,
        rate: feeMetrics.feesCollected.reflection.rate
      },
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      icon: '💎'
    },
    {
      type: 'liquidity',
      title: 'Liquidity',
      data: {
        daily: feeMetrics.feesCollected.liquidity.dailyFees,
        total: feeMetrics.feesCollected.liquidity.totalCollected,
        rate: feeMetrics.feesCollected.liquidity.rate
      },
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      icon: '🌊'
    },
    {
      type: 'locker',
      title: 'Locker',
      data: {
        daily: feeMetrics.feesCollected.locker.dailyFees,
        total: feeMetrics.feesCollected.locker.totalCollected,
        rate: feeMetrics.feesCollected.locker.rate
      },
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      icon: '🔒'
    }
  ];

  return (
    <section className="relative py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Live Fee Analytics
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time fee collection and distribution powered by blockchain data
          </p>
        </motion.div>

        {/* Fee Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {feeTypes.map((fee, index) => {
            // Enhanced liquidity card with AutoLiquidityMeter
            if (fee.type === 'liquidity') {
              return (
                <motion.div
                  key={fee.type}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="relative h-full">
                    <FeeCard 
                      {...fee}
                      efficiency={feeMetrics.efficiency[fee.type as keyof typeof feeMetrics.efficiency] || 0}
                      animationDelay={index * 0.1}
                    />
                    
                    {/* Liquidity Engine Meter */}
                    {contractData && (
                      <div className="mt-4">
                        <AutoLiquidityMeter
                          currentAccumulation={parseFloat(contractData.liquidityData.currentAccumulation) || 0}
                          threshold={parseFloat(contractData.swapSettings.threshold) || 1000000}
                          loading={contractLoading}
                          isThresholdReached={contractData.liquidityData.isThresholdReached || false}
                          isPendingSwap={contractData.liquidityData.isPendingSwap || false}
                          lastSwapTimestamp={contractData.liquidityData.lastSwapTimestamp || 0}
                          estimatedNextSwap={contractData.liquidityData.estimatedNextSwap || null}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            }

            // Enhanced reflection card with ReflectionMatrixMeter
            if (fee.type === 'reflection') {
              return (
                <motion.div
                  key={fee.type}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="relative h-full">
                    <FeeCard 
                      {...fee}
                      efficiency={feeMetrics.efficiency[fee.type as keyof typeof feeMetrics.efficiency] || 0}
                      animationDelay={index * 0.1}
                    />
                    
                    {/* Reflection Matrix Meter */}
                    <div className="mt-4">
                      <ReflectionMatrixMeter />
                    </div>
                  </div>
                </motion.div>
              );
            }
            
            // Regular fee cards for other types
            return (
              <FeeCard 
                key={fee.type}
                {...fee}
                efficiency={feeMetrics.efficiency[fee.type as keyof typeof feeMetrics.efficiency] || 0}
                animationDelay={index * 0.1}
              />
            );
          })}
        </motion.div>

        {/* Fee Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FeeCalculator 
            currentVolume={volume24h}
            feeMetrics={feeMetrics}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default SimplifiedFeesSection;