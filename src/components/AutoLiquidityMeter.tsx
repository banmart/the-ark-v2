import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Activity, ArrowRight, Flame, Droplets } from 'lucide-react';

interface AutoLiquidityMeterProps {
  currentAccumulation: number;
  threshold: number;
  loading: boolean;
  isThresholdReached: boolean;
  isPendingSwap: boolean;
  lastSwapTimestamp: number;
  estimatedNextSwap: number | null;
}

type MeterState = 'MONITORING' | 'ACCUMULATING' | 'THRESHOLD_REACHED' | 'PENDING_SWAP' | 'COMPLETED';

const AutoLiquidityMeter = ({ 
  currentAccumulation, 
  threshold, 
  loading, 
  isThresholdReached, 
  isPendingSwap, 
  lastSwapTimestamp, 
  estimatedNextSwap 
}: AutoLiquidityMeterProps) => {
  const [meterState, setMeterState] = useState<MeterState>('MONITORING');
  const [lastKnownSwapTime, setLastKnownSwapTime] = useState(0);
  
  const percentage = Math.min((currentAccumulation / threshold) * 100, 100);
  
  // Update state based on real blockchain data
  useEffect(() => {
    if (loading) return;

    // Check if a new swap occurred
    if (lastSwapTimestamp > lastKnownSwapTime && lastKnownSwapTime > 0) {
      setMeterState('COMPLETED');
      setLastKnownSwapTime(lastSwapTimestamp);
      
      // Show completed state briefly, then reset to monitoring
      setTimeout(() => {
        setMeterState('MONITORING');
      }, 3000);
      return;
    }

    // Update last known swap time
    if (lastSwapTimestamp > lastKnownSwapTime) {
      setLastKnownSwapTime(lastSwapTimestamp);
    }

    // Set state based on real blockchain conditions
    if (isPendingSwap) {
      setMeterState('PENDING_SWAP');
    } else if (isThresholdReached) {
      setMeterState('THRESHOLD_REACHED');
    } else if (currentAccumulation > 0) {
      setMeterState('ACCUMULATING');
    } else {
      setMeterState('MONITORING');
    }
  }, [isThresholdReached, isPendingSwap, lastSwapTimestamp, currentAccumulation, loading, lastKnownSwapTime]);

  const getStateColor = () => {
    switch (meterState) {
      case 'MONITORING': return 'blue';
      case 'ACCUMULATING': return 'green';
      case 'THRESHOLD_REACHED': return 'yellow';
      case 'PENDING_SWAP': return 'orange';
      case 'COMPLETED': return 'green';
      default: return 'green';
    }
  };

  const getStateText = () => {
    switch (meterState) {
      case 'MONITORING': return 'MONITORING_BLOCKCHAIN';
      case 'ACCUMULATING': return 'ACCUMULATING_FEES';
      case 'THRESHOLD_REACHED': return 'THRESHOLD_REACHED';
      case 'PENDING_SWAP': return 'AWAITING_NEXT_TX';
      case 'COMPLETED': return 'SWAP_EXECUTED';
      default: return 'MONITORING_BLOCKCHAIN';
    }
  };

  const getEstimatedTime = () => {
    if (!estimatedNextSwap || isThresholdReached) return null;
    
    const now = Date.now();
    const timeRemaining = Math.max(0, estimatedNextSwap - now);
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `~${hours}h ${minutes}m`;
    if (minutes > 0) return `~${minutes}m`;
    return 'Soon';
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border-2 border-green-500/30 rounded-xl p-6 mb-6 overflow-hidden relative group hover:border-green-500/60 transition-all duration-500">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className={`w-5 h-5 text-${getStateColor()}-400 ${meterState === 'PENDING_SWAP' ? 'animate-spin' : 'animate-pulse'}`} />
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
            value={meterState === 'COMPLETED' ? 0 : percentage} 
            className={`h-4 bg-gray-800/50 ${meterState === 'THRESHOLD_REACHED' || meterState === 'PENDING_SWAP' ? 'animate-pulse' : ''}`}
          />
          {meterState === 'PENDING_SWAP' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent animate-[scan_1s_ease-in-out_infinite]" />
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

      {/* Live Status Info */}
      {meterState === 'PENDING_SWAP' && (
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
          <div className="text-orange-400 font-mono text-sm mb-2 text-center animate-pulse">
            [THRESHOLD_REACHED - WAITING_FOR_NEXT_TRANSACTION]
          </div>
          <div className="text-xs text-gray-400 font-mono text-center">
            Auto-swap will trigger on next qualifying transaction
          </div>
        </div>
      )}

      {/* Estimated Time */}
      {meterState === 'ACCUMULATING' && getEstimatedTime() && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="text-blue-400 font-mono text-sm text-center">
            ESTIMATED_NEXT_SWAP: {getEstimatedTime()}
          </div>
        </div>
      )}

      {/* Liquidity Process Flow */}
      {(meterState === 'THRESHOLD_REACHED' || meterState === 'PENDING_SWAP') && (
        <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-4">
          <div className="text-yellow-400 font-mono text-sm mb-3 text-center">
            [LIQUIDITY_PROCESS_READY]
          </div>
          
          <div className="flex items-center justify-between text-xs font-mono">
            {/* Step 1: Token Split */}
            <div className="flex flex-col items-center text-yellow-400">
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
                50%
              </div>
              <span>TOKENS</span>
            </div>
            
            <ArrowRight className="w-4 h-4 text-yellow-400" />
            
            {/* Step 2: PLS Conversion */}
            <div className="flex flex-col items-center text-yellow-400">
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
                <Droplets className="w-4 h-4" />
              </div>
              <span>PLS</span>
            </div>
            
            <ArrowRight className="w-4 h-4 text-yellow-400" />
            
            {/* Step 3: LP Creation */}
            <div className="flex flex-col items-center text-yellow-400">
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
                LP
              </div>
              <span>PAIR</span>
            </div>
            
            <ArrowRight className="w-4 h-4 text-yellow-400" />
            
            {/* Step 4: Burn */}
            <div className="flex flex-col items-center text-yellow-400">
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-1">
                <Flame className="w-4 h-4" />
              </div>
              <span>BURN</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {meterState === 'COMPLETED' && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
          <div className="text-green-400 font-mono text-sm animate-pulse">
            ✓ LIQUIDITY_SWAP_EXECUTED_ON_BLOCKCHAIN
          </div>
          {lastSwapTimestamp > 0 && (
            <div className="text-xs text-gray-400 font-mono mt-1">
              Last swap: {new Date(lastSwapTimestamp * 1000).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Monitoring State */}
      {meterState === 'MONITORING' && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
          <div className="text-blue-400 font-mono text-sm">
            [BLOCKCHAIN_MONITORING_ACTIVE]
          </div>
          <div className="text-xs text-gray-400 font-mono mt-1">
            Tracking liquidity fee accumulation in real-time
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