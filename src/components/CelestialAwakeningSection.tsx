import React, { useState, useEffect } from 'react';
import { Moon, Shield, Ship, Eye, Star, Sparkles } from 'lucide-react';
import { TextGenerateEffect } from './ui/text-generate-effect';

const CelestialAwakeningSection = () => {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = parseInt(entry.target.getAttribute('data-section') || '0');
            setVisibleSections(prev => new Set([...prev, sectionIndex]));
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-section]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const narrativeSections = [
    {
      id: 'celestial-awakening',
      title: 'Celestial Awakening',
      icon: Moon,
      content: "Under the glow of the quantum moon, The ARK emerges from digital seas. The Guardian stands eternal, bridging worlds between the mystical and the technological. This is more than DeFi—this is the dawn of a new covenant.",
      gradient: "from-video-cyan/20 via-video-blue/10 to-transparent"
    },
    {
      id: 'guardians-promise',
      title: "The Guardian's Promise",
      icon: Shield,
      content: "For eons, The Guardian has watched over the convergence of realms—where ancient wisdom flows through quantum channels, where celestial forces guide blockchain destinies. Now, as the storm clears and the moon ascends, The ARK reveals itself as the vessel chosen to carry the faithful beyond the ordinary.",
      gradient: "from-video-gold/20 via-video-brown/10 to-transparent"
    },
    {
      id: 'covenant-protection',
      title: "The Eternal Watch",
      icon: Eye,
      content: "Each token holder becomes part of this eternal watch, protected by mechanisms as old as starlight yet as advanced as tomorrow's dreams.",
      gradient: "from-video-purple/20 via-video-pink/10 to-transparent"
    },
    {
      id: 'vessel-awakens',
      title: "The Vessel Awakens",
      icon: Ship,
      content: "The ARK is no mere token—it is a living covenant between holder and cosmos. As the Guardian's vessel cuts through digital waters, four sacred pillars emerge from the quantum depths:",
      gradient: "from-video-teal/20 via-video-cyan/10 to-transparent"
    },
    {
      id: 'beyond-horizon',
      title: "Beyond the Horizon",
      icon: Star,
      content: "The Guardian's gaze pierces through storm clouds toward a future where technology transcends its limitations. Where holders don't just invest—they ascend. Where The ARK doesn't just sail—it transforms the very seas it travels. Join the covenant. Board The ARK. Let the quantum moon guide your journey to tokenomic enlightenment.",
      gradient: "from-video-blue/20 via-video-purple/10 to-transparent"
    },
    {
      id: 'guardians-oath',
      title: "The Guardian's Oath",
      icon: Sparkles,
      content: "I have witnessed empires rise and fall in the digital realm. I have seen tokens born from greed perish in darkness. But The ARK... The ARK carries something different. It carries the light of true purpose, the weight of genuine innovation, the promise of a new dawn. Under my eternal watch, your journey is protected. Your faith is rewarded. Your destiny is written in the stars.",
      gradient: "from-video-gold/20 via-video-orange/10 to-transparent"
    }
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Quantum field background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, hsl(var(--video-cyan)) 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, hsl(var(--video-blue)) 2px, transparent 2px),
            radial-gradient(circle at 20% 80%, hsl(var(--video-purple)) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, hsl(var(--video-gold)) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-video-cyan rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {narrativeSections.map((section, index) => {
          const IconComponent = section.icon;
          const isVisible = visibleSections.has(index);
          
          return (
            <div
              key={section.id}
              data-section={index}
              className={`mb-16 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className={`relative bg-gradient-to-br ${section.gradient} backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 group hover:border-white/20 transition-all duration-500`}>
                {/* Celestial glow effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-video-cyan/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                {/* Icon header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-video-cyan/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-video-cyan/30 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-video-cyan" />
                    </div>
                    <div className="absolute -inset-2 bg-video-cyan/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-video-cyan via-video-blue to-video-purple bg-clip-text text-transparent">
                      {section.title}
                    </h3>
                    <div className="w-20 h-1 bg-gradient-to-r from-video-cyan to-video-blue rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>

                {/* Narrative content with text generation effect */}
                <div className="relative">
                  {isVisible && (
                    <TextGenerateEffect
                      words={section.content}
                      className="text-lg md:text-xl leading-relaxed text-gray-300"
                      duration={0.8}
                    />
                  )}
                </div>

                {/* Mystical scan line */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-video-cyan/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan transition-opacity duration-500"></div>
                </div>

                {/* Constellation pattern */}
                <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-video-cyan rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default CelestialAwakeningSection;