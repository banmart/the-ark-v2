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
}

const FeeCard = ({ 
  title, 
  data, 
  efficiency, 
  color, 
  borderColor, 
  icon, 
  animationDelay = 0 
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
      <div className={`
        relative p-6 h-full transition-all duration-300
        liquid-glass rounded-2xl
        border border-white/10
        hover:border-white/20
        group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
      `}>
        {/* Top edge highlight highlight */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <span className="text-xl">{icon}</span>
            </div>
            <h3 className="font-bold text-white tracking-tight uppercase text-sm font-sans">{title}</h3>
          </div>
          <div className={`px-2 py-1 rounded-md text-[10px] font-mono border ${getEfficiencyColor(efficiency).split(' ').slice(0, 2).join(' ')}`}>
            {efficiency.toFixed(1)}%
          </div>
        </div>

        {/* Daily Amount */}
        <div className="mb-4">
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1">Daily Collection</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              {formatAmount(data.daily)}
            </span>
            <span className="text-xs text-white/30 font-mono">ARK</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-white/30 font-mono mb-2 uppercase tracking-tighter">
            <span>Statute Efficiency</span>
            <span>{efficiency.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/20 rounded-full transition-all duration-1000"
              style={{ width: `${efficiency}%` }}
            />
          </div>
        </div>

        {/* Rate */}
        <div className="text-xs text-white/50 font-mono uppercase tracking-widest">
          <span>{title} Rate: {(data.rate * 100).toFixed(2)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FeeCard;