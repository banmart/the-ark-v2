import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BurnVisualizationProps {
  amount: number;
  className?: string;
}

const BurnVisualization: React.FC<BurnVisualizationProps> = ({ amount }) => {
  const [flames, setFlames] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  const [tokens, setTokens] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate flame particles
    const newFlames = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 0.8,
      delay: Math.random() * 2
    }));

    // Generate token particles being burned
    const newTokens = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      delay: Math.random() * 3
    }));

    setFlames(newFlames);
    setTokens(newTokens);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Fire Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-destructive/30 via-destructive/10 to-transparent rounded-lg" />
      
      {/* Flame Particles */}
      {flames.map((flame) => (
        <motion.div
          key={flame.id}
          className="absolute w-3 h-6 bg-gradient-to-t from-orange-500 via-red-500 to-yellow-400 rounded-full opacity-70"
          style={{
            left: `${flame.x}%`,
            bottom: `${flame.y}%`,
            transform: `scale(${flame.size})`
          }}
          animate={{
            y: [-20, -40, -20],
            scale: [flame.size * 0.8, flame.size * 1.2, flame.size * 0.8],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: flame.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Burning Token Particles */}
      {tokens.map((token) => (
        <motion.div
          key={token.id}
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{
            left: `${token.x}%`,
            top: `${token.y}%`
          }}
          animate={{
            y: [0, -30],
            opacity: [1, 0],
            scale: [1, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: token.delay,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Central Incinerator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="w-12 h-8 bg-gradient-to-t from-red-600 to-orange-400 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
          animate={{
            scale: [0.8, 1.2, 0.8],
            y: [-5, -10, -5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Burn Rate Indicator */}
      <div className="absolute top-2 right-2 text-xs text-destructive font-medium">
        {amount > 0 ? '🔥 ACTIVE' : '💤 IDLE'}
      </div>
    </div>
  );
};

export default BurnVisualization;