import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Eye, Users, Calculator, Coins, TrendingUp } from 'lucide-react';
import { CONTRACT_CONSTANTS } from '../../utils/constants';

interface ReflectionsMeterProps {
  currentReflectionPool: number;
  totalHolders: number;
  userHoldings?: number;
  userReflections?: number;
  dailyReflectionRate: number;
  loading: boolean;
}

type ReflectionState = 'MONITORING' | 'DISTRIBUTING' | 'CALCULATING' | 'COMPLETED';

const ReflectionsMeter = ({ 
  currentReflectionPool, 
  totalHolders, 
  userHoldings = 0, 
  userReflections = 0,
  dailyReflectionRate,
  loading 
}: ReflectionsMeterProps) => {
  const [reflectionState, setReflectionState] = useState<ReflectionState>('MONITORING');
  const [calculatorInput, setCalculatorInput] = useState('10000');
  const [lastReflectionUpdate, setLastReflectionUpdate] = useState(Date.now());

  // Animate reflection state changes
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceUpdate = now - lastReflectionUpdate;

      if (timeSinceUpdate > 30000) { // 30 seconds without update
        setReflectionState('MONITORING');
      } else if (currentReflectionPool > 1000) {
        setReflectionState('DISTRIBUTING');
      } else {
        setReflectionState('CALCULATING');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentReflectionPool, loading, lastReflectionUpdate]);

  const getStateColor = () => {
    switch (reflectionState) {
      case 'MONITORING': return 'blue';
      case 'DISTRIBUTING': return 'purple';
      case 'CALCULATING': return 'green';
      case 'COMPLETED': return 'cyan';
      default: return 'purple';
    }
  };

  const getStateText = () => {
    switch (reflectionState) {
      case 'MONITORING': return 'MONITORING_HOLDERS';
      case 'DISTRIBUTING': return 'DISTRIBUTING_REFLECTIONS';
      case 'CALCULATING': return 'CALCULATING_REWARDS';
      case 'COMPLETED': return 'REFLECTION_COMPLETE';
      default: return 'PROCESSING_REFLECTIONS';
    }
  };

  const calculatePersonalReflections = (holdings: number) => {
    if (totalHolders === 0 || currentReflectionPool === 0) return 0;
    // Simplified reflection calculation based on holdings percentage
    const totalSupply = CONTRACT_CONSTANTS.TOTAL_SUPPLY;
    const holdingPercentage = holdings / totalSupply;
    return currentReflectionPool * holdingPercentage;
  };

  const estimatedDailyReflections = calculatePersonalReflections(parseFloat(calculatorInput) || 0);

  return (
    <div className="bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-6 overflow-hidden relative group hover:border-purple-500/60 transition-all duration-500">
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Status Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <Eye className={`w-5 h-5 text-${getStateColor()}-400 ${reflectionState === 'DISTRIBUTING' ? 'animate-pulse' : ''}`} />
          <h4 className="text-lg font-bold text-purple-400 font-mono">
            [REFLECTIONS_ENGINE]
          </h4>
        </div>
        <div className={`text-${getStateColor()}-400 font-mono text-sm px-3 py-1 bg-${getStateColor()}-500/20 border border-${getStateColor()}-500/30 rounded`}>
          {getStateText()}
        </div>
      </div>

      {/* Reflection Fee Display */}
      <div className="mb-6 relative z-10">
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-2xl font-bold text-purple-400 font-mono mb-2">
            {CONTRACT_CONSTANTS.REFLECTION_FEE / CONTRACT_CONSTANTS.DIVIDER * 100}% REFLECTION FEE
          </div>
          <div className="text-sm text-gray-400 font-mono">
            Every transaction automatically distributes reflections to all holders
          </div>
        </div>
      </div>

      {/* Live Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-400 font-mono">
            {loading ? '[LOADING...]' : totalHolders.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">TOTAL_HOLDERS</div>
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
          <Coins className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-400 font-mono">
            {loading ? '[LOADING...]' : `${currentReflectionPool.toLocaleString()}`}
          </div>
          <div className="text-xs text-gray-400">DAILY_REFLECTIONS</div>
        </div>
      </div>

      {/* User Personal Stats (if connected) */}
      {userHoldings > 0 && (
        <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg p-4 mb-6 relative z-10">
          <div className="text-center">
            <div className="text-purple-400 font-mono text-sm mb-2">YOUR_REFLECTIONS</div>
            <div className="text-2xl font-bold text-white font-mono mb-1">
              {userReflections.toLocaleString()} ARK
            </div>
            <div className="text-xs text-gray-400">
              From {userHoldings.toLocaleString()} ARK holdings
            </div>
          </div>
        </div>
      )}

      {/* Interactive Reflection Calculator */}
      <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4 mb-4 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 font-mono text-sm">REFLECTION_CALCULATOR</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 font-mono block mb-1">
              TOKEN_HOLDINGS:
            </label>
            <input
              type="number"
              value={calculatorInput}
              onChange={(e) => setCalculatorInput(e.target.value)}
              className="w-full bg-black/30 border border-purple-500/30 rounded px-3 py-2 text-white font-mono text-sm focus:border-purple-500/60 focus:outline-none"
              placeholder="Enter ARK amount"
            />
          </div>
          
          <div className="bg-purple-500/10 rounded p-3">
            <div className="text-xs text-purple-400 font-mono mb-1">ESTIMATED_DAILY_REFLECTIONS:</div>
            <div className="text-lg font-bold text-white font-mono">
              {estimatedDailyReflections.toFixed(4)} ARK
            </div>
            <div className="text-xs text-gray-400 font-mono">
              Based on current reflection rate
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Process Visualization */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-4 relative z-10">
        <div className="text-purple-400 font-mono text-sm mb-3 text-center">
          [REFLECTION_DISTRIBUTION_PROCESS]
        </div>
        
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex flex-col items-center text-purple-400">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
              💸
            </div>
            <span>TX_FEE</span>
          </div>
          
          <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse"></div>
          </div>
          
          <div className="flex flex-col items-center text-cyan-400">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span>HOLDERS</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 text-center mt-2">
          Reflections distributed proportionally based on holdings
        </div>
      </div>

      {/* Scanning Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
          75% { transform: translateY(-15px) rotate(270deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ReflectionsMeter;