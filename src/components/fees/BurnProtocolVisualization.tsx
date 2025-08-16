import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BurnProtocolVisualizationProps {
  dailyBurn: number;
  totalBurned: number;
  efficiency: number;
  className?: string;
}

const BurnProtocolVisualization = ({ 
  dailyBurn, 
  totalBurned, 
  efficiency, 
  className = "" 
}: BurnProtocolVisualizationProps) => {
  const [flames, setFlames] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate flame particles
    const flameParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 80 + 20,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 2
    }));

    // Generate sparkle particles
    const sparkleParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));

    setFlames(flameParticles);
    setSparkles(sparkleParticles);
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
    <div className={`relative w-full h-48 bg-gradient-to-br from-red-950/40 to-orange-900/30 rounded-lg overflow-hidden ${className}`}>
      {/* Background flame effect */}
      <div className="absolute inset-0">
        {flames.map((flame) => (
          <motion.div
            key={flame.id}
            className="absolute w-3 h-3 bg-gradient-to-t from-red-500 to-orange-400 rounded-full opacity-60"
            style={{ 
              left: `${flame.x}%`, 
              top: `${flame.y}%`,
              width: `${flame.size}px`,
              height: `${flame.size}px`
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              delay: flame.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{ 
              left: `${sparkle.x}%`, 
              top: `${sparkle.y}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Central incinerator visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-20 h-20 bg-gradient-to-br from-red-600 to-orange-500 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 20px rgba(239, 68, 68, 0.5)",
              "0 0 30px rgba(239, 68, 68, 0.8)",
              "0 0 20px rgba(239, 68, 68, 0.5)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full opacity-80" />
          <div className="absolute inset-4 bg-gradient-to-br from-white to-yellow-300 rounded-full opacity-60" />
        </motion.div>
      </div>

      {/* Burn metrics overlay */}
      <div className="absolute bottom-3 left-3 right-3">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-red-300 font-medium">Daily Burn</div>
              <div className="text-white font-bold">{formatAmount(dailyBurn)} ARK</div>
            </div>
            <div>
              <div className="text-orange-300 font-medium">Total Burned</div>
              <div className="text-white font-bold">{formatAmount(totalBurned)} ARK</div>
            </div>
          </div>
          
          {/* Burn intensity indicator */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-red-200 mb-1">
              <span>Burn Intensity</span>
              <span>{efficiency.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-red-900/50 rounded-full h-1.5">
              <motion.div 
                className="bg-gradient-to-r from-red-500 to-orange-400 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${efficiency}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating burn tokens */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-400 rounded-full"
            style={{
              top: `${-30 + Math.sin((i * Math.PI * 2) / 6) * 25}px`,
              left: `${Math.cos((i * Math.PI * 2) / 6) * 25}px`
            }}
            animate={{
              opacity: [1, 0.3, 1],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default BurnProtocolVisualization;