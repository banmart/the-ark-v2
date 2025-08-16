import React from 'react';
import { motion } from 'framer-motion';
import { useARKTokenData } from '../../hooks/useARKTokenData';
import { useContractData } from '../../hooks/useContractData';
import { useReflectionData } from '../../hooks/useReflectionData';
import { useLockerData } from '../../hooks/useLockerData';
import { Card, CardContent } from '../ui/card';
import { Flame, Grid3X3, Waves, Vault } from 'lucide-react';
import BurnVisualization from './BurnVisualization';
import ReflectionVisualization from './ReflectionVisualization';
import LiquidityVisualization from './LiquidityVisualization';
import LockerVisualization from './LockerVisualization';

const EnhancedFeeVisualizationsSection = () => {
  const { data: arkData } = useARKTokenData();
  const { data: contractData, loading: contractLoading } = useContractData();
  const { data: reflectionData, loading: reflectionLoading } = useReflectionData();
  const { protocolStats, loading: lockerLoading } = useLockerData();

  // Always show the section with fallback data

  const formatAmount = (amount: number) => {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`;
    return amount.toFixed(2);
  };

  // Get real blockchain data for each fee type
  const burnedTokens = parseFloat(contractData?.burnedTokens?.toString() || '0');
  const reflectionPool = parseFloat(reflectionData?.totalReflectionPool?.toString() || '0');
  const liquidityAccumulation = parseFloat(contractData?.liquidityData?.currentAccumulation?.toString() || '0');
  const totalLocked = parseFloat(protocolStats?.totalLockedTokens?.toString() || '0');
  
  // Calculate simple efficiency metrics based on relative performance
  const totalSupply = parseFloat(contractData?.totalSupply?.toString() || '1000000000');
  const burnEfficiency = Math.min(100, (burnedTokens / (totalSupply * 0.05)) * 100); // 5% burn target
  const reflectionEfficiency = Math.min(100, (reflectionPool / (totalSupply * 0.02)) * 100); // 2% reflection target
  const liquidityEfficiency = Math.min(100, (liquidityAccumulation / (totalSupply * 0.01)) * 100); // 1% liquidity target
  const lockerEfficiency = Math.min(100, (totalLocked / (totalSupply * 0.10)) * 100); // 10% locked target

  const feeCards = [
    {
      title: '2% Burn Protocol',
      icon: <Flame className="h-8 w-8 text-destructive" />,
      realData: {
        amount: burnedTokens,
        label: 'Total Burned',
        description: 'Tokens permanently removed from circulation'
      },
      efficiency: burnEfficiency / 100,
      gradient: 'from-destructive/20 via-destructive/10 to-transparent',
      border: 'border-destructive/30',
      type: 'burn'
    },
    {
      title: 'Reflection Matrix',
      icon: <Grid3X3 className="h-8 w-8 text-primary" />,
      realData: {
        amount: reflectionPool,
        label: 'Active Pool',
        description: 'Reflections ready for distribution'
      },
      efficiency: reflectionEfficiency / 100,
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      border: 'border-primary/30',
      type: 'reflection'
    },
    {
      title: '3% Liquidity Engine',
      icon: <Waves className="h-8 w-8 text-accent" />,
      realData: {
        amount: liquidityAccumulation,
        label: 'Accumulation',
        description: 'Tokens collected for next liquidity swap'
      },
      efficiency: liquidityEfficiency / 100,
      gradient: 'from-accent/20 via-accent/10 to-transparent',
      border: 'border-accent/30',
      type: 'liquidity'
    },
    {
      title: 'Locker Rewards',
      icon: <Vault className="h-8 w-8 text-secondary" />,
      realData: {
        amount: totalLocked,
        label: 'Total Locked',
        description: 'Tokens secured in locker protocol'
      },
      efficiency: lockerEfficiency / 100,
      gradient: 'from-secondary/20 via-secondary/10 to-transparent',
      border: 'border-secondary/30',
      type: 'locker'
    }
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Transparent background - shows website background */}
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Live Fee Protocol Visualizations
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
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
                relative overflow-hidden h-96 backdrop-blur-sm
                bg-black/20 
                border-2 border-cyan-500/30
                transition-all duration-500
                hover:shadow-2xl hover:shadow-cyan-500/20
                group-hover:border-cyan-400/60
              `}>
                <CardContent className="p-0 h-full flex flex-col relative">
                  {/* Card Header with Real Data */}
                  <div className="p-6 pb-4 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-cyan-500/30">
                          {card.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{card.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {(card.efficiency * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">Efficiency</div>
                      </div>
                    </div>

                    {/* Prominent Real Data Display */}
                    <div className="text-center p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-cyan-500/30">
                      <div className="text-3xl font-bold text-white mb-1">
                        {formatAmount(card.realData.amount)}
                      </div>
                      <div className="text-sm font-medium text-gray-200 mb-1">
                        {card.realData.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {card.realData.description}
                      </div>
                    </div>
                  </div>

                  {/* Unique Visualization Area */}
                  <div className="flex-1 relative min-h-0 p-6 pt-0">
                    {card.type === 'burn' && <BurnVisualization amount={card.realData.amount} />}
                    {card.type === 'reflection' && <ReflectionVisualization amount={card.realData.amount} />}
                    {card.type === 'liquidity' && <LiquidityVisualization 
                      amount={card.realData.amount} 
                      threshold={parseFloat(contractData?.swapSettings.threshold || '1000000')}
                    />}
                    {card.type === 'locker' && <LockerVisualization amount={card.realData.amount} />}
                  </div>

                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm text-blue-300 font-medium">Live Data • Updates Every 15s</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedFeeVisualizationsSection;