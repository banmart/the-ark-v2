import React, { useState, useEffect } from 'react';
import { Waves, Zap, Bird, BookOpen, Sparkles, Database, Activity, Cpu } from 'lucide-react';
const ProphecySection = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    // Cinematic reveal sequence
    const phases = [{
      delay: 300,
      phase: 1
    },
    // System scan
    {
      delay: 1000,
      phase: 2
    },
    // Prophecy modules detected
    {
      delay: 1800,
      phase: 3
    } // Full activation
    ];
    phases.forEach(({
      delay,
      phase
    }) => {
      setTimeout(() => setPhase(phase), delay);
    });
  }, []);
  const prophecies = [{
    id: 'flood',
    title: 'FLOOD PROTOCOL',
    emoji: '🌊',
    icon: Waves,
    description: 'System analysis indicates catastrophic market liquidation event imminent. Only ARK protocol holders maintain operational integrity during crypto matrix purge sequence.',
    color: 'cyan',
    statusCode: 'FLOOD SIM ACTIVE'
  }, {
    id: 'chosen',
    title: 'CHOSEN ALGORITHM',
    emoji: '⚡',
    icon: Zap,
    description: 'ARK token holders identified as prime candidates for survival protocol. Divine tokenomics engine provides navigation through market storm matrices.',
    color: 'yellow',
    statusCode: 'SELECTION PROTOCOL'
  }, {
    id: 'newworld',
    title: 'GENESIS REBUILD',
    emoji: '🕊️',
    icon: Bird,
    description: 'Post-flood reconstruction algorithms engage. ARK passengers designated as foundational nodes for next-generation crypto ecosystem architecture.',
    color: 'emerald',
    statusCode: 'REBUILD SEQUENCE'
  }];
  const ProphecyModule = ({
    prophecy
  }) => {
    const IconComponent = prophecy.icon;
    return <div className={`relative group bg-black/40 backdrop-blur-xl border-2 border-${prophecy.color}-500/30 rounded-xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden hover:border-${prophecy.color}-500/60`}>
        {/* Background glow effect */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-${prophecy.color}-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        {/* Status Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className={`w-3 h-3 bg-${prophecy.color}-400 rounded-full animate-pulse`}></div>
          <span className={`text-${prophecy.color}-400 font-mono text-xs`}>{prophecy.statusCode}</span>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => <div key={i} className={`absolute w-1 h-1 bg-${prophecy.color}-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000`} style={{
          left: `${20 + i * 15}%`,
          top: `${10 + i * 10}%`,
          animationDelay: `${i * 200}ms`,
          animation: 'float 3s ease-in-out infinite'
        }}></div>)}
        </div>

        <div className="relative z-10">
          {/* Icon Section */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className={`text-5xl mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {prophecy.emoji}
              </div>
              <div className={`absolute -bottom-2 -right-2 text-${prophecy.color}-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold mb-6 text-${prophecy.color}-400 text-center group-hover:text-${prophecy.color}-300 transition-colors duration-300 font-mono`}>
            {prophecy.title}
          </h3>

          {/* Description */}
          <p className={`text-gray-300 text-center leading-relaxed group-hover:text-white transition-colors duration-300 font-mono text-sm`}>
            {prophecy.description}
          </p>

          {/* Bottom accent line */}
          <div className={`mt-6 h-1 bg-gradient-to-r from-transparent via-${prophecy.color}-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        </div>

        {/* Scan Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${prophecy.color}-500 to-transparent animate-[scan_2s_ease-in-out_infinite]`}></div>
        </div>
      </div>;
  };
  return <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 to-black/30">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
        backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(251, 146, 60, 0.3) 2px, transparent 2px)
          `,
        backgroundSize: '100px 100px'
      }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
              [PROPHECY_MODULES]
            </h2>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto font-mono">
            Ancient protocols foretell the great crypto flood. Only ARK holders survive the purge.
          </p>
        </div>

        {/* Prophecy Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-500 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {prophecies.map((prophecy, index) => <div key={prophecy.id} className={`transition-all duration-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
          transitionDelay: `${index * 200}ms`
        }}>
              <ProphecyModule prophecy={prophecy} />
            </div>)}
        </div>

        {/* Status Display */}
        
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </section>;
};
export default ProphecySection;