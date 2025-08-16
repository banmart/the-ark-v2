import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReflectionData } from '../../hooks/useReflectionData';
import { useWallet } from '../../hooks/useWallet';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Users, Zap, TrendingUp, Calculator } from 'lucide-react';

interface ReflectionMatrixMeterProps {
  className?: string;
}

const ReflectionMatrixMeter: React.FC<ReflectionMatrixMeterProps> = ({ className }) => {
  const { data: reflectionData, loading } = useReflectionData();
  const { account, isConnected } = useWallet();
  const [matrixNodes, setMatrixNodes] = useState<Array<{ id: number; active: boolean; pulse: boolean }>>([]);
  const [flowParticles, setFlowParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);

  // Initialize matrix grid
  useEffect(() => {
    const nodes = Array.from({ length: 64 }, (_, i) => ({
      id: i,
      active: Math.random() > 0.3,
      pulse: Math.random() > 0.7
    }));
    setMatrixNodes(nodes);

    const interval = setInterval(() => {
      setMatrixNodes(prev => prev.map(node => ({
        ...node,
        active: Math.random() > 0.4,
        pulse: Math.random() > 0.8
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Animate reflection flow particles
  useEffect(() => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random()
    }));
    setFlowParticles(particles);

    const interval = setInterval(() => {
      setFlowParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + 1) % 100,
        y: (particle.y + 0.5) % 100,
        opacity: 0.3 + Math.sin(Date.now() * 0.003 + particle.id) * 0.3
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const formatAmount = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(2);
  };

  const formatRate = (rate: number): string => {
    return `${rate.toFixed(4)}%`;
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-blue-500/20 rounded"></div>
          <div className="h-8 bg-blue-500/20 rounded"></div>
          <div className="h-4 bg-blue-500/20 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20 p-4 ${className}`}>
      {/* Matrix Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full gap-[1px]">
          {matrixNodes.map((node) => (
            <motion.div
              key={node.id}
              className={`rounded-[1px] ${
                node.active 
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                  : 'bg-blue-900/20'
              }`}
              animate={{
                opacity: node.active ? (node.pulse ? [0.3, 1, 0.3] : 0.6) : 0.1,
                scale: node.pulse ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: node.pulse ? 1.5 : 2,
                repeat: node.pulse ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Flow Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {flowParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              boxShadow: [
                '0 0 4px #60a5fa',
                '0 0 8px #60a5fa',
                '0 0 4px #60a5fa'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">REFLECTION MATRIX</span>
          </div>
          <Badge 
            variant="outline" 
            className="border-blue-500/30 text-blue-400 bg-blue-500/10"
          >
            {reflectionData.efficiency.toFixed(1)}% Efficiency
          </Badge>
        </div>

        {/* Central Pulse Hub */}
        <div className="relative">
          <motion.div
            className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(96, 165, 250, 0.7)',
                '0 0 0 20px rgba(96, 165, 250, 0)',
                '0 0 0 0 rgba(96, 165, 250, 0.7)'
              ],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white font-bold text-xs">POOL</span>
          </motion.div>
          
          {/* Pool Size */}
          <div className="text-center mt-2">
            <div className="text-xl font-bold text-blue-400">
              {formatAmount(reflectionData.poolSize)} ARK
            </div>
            <div className="text-xs text-muted-foreground">Current Pool</div>
          </div>
        </div>

        <Separator className="bg-blue-500/20" />

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-blue-400" />
              <span className="text-muted-foreground">Active Holders</span>
            </div>
            <div className="font-semibold text-blue-400">
              {reflectionData.totalHolders.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-400" />
              <span className="text-muted-foreground">Distribution Rate</span>
            </div>
            <div className="font-semibold text-blue-400">
              {formatAmount(reflectionData.reflectionDistributionRate)}/s
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground">Pool Accumulation</span>
            <div className="font-semibold text-green-400">
              +{formatAmount(reflectionData.poolAccumulationRate * 3600)}/hr
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground">Total Distributed</span>
            <div className="font-semibold text-purple-400">
              {formatAmount(parseFloat(reflectionData.totalDistributed))}
            </div>
          </div>
        </div>

        {/* User Personal Tracker */}
        {account && isConnected && (
          <>
            <Separator className="bg-blue-500/20" />
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Calculator className="h-3 w-3 text-green-400" />
                <span className="text-xs font-medium text-green-400">YOUR REFLECTIONS</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-green-400">
                    {formatAmount(reflectionData.userEstimatedDailyReflections)}
                  </div>
                  <div className="text-muted-foreground">Daily</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-400">
                    {formatAmount(reflectionData.userEstimatedWeeklyReflections)}
                  </div>
                  <div className="text-muted-foreground">Weekly</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-400">
                    {formatAmount(reflectionData.userEstimatedMonthlyReflections)}
                  </div>
                  <div className="text-muted-foreground">Monthly</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-muted-foreground">Your Share: {formatRate(reflectionData.userReflectionRate)}</div>
              </div>
            </div>
          </>
        )}

        {/* Real-time Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Last Update: {Math.floor((Date.now() - reflectionData.lastReflectionUpdate) / 1000)}s ago
          </span>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ReflectionMatrixMeter;