import React, { useState, useEffect } from 'react';
import { tiers } from './tier-legend/tierData';

const CompactTierDisplay = () => {
  const [systemPhase, setSystemPhase] = useState(0);
  const [activeTier, setActiveTier] = useState(0);

  useEffect(() => {
    // System initialization sequence
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 600, phase: 2 },
      { delay: 900, phase: 3 }
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setSystemPhase(phase), delay);
    });

    // Rotating tier highlight
    const interval = setInterval(() => {
      setActiveTier(prev => (prev + 1) % 6);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const TierCard = ({ tier, index }: { tier: any; index: number }) => {
    const isActive = activeTier === index;
    
    return (
      <div className={`
        relative bg-black/30 backdrop-blur-sm border rounded-lg p-4 
        hover:scale-105 transition-all duration-300 group overflow-hidden
        ${tier.special ? 'border-orange-400/40 shadow-lg shadow-orange-400/20' : `border-${tier.color}/30`}
        ${isActive ? `shadow-md shadow-${tier.color}/20 border-${tier.color}/50` : ''}
      `}>
        
        {/* Status Indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-1.5 h-1.5 bg-${tier.color} rounded-full animate-pulse`}></div>
        </div>

        {/* Special Badge for Legendary */}
        {tier.special && (
          <div className="absolute top-1 left-1 bg-orange-400/20 border border-orange-400/40 text-orange-400 px-1 py-0.5 rounded text-xs font-mono">
            LEG
          </div>
        )}

        {/* Active Tier Pulse */}
        {isActive && (
          <div className={`absolute inset-0 bg-gradient-to-br from-${tier.color}/10 to-transparent opacity-50 animate-pulse rounded-lg`}></div>
        )}

        <div className="relative z-10 text-center">
          {/* Tier Icon */}
          <div className={`text-2xl mb-2 ${tier.special ? 'animate-pulse' : ''} ${isActive ? 'animate-bounce' : ''}`}>
            {tier.icon}
          </div>

          {/* Tier Title */}
          <h4 className={`text-sm font-bold text-${tier.color} font-mono mb-1`}>
            {tier.name}
          </h4>
          
          {/* Multiplier */}
          <div className={`text-lg font-black font-mono mb-1 ${
            tier.special 
              ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' 
              : `text-${tier.color}`
          }`}>
            {tier.multiplier}
          </div>
          
          {/* Duration */}
          <div className="text-xs text-gray-400 font-mono">
            {tier.duration}
          </div>
        </div>

        {/* Scan Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-${tier.color} to-transparent animate-[scan_1.5s_ease-in-out_infinite]`}></div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative max-w-6xl mx-auto px-6 py-8">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* System Header */}
        <div className={`text-center mb-8 transition-all duration-700 ${
          systemPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="text-xs font-mono text-cyan-400/60 mb-2 tracking-wider">
            [SACRED_LOCKER_TIERS]
          </div>
          <h2 className="text-xl font-bold text-cyan-400 font-mono">
            Tier Overview
          </h2>
        </div>

        {/* Tier Grid */}
        <div className={`
          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4
          transition-all duration-700 delay-300 ${
            systemPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }
        `}>
          {tiers.map((tier, index) => (
            <TierCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default CompactTierDisplay;