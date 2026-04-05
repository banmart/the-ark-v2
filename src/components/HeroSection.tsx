import React from 'react';
import { ChevronDown, ArrowRight, Copy, Check } from 'lucide-react';

interface HeroSectionProps {
  handleConnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  account: string | null;
  copyToClipboard: (text: string) => void;
  contractAddress: string;
}

const HeroSection = ({ 
  handleConnectWallet, 
  isConnecting, 
  isConnected, 
  account,
  copyToClipboard,
  contractAddress 
}: HeroSectionProps) => {
  const [copied, setCopied] = React.useState(false);

  const [videoLoaded, setVideoLoaded] = React.useState(false);

  const handleCopy = () => {
    copyToClipboard(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-screen bg-transparent overflow-hidden flex flex-col font-sans">
      {/* Hero Video Container - Relative on mobile (above content), Absolute on desktop (background) */}
      <div 
        className="relative md:absolute inset-0 z-0 w-full h-[50vh] md:h-full overflow-hidden bg-transparent"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)'
        }}
      >
        {/* Cinematic Placeholder / Fallback Image */}
        <img 
          src="/assets/images/the-ark-ship.jpg" 
          alt="The Ark Sanctuary"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 pointer-events-none z-[1] ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        />

        <video
          autoPlay
          muted
          loop
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.5)}
        >
          <source src="/videos/ark------final-----01.mp4" type="video/mp4" />
        </video>
        {/* Black Overlay removed for better transparency blend */}
        
        {/* Bottom fade removed in favor of alpha mask */}
      </div>

      {/* Hero Content - Adjusted padding for mobile/desktop layout switch */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-12 md:pt-[280px] pb-[102px] flex flex-col items-center text-center flex-grow">
        
        {/* All content container for unified opacity transition - TRIGGER ON BOUNDING BOX */}
        <div className="flex flex-col items-center transition-all duration-1000 opacity-60 group/hero hover:opacity-100">

          {/* Heading with Outlined/Solid state - The Covenant Branding */}
          <div className="mb-14 space-y-4 text-center">
            <div className="flex flex-col items-center">
              {/* Main Heading: Outlined by default, Solid on group hover */}
              <h1 
                className="text-[64px] md:text-[140px] font-black leading-[0.85] tracking-tighter transition-all duration-700 uppercase
                  text-transparent [text-shadow:none]
                  group-hover/hero:text-white group-hover/hero:[WebkitTextFillColor:white]"
                style={{
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.8)',
                }}
              >
                The ARK
              </h1>
              
              {/* Secondary Heading: Follows same logic */}
              <h1 
                className="text-[32px] md:text-[54px] font-black leading-[0.85] tracking-tighter uppercase italic mt-4 transition-all duration-700
                  text-transparent 
                  group-hover/hero:text-white group-hover/hero:[WebkitTextFillColor:white]"
                style={{
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.8)',
                }}
              >
                ON PULSECHAIN
              </h1>
            </div>
          </div>

          {/* Subtitle - Covenant Context */}
          <p className="max-w-[720px] text-[16px] md:text-[18px] font-normal text-white/70 leading-relaxed mb-12">
            An advanced yield-optimizing ecosystem built on <strong>PulseChain</strong>. Maximize your digital assets through <strong>Automated Deflation</strong> and <strong>Strategic Rewards</strong>. Our protocol logic is designed for one thing: sustainable growth and deep liquidity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
            {/* Main CTA - Wallet Connect style */}
            <div className="relative group">
              <div className="absolute -inset-[0.6px] bg-primary rounded-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="relative px-[36px] py-[14px] bg-black rounded-full flex items-center justify-center transition-all hover:bg-neutral-900 active:scale-95 shadow-[0_0_20px_hsl(var(--primary)/0.2)] border border-primary/50"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-radial from-primary to-transparent blur-[2px]" />
                <span className="text-[15px] font-bold text-white uppercase tracking-wide">
                  {isConnected ? (account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected') : (isConnecting ? 'Connecting...' : 'Connect Wallet')}
                </span>
              </button>
            </div>

            {/* Contract Address Pill */}
            <div className="relative group/copy">
              <div className="absolute -inset-[0.6px] bg-white/10 rounded-full pointer-events-none opacity-100 border border-white/5" />
              <button 
                onClick={handleCopy}
                className="relative px-[24px] py-[14px] bg-black/40 backdrop-blur-xl rounded-full flex items-center gap-3 transition-all hover:bg-white/5 active:scale-95"
              >
                <div className="flex flex-col items-start">
                  <span className="text-white/30 text-[9px] uppercase font-mono tracking-widest">Protocol Address</span>
                  <span className="text-white/80 font-mono text-xs">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/5">
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - Centered at bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-70 z-20">
        <span className="text-white/60 font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={20} className="text-primary/80" />
      </div>
    </section>
  );
};

export default HeroSection;
