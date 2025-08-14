import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Flame, Users, Droplets, Lock, ArrowRight, Database } from 'lucide-react';
import { useContractData } from '../hooks/useContractData';
import { useARKTokenData } from '../hooks/useARKTokenData';
import { useLockerData } from '../hooks/useLockerData';

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
}

const InteractiveQuantumPillars = () => {
  const [activePillar, setActivePillar] = useState(0);
  const [pillarsLoaded, setPillarsLoaded] = useState(false);
  
  const { data: contractData, loading: contractLoading } = useContractData();
  const { data: tokenData, loading: tokenLoading } = useARKTokenData();
  const { protocolStats, userStats, loading: lockerLoading } = useLockerData();

  useEffect(() => {
    // Animate pillars on load
    const timer = setTimeout(() => setPillarsLoaded(true), 500);
    
    // Rotate active pillar every 4 seconds
    const interval = setInterval(() => {
      setActivePillar(prev => (prev + 1) % 4);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const getStateColor = (state: PillarState) => {
    switch (state) {
      case 'MONITORING': return 'blue';
      case 'ACTIVE': return 'green';
      case 'THRESHOLD_REACHED': return 'yellow';
      case 'PROCESSING': return 'orange';
      case 'ACCUMULATING': return 'purple';
      default: return 'blue';
    }
  };

  const getPillarsData = (): PillarData[] => {
    const burnRate = typeof tokenData?.dailyBurnRate === 'number' ? tokenData.dailyBurnRate : 0;
    const currentVolume = typeof tokenData?.volume24h === 'number' ? tokenData.volume24h : 0;
    const reflectionRate = currentVolume * 0.02; // 2% of volume for reflections
    const liquidityThreshold = contractData?.swapSettings?.threshold ? parseFloat(contractData.swapSettings.threshold) : 1000;
    const currentLiquidity = contractData?.liquidityData?.currentAccumulation ? parseFloat(contractData.liquidityData.currentAccumulation) : 0;
    const totalLocked = typeof protocolStats?.totalLockedTokens === 'number' ? protocolStats.totalLockedTokens : 0;
    const rewardPool = typeof protocolStats?.rewardPool === 'number' ? protocolStats.rewardPool : 0;
    const burnedTokens = tokenData?.burnedTokens ? (typeof tokenData.burnedTokens === 'number' ? tokenData.burnedTokens : parseFloat(tokenData.burnedTokens.toString())) : 0;

    return [
      {
        id: 0,
        icon: Flame,
        emoji: '🔥',
        title: 'BURN PROTOCOL',
        subtitle: 'Molecular Disintegration',
        description: 'Real-time token burning with quantum incineration to void address plus automated LP destruction.',
        color: 'red',
        gradient: 'from-red-500 to-orange-500',
        value: burnRate,
        maxValue: 100000,
        unit: 'ARK/day',
        state: burnRate > 0 ? 'ACTIVE' : 'MONITORING',
        liveData: burnedTokens > 0 ? `${(burnedTokens / 1000000).toFixed(2)}M BURNED` : 'LOADING...',
        actionText: 'VIEW_BURN_HISTORY'
      },
      {
        id: 1,
        icon: Users,
        emoji: '🫂',
        title: 'REFLECTION MATRIX',
        subtitle: 'Quantum Redistribution',
        description: 'Autonomous redistribution to holders based on molecular weight with extended holding amplification.',
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-500',
        value: reflectionRate,
        maxValue: 50000,
        unit: 'ARK/day',
        state: reflectionRate > 0 ? 'ACTIVE' : 'MONITORING',
        liveData: currentVolume > 0 ? `${(currentVolume / 1000).toFixed(1)}K VOLUME` : 'LOADING...',
        actionText: 'VIEW_REFLECTIONS'
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
        state: currentLiquidity >= liquidityThreshold ? 'THRESHOLD_REACHED' : 
               currentLiquidity > 0 ? 'ACCUMULATING' : 'MONITORING',
        liveData: tokenData?.liquidity ? `$${(typeof tokenData.liquidity === 'number' ? tokenData.liquidity / 1000 : parseFloat(tokenData.liquidity.toString()) / 1000).toFixed(1)}K TVL` : 'LOADING...',
        actionText: 'VIEW_LIQUIDITY'
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
        value: rewardPool,
        maxValue: 1000000,
        unit: 'ARK',
        state: totalLocked > 0 ? 'ACCUMULATING' : 'MONITORING',
        liveData: totalLocked > 0 ? `${(totalLocked / 1000000).toFixed(2)}M LOCKED` : 'LOADING...',
        actionText: 'ENTER_VAULT'
      }
    ];
  };

  const pillarsData = getPillarsData();
  const loading = contractLoading || tokenLoading || lockerLoading;

  return (
    <section id="quantum-pillars" className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 to-black/30">
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
            <span>[QUANTUM_ARCHITECTURE_SCAN]</span>
            <Database className="w-3 h-3 animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-cyan-400">
            <span className="animate-[glitch_4s_ease-in-out_infinite]">INTERACTIVE</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_0.5s_infinite]">QUANTUM</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_1s_infinite]">PILLARS</span>
          </h2>
          
          <div className="text-sm text-gray-400 font-mono">
            [LIVE_BLOCKCHAIN_DATA_INTERFACE]
          </div>
        </div>

        {/* Interactive Pillars Grid - 2x2 Layout */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 delay-300 ${pillarsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {pillarsData.map((pillar, index) => {
            const IconComponent = pillar.icon;
            const isActive = activePillar === pillar.id;
            const percentage = pillar.maxValue > 0 ? Math.min((pillar.value / pillar.maxValue) * 100, 100) : 0;
            const stateColor = getStateColor(pillar.state);

            return (
              <Card 
                key={pillar.id} 
                className={`relative bg-black/60 backdrop-blur-xl border-2 rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 cursor-pointer ${
                  isActive 
                    ? `border-${pillar.color}-500/80 shadow-lg shadow-${pillar.color}-500/30` 
                    : `border-${pillar.color}-500/30 hover:border-${pillar.color}-500/60`
                }`}
              >
                <CardContent className="p-6">
                  {/* Status Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-5 h-5 text-${pillar.color}-400`} />
                      <div className={`w-2 h-2 bg-${stateColor}-400 rounded-full ${pillar.state === 'ACTIVE' ? 'animate-pulse' : ''}`}></div>
                    </div>
                    <div className={`text-${stateColor}-400 font-mono text-xs px-2 py-1 bg-${stateColor}-500/20 border border-${stateColor}-500/30 rounded`}>
                      {pillar.state}
                    </div>
                  </div>

                  {/* Pillar Icon & Title */}
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2 group-hover:animate-bounce transition-all">
                      {pillar.emoji}
                    </div>
                    <h3 className={`text-lg font-bold text-${pillar.color}-400 font-mono mb-1`}>
                      {pillar.title}
                    </h3>
                    <div className={`text-xs text-${pillar.color}-300/60 font-mono mb-2`}>
                      [{pillar.subtitle}]
                    </div>
                  </div>

                  {/* Live Data Display */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-mono">
                        LIVE_DATA
                      </span>
                      <span className={`text-xs text-${pillar.color}-400 font-mono`}>
                        {loading ? '[LOADING...]' : pillar.liveData}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative mb-2">
                      <Progress 
                        value={loading ? 0 : percentage}
                        className={`h-3 bg-gray-800/50 ${pillar.state === 'THRESHOLD_REACHED' ? 'animate-pulse' : ''}`}
                      />
                      {pillar.state === 'PROCESSING' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent animate-[scan_1s_ease-in-out_infinite]" />
                      )}
                    </div>
                    
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-500">
                        {loading ? '[LOADING...]' : `${pillar.value.toLocaleString()} ${pillar.unit}`}
                      </span>
                      <span className={`text-${pillar.color}-400`}>
                        {loading ? '[LOADING...]' : `${pillar.maxValue.toLocaleString()} ${pillar.unit}`}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-xs leading-relaxed mb-4">
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
                  <div className={`absolute inset-0 bg-gradient-to-r ${pillar.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`}></div>
                  
                  {/* Active Pillar Pulse */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${pillar.gradient} opacity-5 animate-pulse rounded-xl`}></div>
                  )}

                  {/* Scan Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${pillar.gradient} animate-[scan_2s_ease-in-out_infinite]`}></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Status Footer */}
        <div className={`text-center mt-8 transition-all duration-1000 delay-700 ${pillarsLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/40 font-mono text-xs">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>[QUANTUM_FIELD_SYNCHRONIZATION_COMPLETE]</span>
            <Activity className="w-3 h-3 animate-pulse" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </section>
  );
};

export default InteractiveQuantumPillars;