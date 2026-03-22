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
      colorClass: 'text-yellow-600',
      accentClass: 'text-yellow-400',
      glowColor: 'rgba(202, 138, 4, 0.4)',
      borderGlow: 'rgba(202, 138, 4, 0.3)',
      duration: '30-89 Days',
      multiplier: '1x',
      features: ['Entry level blessing', 'Share in vault rewards', 'Bronze role in community', 'Protected from the flood'],
      gradient: 'from-yellow-600/20 via-yellow-700/10 to-transparent',
      buttonGradient: 'from-yellow-600 to-yellow-500',
      status: 'ENTRY_LEVEL'
    },
    {
      name: 'SILVER',
      icon: '🛡️',
      colorClass: 'text-gray-300',
      accentClass: 'text-gray-200',
      glowColor: 'rgba(209, 213, 219, 0.4)',
      borderGlow: 'rgba(209, 213, 219, 0.3)',
      duration: '90-179 Days',
      multiplier: '1.5x',
      features: ['1.5x rewards multiplier', 'Enhanced vault share', 'Silver role & privileges', 'Priority support'],
      gradient: 'from-gray-300/20 via-gray-400/10 to-transparent',
      buttonGradient: 'from-gray-300 to-gray-200',
      status: 'ENHANCED'
    },
    {
      name: 'GOLD',
      icon: '👑',
      colorClass: 'text-yellow-400',
      accentClass: 'text-yellow-300',
      glowColor: 'rgba(250, 204, 21, 0.4)',
      borderGlow: 'rgba(250, 204, 21, 0.3)',
      duration: '180-364 Days',
      multiplier: '2x',
      features: ['2x rewards multiplier', 'Gold tier benefits', 'Governance participation', 'Exclusive features access'],
      gradient: 'from-yellow-400/20 via-yellow-500/10 to-transparent',
      buttonGradient: 'from-yellow-400 to-yellow-300',
      status: 'PRIVILEGED'
    },
    {
      name: 'DIAMOND',
      icon: '💎',
      colorClass: 'text-cyan-400',
      accentClass: 'text-cyan-300',
      glowColor: 'rgba(34, 211, 238, 0.4)',
      borderGlow: 'rgba(34, 211, 238, 0.3)',
      duration: '1-2 Years',
      multiplier: '3x',
      features: ['3x rewards multiplier', 'Diamond hand status', 'VIP community access', 'Special event invites'],
      gradient: 'from-cyan-400/20 via-cyan-500/10 to-transparent',
      buttonGradient: 'from-cyan-400 to-cyan-300',
      status: 'VIP_ACCESS'
    },
    {
      name: 'PLATINUM',
      icon: '⭐',
      colorClass: 'text-purple-400',
      accentClass: 'text-purple-300',
      glowColor: 'rgba(192, 132, 252, 0.4)',
      borderGlow: 'rgba(192, 132, 252, 0.3)',
      duration: '2-3 Years',
      multiplier: '4x',
      features: ['4x rewards multiplier', 'Platinum elite status', 'Development influence', 'Strategic decision input'],
      gradient: 'from-purple-400/20 via-purple-500/10 to-transparent',
      buttonGradient: 'from-purple-400 to-purple-300',
      status: 'ELITE_TIER'
    },
    {
      name: 'MYTHIC',
      icon: '🔮',
      colorClass: 'text-violet-400',
      accentClass: 'text-violet-300',
      glowColor: 'rgba(139, 92, 246, 0.4)',
      borderGlow: 'rgba(139, 92, 246, 0.3)',
      duration: '3-4 Years',
      multiplier: '5x',
      features: ['5x rewards multiplier', 'Mythic inner circle', 'Exclusive protocol insights', 'Core governance member'],
      gradient: 'from-violet-400/20 via-violet-500/10 to-transparent',
      buttonGradient: 'from-violet-400 to-violet-300',
      special: true,
      status: 'MYTHIC_REALM'
    },
    {
      name: 'LEGENDARY',
      icon: '⚡',
      colorClass: 'text-orange-400',
      accentClass: 'text-red-400',
      glowColor: 'rgba(251, 146, 60, 0.5)',
      borderGlow: 'rgba(251, 146, 60, 0.4)',
      duration: '4-5 Years',
      multiplier: '7x',
      features: ['7x rewards multiplier', 'Legendary ARK status', 'Ultimate vault rewards', 'True Noah privileges', 'Lead the new world'],
      gradient: 'from-orange-500/20 via-red-500/10 to-transparent',
      buttonGradient: 'from-orange-500 to-red-500',
      special: true,
      status: 'LEGENDARY'
    }
  ];

  // Floating particles with tier colors
  const particles = [
    { size: 3, x: 8, y: 15, delay: 0, color: 'rgba(202, 138, 4, 0.6)' },
    { size: 2, x: 92, y: 25, delay: 2, color: 'rgba(209, 213, 219, 0.5)' },
    { size: 4, x: 15, y: 70, delay: 1, color: 'rgba(250, 204, 21, 0.6)' },
    { size: 2, x: 85, y: 80, delay: 3, color: 'rgba(34, 211, 238, 0.6)' },
    { size: 3, x: 25, y: 40, delay: 0.5, color: 'rgba(192, 132, 252, 0.5)' },
    { size: 4, x: 75, y: 55, delay: 2.5, color: 'rgba(251, 146, 60, 0.6)' },
    { size: 3, x: 50, y: 45, delay: 1.2, color: 'rgba(139, 92, 246, 0.5)' },
    { size: 2, x: 45, y: 20, delay: 1.5, color: 'rgba(34, 211, 238, 0.4)' },
    { size: 3, x: 55, y: 85, delay: 3.5, color: 'rgba(250, 204, 21, 0.5)' },
    { size: 2, x: 35, y: 60, delay: 0.8, color: 'rgba(192, 132, 252, 0.4)' },
    { size: 3, x: 65, y: 35, delay: 2.2, color: 'rgba(251, 146, 60, 0.5)' },
    { size: 2, x: 20, y: 90, delay: 1.8, color: 'rgba(202, 138, 4, 0.4)' },
    { size: 4, x: 80, y: 10, delay: 0.3, color: 'rgba(209, 213, 219, 0.6)' },
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
          className={`relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 
            transition-all duration-500 overflow-hidden
            hover:bg-white/[0.05] hover:border-white/[0.15] hover:-translate-y-2 hover:scale-[1.02]
            ${tier.special ? 'border-orange-500/30' : ''}
            ${isActive ? 'border-white/20' : ''}`}
          style={{
            boxShadow: isActive 
              ? `0 20px 60px -10px ${tier.borderGlow}, inset 0 1px 0 0 rgba(255,255,255,0.1)` 
              : 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
          }}
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
    <section className="relative z-30 py-24 px-6 overflow-hidden">
      {/* === PREMIUM BACKGROUND LAYERS === */}
      
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-cyan-950/10 to-black/30" />
      
      {/* Deep vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      {/* Animated gradient orbs */}
      <div 
        className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
          animationDuration: '8s'
        }}
      />
      <div 
        className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.4) 0%, transparent 70%)',
          animationDuration: '10s',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[150px] animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%)',
          animationDuration: '12s',
          animationDelay: '4s'
        }}
      />
      <div 
        className="absolute bottom-40 left-[30%] w-[350px] h-[350px] rounded-full opacity-15 blur-[100px] animate-pulse"
        style={{ 
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)',
          animationDuration: '9s',
          animationDelay: '1s'
        }}
      />

      {/* Film grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Tech grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-[particleDrift_20s_ease-in-out_infinite]"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Corner glow accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-600/10 to-transparent blur-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-500/10 to-transparent blur-3xl" />

      {/* === CONTENT === */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Premium Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${systemPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Glassmorphism badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]">
              <Database 
                className="w-5 h-5 text-cyan-400" 
                style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))' }}
              />
              <span className="text-cyan-400/90 font-mono text-sm tracking-[0.2em]">
                TIER SYSTEM ONLINE
              </span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }} />
            </div>
          </div>

          {/* Premium title */}
          <h2 
            className="text-4xl md:text-6xl font-black font-mono mb-4"
            style={{
              background: 'linear-gradient(135deg, #22d3ee 0%, #facc15 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(34, 211, 238, 0.3))'
            }}
          >
            [LOCKER_TIERS]
          </h2>

          {/* Accent line */}
          <div className="flex justify-center mb-6">
            <div 
              className="w-32 h-[2px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.6), rgba(250, 204, 21, 0.6), rgba(192, 132, 252, 0.6), transparent)'
              }}
            />
          </div>

          {/* Description */}
          <p className="text-white/50 text-lg max-w-3xl mx-auto font-mono tracking-wide">
            Advanced tier system with multiplied rewards and exclusive benefits
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
        @keyframes particleDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(15px, -20px) scale(1.1); opacity: 0.8; }
          50% { transform: translate(-10px, -35px) scale(0.9); opacity: 0.5; }
          75% { transform: translate(20px, -15px) scale(1.05); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
};

export default LockerTiersSection;
