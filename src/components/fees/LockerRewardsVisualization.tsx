import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LockerRewardsVisualizationProps {
  dailyRewards: number;
  totalLocked: number;
  efficiency: number;
  className?: string;
}

const LockerRewardsVisualization = ({ 
  dailyRewards, 
  totalLocked, 
  efficiency, 
  className = "" 
}: LockerRewardsVisualizationProps) => {
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const coinParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      delay: Math.random() * 2
    }));

    setCoins(coinParticles);
  }, []);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K`;
    }
    return amount.toFixed(2);
  };

  return (
    <div className={`relative w-full h-48 bg-gradient-to-br from-purple-950/40 to-violet-900/30 rounded-lg overflow-hidden ${className}`}>
      {/* Vault background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-4 border-2 border-purple-400 rounded-lg">
          <div className="absolute inset-2 border border-purple-300 rounded">
            <div className="absolute inset-2 border border-purple-200 rounded" />
          </div>
        </div>
      </div>

      {/* Floating reward coins */}
      <div className="absolute inset-0">
        {coins.map((coin) => (
          <motion.div
            key={coin.id}
            className="absolute w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border border-yellow-300"
            style={{ 
              left: `${coin.x}%`, 
              top: `${coin.y}%`
            }}
            animate={{
              y: [-5, 5, -5],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              delay: coin.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-1 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Central vault visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Vault body */}
          <div className="w-24 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg border-2 border-slate-500 relative">
            {/* Vault door */}
            <div className="absolute inset-1 bg-gradient-to-br from-slate-500 to-slate-700 rounded border border-slate-400">
              {/* Lock mechanism */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="w-6 h-6 bg-gradient-to-br from-gold-400 to-yellow-600 rounded-full border-2 border-yellow-500"
                  animate={{
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-1 bg-yellow-300 rounded-full" />
                </motion.div>
              </div>
            </div>
            
            {/* Security lights */}
            <div className="absolute -top-1 left-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute -top-1 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500" />
          </div>
        </motion.div>
      </div>

      {/* Reward beams */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-gradient-to-t from-transparent via-purple-400 to-transparent"
          style={{
            left: `${25 + i * 20}%`,
            height: '100%'
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scaleY: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Locker metrics overlay */}
      <div className="absolute bottom-3 left-3 right-3">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-purple-300 font-medium">Daily Rewards</div>
              <div className="text-white font-bold">{formatAmount(dailyRewards)} ARK</div>
            </div>
            <div>
              <div className="text-violet-300 font-medium">Total Locked</div>
              <div className="text-white font-bold">{formatAmount(totalLocked)} ARK</div>
            </div>
          </div>
          
          {/* Security level indicator */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-purple-200 mb-1">
              <span>Security Level</span>
              <span>{efficiency.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-1.5">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-violet-400 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${efficiency}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Particle trail effect */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-8 h-8"
        animate={{
          x: [0, 50, 100, 50, 0],
          y: [0, -20, 0, 20, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-2 h-2 bg-purple-400 rounded-full opacity-60" />
      </motion.div>
    </div>
  );
};

export default LockerRewardsVisualization;