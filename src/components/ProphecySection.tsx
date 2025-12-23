import React, { useState, useEffect } from 'react';
import { Waves, Zap, Bird, BookOpen, Sparkles, Shield, Target, Cpu } from 'lucide-react';

const ProphecySection = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 1000, phase: 2 },
      { delay: 1800, phase: 3 }
    ];
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setPhase(phase), delay);
    });
  }, []);

  const prophecies = [
    {
      id: 'flood',
      title: 'FLOOD PROTOCOL',
      emoji: '🌊',
      icon: Waves,
      description: 'System analysis indicates catastrophic market liquidation event imminent. Only ARK protocol holders maintain operational integrity during crypto matrix purge sequence.',
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      gradientFrom: 'from-cyan-400',
      gradientTo: 'to-teal-400',
      statusCode: 'FLOOD SIM ACTIVE'
    },
    {
      id: 'chosen',
      title: 'CHOSEN ALGORITHM',
      emoji: '⚡',
      icon: Zap,
      description: 'ARK token holders identified as prime candidates for survival protocol. Divine tokenomics engine provides navigation through market storm matrices.',
      color: 'yellow',
      glowColor: 'rgba(251, 191, 36, 0.4)',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-orange-400',
      statusCode: 'SELECTION PROTOCOL'
    },
    {
      id: 'newworld',
      title: 'GENESIS REBUILD',
      emoji: '🕊️',
      icon: Bird,
      description: 'Post-flood reconstruction algorithms engage. ARK passengers designated as foundational nodes for next-generation crypto ecosystem architecture.',
      color: 'emerald',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-400',
      statusCode: 'REBUILD SEQUENCE'
    }
  ];

  // Generate floating particles with prophecy colors
  const particles = React.useMemo(() => {
    const colors = ['cyan', 'yellow', 'emerald', 'purple'];
    return [...Array(20)].map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6,
      size: 2 + Math.random() * 3
    }));
  }, []);

  // Corner glow accents
  const cornerGlows = [
    { position: 'top-0 left-0', color: 'purple' },
    { position: 'top-0 right-0', color: 'cyan' },
    { position: 'bottom-0 left-0', color: 'emerald' },
    { position: 'bottom-0 right-0', color: 'yellow' },
    { position: 'top-1/2 left-0 -translate-y-1/2', color: 'purple' },
    { position: 'top-1/2 right-0 -translate-y-1/2', color: 'cyan' }
  ];

  const ProphecyModule = ({ prophecy, index }: { prophecy: typeof prophecies[0]; index: number }) => {
    const IconComponent = prophecy.icon;
    
    return (
      <div 
        className={`relative group transition-all duration-700 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        {/* Outer glow ring */}
        <div 
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"
          style={{ background: prophecy.glowColor }}
        />
        
        {/* Main card */}
        <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 overflow-hidden group-hover:border-white/[0.15] transition-all duration-500 group-hover:-translate-y-2">
          {/* Top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Inner radial highlight */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-radial from-white/[0.03] to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
          
          {/* Scan line effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${prophecy.glowColor}, transparent)`,
                animation: 'prophecyScan 2s ease-in-out infinite'
              }}
            />
          </div>
          
          {/* Status badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 bg-${prophecy.color}-400 rounded-full animate-pulse shadow-[0_0_8px_currentColor]`} />
            <span className={`text-${prophecy.color}-400 font-mono text-xs tracking-widest`}>
              {prophecy.statusCode}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Emoji container */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                  style={{ boxShadow: `0 0 30px ${prophecy.glowColor}` }}
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {prophecy.emoji}
                  </span>
                </div>
                {/* Secondary icon */}
                <div 
                  className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-${prophecy.color}-500/20 backdrop-blur-xl border border-${prophecy.color}-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110`}
                >
                  <IconComponent className={`w-5 h-5 text-${prophecy.color}-400`} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-xl font-black mb-4 text-center tracking-wider bg-gradient-to-r ${prophecy.gradientFrom} ${prophecy.gradientTo} bg-clip-text text-transparent`}>
              [{prophecy.title}]
            </h3>

            {/* Description */}
            <p className="text-white/70 text-center leading-relaxed font-mono text-sm group-hover:text-white/90 transition-colors duration-300">
              {prophecy.description}
            </p>

            {/* Bottom accent line */}
            <div 
              className={`mt-6 h-0.5 bg-gradient-to-r from-transparent via-${prophecy.color}-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            
            {/* Footer badge */}
            <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <div className={`px-4 py-2 rounded-full bg-${prophecy.color}-500/10 backdrop-blur-xl border border-${prophecy.color}-500/20 flex items-center gap-2`}>
                <Shield className={`w-3.5 h-3.5 text-${prophecy.color}-400`} />
                <span className={`text-${prophecy.color}-400 text-xs font-mono tracking-wider`}>QUANTUM FIELD ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative z-30 py-24 px-6 overflow-hidden">
      {/* === PREMIUM MULTI-LAYER BACKGROUND === */}
      
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
      
      {/* Deep vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.9)_100%)]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      <div className="absolute bottom-1/3 right-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '3s' }} />
      
      {/* Film grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Tech grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full bg-${particle.color}-400/60`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `prophecyFloat ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              boxShadow: `0 0 ${particle.size * 2}px currentColor`
            }}
          />
        ))}
      </div>
      
      {/* Corner glow accents */}
      {cornerGlows.map((glow, i) => (
        <div
          key={i}
          className={`absolute ${glow.position} w-64 h-64 bg-${glow.color}-500/10 rounded-full blur-[80px] pointer-events-none`}
        />
      ))}

      {/* === CONTENT === */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Premium Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Glassmorphism badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            </div>
            <span className="text-white/60 font-mono text-sm tracking-widest">ANCIENT PROTOCOLS</span>
          </div>
          
          {/* Gradient title */}
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              [PROPHECY MODULES]
            </span>
          </h2>
          
          {/* Accent line */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1 rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-500" />
          </div>
          
          {/* Subtitle */}
          <p className="text-white/70 text-lg max-w-3xl mx-auto font-mono leading-relaxed">
            Ancient protocols foretell the great crypto flood. Only ARK holders survive the purge.
          </p>
        </div>

        {/* Prophecy Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          {prophecies.map((prophecy, index) => (
            <ProphecyModule key={prophecy.id} prophecy={prophecy} index={index} />
          ))}
        </div>

        {/* Premium Status Display */}
        <div className={`transition-all duration-1000 delay-500 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative max-w-3xl mx-auto">
            {/* Outer glow */}
            <div className="absolute -inset-1 rounded-2xl bg-purple-500/20 blur-xl" />
            
            {/* Main container */}
            <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 overflow-hidden">
              {/* Top edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              
              {/* Header */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
                  PROPHECY STATUS: ACTIVE
                </span>
              </div>
              
              {/* Status indicators */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {prophecies.map((p) => (
                  <div key={p.id} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-${p.color}-500/10 border border-${p.color}-500/20`}>
                    <div className={`w-2 h-2 rounded-full bg-${p.color}-400 animate-pulse`} />
                    <span className={`text-${p.color}-400 text-xs font-mono tracking-wider`}>{p.statusCode}</span>
                  </div>
                ))}
              </div>
              
              {/* Message */}
              <p className="text-white/60 font-mono text-sm text-center leading-relaxed">
                All prophecy modules operational. ARK survival protocol initialized. 
                Flood simulation running in background matrix.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes prophecyFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.4;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) translateX(-10px) rotate(180deg); 
            opacity: 0.6;
          }
          75% { 
            transform: translateY(-30px) translateX(5px) rotate(270deg); 
            opacity: 0.9;
          }
        }
        @keyframes prophecyScan {
          0% { transform: translateY(0); }
          100% { transform: translateY(400px); }
        }
      `}</style>
    </section>
  );
};

export default ProphecySection;
