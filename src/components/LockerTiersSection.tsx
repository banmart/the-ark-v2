import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface LockerTiersSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const LockerTiersSection = ({
  contractData,
  contractLoading
}: LockerTiersSectionProps) => {
  const [systemPhase, setSystemPhase] = useState(0);
  const [activeTier, setActiveTier] = useState(0);

  useEffect(() => {
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 1000, phase: 2 },
      { delay: 1800, phase: 3 }
    ];
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setSystemPhase(phase), delay);
    });

    const interval = setInterval(() => {
      setActiveTier(prev => (prev + 1) % 7);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const tiers = [
    {
      name: 'BRONZE',
      icon: '⛵',
      colorClass: 'text-white/60',
      accentClass: 'text-white/40',
      glowColor: 'rgba(255, 255, 255, 0.1)',
      borderGlow: 'rgba(255, 255, 255, 0.05)',
      duration: '30-89 Days',
      multiplier: '1x',
      features: ['Protocol entry level', 'Share in vault rewards', 'Utility access enabled', 'Protected from dilution'],
      gradient: 'from-white/5 to-transparent',
      buttonGradient: 'from-white/10 to-white/5',
      status: 'INITIATE'
    },
    {
      name: 'SILVER',
      icon: '🛡️',
      colorClass: 'text-white/70',
      accentClass: 'text-white/50',
      glowColor: 'rgba(255, 255, 255, 0.15)',
      borderGlow: 'rgba(255, 255, 255, 0.1)',
      duration: '90-179 Days',
      multiplier: '1.5x',
      features: ['1.5x rewards multiplier', 'Enhanced vault share', 'Silver role & privileges', 'Priority support'],
      gradient: 'from-white/5 to-transparent',
      buttonGradient: 'from-white/10 to-white/5',
      status: 'FAITHFUL'
    },
    {
      name: 'GOLD',
      icon: '👑',
      colorClass: 'text-white/80',
      accentClass: 'text-white/60',
      glowColor: 'rgba(255, 255, 255, 0.2)',
      borderGlow: 'rgba(255, 255, 255, 0.15)',
      duration: '180-364 Days',
      multiplier: '2x',
      features: ['2x rewards multiplier', 'Gold tier benefits', 'Governance participation', 'Exclusive features access'],
      gradient: 'from-white/5 to-transparent',
      buttonGradient: 'from-white/10 to-white/5',
      status: 'STEWARD'
    },
    {
      name: 'DIAMOND',
      icon: '💎',
      colorClass: 'text-white/90',
      accentClass: 'text-white/70',
      glowColor: 'rgba(255, 255, 255, 0.25)',
      borderGlow: 'rgba(255, 255, 255, 0.2)',
      duration: '1-2 Years',
      multiplier: '3x',
      features: ['3x rewards multiplier', 'Diamond hand status', 'VIP community access', 'Special event invites'],
      gradient: 'from-white/5 to-transparent',
      buttonGradient: 'from-white/10 to-white/5',
      status: 'GUARDIAN'
    },
    {
      name: 'PLATINUM',
      icon: '⭐',
      colorClass: 'text-white',
      accentClass: 'text-white/80',
      glowColor: 'rgba(255, 255, 255, 0.3)',
      borderGlow: 'rgba(255, 255, 255, 0.25)',
      duration: '2-3 Years',
      multiplier: '4x',
      features: ['4x rewards multiplier', 'Platinum elite status', 'Development influence', 'Strategic decision input'],
      gradient: 'from-white/5 to-transparent',
      buttonGradient: 'from-white/10 to-white/5',
      status: 'COVENANT HIGH'
    },
    {
      name: 'MYTHIC',
      icon: '🔮',
      colorClass: 'text-white',
      accentClass: 'text-white/90',
      glowColor: 'rgba(255, 255, 255, 0.35)',
      borderGlow: 'rgba(255, 255, 255, 0.3)',
      duration: '3-4 Years',
      multiplier: '5x',
      features: ['5x rewards multiplier', 'Mythic priority access', 'Exclusive protocol insights', 'Core governance member'],
      gradient: 'from-white/5 to-transparent',
      buttonGradient: 'from-white/10 to-white/5',
      special: true,
      status: 'MYTHIC KEEPER'
    },
    {
      name: 'LEGENDARY',
      icon: '⚡',
      colorClass: 'text-ark-gold-400',
      accentClass: 'text-ark-gold-500',
      glowColor: 'rgba(251, 146, 60, 0.5)',
      borderGlow: 'rgba(251, 146, 60, 0.4)',
      duration: '4-5 Years',
      multiplier: '7x',
      features: ['7x rewards multiplier', 'Legendary ARK status', 'Ultimate vault rewards', 'Max governance weight', 'Premium ecosystem tier'],
      gradient: 'from-orange-500/10 via-red-500/5 to-transparent',
      buttonGradient: 'from-orange-500 to-red-500',
      special: true,
      status: 'LEGENDARY'
    }
  ];




  const TierCard = ({ tier, index }: { tier: typeof tiers[0]; index: number }) => {
    const isActive = activeTier === index;
    
    return (
      <div 
        className="relative group"
        style={{
          filter: isActive ? `drop-shadow(0 0 30px ${tier.glowColor})` : 'none',
          transition: 'filter 0.5s ease-out'
        }}
      >
        {/* Outer glow ring */}
        <div 
          className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${tier.glowColor}, transparent 50%, ${tier.glowColor})`,
            filter: `blur(8px)`
          }}
        />
        
        {/* Main card */}
        <div 
          className={`relative liquid-glass border rounded-2xl p-6 
            transition-all duration-500 overflow-hidden
            hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]
            ${tier.special ? 'border-ark-gold-500/30' : 'border-white/5'}
            ${isActive ? 'border-white/20' : ''}`}
        >
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} rounded-2xl opacity-60`} />
          
          {isActive && (
            <div 
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{ 
                background: `radial-gradient(circle at center, ${tier.borderGlow} 0%, transparent 70%)`,
                opacity: 0.3
              }}
            />
          )}

          <div className="relative z-10 pt-4">
            <h3 className="text-center mb-1">
              <span 
                className="text-xl font-black font-mono tracking-wider"
                style={{
                  background: tier.special 
                    ? 'linear-gradient(135deg, #fb923c, #ef4444, #fb923c)' 
                    : `linear-gradient(135deg, ${tier.glowColor.replace('0.4', '1').replace('0.5', '1')}, white)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: `0 0 30px ${tier.borderGlow}`
                }}
              >
                [{tier.name}]
              </span>
            </h3>
            
            <div className="flex justify-center mb-5">
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] backdrop-blur border border-white/[0.08]">
                <span className={`${tier.colorClass} font-mono text-[10px] tracking-wide opacity-80 uppercase`}>
                  PERIOD: {tier.duration}
                </span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div 
                className="text-5xl font-black font-mono mb-1"
                style={{
                  background: tier.special 
                    ? 'linear-gradient(135deg, #fb923c, #ef4444)' 
                    : `linear-gradient(135deg, ${tier.glowColor.replace('0.4', '1').replace('0.5', '1')}, white 80%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: `drop-shadow(0 0 20px ${tier.borderGlow})`
                }}
              >
                {tier.multiplier}
              </div>
              <div className="text-white/40 font-mono text-[10px] tracking-[0.2em]">
                MULTIPLIER
              </div>
            </div>
            
            <ul className="space-y-2 mb-6">
              {tier.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start font-mono text-[10px]">
                  <span 
                    className="mr-2 mt-0.5"
                    style={{ 
                      color: tier.glowColor.replace('0.4', '1').replace('0.5', '1'),
                      textShadow: `0 0 10px ${tier.glowColor}`
                    }}
                  >
                    ▸
                  </span>
                  <span className="text-white/60 tracking-tight">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              to="/locker" 
              className={`block w-full py-3 rounded-xl text-center font-mono text-[10px] font-black tracking-[0.2em] uppercase
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                ${tier.special ? 'text-white' : 'text-black'}`}
              style={{
                background: tier.special 
                  ? 'linear-gradient(135deg, #ea580c, #dc2626)' 
                  : `linear-gradient(135deg, ${tier.glowColor.replace('0.4', '1').replace('0.5', '1')}, white)`,
                boxShadow: `0 10px 30px -10px ${tier.glowColor}`
              }}
            >
              {tier.special ? '⚡ LOCK ASSETS' : `ENTER POSITION`}
            </Link>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden rounded-2xl">
            <div 
              className="absolute top-0 left-0 w-full h-[2px] animate-[tierScan_2s_ease-in-out_infinite]"
              style={{
                background: `linear-gradient(90deg, transparent, ${tier.glowColor}, transparent)`
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative z-30 py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        <div className={`text-center mb-16 transition-all duration-1000 ${systemPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
            Locker Tiers
          </h2>

          <p className="text-white/50 text-sm md:text-lg max-w-3xl mx-auto font-mono leading-relaxed">
            Optimize capital efficiency through time-weighted liquidity locks. Select a duration to determine your yield multiplier and protocol governance influence.
          </p>
        </div>

        <div className={`relative transition-all duration-1000 delay-500 ${systemPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile View (Accordion) */}
          <div className="md:hidden">
            <Accordion type="single" collapsible className="space-y-4">
              {tiers.map((tier, index) => (
                <AccordionItem 
                  key={tier.name} 
                  value={tier.name}
                  className="relative liquid-glass rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group border-b-0"
                >
                  <AccordionTrigger className="hover:no-underline p-5 w-full">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-5">
                        <div className="text-left">
                          <p className="text-sm font-black text-white uppercase tracking-tighter">[{tier.name}]</p>
                          <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">{tier.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white font-mono tracking-tighter">{tier.multiplier}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-6">
                    <div className="pt-4 border-t border-white/5 space-y-6">
                      <ul className="space-y-3">
                        {tier.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start font-mono text-[11px] leading-tight">
                            <span className="mr-2 text-white/40">▸</span>
                            <span className="text-white/60">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link 
                        to="/locker" 
                        className={`block w-full py-4 rounded-xl text-center font-mono text-xs font-black tracking-widest uppercase transition-all
                          ${tier.special ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' : 'bg-white text-black'}`}
                      >
                        {tier.special ? '⚡ LOCK ASSETS' : `ENTER POSITION`}
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="hidden md:block relative">
            {/* Vertical Alpha Gradient Overlays removed for transparency */}
            
            {/* Infinite Scroller Container */}
            <div 
              className="relative overflow-hidden py-12"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
              }}
            >
              <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused] w-max">
                {[...tiers, ...tiers, ...tiers].map((tier, index) => (
                  <div 
                    key={`${tier.name}-${index}`} 
                    className="flex-shrink-0 w-[320px]"
                  >
                    <TierCard tier={tier} index={index % tiers.length} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        @keyframes tierScan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(calc(100vh)); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default LockerTiersSection;
