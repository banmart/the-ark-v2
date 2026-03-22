import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Flame, RefreshCcw, Droplets, Lock, ArrowRight, Database } from 'lucide-react';
import { useContractData } from '../hooks/useContractData';
import { useARKTokenData } from '../hooks/useARKTokenData';
import { useLockerData } from '../hooks/useLockerData';
import { useIsMobile } from '../hooks/use-mobile';
import { useFeeMetrics } from '../hooks/useFeeMetrics';
import { useBurnAnalytics } from '../hooks/useBurnAnalytics';
import { useNavigate } from 'react-router-dom';

type PillarState = 'MONITORING' | 'ACTIVE' | 'THRESHOLD_REACHED' | 'PROCESSING' | 'ACCUMULATING';

interface PillarData {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  value: number;
  maxValue: number;
  unit: string;
  state: PillarState;
  liveData: string;
  actionText: string;
  onClick?: () => void;
}

const InteractiveQuantumPillars = memo(() => {
  const [pillarsLoaded, setPillarsLoaded] = useState(false);
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const { data: contractData, loading: contractLoading } = useContractData();
  const { data: tokenData, loading: tokenLoading } = useARKTokenData();
  const { protocolStats, userStats, loading: lockerLoading } = useLockerData();
  const { feeMetrics, loading: feeLoading } = useFeeMetrics(tokenData?.volume24h ? Number(tokenData.volume24h) : undefined);
  const { burnMetrics } = useBurnAnalytics(typeof tokenData?.volume24h === 'number' ? tokenData.volume24h : 0);

  useEffect(() => {
    // Animate pillars on load
    const timer = setTimeout(() => setPillarsLoaded(true), 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);


  // Real-time animation effect
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setRealTimeUpdate(prev => prev + 1);
    }, 3000);

    return () => clearInterval(glitchTimer);
  }, []);

  const getStateColor = useCallback((state: PillarState) => {
    switch (state) {
      case 'MONITORING': return 'blue';
      case 'ACTIVE': return 'green';
      case 'THRESHOLD_REACHED': return 'yellow';
      case 'PROCESSING': return 'orange';
      case 'ACCUMULATING': return 'purple';
      default: return 'blue';
    }
  }, []);

  const getPillarsData = useMemo((): PillarData[] => {
    // Get real fee data from service
    const currentVolume = typeof tokenData?.volume24h === 'number' ? tokenData.volume24h : 0;
    const fees = feeMetrics?.feesCollected;
    const efficiency = feeMetrics?.efficiency;
    
    // Use real fee data when available, fallback to calculations
    const burnDaily = fees?.burn.dailyFees || 0;
    const daoDaily = fees?.dao.dailyFees || 0;
    const liquidityDaily = fees?.liquidity.dailyFees || 0;
    const lockerDaily = fees?.locker.dailyFees || 0;
    
    // Get real-time data
    const liquidityThreshold = contractData?.swapSettings?.threshold ? parseFloat(contractData.swapSettings.threshold) : 1000000;
    const currentLiquidity = contractData?.liquidityData?.currentAccumulation ? parseFloat(contractData.liquidityData.currentAccumulation) : 0;
    const totalLocked = typeof protocolStats?.totalLockedTokens === 'number' ? protocolStats.totalLockedTokens : 0;
    const rewardPool = typeof protocolStats?.rewardPool === 'number' ? protocolStats.rewardPool : 0;
    
    // Calculate dynamic max values based on real fee collection
    const burnMaxCapacity = Math.max(currentVolume * 0.01, burnDaily * 2); // 1% of volume or 2x current rate
    const daoMaxCapacity = Math.max(currentVolume * 0.01, daoDaily * 2); // 1% dao
    const liquidityMaxCapacity = Math.max(currentVolume * 0.04, liquidityDaily * 2); // 4% liquidity
    const rewardMaxCapacity = Math.max(rewardPool * 0.04, lockerDaily * 2); // 4% locker

    // Enhanced state calculation functions using real fee efficiency
    const getBurnState = (rate: number, capacity: number, eff: number = 0): PillarState => {
      if (eff > 80) return 'PROCESSING';
      if (eff > 50 || rate > capacity * 0.5) return 'ACTIVE';
      if (eff > 20 || rate > capacity * 0.1) return 'MONITORING';
      return 'MONITORING';
    };

    const getReflectionState = (reflections: number, capacity: number, eff: number = 0): PillarState => {
      if (eff > 70) return 'ACTIVE';
      if (eff > 30 || reflections > capacity * 0.3) return 'MONITORING';
      return 'MONITORING';
    };

    const getLiquidityState = (current: number, threshold: number, eff: number = 0): PillarState => {
      if (current >= threshold) return 'THRESHOLD_REACHED';
      if (eff > 60 || current > threshold * 0.7) return 'PROCESSING';
      if (eff > 20 || current > threshold * 0.3) return 'ACCUMULATING';
      return 'MONITORING';
    };

    const getRewardState = (rewards: number, capacity: number, eff: number = 0): PillarState => {
      if (eff > 60) return 'ACTIVE';
      if (eff > 20 || rewards > capacity * 0.2) return 'ACCUMULATING';
      return 'MONITORING';
    };

    return [
      {
        id: 0,
        icon: Flame,
        emoji: '🔥',
        title: 'BURN PROTOCOL',
        subtitle: 'Deflationary Mechanism',
        description: '1% of every transaction is permanently burned, reducing total supply over time.',
        color: 'red',
        gradient: 'from-red-500 to-orange-500',
        value: burnDaily,
        maxValue: burnMaxCapacity,
        unit: 'ARK/day',
        state: getBurnState(burnDaily, burnMaxCapacity, efficiency?.burn || 0),
        liveData: burnDaily > 0 ? `${burnDaily > 1000 ? (burnDaily / 1000).toFixed(1) + 'K' : burnDaily.toFixed(0)} ARK/DAY` : 'LOADING...',
        actionText: 'VIEW BURN ANALYTICS',
        onClick: () => navigate('/burn-analytics')
      },
      {
        id: 1,
        icon: RefreshCcw,
        emoji: '🏛️',
        title: 'DAO TREASURY',
        subtitle: 'Community Governance',
        description: '1% of every transaction funds the DAO treasury for community-driven governance and development.',
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-500',
        value: daoDaily,
        maxValue: daoMaxCapacity,
        unit: 'ARK/day',
        state: getReflectionState(daoDaily, daoMaxCapacity, efficiency?.dao || 0),
        liveData: daoDaily > 0 ? `${daoDaily > 1000 ? (daoDaily / 1000).toFixed(1) + 'K' : daoDaily.toFixed(0)} ARK/DAY` : 'LOADING...',
        actionText: 'VIEW DAO'
      },
      {
        id: 2,
        icon: Droplets,
        emoji: '💧',
        title: 'LIQUIDITY ENGINE',
        subtitle: 'Fluid Dynamics Control',
        description: 'Automated liquidity synthesis with quantum slippage protection and threshold management.',
        color: 'purple',
        gradient: 'from-purple-500 to-pink-500',
        value: currentLiquidity,
        maxValue: liquidityThreshold,
        unit: 'ARK',
        state: getLiquidityState(currentLiquidity, liquidityThreshold, efficiency?.liquidity || 0),
        liveData: `${((currentLiquidity / liquidityThreshold) * 100).toFixed(1)}% TO SWAP`,
        actionText: 'VIEW LIQUIDITY'
      },
      {
        id: 3,
        icon: Lock,
        emoji: '🔒',
        title: 'VAULT REWARDS',
        subtitle: 'Temporal Amplification',
        description: 'Dedicated quantum vault rewards for temporal commitment with up to 8x multipliers.',
        color: 'green',
        gradient: 'from-green-500 to-teal-500',
        value: lockerDaily,
        maxValue: rewardMaxCapacity,
        unit: 'ARK/day',
        state: getRewardState(lockerDaily, rewardMaxCapacity, efficiency?.locker || 0),
        liveData: lockerDaily > 0 ? `${lockerDaily > 1000 ? (lockerDaily / 1000).toFixed(1) + 'K' : lockerDaily.toFixed(0)} ARK/DAY` : 'LOADING...',
        actionText: 'ENTER VAULT'
      }
    ];
  }, [feeMetrics, contractData, tokenData, protocolStats, realTimeUpdate]);

  const pillarsData = getPillarsData;
  
  // Show loading state while fee data is being fetched
  const loading = contractLoading || tokenLoading || lockerLoading || feeLoading;

  return (
    <section id="quantum-pillars" className="relative z-30 py-16 px-6 bg-gradient-to-b from-black/10 to-black/30">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(239, 68, 68, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* System Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${pillarsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/60 font-mono text-xs mb-4">
            <Database className="w-3 h-3 animate-pulse" />
            <span>[QUANTUM ARCHITECTURE SCAN]</span>
            <Database className="w-3 h-3 animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-cyan-400">
            <span className="animate-[glitch_4s_ease-in-out_infinite]">INTERACTIVE</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_0.5s_infinite]">QUANTUM</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_1s_infinite]">PILLARS</span>
          </h2>
          
          <div className="text-sm text-gray-400 font-mono">
            [LIVE BLOCKCHAIN DATA INTERFACE]
          </div>
        </div>

        {/* Interactive Pillars Grid - 2x2 Layout */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 delay-300 ${pillarsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {pillarsData.map((pillar, index) => {
            const IconComponent = pillar.icon;
            const percentage = pillar.maxValue > 0 ? Math.min((pillar.value / pillar.maxValue) * 100, 100) : 0;
            const stateColor = getStateColor(pillar.state);

            return (
                <Card 
                key={pillar.id} 
                className={`relative bg-black/60 backdrop-blur-xl border-2 rounded-xl overflow-hidden group ${isMobile ? 'active:scale-[0.98]' : 'hover:scale-[1.02]'} transition-all duration-500 ${pillar.onClick ? 'cursor-pointer' : ''} will-change-transform border-${pillar.color}-500/30 ${isMobile ? 'active:border-' : 'hover:border-'}${pillar.color}-500/60`}
                style={{ contain: 'layout style paint' }}
                onClick={pillar.onClick}
              >
                <CardContent className="p-6">
                  {/* Status Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-5 h-5 text-${pillar.color}-400`} />
                      <div className={`w-2 h-2 bg-${stateColor}-400 rounded-full ${pillar.state === 'ACTIVE' && !isMobile ? 'animate-pulse' : ''}`}></div>
                    </div>
                    <div className={`text-${stateColor}-400 font-mono text-xs px-2 py-1 bg-${stateColor}-500/20 border border-${stateColor}-500/30 rounded`}>
                      {pillar.state}
                    </div>
                  </div>

                  {/* Pillar Icon & Title */}
                  <div className="text-center mb-4">
                    <div className={`text-3xl mb-2 ${isMobile ? 'active:animate-pulse' : 'group-hover:animate-bounce'} transition-all`}>
                      {pillar.emoji}
                    </div>
                    <h3 className={`text-xl font-bold text-${pillar.color}-400 font-mono mb-1`}>
                      {pillar.title}
                    </h3>
                    <div className={`text-sm text-${pillar.color}-300/60 font-mono mb-2`}>
                      [{pillar.subtitle}]
                    </div>
                  </div>

                  {/* Live Data Display */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 font-mono">
                        LIVE DATA
                      </span>
                      <span className={`text-sm text-${pillar.color}-400 font-mono`}>
                        {loading ? '[LOADING...]' : pillar.liveData}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative mb-2">
                      <Progress 
                        value={loading ? 0 : percentage}
                        className={`h-3 bg-gray-800/50 ${pillar.state === 'THRESHOLD_REACHED' && !isMobile ? 'animate-pulse' : ''}`}
                      />
                      {pillar.state === 'PROCESSING' && !isMobile && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent animate-[scan_1s_ease-in-out_infinite]" />
                      )}
                    </div>
                    
                    <div className="flex justify-between text-sm font-mono">
                      <span className="text-gray-500">
                        {loading ? '[LOADING...]' : `${pillar.value.toLocaleString()} ${pillar.unit}`}
                      </span>
                      <span className={`text-${pillar.color}-400`}>
                        {loading ? '[LOADING...]' : `${pillar.maxValue.toLocaleString()} ${pillar.unit}`}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  {/* Action Button */}
                  <div className="flex items-center justify-center gap-2">
                    <Activity className={`w-3 h-3 text-${pillar.color}-400 animate-pulse`} />
                    <span className={`text-${pillar.color}-400 font-mono text-xs hover:text-${pillar.color}-300 transition-colors`}>
                      {pillar.actionText}
                    </span>
                    <ArrowRight className={`w-3 h-3 text-${pillar.color}-400`} />
                  </div>

                  {/* Animated Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${pillar.gradient} opacity-0 ${isMobile ? 'group-active:opacity-10' : 'group-hover:opacity-10'} transition-opacity rounded-xl`}></div>

                  {/* Scan Effect - Disabled on mobile */}
                  {!isMobile && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${pillar.gradient} animate-[scan_2s_ease-in-out_infinite]`}></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Status Footer */}
        <div className={`text-center mt-8 transition-all duration-1000 delay-700 ${pillarsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/40 font-mono text-xs">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>[QUANTUM FIELD SYNCHRONIZATION COMPLETE]</span>
            <Activity className="w-3 h-3 animate-pulse" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse, .animate-bounce, [class*="animate-"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
});

InteractiveQuantumPillars.displayName = 'InteractiveQuantumPillars';

export default InteractiveQuantumPillars;