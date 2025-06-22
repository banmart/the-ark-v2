import React from 'react';
import { ArrowRight, Shield, Lock } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

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
  const heroText = "The digital waters are rising. Projects sink beneath the waves daily, their promises dissolved into the endless ocean of failed tokens. But from the storm clouds emerges a beacon of hope—The ARK, where deflation meets devotion, and only the faithful shall inherit the new world.";
  
  return (
    <section className="relative z-10 pt-32 md:pt-40 pb-12 px-6 min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://capkhkvrmzbiyzaaqcts.supabase.co/storage/v1/object/sign/media/ark-background.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNWY4ZTA3NC1hYmI5LTQ3NDQtYjk3ZC0wMDMyZDEwMjBiZDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9hcmstYmFja2dyb3VuZC5tcDQiLCJpYXQiOjE3NTA1OTY3ODIsImV4cCI6MTc4MjEzMjc4Mn0.l-0uwdiiCLTri4fUi3Ypl43vp6Hy7s3gjxAg4BPZHHc" type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <img 
            src="https://crypto-genesis-beacon.lovable.app/lovable-uploads/00beb11a-64d8-4ae5-8c77-2846b0ef503c.jpg" 
            alt="ARK Background"
            className="w-full h-full object-cover"
          />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20"></div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent animate-[fade-in_1s_ease-out]">
              THE ARK ❍
            </h1>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white animate-[fade-in_1s_ease-out_0.2s_both]">
              In the beginning, there was chaos in the crypto seas...
            </h3>
            
            <div className="text-xl text-gray-300 max-w-3xl mx-auto mb-4 animate-[fade-in_1s_ease-out_0.4s_both]">
              <TextGenerateEffect words={heroText} duration={2} filter={false} className="text-gray-300" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-[fade-in_1s_ease-out_0.6s_both]">
              <button onClick={() => copyToClipboard(contractAddress)} className="bg-cyan-500 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30 flex items-center gap-2">
                Buy ARK
                <ArrowRight size={18} />
              </button>
              <button onClick={() => setShowOnboarding(true)} className="border border-cyan-500/30 px-8 py-3 rounded-full font-semibold hover:bg-cyan-500/10 hover:scale-105 transition-all text-center backdrop-blur-sm">
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