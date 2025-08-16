import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { formatEther } from 'ethers';

interface FeeCardProps {
  type: string;
  title: string;
  data: {
    daily: number;
    total: number;
    rate: number;
  };
  efficiency: number;
  color: string;
  borderColor: string;
  icon: string;
  animationDelay?: number;
  children?: React.ReactNode;
}

const FeeCard = ({ 
  title, 
  data, 
  efficiency, 
  color, 
  borderColor, 
  icon, 
  animationDelay = 0,
  children 
}: FeeCardProps) => {
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K`;
    }
    return amount.toFixed(2);
  };

  const getEfficiencyColor = (eff: number) => {
    if (eff >= 90) return 'text-green-400 border-green-400/30 bg-green-500/10';
    if (eff >= 70) return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10';
    return 'text-red-400 border-red-400/30 bg-red-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: animationDelay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className={`
        relative p-6 h-full transition-all duration-300
        bg-gradient-to-br ${color}
        border ${borderColor}
        hover:shadow-lg hover:shadow-primary/10
        backdrop-blur-sm
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <Badge className={getEfficiencyColor(efficiency)}>
            {efficiency.toFixed(1)}%
          </Badge>
        </div>

        {/* Daily Amount */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Daily Collection</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formatAmount(data.daily)}
            </span>
            <span className="text-sm text-muted-foreground">ARK</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Efficiency</span>
            <span>{efficiency.toFixed(1)}%</span>
          </div>
          <Progress 
            value={efficiency} 
            className="h-2 bg-muted/30"
          />
        </div>

        {/* Rate */}
        <div className="text-xs text-muted-foreground">
          <span>Rate: {(data.rate * 100).toFixed(2)}% per transaction</span>
        </div>

        {/* Visualization Content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
      </Card>
    </motion.div>
  );
};

export default FeeCard;