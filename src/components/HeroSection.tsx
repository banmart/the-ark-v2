import React from 'react';
import { ArrowRight } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

interface HeroSectionProps {
  copyToClipboard: (text: string) => void;
  contractAddress: string;
  setShowOnboarding: (show: boolean) => void;
}

const HeroSection = ({ copyToClipboard, contractAddress, setShowOnboarding }: HeroSectionProps) => {
  const heroText = "No marketing wallet. No team tokens. No admin keys. Just pure tokenomics: burn, reflect, liquify, and reward. ARK is what happens when code serves community, not founders.";

  return (
    <section className="relative z-10 pt-32 md:pt-40 pb-12 px-6 min-h-screen flex items-center hero-bg hero-bg-animated" style={{
      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0)), url('/lovable-uploads/fa12e00f-4d05-4966-a987-e5caeb0c5029.png')`
    }}>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent animate-[fade-in_1s_ease-out]">
              THE ARK
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-[fade-in_1s_ease-out_0.2s_both]">
              Where Deflation Meets Devotion
            </h2>
            <div className="mb-8 animate-[fade-in_1s_ease-out_0.4s_both]">
              <TextGenerateEffect 
                words={heroText}
                duration={2}
                filter={false}
                className="text-gray-300"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-[fade-in_1s_ease-out_0.6s_both]">
              <button onClick={() => copyToClipboard(contractAddress)} className="bg-cyan-500 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30 flex items-center gap-2">
                Buy ARK
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setShowOnboarding(true)}
                className="border border-cyan-500/30 px-8 py-3 rounded-full font-semibold hover:bg-cyan-500/10 hover:scale-105 transition-all text-center backdrop-blur-sm"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right side - Clean ❍ Symbol */}
          <div className="flex justify-center animate-[fade-in_1s_ease-out_0.8s_both]">
            <div className="relative w-96 h-96 flex items-center justify-center">
              {/* Clean ❍ Symbol - Keep exactly as is */}
              <div className="text-[24rem] font-black text-cyan-400 animate-[rotate-3d_15s_linear_infinite] relative z-10">
                ❍
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
