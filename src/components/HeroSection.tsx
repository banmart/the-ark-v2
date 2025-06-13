
import React, { useState, useEffect } from 'react';
import { ArrowRight } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import ParticleSystem from './ParticleSystem';
import Enhanced3DSymbol from './Enhanced3DSymbol';
import DynamicBackground from './DynamicBackground';

interface HeroSectionProps {
  copyToClipboard: (text: string) => void;
  contractAddress: string;
  setShowOnboarding: (show: boolean) => void;
}

const HeroSection = ({ copyToClipboard, contractAddress, setShowOnboarding }: HeroSectionProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroText = "No marketing wallet. No team tokens. No admin keys. Just pure tokenomics: burn, reflect, liquify, and reward. ARK is what happens when code serves community, not founders.";

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative z-10 pt-32 md:pt-40 pb-12 px-6 min-h-screen flex items-center overflow-hidden">
      {/* Dynamic Background System */}
      <DynamicBackground />
      
      {/* Interactive Particle System */}
      <ParticleSystem width={dimensions.width} height={dimensions.height} />

      {/* Magnetic effect for cursor */}
      <div 
        className="fixed w-6 h-6 border-2 border-cyan-400/50 rounded-full pointer-events-none z-50 transition-transform duration-75 mix-blend-difference"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(0.8)'
        }}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Enhanced Text */}
          <div className="relative">
            {/* Holographic text effects */}
            <div className="absolute inset-0 -z-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent blur-sm opacity-30">
                THE ARK
              </h1>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent animate-[fade-in_1s_ease-out] relative">
              THE ARK
              {/* Prismatic edge effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent opacity-20 animate-[gradient-shift_3s_ease-in-out_infinite]">
                THE ARK
              </div>
            </h1>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-[fade-in_1s_ease-out_0.2s_both] relative">
              Built on PulseChain. Sustained by Believers.
              {/* Electric underline */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            </h2>

            <div className="mb-8 animate-[fade-in_1s_ease-out_0.4s_both] glass-card p-6 rounded-xl">
              <TextGenerateEffect 
                words={heroText}
                duration={2}
                filter={false}
                className="text-gray-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-[fade-in_1s_ease-out_0.6s_both]">
              <button 
                onClick={() => copyToClipboard(contractAddress)} 
                className="group relative bg-cyan-500 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 overflow-hidden"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                <span className="relative z-10">Buy ARK</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                
                {/* Scan line effect */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-white/50 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>
              
              <button 
                onClick={() => setShowOnboarding(true)}
                className="group relative border border-cyan-500/30 px-8 py-3 rounded-full font-semibold hover:bg-cyan-500/10 hover:scale-105 transition-all text-center backdrop-blur-sm overflow-hidden"
              >
                {/* Magnetic field effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                <span className="relative z-10">Learn More</span>
              </button>
            </div>
          </div>

          {/* Right side - Enhanced 3D Symbol */}
          <div className="flex justify-center animate-[fade-in_1s_ease-out_0.8s_both]">
            <Enhanced3DSymbol />
          </div>
        </div>
      </div>

      {/* Breathing effect overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-400/5 via-transparent to-transparent animate-pulse pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
