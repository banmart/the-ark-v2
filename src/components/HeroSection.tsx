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
      {/* Hero Video Container */}
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

      {/* Hero Content — full-height grid: heading top-left, excerpt top-right, buttons bottom-right */}
      <div className="relative z-10 w-full flex-grow flex flex-col">
        <div
          className="
            w-full px-6 md:px-[120px] flex-grow
            grid grid-cols-1 md:grid-cols-2
            grid-rows-[auto_1fr_auto]
            pt-[140px] md:pt-[180px] pb-[80px] md:pb-[228px] gap-x-12
            transition-all duration-1000 opacity-60 group/hero hover:opacity-100
          "
        >

          {/* TOP: Heading — centered on mobile, left on desktop */}
          <div className="col-start-1 row-start-1 flex flex-col items-center md:items-start justify-start text-center md:text-left">
            <h1
              className="text-[64px] md:text-[120px] font-black leading-[0.85] tracking-tighter uppercase text-white"
            >
              The ARK
            </h1>
            <h1
              className="text-[28px] md:text-[48px] font-black leading-[0.9] tracking-tighter uppercase italic mt-3 text-white"
            >
              ON PULSECHAIN
            </h1>
          </div>

          {/* EXCERPT — centered on mobile, top-right on desktop */}
          <div className="col-start-1 md:col-start-2 row-start-2 md:row-start-1 flex items-start justify-center md:justify-end mt-6 md:mt-0">
            <p className="max-w-[400px] text-[15px] md:text-[17px] font-normal text-white/70 leading-relaxed text-center md:text-right">
              An advanced yield-optimizing ecosystem built on <strong>PulseChain</strong>. Maximize your digital assets through <strong>Automated Deflation</strong> and <strong>Strategic Rewards</strong>. Our protocol logic is designed for one thing: sustainable growth and deep liquidity.
            </p>
          </div>

          {/* BUTTONS — centered on mobile, bottom-left on desktop */}
          <div className="col-start-1 row-start-3 md:row-start-2 flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4 mt-6">
            {/* Main CTA - Wallet Connect */}
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
