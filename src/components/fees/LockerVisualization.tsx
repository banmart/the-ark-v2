import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LockerVisualizationProps {
  amount: number;
  className?: string;
}

const LockerVisualization: React.FC<LockerVisualizationProps> = ({ amount }) => {
  const [securityLights, setSecurityLights] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [lockedTokens, setLockedTokens] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate security lights
    const newLights = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: 15 + (i * 20),
      y: 10 + Math.random() * 10,
      delay: i * 0.5
    }));

    // Generate locked token particles
    const newTokens = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 40 + Math.random() * 40,
      delay: Math.random() * 2
    }));

    setSecurityLights(newLights);
    setLockedTokens(newTokens);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5">
      {/* Vault Background */}
      <div className="absolute inset-4 border-4 border-secondary/40 rounded-lg bg-gradient-to-br from-secondary/10 to-transparent" />
      
      {/* Security Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="text-secondary">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Central Vault Door */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-16 h-16 border-4 border-secondary rounded-full bg-secondary/10 flex items-center justify-center"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Lock Mechanism */}
          <motion.div
            className="w-6 h-6 border-2 border-secondary rounded bg-secondary/20"
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Security Beams */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-8 bg-secondary/50 origin-bottom"
            style={{
              left: '50%',
              bottom: '50%',
              transform: `rotate(${angle}deg) translateY(-32px)`
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleY: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Security Status Lights */}
      {securityLights.map((light) => (
        <motion.div
          key={light.id}
          className="absolute w-2 h-2 rounded-full bg-secondary"
          style={{
            left: `${light.x}%`,
            top: `${light.y}%`
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: light.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Locked Token Particles */}
      {lockedTokens.map((token) => (
        <motion.div
          key={token.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/60 border border-secondary/40"
          style={{
            left: `${token.x}%`,
            top: `${token.y}%`
          }}
          animate={{
            y: [0, -5, 0],
            opacity: [0.6, 1, 0.6],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: token.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Security Level Bars */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-1 bg-secondary/30 rounded"
              animate={{
                backgroundColor: i < 4 ? 'hsl(var(--secondary))' : 'hsl(var(--secondary) / 0.3)'
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        <div className="text-xs text-secondary font-medium mt-1 text-center">
          SECURITY LEVEL: HIGH
        </div>
      </div>

      {/* Lock Status */}
      <div className="absolute top-2 right-2 text-xs text-secondary font-medium">
        {amount > 0 ? '🔒 SECURED' : '🔓 OPEN'}
      </div>
    </div>
  );
};

export default LockerVisualization;