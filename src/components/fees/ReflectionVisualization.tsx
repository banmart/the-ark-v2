import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ReflectionVisualizationProps {
  amount: number;
  className?: string;
}

const ReflectionVisualization: React.FC<ReflectionVisualizationProps> = ({ amount }) => {
  const [matrixLines, setMatrixLines] = useState<Array<{ id: number; x: number; delay: number; speed: number }>>([]);
  const [distributionNodes, setDistributionNodes] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate matrix rain lines
    const newLines = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: (i * 12.5) + Math.random() * 8,
      delay: Math.random() * 2,
      speed: 0.8 + Math.random() * 0.4
    }));

    // Generate distribution nodes
    const newNodes = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 20 + (i * 12) + Math.random() * 8,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 3
    }));

    setMatrixLines(newLines);
    setDistributionNodes(newNodes);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-primary/20 to-transparent rounded-lg">
      {/* Matrix Rain Background */}
      {matrixLines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute w-px bg-gradient-to-b from-transparent via-primary to-transparent h-full opacity-60"
          style={{ left: `${line.x}%` }}
          animate={{
            backgroundPosition: ['0% 0%', '0% 100%']
          }}
          transition={{
            duration: 2 / line.speed,
            repeat: Infinity,
            delay: line.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Digital Characters */}
      <div className="absolute inset-0 text-primary/40 text-xs font-mono overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`
            }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [0, 20]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </motion.div>
        ))}
      </div>

      {/* Distribution Nodes */}
      {distributionNodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-3 h-3 border-2 border-primary rounded-full bg-primary/20"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            borderColor: ['hsl(var(--primary))', 'hsl(var(--primary) / 0.5)', 'hsl(var(--primary))']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Central Distribution Hub */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-8 h-8 border-2 border-primary rounded-full bg-primary/10 flex items-center justify-center"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-2 h-2 bg-primary rounded-full" />
        </motion.div>

        {/* Connecting Lines to Nodes */}
        {distributionNodes.map((node, index) => (
          <motion.div
            key={`line-${node.id}`}
            className="absolute w-px bg-primary/30 origin-center"
            style={{
              left: '50%',
              top: '50%',
              height: '20px',
              transform: `rotate(${index * 60}deg) translateY(-10px)`
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleY: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Pool Status */}
      <div className="absolute top-2 right-2 text-xs text-primary font-medium">
        {amount > 0 ? '📡 ACTIVE' : '💤 IDLE'}
      </div>
    </div>
  );
};

export default ReflectionVisualization;