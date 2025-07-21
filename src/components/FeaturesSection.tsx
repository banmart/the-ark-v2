import React, { useState, useEffect } from 'react';
import { Flame, Users, Droplets, Lock, Zap, Database, Activity, Shield } from 'lucide-react';
const FeaturesSection = () => {
  const [pillarsPhase, setPillarsPhase] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  useEffect(() => {
    // Cinematic pillars revelation sequence
    const phases = [{
      delay: 300,
      phase: 1
    },
    // System scan
    {
      delay: 1000,
      phase: 2
    },
    // Pillars detected
    {
      delay: 1800,
      phase: 3
    } // Full activation
    ];
    phases.forEach(({
      delay,
      phase
    }) => {
      setTimeout(() => setPillarsPhase(phase), delay);
    });

    // Rotating pillar highlight
    const interval = setInterval(() => {
      setActivePillar(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const pillars = [{
    id: 0,
    icon: Flame,
    emoji: '🔥',
    title: 'BURN_PROTOCOL',
    subtitle: 'Molecular Disintegration',
    percentage: '2%',
    detail: '+ LP Token Burns',
    description: 'Permanent molecular disintegration through quantum incineration to void address plus automated LP token annihilation for maximum deflationary cascade.',
    color: 'red',
    status: 'ACTIVE_BURN',
    gradient: 'from-red-500 to-orange-500'
  }, {
    id: 1,
    icon: Users,
    emoji: '🫂',
    title: 'REFLECTION_MATRIX',
    subtitle: 'Quantum Redistribution',
    percentage: '2%',
    detail: 'Auto Redistribution',
    description: 'Autonomous quantum redistribution to all vessel holders based on molecular weight. Extended holding periods amplify reflection coefficients.',
    color: 'blue',
    status: 'DISTRIBUTING',
    gradient: 'from-blue-500 to-cyan-500'
  }, {
    id: 2,
    icon: Droplets,
    emoji: '💧',
    title: 'LIQUIDITY_ENGINE',
    subtitle: 'Fluid Dynamics Control',
    percentage: '3%',
    detail: 'Smart Threshold',
    description: 'Automated liquidity synthesis with quantum slippage protection. Threshold: 0.1% supply, Max: 0.2% supply for optimal market equilibrium.',
    color: 'purple',
    status: 'STABILIZING',
    gradient: 'from-purple-500 to-pink-500'
  }, {
    id: 3,
    icon: Lock,
    emoji: '🔒',
    title: 'VAULT_REWARDS',
    subtitle: 'Temporal Amplification',
    percentage: '2%',
    detail: 'Vault Accumulation',
    description: 'Dedicated quantum vault rewards for temporal commitment. Earn amplified rewards through time-lock mechanics with up to 8x multipliers.',
    color: 'green',
    status: 'ACCUMULATING',
    gradient: 'from-green-500 to-teal-500'
  }];
  return <section id="features" className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 to-black/30">
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${pillarsPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/60 font-mono text-xs mb-4">
            <Database className="w-3 h-3 animate-pulse" />
            <span>[QUANTUM_ARCHITECTURE_SCAN]</span>
            <Database className="w-3 h-3 animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-cyan-400">
            <span className="animate-[glitch_4s_ease-in-out_infinite]">THE FOUR</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_0.5s_infinite]">QUANTUM</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_1s_infinite]">PILLARS</span>
          </h2>
          
          <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6">
            <p className="text-lg text-gray-200 mb-2">
              <span className="text-cyan-400 font-mono">[ARCHITECTURE_BRIEF]</span> The ARK's quantum foundation rests upon four 
              <span className="text-purple-400 font-bold"> divine pillars</span>, creating a 
              <span className="text-teal-400 font-semibold"> deflationary ecosystem</span> with maximum security protocols 
              and amplified rewards for the faithful.
            </p>
            <div className="text-sm text-gray-400 font-mono">
              Each pillar operates autonomously while maintaining quantum entanglement with the core matrix.
            </div>
          </div>
        </div>

        {/* Quantum Pillars Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-500 ${pillarsPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {pillars.map((pillar, index) => {
          const IconComponent = pillar.icon;
          const isActive = activePillar === pillar.id;
          return <div key={pillar.id} className={`relative bg-black/40 backdrop-blur-xl border rounded-xl p-6 hover:scale-105 transition-all duration-500 group overflow-hidden ${isActive ? `border-${pillar.color}-500/60 shadow-lg shadow-${pillar.color}-500/20` : `border-${pillar.color}-500/30 hover:border-${pillar.color}-500/50`}`}>
                {/* Animated Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${pillar.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`}></div>
                
                {/* Active Pillar Pulse */}
                {isActive && <div className={`absolute inset-0 bg-gradient-to-r ${pillar.gradient} opacity-5 animate-pulse rounded-xl`}></div>}

                {/* System Status */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <div className={`w-2 h-2 bg-${pillar.color}-400 rounded-full animate-pulse`}></div>
                  <span className={`text-${pillar.color}-400 font-mono text-xs`}>
                    {pillar.status}
                  </span>
                </div>

                {/* Pillar Icon */}
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <div className={`text-4xl mb-2 text-${pillar.color}-500 group-hover:animate-bounce transition-all`}>
                      {pillar.emoji}
                    </div>
                    <IconComponent className={`w-6 h-6 text-${pillar.color}-400 absolute -bottom-1 -right-1 opacity-60`} />
                  </div>
                </div>

                {/* Pillar Title */}
                <h3 className={`text-xl font-bold mb-2 text-${pillar.color}-400 text-center font-mono`}>
                  {pillar.title}
                </h3>
                <div className={`text-xs text-${pillar.color}-300/60 text-center mb-4 font-mono`}>
                  [{pillar.subtitle}]
                </div>

                {/* Metrics Display */}
                <div className="text-center mb-4">
                  <div className={`text-3xl font-black text-${pillar.color}-300 font-mono`}>
                    {pillar.percentage}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {pillar.detail}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-center text-sm leading-relaxed">
                  {pillar.description}
                </p>

                {/* Quantum Field Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-600/30">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono">
                    <Activity className={`w-3 h-3 text-${pillar.color}-400 animate-pulse`} />
                    <span className={`text-${pillar.color}-400`}>QUANTUM_FIELD_ACTIVE</span>
                  </div>
                </div>

                {/* Scan Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${pillar.gradient} animate-[scan_2s_ease-in-out_infinite]`}></div>
                </div>
              </div>;
        })}
        </div>

        {/* System Diagnostics */}
        
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </section>;
};
export default FeaturesSection;