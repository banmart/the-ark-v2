import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Flame, TrendingDown, Calculator, Zap, AlertTriangle } from 'lucide-react';
import { CONTRACT_CONSTANTS } from '../../utils/constants';

interface BurnVisualizationProps {
  totalBurned: number;
  dailyBurnRate: number;
  circulatingSupply: number;
  recentBurns: number[];
  burnVelocity: number;
  loading: boolean;
}

type BurnState = 'MONITORING' | 'BURNING' | 'ACCELERATING' | 'DEFLATIONARY';

const BurnVisualization = ({ 
  totalBurned, 
  dailyBurnRate, 
  circulatingSupply, 
  recentBurns = [], 
  burnVelocity,
  loading 
}: BurnVisualizationProps) => {
  const [burnState, setBurnState] = useState<BurnState>('MONITORING');
  const [flameIntensity, setFlameIntensity] = useState(1);
  const [calculatorInput, setCalculatorInput] = useState('1000000');

  const totalSupply = CONTRACT_CONSTANTS.TOTAL_SUPPLY;
  const burnedPercentage = (totalBurned / totalSupply) * 100;
  const supplyReduction = totalBurned;

  // Update burn state based on velocity
  useEffect(() => {
    if (loading) return;

    if (burnVelocity > 50000) {
      setBurnState('ACCELERATING');
      setFlameIntensity(3);
    } else if (burnVelocity > 10000) {
      setBurnState('BURNING');
      setFlameIntensity(2);
    } else if (burnVelocity > 1000) {
      setBurnState('DEFLATIONARY');
      setFlameIntensity(1.5);
    } else {
      setBurnState('MONITORING');
      setFlameIntensity(1);
    }
  }, [burnVelocity, loading]);

  const getStateColor = () => {
    switch (burnState) {
      case 'MONITORING': return 'blue';
      case 'BURNING': return 'orange';
      case 'ACCELERATING': return 'red';
      case 'DEFLATIONARY': return 'purple';
      default: return 'orange';
    }
  };

  const getStateText = () => {
    switch (burnState) {
      case 'MONITORING': return 'MONITORING_BURNS';
      case 'BURNING': return 'ACTIVE_BURNING';
      case 'ACCELERATING': return 'BURN_ACCELERATION';
      case 'DEFLATIONARY': return 'DEFLATIONARY_MODE';
      default: return 'PROCESSING_BURNS';
    }
  };

  const calculateBurnImpact = (burnAmount: number) => {
    const newCirculating = circulatingSupply - burnAmount;
    const supplyReductionPercent = (burnAmount / circulatingSupply) * 100;
    const priceImpactEstimate = supplyReductionPercent * 0.5; // Simplified calculation
    return { newCirculating, supplyReductionPercent, priceImpactEstimate };
  };

  const burnImpact = calculateBurnImpact(parseFloat(calculatorInput) || 0);

  return (
    <div className="bg-black/40 backdrop-blur-xl border-2 border-orange-500/30 rounded-xl p-6 overflow-hidden relative group hover:border-orange-500/60 transition-all duration-500">
      {/* Flame Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-4 bg-gradient-to-t from-orange-500 to-red-500 rounded-full animate-fire`}
            style={{
              left: `${15 + i * 10}%`,
              bottom: `${10 + Math.random() * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${1 + Math.random()}s`,
              transform: `scale(${flameIntensity})`,
              opacity: burnState === 'MONITORING' ? 0.3 : 0.8
            }}
          />
        ))}
      </div>

      {/* Status Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <Flame className={`w-5 h-5 text-${getStateColor()}-400 ${burnState !== 'MONITORING' ? 'animate-pulse' : ''}`} />
          <h4 className="text-lg font-bold text-orange-400 font-mono">
            [BURN_MECHANISM]
          </h4>
        </div>
        <div className={`text-${getStateColor()}-400 font-mono text-sm px-3 py-1 bg-${getStateColor()}-500/20 border border-${getStateColor()}-500/30 rounded`}>
          {getStateText()}
        </div>
      </div>

      {/* Burn Fee Display */}
      <div className="mb-6 relative z-10">
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-orange-400 font-mono mb-2">
            {CONTRACT_CONSTANTS.BURN_FEE / CONTRACT_CONSTANTS.DIVIDER * 100}% BURN FEE
          </div>
          <div className="text-sm text-gray-400 font-mono">
            Tokens permanently removed from circulation
          </div>
        </div>
      </div>

      {/* Burn Progress */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400 font-mono">
            TOTAL_BURNED
          </span>
          <span className="text-sm text-orange-400 font-mono">
            {burnedPercentage.toFixed(2)}% of supply
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={burnedPercentage} 
            className={`h-6 bg-gray-800/50 ${burnState === 'ACCELERATING' ? 'animate-pulse' : ''}`}
          />
          {burnState === 'ACCELERATING' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/50 to-transparent animate-[scan_1s_ease-in-out_infinite]" />
          )}
          
          {/* Flame overlay on progress bar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame className={`w-4 h-4 text-orange-300 ${burnState !== 'MONITORING' ? 'animate-bounce' : ''}`} />
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs font-mono">
          <span className="text-gray-500">
            {loading ? '[LOADING...]' : `${totalBurned.toLocaleString()} ARK`}
          </span>
          <span className="text-orange-400">
            {loading ? '[LOADING...]' : `${totalSupply.toLocaleString()} ARK`}
          </span>
        </div>
      </div>

      {/* Live Burn Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
          <TrendingDown className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-orange-400 font-mono">
            {loading ? '[LOADING...]' : dailyBurnRate.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">DAILY_BURN_RATE</div>
        </div>
        
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-orange-400 font-mono">
            {loading ? '[LOADING...]' : `${burnVelocity.toLocaleString()}`}
          </div>
          <div className="text-xs text-gray-400">BURN_VELOCITY</div>
        </div>
      </div>

      {/* Supply Reduction Impact */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-4 mb-6 relative z-10">
        <div className="text-center">
          <div className="text-orange-400 font-mono text-sm mb-2">SUPPLY_REDUCTION_IMPACT</div>
          <div className="text-2xl font-bold text-white font-mono mb-1">
            -{supplyReduction.toLocaleString()} ARK
          </div>
          <div className="text-xs text-gray-400">
            Permanently removed from circulation
          </div>
        </div>
      </div>

      {/* Burn Impact Calculator */}
      <div className="bg-black/50 border border-orange-500/30 rounded-lg p-4 mb-4 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-mono text-sm">BURN_IMPACT_CALCULATOR</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 font-mono block mb-1">
              BURN_AMOUNT:
            </label>
            <input
              type="number"
              value={calculatorInput}
              onChange={(e) => setCalculatorInput(e.target.value)}
              className="w-full bg-black/30 border border-orange-500/30 rounded px-3 py-2 text-white font-mono text-sm focus:border-orange-500/60 focus:outline-none"
              placeholder="Enter ARK burn amount"
            />
          </div>
          
          <div className="space-y-2">
            <div className="bg-orange-500/10 rounded p-3">
              <div className="text-xs text-orange-400 font-mono mb-1">SUPPLY_REDUCTION:</div>
              <div className="text-lg font-bold text-white font-mono">
                {burnImpact.supplyReductionPercent.toFixed(4)}%
              </div>
            </div>
            
            <div className="bg-red-500/10 rounded p-3">
              <div className="text-xs text-red-400 font-mono mb-1">ESTIMATED_PRICE_IMPACT:</div>
              <div className="text-lg font-bold text-white font-mono">
                +{burnImpact.priceImpactEstimate.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Burn Process Visualization */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4 relative z-10">
        <div className="text-orange-400 font-mono text-sm mb-3 text-center">
          [DEFLATIONARY_BURN_PROCESS]
        </div>
        
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex flex-col items-center text-orange-400">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
              2%
            </div>
            <span>TX_FEE</span>
          </div>
          
          <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"></div>
          </div>
          
          <div className="flex flex-col items-center text-red-400">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <span>BURN</span>
          </div>
          
          <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-red-500 to-purple-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 animate-pulse"></div>
          </div>
          
          <div className="flex flex-col items-center text-purple-400">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>VOID</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 text-center mt-2">
          Tokens sent to burn address - permanently removed forever
        </div>
      </div>

      {/* Scanning Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes fire {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
        }
        .animate-fire {
          animation: fire linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BurnVisualization;