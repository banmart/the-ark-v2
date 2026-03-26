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
    return '255, 255, 255';
  };

  const TierCard = ({ tier, index }: { tier: any; index: number }) => {
    const isActive = activeTier === index;
    const colorRGB = getTierColorRGB(tier.name);

    return (
      <div 
        className={`relative group overflow-hidden rounded-2xl transition-all duration-500 pb-12 ${isActive ? 'scale-105 z-10' : 'hover:scale-102 opacity-60'}`}
      >
        <div className={`relative liquid-glass rounded-2xl p-6 transition-all duration-500 border border-white/10 ${isActive ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5'}`}>
          <div className="relative z-10 text-center space-y-4">
            <div className="text-3xl filter grayscale brightness-200">
              {tier.icon}
            </div>

            <h4 className="text-[10px] font-black font-mono tracking-[0.2em] text-white uppercase opacity-40">
              {tier.name}
            </h4>
            
            <div className="text-3xl font-black font-mono tracking-tighter text-white">
              {tier.multiplier}
            </div>
            
            <div className="text-[9px] text-white/20 font-mono font-bold tracking-widest uppercase truncate px-2">
              {tier.duration}
            </div>
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
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Tier Grid */}
        <div className={`
          grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-4
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
