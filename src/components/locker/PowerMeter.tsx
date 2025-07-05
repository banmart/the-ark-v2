import React, { useEffect, useState } from 'react';

interface PowerMeterProps {
  userWeight: number;
  totalWeight: number;
  loading?: boolean;
}

const PowerMeter = ({ userWeight, totalWeight, loading }: PowerMeterProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const actualPercentage = totalWeight > 0 ? (userWeight / totalWeight) * 100 : 0;
  
  useEffect(() => {
    if (loading) return;
    
    const timer = setTimeout(() => {
      setAnimatedPercentage(actualPercentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [actualPercentage, loading]);

  const getColorClass = (percentage: number) => {
    if (percentage >= 30) return 'from-cyan-500 to-blue-400';
    if (percentage >= 15) return 'from-green-500 to-emerald-400';
    if (percentage >= 5) return 'from-yellow-500 to-orange-400';
    return 'from-orange-500 to-red-400';
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gray-600 to-gray-500 animate-pulse"></div>
        </div>
        <div className="text-xs text-gray-400 mt-1">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full bg-gradient-to-r ${getColorClass(actualPercentage)} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(animatedPercentage, 100)}%` }}
        ></div>
      </div>
      <div className="text-sm font-bold text-yellow-400">
        {actualPercentage.toFixed(1)}%
      </div>
    </div>
  );
};

export default PowerMeter;