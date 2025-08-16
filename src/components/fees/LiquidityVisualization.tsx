import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LiquidityVisualizationProps {
  amount: number;
  threshold: number;
  className?: string;
}

const LiquidityVisualization: React.FC<LiquidityVisualizationProps> = ({ amount, threshold }) => {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  const [waves, setWaves] = useState<Array<{ id: number; delay: number }>>([]);

  const fillPercentage = threshold > 0 ? Math.min((amount / threshold) * 100, 100) : 0;

  useEffect(() => {
    // Generate liquid bubbles
    const newBubbles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 70 + 20,
      size: 0.5 + Math.random() * 0.8,
      delay: Math.random() * 3
    }));

    // Generate wave layers
    const newWaves = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 0.5
    }));

    setBubbles(newBubbles);
    setWaves(newWaves);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Container Background */}
      <div className="absolute inset-0 border-2 border-accent/30 rounded-lg bg-gradient-to-t from-accent/10 to-transparent" />
      
      {/* Liquid Fill */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent via-accent/80 to-accent/60 rounded-b-lg"
        initial={{ height: '0%' }}
        animate={{ height: `${fillPercentage}%` }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Wave Effects */}
      {waves.map((wave) => (
        <motion.div
          key={wave.id}
          className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
          style={{ bottom: `${fillPercentage}%` }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: wave.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-accent/40 border border-accent/60"
          style={{
            left: `${bubble.x}%`,
            bottom: `${Math.min(bubble.y, fillPercentage)}%`,
            width: `${bubble.size * 8}px`,
            height: `${bubble.size * 8}px`
          }}
          animate={{
            y: [-10, -30, -10],
            opacity: [0.4, 0.8, 0.4],
            scale: [bubble.size * 0.8, bubble.size * 1.2, bubble.size * 0.8]
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Threshold Indicator */}
      <div className="absolute left-0 right-0 border-t-2 border-dashed border-accent/50" style={{ top: '0%' }}>
        <div className="absolute -top-3 right-2 text-xs text-accent font-medium">
          THRESHOLD
        </div>
      </div>

      {/* Fill Level Indicator */}
      <div className="absolute top-2 left-2 text-xs text-accent font-medium">
        {fillPercentage.toFixed(1)}% FULL
      </div>

      {/* Swap Status */}
      <div className="absolute top-2 right-2 text-xs text-accent font-medium">
        {fillPercentage >= 100 ? '🚀 READY' : '⏳ FILLING'}
      </div>

      {/* Liquid Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full opacity-60"
            style={{
              left: `${20 + i * 12}%`,
              bottom: `${fillPercentage + 5}%`
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LiquidityVisualization;