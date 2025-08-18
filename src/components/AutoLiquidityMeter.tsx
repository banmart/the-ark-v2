import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Activity, ArrowRight, Flame, Droplets } from 'lucide-react';

interface AutoLiquidityMeterProps {
  currentAccumulation: number;
  threshold: number;
  loading: boolean;
}

type MeterState = 'ACCUMULATING' | 'THRESHOLD_REACHED' | 'PROCESSING_SWAP' | 'SWAP_COMPLETED';

const AutoLiquidityMeter = ({ currentAccumulation, threshold, loading }: AutoLiquidityMeterProps) => {
  const [meterState, setMeterState] = useState<MeterState>('ACCUMULATING');
  const [animationPhase, setAnimationPhase] = useState(0);
  
  const percentage = Math.min((currentAccumulation / threshold) * 100, 100);
  const isThresholdReached = percentage >= 100;
  
  useEffect(() => {
    if (isThresholdReached && meterState === 'ACCUMULATING') {
      setMeterState('THRESHOLD_REACHED');
      
      // Start animation sequence
      setTimeout(() => {
        setMeterState('PROCESSING_SWAP');
        setAnimationPhase(1);
        
        // Phase 1: Token conversion
        setTimeout(() => setAnimationPhase(2), 1000);
        
        // Phase 2: LP creation
        setTimeout(() => setAnimationPhase(3), 2000);
        
        // Phase 3: LP burn
        setTimeout(() => setAnimationPhase(4), 3000);
        
        // Phase 4: Reset
        setTimeout(() => {
          setMeterState('SWAP_COMPLETED');
          setAnimationPhase(0);
          
          // Reset to accumulating after showing completed state
          setTimeout(() => setMeterState('ACCUMULATING'), 1500);
        }, 4000);
      }, 2000);
    }
  }, [isThresholdReached, meterState]);

  const getStateColor = () => {
    switch (meterState) {
      case 'ACCUMULATING': return 'green';
      case 'THRESHOLD_REACHED': return 'yellow';
      case 'PROCESSING_SWAP': return 'cyan';
      case 'SWAP_COMPLETED': return 'green';
      default: return 'green';
    }
  };

  const getStateText = () => {
    switch (meterState) {
      case 'ACCUMULATING': return 'ACCUMULATING_TOKENS';
      case 'THRESHOLD_REACHED': return 'THRESHOLD_REACHED';
      case 'PROCESSING_SWAP': return 'PROCESSING_SWAP';
      case 'SWAP_COMPLETED': return 'SWAP_COMPLETED';
      default: return 'ACCUMULATING_TOKENS';
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border-2 border-green-500/30 rounded-xl p-6 mb-6 overflow-hidden relative group hover:border-green-500/60 transition-all duration-500">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className={`w-5 h-5 text-${getStateColor()}-400 ${meterState === 'PROCESSING_SWAP' ? 'animate-spin' : 'animate-pulse'}`} />
          <h4 className="text-lg font-bold text-green-400 font-mono">
            [AUTO_LIQUIDITY_METER]
          </h4>
        </div>
        <div className={`text-${getStateColor()}-400 font-mono text-sm px-3 py-1 bg-${getStateColor()}-500/20 border border-${getStateColor()}-500/30 rounded`}>
          {getStateText()}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400 font-mono">
            CURRENT_ACCUMULATION
          </span>
          <span className={`text-sm text-${getStateColor()}-400 font-mono`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={meterState === 'SWAP_COMPLETED' ? 0 : percentage} 
            className={`h-4 bg-gray-800/50 ${meterState === 'THRESHOLD_REACHED' || meterState === 'PROCESSING_SWAP' ? 'animate-pulse' : ''}`}
          />
          {meterState === 'PROCESSING_SWAP' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-[scan_1s_ease-in-out_infinite]" />
          )}
        </div>
        
        <div className="flex justify-between mt-2 text-xs font-mono">
          <span className="text-gray-500">
            {loading ? '[LOADING...]' : `${currentAccumulation.toLocaleString()} ARK`}
          </span>
          <span className="text-green-400">
            {loading ? '[LOADING...]' : `${threshold.toLocaleString()} ARK`}
          </span>
        </div>
      </div>

      {/* Animation Flow */}
      {meterState === 'PROCESSING_SWAP' && (
        <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4">
          <div className="text-cyan-400 font-mono text-sm mb-3 text-center">
            [LIQUIDITY_PROCESSING_SEQUENCE]
          </div>
          
          <div className="flex items-center justify-between text-xs font-mono">
            {/* Phase 1: Token Split */}
            <div className={`flex flex-col items-center transition-all duration-500 ${animationPhase >= 1 ? 'text-cyan-400' : 'text-gray-600'}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
                50%
              </div>
              <span>TOKENS</span>
            </div>
            
            <ArrowRight className={`w-4 h-4 transition-all duration-500 ${animationPhase >= 1 ? 'text-cyan-400' : 'text-gray-600'}`} />
            
            {/* Phase 2: PLS Conversion */}
            <div className={`flex flex-col items-center transition-all duration-500 ${animationPhase >= 2 ? 'text-yellow-400' : 'text-gray-600'}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
                <Droplets className="w-4 h-4" />
              </div>
              <span>PLS</span>
            </div>
            
            <ArrowRight className={`w-4 h-4 transition-all duration-500 ${animationPhase >= 2 ? 'text-yellow-400' : 'text-gray-600'}`} />
            
            {/* Phase 3: LP Creation */}
            <div className={`flex flex-col items-center transition-all duration-500 ${animationPhase >= 3 ? 'text-purple-400' : 'text-gray-600'}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
                LP
              </div>
              <span>PAIR</span>
            </div>
            
            <ArrowRight className={`w-4 h-4 transition-all duration-500 ${animationPhase >= 3 ? 'text-purple-400' : 'text-gray-600'}`} />
            
            {/* Phase 4: Burn */}
            <div className={`flex flex-col items-center transition-all duration-500 ${animationPhase >= 4 ? 'text-red-400' : 'text-gray-600'}`}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
                <Flame className="w-4 h-4" />
              </div>
              <span>BURN</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {meterState === 'SWAP_COMPLETED' && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
          <div className="text-green-400 font-mono text-sm animate-pulse">
            ✓ LIQUIDITY_SWAP_COMPLETED - RESTARTING_ACCUMULATION
          </div>
        </div>
      )}

      {/* Scan Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default AutoLiquidityMeter;