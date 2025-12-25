import React, { useState, useEffect } from 'react';
import { Flame, Users, Droplets, Lock, Database, Activity, Sparkles } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const FeaturesSection = () => {
  const [pillarsPhase, setPillarsPhase] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Cinematic pillars revelation sequence
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 1000, phase: 2 },
      { delay: 1800, phase: 3 }
    ];
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setPillarsPhase(phase), delay);
    });

    // Rotating pillar highlight
    const interval = setInterval(() => {
      setActivePillar(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hardcoded pillars data with fixed percentages
  const pillars = [
    {
      id: 0,
      icon: Flame,
      emoji: '🔥',
      title: 'BURN PROTOCOL',
      subtitle: 'Molecular Disintegration',
      percentage: '2%',
      detail: 'Deflationary Mechanics',
      description: 'Permanent molecular disintegration through quantum incineration to void address plus automated LP token annihilation for maximum deflationary cascade.',
      color: 'red',
      status: 'ACTIVE BURN',
      gradient: 'from-red-500 to-orange-500',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      borderColor: 'border-red-500/30',
      borderHover: 'hover:border-red-500/60',
      textColor: 'text-red-400',
      liveMetric: 'Continuous burn rate'
    },
    {
      id: 1,
      icon: Users,
      emoji: '🫂',
      title: 'REFLECTION MATRIX',
      subtitle: 'Quantum Redistribution',
      percentage: '2%',
      detail: 'Holder Rewards',
      description: 'Autonomous quantum redistribution to all vessel holders based on molecular weight. Extended holding periods amplify reflection coefficients.',
      color: 'blue',
      status: 'DISTRIBUTING',
      gradient: 'from-blue-500 to-cyan-500',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      borderColor: 'border-blue-500/30',
      borderHover: 'hover:border-blue-500/60',
      textColor: 'text-blue-400',
      liveMetric: 'Active redistribution'
    },
    {
      id: 2,
      icon: Droplets,
      emoji: '💧',
      title: 'LIQUIDITY ENGINE',
      subtitle: 'Fluid Dynamics Control',
      percentage: '3%',
      detail: 'Market Stability',
      description: 'Automated liquidity synthesis with quantum slippage protection. Threshold: 0.1% supply, Max: 0.2% supply for optimal market equilibrium.',
      color: 'purple',
      status: 'ACCUMULATING',
      gradient: 'from-purple-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      borderColor: 'border-purple-500/30',
      borderHover: 'hover:border-purple-500/60',
      textColor: 'text-purple-400',
      liveMetric: 'Pool enhancement'
    },
    {
      id: 3,
      icon: Lock,
      emoji: '🔒',
      title: 'VAULT REWARDS',
      subtitle: 'Temporal Amplification',
      percentage: '2%',
      detail: 'Lock Incentives',
      description: 'Dedicated quantum vault rewards for temporal commitment. Earn amplified rewards through time-lock mechanics with up to 8x multipliers.',
      color: 'green',
      status: 'REWARDS ACTIVE',
      gradient: 'from-green-500 to-teal-500',
      glowColor: 'rgba(34, 197, 94, 0.4)',
      borderColor: 'border-green-500/30',
      borderHover: 'hover:border-green-500/60',
      textColor: 'text-green-400',
      liveMetric: 'Vault allocation'
    }
  ];

  // Generate floating particles
  const particles = Array.from({ length: isMobile ? 8 : 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20,
    color: ['red', 'blue', 'purple', 'green'][i % 4]
  }));

  const getParticleColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-400/60';
      case 'blue': return 'bg-blue-400/60';
      case 'purple': return 'bg-purple-400/60';
      case 'green': return 'bg-green-400/60';
      default: return 'bg-cyan-400/60';
    }
  };

  return (
    <section id="features" className="relative z-30 py-24 px-6 overflow-hidden">
      {/* ===== PREMIUM BACKGROUND LAYERS ===== */}
      
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
      
      {/* Deep vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Animated gradient orbs */}
      {!isMobile && (
        <>
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-red-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '-6s' }} />
          <div className="absolute bottom-40 left-[20%] w-[300px] h-[300px] bg-green-500/6 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '-2s' }} />
        </>
      )}
      
      {/* Film grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Premium grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${getParticleColor(particle.color)} pointer-events-none`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `particle-drift ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      {/* Corner color accents */}
      {!isMobile && (
        <>
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-red-500/10 to-transparent blur-3xl" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-green-500/10 to-transparent blur-3xl" />
        </>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ===== PREMIUM HEADER ===== */}
        <div className={`text-center mb-20 transition-all duration-1000 ${pillarsPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Glassmorphism badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-lg">
            <Database className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400/80 font-mono text-xs tracking-[0.2em]">[QUANTUM ARCHITECTURE SCAN]</span>
            <Database className="w-3 h-3 text-cyan-400 animate-pulse" />
          </div>
          
          {/* Premium gradient title */}
          <h2 className="mb-4 bg-gradient-to-r from-cyan-300 via-teal-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            THE FOUR QUANTUM PILLARS
          </h2>
          
          {/* Accent line */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <Sparkles className="w-4 h-4 text-cyan-400/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
        </div>

        {/* ===== PREMIUM PILLAR CARDS GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            const isActive = activePillar === pillar.id;
            const revealDelay = 150 * index;
            
            return (
              <div
                key={pillar.id}
                className={`relative group transition-all duration-700 ease-out ${
                  pillarsPhase >= 2 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${revealDelay}ms` }}
              >
                {/* Outer glow ring */}
                <div 
                  className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl ${
                    isActive ? 'opacity-60' : ''
                  }`}
                  style={{ background: pillar.glowColor }}
                />
                
                {/* Active pillar pulse ring */}
                {isActive && (
                  <div 
                    className="absolute -inset-2 rounded-2xl animate-pulse"
                    style={{ 
                      background: `linear-gradient(135deg, ${pillar.glowColor}, transparent)`,
                      opacity: 0.3
                    }}
                  />
                )}
                
                {/* Main card */}
                <div className={`relative bg-white/[0.02] backdrop-blur-xl border rounded-2xl p-6 overflow-hidden transition-all duration-500 ${pillar.borderColor} ${pillar.borderHover} ${
                  isActive ? 'border-opacity-80 shadow-2xl' : ''
                } group-hover:-translate-y-1 group-hover:shadow-2xl`}>
                  
                  {/* Top edge highlight */}
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 rounded-2xl`} />
                  
                  {/* Active pulse background */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-[0.03] animate-pulse rounded-2xl`} />
                  )}

                  {/* ===== STATUS BADGE ===== */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                      <div 
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ 
                          backgroundColor: pillar.glowColor.replace('0.4', '1'),
                          boxShadow: `0 0 6px ${pillar.glowColor}`
                        }}
                      />
                      <span className={`${pillar.textColor} font-mono text-[10px] tracking-wider`}>
                        {pillar.status}
                      </span>
                    </div>
                  </div>

                  {/* ===== ICON SECTION ===== */}
                  <div className="text-center mb-5 mt-2">
                    <div className="relative inline-block">
                      {/* Icon glow */}
                      <div 
                        className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                        style={{ background: pillar.glowColor }}
                      />
                      
                      {/* Frosted icon container */}
                      <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] group-hover:scale-110 transition-transform duration-500">
                        <span className="text-3xl drop-shadow-lg">{pillar.emoji}</span>
                      </div>
                      
                      {/* Small icon badge */}
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 border ${pillar.borderColor}`}>
                        <IconComponent className={`w-3 h-3 ${pillar.textColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* ===== TITLE ===== */}
                  <h3 className={`text-lg font-bold mb-1 text-center font-mono bg-gradient-to-r ${pillar.gradient} bg-clip-text text-transparent`}>
                    {pillar.title}
                  </h3>
                  <div className="text-[11px] text-white/40 text-center mb-5 font-mono tracking-wide">
                    [{pillar.subtitle}]
                  </div>

                  {/* ===== METRICS ===== */}
                  <div className="text-center mb-5">
                    <div 
                      className={`text-4xl font-black font-mono ${pillar.textColor}`}
                      style={{ textShadow: `0 0 20px ${pillar.glowColor}` }}
                    >
                      {pillar.percentage}
                    </div>
                    <div className="text-xs text-white/50 font-mono mt-1">
                      {pillar.detail}
                    </div>
                    {pillar.liveMetric && (
                      <div className="text-[10px] text-white/30 font-mono mt-1">
                        {pillar.liveMetric}
                      </div>
                    )}
                  </div>

                  {/* ===== DESCRIPTION ===== */}
                  <p className="text-white/60 text-center text-sm leading-relaxed mb-5">
                    {pillar.description}
                  </p>

                  {/* ===== FOOTER ===== */}
                  <div className="pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.04]">
                      <Activity 
                        className={`w-3 h-3 ${pillar.textColor} animate-pulse`}
                        style={{ filter: `drop-shadow(0 0 4px ${pillar.glowColor})` }}
                      />
                      <span className={`${pillar.textColor} font-mono text-[10px] tracking-wider`}>
                        QUANTUM FIELD ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Scan line effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden rounded-2xl">
                    <div 
                      className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${pillar.gradient}`}
                      style={{ animation: 'scan-line 2.5s ease-in-out infinite' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        
        @keyframes particle-drift {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% { 
            transform: translate(15px, -20px) scale(1.1);
            opacity: 0.6;
          }
          50% { 
            transform: translate(-10px, -35px) scale(0.9);
            opacity: 0.3;
          }
          75% { 
            transform: translate(20px, -15px) scale(1.05);
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
