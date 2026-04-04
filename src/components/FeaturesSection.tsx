import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

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
      title: 'BURN',
      subtitle: 'Dynamic Burn System',
      percentage: '1%',
      detail: 'Protocol Burn',
      description: 'The ARK Protocol is built for scarcity. 1% of every transaction is permanently removed from circulation, systematically reducing supply over time on PulseChain.',
      color: 'red',
      gradient: 'from-pink-500 to-red-500',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      borderColor: 'border-red-500/30',
      borderHover: 'hover:border-red-500/60',
      textColor: 'text-red-400',
      liveMetric: 'Reducing Supply'
    },
    {
      id: 1,
      title: 'DAO',
      subtitle: 'Strategic Reserves',
      percentage: '1%',
      detail: 'Ecosystem Growth',
      description: '1% flows into the multi-sig Treasury to ensure long-term protocol viability. Funds are utilized for strategic buy-backs, development, and market expansions.',
      color: 'blue',

      gradient: 'from-blue-500 to-cyan-500',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      borderColor: 'border-blue-500/30',
      borderHover: 'hover:border-blue-500/60',
      textColor: 'text-blue-400',
      liveMetric: 'Treasury Expansion'
    },
    {
      id: 2,
      title: 'LIQUIDITY',
      subtitle: 'Price Floor Support',
      percentage: '4%',
      detail: 'Automated LP',
      description: '4% of all volume is automatically converted into PLS/ARK liquidity. This continuous injection strengthens the price floor and depth, enabling high-volume trading.',
      color: 'purple',

      gradient: 'from-purple-500 to-pink-500',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      borderColor: 'border-purple-500/30',
      borderHover: 'hover:border-purple-500/60',
      textColor: 'text-purple-400',
      liveMetric: 'Liquidity Depth'
    },
    {
      id: 3,
      title: 'LOCKER REWARDS',
      subtitle: 'Participant Rewards',
      percentage: '4%',
      detail: 'Staking Dividends',
      description: '4% is distributed to protocol participants who lock their assets. A dynamic reward structure ensures that committed holders receive the highest yield multipliers.',
      color: 'green',

      gradient: 'from-green-500 to-teal-500',
      glowColor: 'rgba(34, 197, 94, 0.4)',
      borderColor: 'border-green-500/30',
      borderHover: 'hover:border-green-500/60',
      textColor: 'text-green-400',
      liveMetric: 'Yield Generation'
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
    <section id="features" className="relative z-30 py-24 px-6 bg-black">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ===== PREMIUM HEADER ===== */}
        <div className={`text-center mb-20 transition-all duration-1000 ${pillarsPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Premium gradient title */}
          <h2 className="mb-4 text-4xl md:text-6xl font-black tracking-tighter uppercase bg-gradient-to-r from-cyan-300 via-teal-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            The ARK Game Theory
          </h2>
          
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto font-mono leading-relaxed mt-6">
            A strategic 10% protocol fee is applied to all ARK transactions. This automated mechanism fuels the deflationary engine, funds governance initiatives, stabilizes liquidity, and powers the reward distribution for long-term stakeholders.
          </p>
        </div>

        {/* ===== PREMIUM PILLAR CARDS GRID/ACCORDION - Mobile First ===== */}
        <div className={`transition-all duration-700 ease-out ${pillarsPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Mobile Accordion */}
          <div className="md:hidden">
            <Accordion type="single" collapsible className="space-y-4">
              {pillars.map((pillar) => {
                return (
                  <AccordionItem 
                    key={pillar.id} 
                    value={`pillar-${pillar.id}`}
                    className={`relative liquid-glass rounded-2xl border ${pillar.borderColor} overflow-hidden border-b-0`}
                   >
                    <AccordionTrigger className="hover:no-underline p-5 w-full">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="text-left">
                          <p className={`text-sm font-black uppercase tracking-tighter ${pillar.textColor}`}>{pillar.title}</p>
                          <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">[{pillar.subtitle}]</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-black font-mono tracking-tighter ${pillar.textColor}`}>{pillar.percentage}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-6">
                      <div className="pt-4 border-t border-white/5 space-y-4">
                        <p className="text-xs text-white/60 leading-relaxed font-mono">
                          {pillar.description}
                        </p>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <span className={`text-[10px] font-mono uppercase tracking-widest ${pillar.textColor}`}>
                            {pillar.liveMetric}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {pillars.map((pillar, index) => {
              const isActive = activePillar === pillar.id;
              const revealDelay = 150 * index;
              
              return (
                <div
                  key={pillar.id}
                  className="relative group transition-all duration-700 ease-out"
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
  

  
                    <div className="pt-4" />
  
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
  

  

                  </div>
                </div>
              );
            })}
          </div>
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
