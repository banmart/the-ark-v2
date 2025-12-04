import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { useChatContext } from './providers/ChatProvider';
import { useBrowserPopup } from './providers/BrowserPopupProvider';
import { TextGenerateEffect } from './ui/text-generate-effect';
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
    <section className="relative z-10 pt-32 md:pt-40 pb-4 px-6 min-h-screen flex flex-col items-center overflow-hidden">
      {/* Black Intro Overlay */}
      <div 
        className={`absolute inset-0 bg-black z-30 transition-opacity duration-[4000ms] ease-in-out ${
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

      {/* Film Grain Overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.03] mix-blend-overlay">
        <div className="absolute inset-0 film-grain" />
      </div>

      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Premium Gradient Layers */}
      <div className="absolute inset-0 z-[7] pointer-events-none">
        {/* Top gradient - deeper */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/90 via-black/50 to-transparent" />
        {/* Bottom gradient - richer */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/70 to-transparent" />
        {/* Side gradients */}
        <div className="absolute top-0 bottom-0 left-0 w-48 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-48 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />
        
        {/* Golden accent glow - center bottom */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(251,191,36,0.3) 0%, transparent 70%)'
          }}
        />
        
        {/* Cyan accent glow - center */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.4) 0%, transparent 60%)'
          }}
        />
      </div>

      {/* Ambient Light Rays */}
      <div className="absolute inset-0 z-[8] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full light-rays opacity-[0.08]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[9] pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/30 particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* Letterbox Bars - Cinematic */}
      <div className="absolute top-0 left-0 right-0 h-[4vh] bg-black z-[10] hidden md:block" />
      <div className="absolute bottom-0 left-0 right-0 h-[4vh] bg-black z-[10] hidden md:block" />

      {/* Subtle Scan Line */}
      <div className="absolute inset-0 z-[11] pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0 scan-lines" />
      </div>

      {/* Premium Audio Control Button */}
      <button
        onClick={toggleAudio}
        aria-label={isMuted ? "Unmute background audio" : "Mute background audio"}
        className="absolute top-6 right-6 z-[60] group"
      >
        <div className="relative p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 
          hover:border-amber-500/30 hover:bg-black/40 transition-all duration-500 
          shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle at center, rgba(251,191,36,0.1) 0%, transparent 70%)'
            }}
          />
          {isMuted ? (
            <VolumeX size={20} className="text-white/70 group-hover:text-amber-400/90 transition-colors duration-300" />
          ) : (
            <Volume2 size={20} className="text-amber-400/90 transition-colors duration-300" />
          )}
        </div>
      </button>

      {/* Content */}
      <div className="flex-grow" />
      
      {/* Bottom Section - Logo and Contract Address */}
      <div className="max-w-7xl mx-auto w-full relative z-20">
        {/* Logo Section - The ARK */}
        <div 
          className={`relative z-20 pb-8 transition-all duration-1000 ease-out ${
            videoPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="text-center">
            {/* Premium Title with Glow */}
            <h1 className="relative">
              <TextGenerateEffect
                words="The ARK"
                className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold 
                  bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 bg-clip-text text-transparent
                  drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                duration={0.5}
              />
              {/* Subtle glow behind text */}
              <div 
                className="absolute inset-0 -z-10 blur-3xl opacity-30"
                style={{
                  background: 'linear-gradient(90deg, rgba(34,211,238,0.5) 0%, rgba(45,212,191,0.5) 50%, rgba(251,191,36,0.3) 100%)'
                }}
              />
            </h1>
            
            {/* Premium Tagline */}
            <p 
              className={`mt-4 text-sm md:text-base tracking-[0.3em] uppercase text-white/40 font-light
                transition-all duration-1000 delay-500 ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
            >
              Decentralized Protocol
            </p>
          </div>
        </div>
        
        {/* Premium Contract Address Card */}
        <div 
          className={`flex justify-center pb-8 transition-all duration-1000 delay-300 ${
            videoPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative group">
            {/* Glassmorphism Card */}
            <div className="relative px-6 py-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl 
              border border-white/[0.08] hover:border-cyan-500/20 
              transition-all duration-500 hover:bg-white/[0.05]
              shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(34,211,238,0.1)]">
              
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.05) 0%, transparent 70%)'
                }}
              />
              
              <p className="text-xs text-white/30 mb-2 tracking-widest uppercase font-light">
                Contract Address
              </p>
              
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 sm:gap-3 group/btn"
              >
                {/* Truncated on mobile, full on desktop */}
                <span className="font-mono text-[10px] sm:text-sm md:text-base text-cyan-400/80 group-hover/btn:text-cyan-300 
                  transition-colors duration-300 tracking-wide">
                  <span className="sm:hidden">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
                  <span className="hidden sm:inline">{contractAddress}</span>
                </span>
                
                <div className={`p-1.5 rounded-lg transition-all duration-300 
                  ${copied 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-white/5 text-white/40 group-hover/btn:text-cyan-400 group-hover/btn:bg-cyan-500/10'
                  }`}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
