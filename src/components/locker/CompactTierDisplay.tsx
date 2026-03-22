import React, { useState, useEffect } from 'react';
import { tiers } from './tier-legend/tierData';

const CompactTierDisplay = () => {
  const [systemPhase, setSystemPhase] = useState(0);
  const [activeTier, setActiveTier] = useState(0);

  useEffect(() => {
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 600, phase: 2 },
      { delay: 900, phase: 3 }
    ];
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setSystemPhase(phase), delay);
    });

    const interval = setInterval(() => {
      setActiveTier(prev => (prev + 1) % 7);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTierColorRGB = (tierName: string) => {
    const colors: Record<string, string> = {
      'Bronze': '205, 127, 50',
      'Silver': '192, 192, 192',
      'Gold': '255, 215, 0',
      'Diamond': '96, 165, 250',
      'Platinum': '167, 139, 250',
      'Mythic': '139, 92, 246',
      'Legendary': '251, 146, 60'
    };
    return colors[tierName] || '34, 211, 238';
  };

  const TierCard = ({ tier, index }: { tier: any; index: number }) => {
    const isActive = activeTier === index;
    const colorRGB = getTierColorRGB(tier.name);

    return (
      <div 
        className={`
          relative group overflow-hidden rounded-xl transition-all duration-500
          ${isActive ? 'scale-105 z-10' : 'hover:scale-102'}
        `}
        style={{
          animationDelay: `${index * 100}ms`
        }}
      >
        {/* Outer glow ring */}
        <div 
          className={`absolute -inset-0.5 rounded-xl blur-sm transition-opacity duration-500 ${isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'}`}
          style={{ background: `rgba(${colorRGB}, 0.5)` }}
        ></div>
        
        {/* Card container */}
        <div 
          className={`
            relative bg-black/50 backdrop-blur-xl border rounded-xl p-4 
            transition-all duration-500
            ${tier.special ? 'border-orange-400/50' : 'border-white/[0.08]'}
            ${isActive ? 'border-opacity-100' : 'group-hover:border-opacity-50'}
          `}
          style={{
            borderColor: isActive ? `rgba(${colorRGB}, 0.6)` : undefined
          }}
        >
          {/* Inner glow */}
          <div 
            className={`absolute inset-0 rounded-xl transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
            style={{ 
              background: `radial-gradient(ellipse at center, rgba(${colorRGB}, 0.1) 0%, transparent 70%)`
            }}
          ></div>
          
          {/* Status Indicator */}
          <div className="absolute top-2 right-2">
            <div className="relative">
              <div 
                className={`absolute inset-0 rounded-full blur-sm ${isActive ? 'animate-ping' : ''}`}
                style={{ background: `rgba(${colorRGB}, 0.5)` }}
              ></div>
              <div 
                className="relative w-2 h-2 rounded-full"
                style={{ background: `rgb(${colorRGB})` }}
              ></div>
            </div>
          </div>

          {/* Special Badge for Legendary */}
          {tier.special && (
            <div className="absolute top-1 left-1 bg-orange-400/20 border border-orange-400/50 text-orange-400 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">
              LEG
            </div>
          )}

          <div className="relative z-10 text-center">
            {/* Tier Icon with glow */}
            <div className="relative mb-3">
              <div 
                className={`absolute inset-0 flex items-center justify-center blur-lg transition-opacity duration-500 ${isActive ? 'opacity-60' : 'opacity-0'}`}
              >
                <span className="text-3xl">{tier.icon}</span>
              </div>
              <div className={`text-2xl md:text-3xl ${tier.special ? 'animate-pulse' : ''} ${isActive ? 'animate-bounce' : ''}`}>
                {tier.icon}
              </div>
            </div>

            {/* Tier Title */}
            <h4 
              className="text-sm font-bold font-mono mb-1 transition-all duration-300"
              style={{ color: `rgb(${colorRGB})` }}
            >
              {tier.name}
            </h4>
            
            {/* Multiplier with gradient */}
            <div className="text-lg md:text-xl font-black font-mono mb-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              {tier.multiplier}
            </div>
            
            {/* Duration */}
            <div className="text-xs text-gray-400 font-mono">
              {tier.duration}
            </div>
          </div>

          {/* Scan Effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden rounded-xl">
            <div 
              className="absolute top-0 left-0 w-full h-0.5 animate-[tierScan_2s_ease-in-out_infinite]"
              style={{ background: `linear-gradient(to right, transparent, rgba(${colorRGB}, 0.8), transparent)` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative max-w-6xl mx-auto px-6 py-8">
      {/* Premium Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.3) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Tier Grid */}
        <div className={`
          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4
          transition-all duration-700 delay-300 ${systemPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          {tiers.map((tier, index) => (
            <TierCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tierScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default CompactTierDisplay;
