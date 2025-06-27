import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Shield, Lock, Zap, Database, Code } from "lucide-react";

interface HeroSectionProps {
  copyToClipboard: (text: string) => void;
  contractAddress: string;
  setShowOnboarding: (show: boolean) => void;
}

const HeroSection = ({
  copyToClipboard,
  contractAddress,
  setShowOnboarding
}: HeroSectionProps) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [textPhase, setTextPhase] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        setVideoLoaded(true);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      return () => video.removeEventListener('canplay', handleCanPlay);
    }
  }, []);

  // Cinematic text sequence
  useEffect(() => {
    const sequence = [
      { delay: 500, phase: 1 },   // System initializing
      { delay: 2000, phase: 2 },  // Scanning networks
      { delay: 3500, phase: 3 },  // ARK detected
      { delay: 5000, phase: 4 },  // Full revelation
    ];

    sequence.forEach(({ delay, phase }) => {
      setTimeout(() => setTextPhase(phase), delay);
    });
  }, []);
  
  return (
    <section className="relative z-10 pt-32 md:pt-40 pb-12 px-6 min-h-screen flex items-center overflow-hidden">
      {/* Video Background with Cinematic Fade In */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-[3000ms] ease-out ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="https://xtailgacbmhdtdxnqjdv.supabase.co/storage/v1/object/sign/media/the-ark-background-062025.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xMGFhNjdlYy05ZmJhLTQ4MTEtODhmYy02ZTBiNzYyODZhOTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS90aGUtYXJrLWJhY2tncm91bmQtMDYyMDI1Lm1wNCIsImlhdCI6MTc1MTA1NTk0MSwiZXhwIjoxNzgyNTkxOTQxfQ.qkYPr1mP8pwmf692gqVwX6pwGpUF3sCud9HfvUfmGAU" type="video/mp4" />
        </video>
        
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ease-out ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage: `url('https://xtailgacbmhdtdxnqjdv.supabase.co/storage/v1/object/sign/media/IMG_20250503_110007_638.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xMGFhNjdlYy05ZmJhLTQ4MTEtODhmYy02ZTBiNzYyODZhOTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9JTUdfMjAyNTA1MDNfMTEwMDA3XzYzOC5qcGciLCJpYXQiOjE3NTEwNTU2MTcsImV4cCI6MTc4MjU5MTYxN30.ZNXMfW_4Qd8OINfFHV2szXhEnPXtMhD5Wwsb45RZ8Yk')`
          }}
        />
        
        {/* Lighter overlay - only on left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/20 lg:via-transparent lg:to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Cinematic Text */}
          <div className="relative">
            {/* Tech HUD Elements */}
            <div className="absolute -top-8 -left-4 text-cyan-400/40 text-xs font-mono">
              [SYSTEM_INIT] 0xACC15eF8fa2e...
            </div>
            <div className="absolute -top-8 right-0 text-cyan-400/40 text-xs font-mono">
              {new Date().toISOString().slice(0, 19)}Z
            </div>

            {/* Main Title - Static, No Animation */}
            <div className="relative mb-6">

            </div>

            {/* Cinematic Text Sequence */}
            <div className="space-y-4 mb-8">
              {/* Phase 1: System Initializing */}
              <div className={`transition-all duration-1000 ${textPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm mb-2">
                  <Database className="w-4 h-4 animate-spin" />
                  <span className="animate-[typing_2s_steps(20)_infinite]">INITIALIZING QUANTUM PROTOCOL...</span>
                </div>
              </div>

              {/* Phase 2: Network Scan */}
              <div className={`transition-all duration-1000 delay-500 ${textPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-2 text-green-400 font-mono text-sm mb-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span>SCANNING PULSECHAIN NETWORKS... [████████████] 100%</span>
                </div>
                <div className="text-yellow-400 font-mono text-xs ml-6">
                  → DETECTING FAILED PROJECTS: 47,392 TOKENS
                </div>
                <div className="text-red-400 font-mono text-xs ml-6 animate-pulse">
                  → FLOOD LEVEL: CRITICAL
                </div>
              </div>

              {/* Phase 3: ARK Detection */}
              <div className={`transition-all duration-1000 delay-1000 ${textPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm mb-2">
                  <Code className="w-4 h-4 animate-bounce" />
                  <span className="text-cyan-300 font-bold">ARK PROTOCOL DETECTED</span>
                </div>
                <div className="text-cyan-400 font-mono text-xs ml-6 space-y-1">
                  <div>→ DEFLATIONARY_ENGINE: ACTIVE</div>
                  <div>→ REFLECTION_MATRIX: OPERATIONAL</div>
                  <div>→ SECURITY_LEVEL: MAXIMUM</div>
                  <div>→ SALVATION_PROBABILITY: 99.97%</div>
                </div>
              </div>

              {/* Phase 4: Full Message */}
              <div className={`transition-all duration-2000 delay-1500 ${textPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="border-l-2 border-cyan-400 pl-4 my-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    <span className="text-cyan-400">[TRANSMISSION_DECODED]</span>
                  </h3>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    The digital waters are rising. Projects sink beneath the waves daily, their promises dissolved into the endless ocean of failed tokens. But from the storm clouds emerges a beacon of hope—
                    <span className="text-cyan-400 font-bold"> The ARK</span>, where 
                    <span className="text-teal-400 font-semibold"> deflation meets devotion</span>, and only the faithful shall inherit the new world.
                  </p>
                </div>

                {/* Tech Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 font-mono text-xs">
                  <div className="bg-black/20 border border-cyan-500/40 rounded p-2">
                    <div className="text-cyan-400">CONTRACT_ADDR</div>
                    <div className="text-white truncate">0xACC15eF8...</div>
                  </div>
                  <div className="bg-black/20 border border-green-500/40 rounded p-2">
                    <div className="text-green-400">SECURITY_STATUS</div>
                    <div className="text-white">RENOUNCED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-2000 ${textPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button 
                onClick={() => copyToClipboard(contractAddress)} 
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 relative overflow-hidden group"
              >
                <span className="relative z-10">BOARD THE ARK</span>
                <ArrowRight size={18} className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button 
                onClick={() => setShowOnboarding(true)} 
                className="border border-cyan-500/60 px-8 py-3 rounded-full font-semibold hover:bg-cyan-500/20 hover:scale-105 transition-all text-center backdrop-blur-sm relative overflow-hidden group"
              >
                <span className="relative z-10">DECODE PROTOCOL</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>

          {/* Right side - Enhanced ❍ Symbol with NO background overlay */}
          <div className="flex justify-center">
            <div className="relative w-96 h-96 flex items-center justify-center">
              
              {/* Central ❍ Symbol */}
              <div className="text-[24rem] font-black text-cyan-400 animate-[rotate-3d_15s_linear_infinite] relative z-10 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                ❍
              </div>
              
              {/* Removed the pulsing energy background */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
