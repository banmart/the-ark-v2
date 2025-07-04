import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface WeightProgressBarProps {
  userWeight: number;
  totalWeight: number;
  loading?: boolean;
}

const WeightProgressBar = ({ userWeight, totalWeight, loading }: WeightProgressBarProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [animationActive, setAnimationActive] = useState(false);

  const actualPercentage = totalWeight > 0 ? (userWeight / totalWeight) * 100 : 0;

  // Animate progress on load
  useEffect(() => {
    if (!loading && actualPercentage > 0) {
      setAnimationActive(true);
      setDisplayProgress(0);
      
      const progressInterval = setInterval(() => {
        setDisplayProgress(prev => {
          if (prev >= actualPercentage) {
            clearInterval(progressInterval);
            return actualPercentage;
          }
          // Easing function: faster in middle, slower at ends
          const increment = prev < actualPercentage * 0.2 ? actualPercentage * 0.05 : 
                          prev < actualPercentage * 0.8 ? actualPercentage * 0.08 : 
                          actualPercentage * 0.02;
          return Math.min(prev + increment, actualPercentage);
        });
      }, 50);

      return () => clearInterval(progressInterval);
    }
  }, [loading, actualPercentage]);

  // Determine color based on influence level
  const getProgressColor = (percentage: number) => {
    if (percentage >= 50) return 'text-cyan-400'; // Whale status
    if (percentage >= 25) return 'text-green-400'; // High influence
    if (percentage >= 10) return 'text-yellow-400'; // Moderate influence
    return 'text-orange-400'; // Low influence
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 50) return 'from-cyan-500 to-blue-500'; // Whale status
    if (percentage >= 25) return 'from-green-500 to-emerald-500'; // High influence
    if (percentage >= 10) return 'from-yellow-500 to-orange-500'; // Moderate influence
    return 'from-orange-500 to-red-500'; // Low influence
  };

  const progressBarLength = 20;
  const filledBars = Math.floor((displayProgress / 100) * progressBarLength);
  const progressBar = '█'.repeat(filledBars) + '▓'.repeat(progressBarLength - filledBars);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="text-2xl font-bold text-yellow-400 mb-1 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Progress Bar Display */}
      <div className={`text-lg font-mono ${getProgressColor(displayProgress)} mb-1`}>
        POWER: [{progressBar}] {displayProgress.toFixed(1)}%
      </div>
      
      {/* Percentage with gradient background */}
      <div className={`inline-block bg-gradient-to-r ${getProgressBarColor(displayProgress)} bg-clip-text text-transparent text-2xl font-black`}>
        {displayProgress.toFixed(1)}% of Total Weight
      </div>
      
      {/* Detailed breakdown */}
      <div className="text-xs text-gray-400 font-mono">
        Your Weight: {userWeight.toLocaleString()} / Total: {totalWeight.toLocaleString()}
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center gap-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${
          displayProgress >= 50 ? 'bg-cyan-400 animate-pulse' :
          displayProgress >= 25 ? 'bg-green-400 animate-pulse' :
          displayProgress >= 10 ? 'bg-yellow-400 animate-pulse' :
          'bg-orange-400 animate-pulse'
        }`}></div>
        <span className={getProgressColor(displayProgress)}>
          {displayProgress >= 50 ? 'WHALE STATUS' :
           displayProgress >= 25 ? 'HIGH INFLUENCE' :
           displayProgress >= 10 ? 'MODERATE POWER' :
           'BUILDING POWER'}
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Your percentage of total weight determines your share of weekly rewards. 
                Higher percentage = bigger rewards from the fee pool.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default WeightProgressBar;