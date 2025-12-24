import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { useChatContext } from './providers/ChatProvider';
import { useBrowserPopup } from './providers/BrowserPopupProvider';
import { mediaUrls } from '@/lib/media-urls';

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
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setIsOpen } = useChatContext();
  const { openPopup } = useBrowserPopup();
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        setVideoLoaded(true);
        setTimeout(() => {
          setShowIntro(false);
        }, 800);
      };
      
      const handlePlaying = () => {
        setTimeout(() => {
          setVideoPlaying(true);
        }, 1000);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
      };
    }
  }, []);
  
  const handleBoardTheArk = () => {
    openPopup('https://emerald-quickest-swallow-922.mypinata.cloud/ipfs/bafybeicevoztyv3vaavekencbqvdo3g6ujfm7gkx2osc6yaim4nap7ckkq', 'Buy ARK');
  };
  
  const handleDecodeProtocol = () => {
    setIsOpen(true);
  };
  
  const toggleAudio = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCopy = () => {
    copyToClipboard(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <section className="relative z-10 pt-32 md:pt-40 pb-4 px-6 min-h-screen flex flex-col overflow-hidden">
      {/* Black Intro Overlay */}
      <div 
        className={`absolute inset-0 bg-ark-obsidian z-30 transition-opacity duration-[4000ms] ease-in-out ${
          showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          loop 
          playsInline 
          className={`w-full h-full object-cover transition-opacity duration-[3000ms] ease-out ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={mediaUrls.heroVideo} type="video/mp4" />
        </video>
        
        {/* Fallback Image */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ease-out ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} 
          style={{ backgroundImage: `url('${mediaUrls.heroBackground}')` }} 
        />
      </div>

      {/* Stone Texture Overlay */}
      <div className="absolute inset-0 z-[4] pointer-events-none stone-texture opacity-50" />

      {/* Heavy Film Grain */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.05] mix-blend-overlay">
        <div 
          className="absolute inset-0 animate-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }} 
        />
      </div>

      {/* Deep Vignette */}
      <div 
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.95) 100%)'
        }}
      />

      {/* Dramatic Gradient Layers */}
      <div className="absolute inset-0 z-[7] pointer-events-none">
        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-ark-obsidian via-ark-obsidian/60 to-transparent" />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-ark-obsidian via-ark-obsidian/80 to-transparent" />
        {/* Left gradient - editorial asymmetry */}
        <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-ark-obsidian/80 to-transparent" />
        
        {/* Gold accent glow - asymmetric position */}
        <div 
          className="absolute bottom-20 left-1/4 w-[500px] h-[300px] opacity-20 animate-gold-pulse"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(42 85% 55% / 0.4) 0%, transparent 60%)'
          }}
        />
      </div>

      {/* Letterbox Bars - Cinematic */}
      <div className="absolute top-0 left-0 right-0 h-[5vh] bg-ark-obsidian z-[10] hidden md:block" />
      <div className="absolute bottom-0 left-0 right-0 h-[5vh] bg-ark-obsidian z-[10] hidden md:block" />

      {/* Premium Audio Control Button */}
      <button
        onClick={toggleAudio}
        aria-label={isMuted ? "Unmute background audio" : "Mute background audio"}
        className="absolute top-6 right-6 z-[60] group"
      >
        <div className="relative p-3 bg-ark-charcoal/80 backdrop-blur-sm border-2 border-ark-stone/30 
          hover:border-ark-gold/50 transition-all duration-300 
          shadow-brutal-sm hover:shadow-brutal-gold">
          {isMuted ? (
            <VolumeX size={20} className="text-ark-ivory/70 group-hover:text-ark-gold transition-colors duration-300" />
          ) : (
            <Volume2 size={20} className="text-ark-gold transition-colors duration-300" />
          )}
        </div>
      </button>

      {/* ========== MAIN CONTENT - EDITORIAL ASYMMETRIC LAYOUT ========== */}
      <div className="flex-grow flex items-end pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto w-full relative z-20">
          
          {/* Title Section - Left Aligned, Massive Typography */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              videoPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {/* Accent Line */}
            <div className="w-24 h-1 bg-ark-gold mb-8 animate-reveal-left" style={{ animationDelay: '200ms' }} />
            
            {/* Main Title - Massive Bebas Neue */}
            <h1 className="text-editorial-hero text-ark-ivory leading-[0.85] tracking-tight mb-6">
              <span className="block opacity-0 animate-reveal-up" style={{ animationDelay: '100ms' }}>
                THE
              </span>
              <span className="block text-ark-gold opacity-0 animate-reveal-up" style={{ animationDelay: '300ms' }}>
                ARK
              </span>
            </h1>
            
            {/* Editorial Subtitle - Cormorant Garamond Italic */}
            <p 
              className="text-editorial-subtitle text-ark-ivory/60 max-w-lg mb-12 opacity-0 animate-reveal-up"
              style={{ animationDelay: '500ms' }}
            >
              Seek refuge from the deluge. <br />
              <span className="text-ark-copper">A sanctuary forged in code.</span>
            </p>
          </div>
          
          {/* Contract Address - Brutalist Stamp Style */}
          <div 
            className={`transition-all duration-1000 delay-700 ${
              videoPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-block group">
              {/* Brutalist Card */}
              <div className="relative px-6 py-5 bg-ark-charcoal/90 backdrop-blur-sm 
                border-l-4 border-ark-gold
                shadow-brutal transition-all duration-300 
                hover:shadow-brutal-gold group-hover:translate-x-1 group-hover:-translate-y-1">
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-ark-stone/30" />
                <div className="absolute bottom-0 left-4 right-0 h-px bg-gradient-to-r from-ark-gold/50 to-transparent" />
                
                <p className="text-brutal-label text-ark-stone mb-2">
                  Contract Address
                </p>
                
                <button
                  type="button"
                  onClick={handleCopy}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleCopy();
                  }}
                  className="flex items-center gap-3 group/btn cursor-pointer touch-manipulation min-h-[44px]"
                >
                  {/* Address Text */}
                  <span className="font-mono text-sm md:text-base text-ark-ivory/90 group-hover/btn:text-ark-gold 
                    transition-colors duration-300 tracking-wide">
                    <span className="sm:hidden">{contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}</span>
                    <span className="hidden sm:inline">{contractAddress}</span>
                  </span>
                  
                  {/* Copy Icon */}
                  <div className={`p-2 transition-all duration-300
                    ${copied 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-ark-stone/20 text-ark-stone group-hover/btn:text-ark-gold group-hover/btn:bg-ark-gold/10'
                    }`}>
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
