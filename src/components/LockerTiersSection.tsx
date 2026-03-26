import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Database } from "lucide-react";

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
      features: ['Entry level blessing', 'Share in vault rewards', 'Bronze role in community', 'Protected from the flood'],
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
      features: ['5x rewards multiplier', 'Mythic inner circle', 'Exclusive protocol insights', 'Core governance member'],
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
      features: ['7x rewards multiplier', 'Legendary ARK status', 'Ultimate vault rewards', 'True Noah privileges', 'Lead the new world'],
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
          {/* Top edge highlight */}
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Quantum field background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} rounded-2xl opacity-60`} />
          
          {/* Active pulse effect */}
          {isActive && (
            <div 
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{ 
                background: `radial-gradient(circle at center, ${tier.borderGlow} 0%, transparent 70%)`,
                opacity: 0.3
              }}
            />
          )}

          {/* Status badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1]"
            >
              <div 
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: tier.glowColor.replace('0.4', '1').replace('0.5', '1') }}
              />
              <span className={`${tier.colorClass} font-mono text-[10px] tracking-wider`}>
                {tier.status}
              </span>
            </div>
          </div>

          {/* Legendary badge */}
          {tier.special && (
            <div className="absolute top-4 left-4">
              <div className="px-2.5 py-1 rounded-full bg-orange-500/10 backdrop-blur-xl border border-orange-500/30 animate-pulse">
                <span className="text-orange-400 font-mono text-[10px] tracking-widest">✦ LEGENDARY</span>
              </div>
            </div>
          )}

          <div className="relative z-10 pt-6">
            {/* Icon container */}
            <div className="flex justify-center mb-5">
              <div 
                className={`relative w-20 h-20 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] 
                  flex items-center justify-center transition-all duration-500
                  group-hover:scale-110 group-hover:border-white/20
                  ${isActive ? 'animate-bounce' : ''}`}
                style={{
                  boxShadow: `0 0 30px ${tier.borderGlow}, inset 0 1px 0 0 rgba(255,255,255,0.1)`
                }}
              >
                <span className={`text-5xl ${tier.special ? 'animate-pulse' : ''}`} style={{ filter: `drop-shadow(0 0 10px ${tier.glowColor})` }}>
                  {tier.icon}
                </span>
              </div>
            </div>

            {/* Tier title */}
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
            
            {/* Lock period badge */}
            <div className="flex justify-center mb-5">
              <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] backdrop-blur border border-white/[0.08]">
                <span className={`${tier.colorClass} font-mono text-xs tracking-wide opacity-80`}>
                  LOCK: {tier.duration}
                </span>
              </div>
            </div>

            {/* Multiplier display */}
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
                REWARD MULTIPLIER
              </div>
            </div>
            
            {/* Features list */}
            <ul className="space-y-2.5 mb-6">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start font-mono text-xs">
                  <span 
                    className="mr-2 mt-0.5"
                    style={{ 
                      color: tier.glowColor.replace('0.4', '1').replace('0.5', '1'),
                      textShadow: `0 0 10px ${tier.glowColor}`
                    }}
                  >
                    ▸
                  </span>
                  <span className="text-white/70">{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* CTA Button */}
            <Link 
              to="/locker" 
              className={`block w-full py-3.5 rounded-xl text-center font-mono text-sm font-bold
                transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5
                ${tier.special ? 'text-white' : 'text-black'}`}
              style={{
                background: tier.special 
                  ? 'linear-gradient(135deg, #ea580c, #dc2626)' 
                  : `linear-gradient(135deg, ${tier.glowColor.replace('0.4', '1').replace('0.5', '1')}, white)`,
                boxShadow: `0 10px 30px -10px ${tier.glowColor}`
              }}
            >
              {tier.special ? '⚡ ASCEND TO LEGEND' : `ENTER ${tier.name} →`}
            </Link>

            {/* Footer status */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05]">
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: tier.glowColor.replace('0.4', '0.8').replace('0.5', '0.8') }}
                />
                <span className="text-white/30 font-mono text-[9px] tracking-widest">
                  TIER ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Scan line effect */}
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
    <section className="relative z-30 py-24 px-6 bg-black">

      {/* === CONTENT === */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Premium Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${systemPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Glassmorphism badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10">
              <Database className="w-4 h-4 text-white/40" />
              <span className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">
                Temporal Alignment
              </span>
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Premium title */}
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
            THE HIERARCHY OF KEEPERS
          </h2>

          {/* Accent line */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <p className="text-white/50 text-base md:text-lg max-w-3xl mx-auto font-mono leading-relaxed">
            The sacred progression of the Covenant. Ascend through the ranks of the Keepers by the merit of your commitment.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${systemPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {tiers.map((tier, index) => (
            <div 
              key={tier.name} 
              className={`transition-all duration-700 ${systemPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <TierCard tier={tier} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
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
