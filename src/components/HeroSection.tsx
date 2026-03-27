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

  const handleCopy = () => {
    copyToClipboard(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col font-sans">
      {/* Hero Video Container - Relative on mobile (above content), Absolute on desktop (background) */}
      <div className="relative md:absolute inset-0 z-0 w-full h-[50vh] md:h-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://emerald-quickest-swallow-922.mypinata.cloud/ipfs/bafybeiewttwnlicyeeq57wwx6gipbxwmzbtuv6vieh7seqoq7imojxmgcm" type="video/mp4" />
        </video>
        {/* Black Overlay - Only on desktop for text readability */}
        <div className="absolute inset-0 bg-black/50 hidden md:block" />
        
        {/* Alpha Transition - Fading out the video bottom, now part of the video container */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-64 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-[5]" />
      </div>

      {/* Hero Content - Adjusted padding for mobile/desktop layout switch */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-12 md:pt-[280px] pb-[102px] flex flex-col items-center text-center flex-grow">
        


        {/* Heading with Gradient Fill - The Covenant Branding */}
        <div className="mb-14 space-y-2 text-center">

          <div className="flex flex-col items-center">
            <h1 
              className="text-[64px] md:text-[120px] font-black leading-[0.85] tracking-tighter"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              THE ARK
            </h1>
            <h1 className="text-[54px] md:text-[96px] font-black leading-[0.85] tracking-tighter text-white uppercase italic">
              COVENANT
            </h1>
          </div>
        </div>

        {/* Subtitle - Covenant Context */}
        <p className="max-w-[720px] text-[16px] md:text-[18px] font-normal text-white/70 leading-relaxed mb-12">
          An unbreakable digital contract inscribed upon the PulseChain. The Covenant of The Ark safeguards your wealth through sacred deflationary laws, perpetual reflections, and the immutable protection of the Vault.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
          {/* Main CTA - Wallet Connect style */}
          <div className="relative group">
            <div className="absolute -inset-[0.6px] bg-white rounded-full pointer-events-none opacity-100" />
            <button 
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="relative px-[36px] py-[14px] bg-white rounded-full flex items-center justify-center transition-all hover:bg-neutral-100 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-radial from-white to-transparent blur-[2px]" />
              <span className="text-[15px] font-bold text-black uppercase tracking-wide">
                {isConnected ? (account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected') : (isConnecting ? 'Connecting...' : 'Connect Wallet')}
              </span>
            </button>
          </div>

          {/* Contract Address Pill */}
          <div className="relative group">
            <div className="absolute -inset-[0.6px] bg-white/20 rounded-full pointer-events-none opacity-100 border border-white/10" />
            <button 
              onClick={handleCopy}
              className="relative px-[24px] py-[14px] bg-black/40 backdrop-blur-xl rounded-full flex items-center gap-3 transition-all hover:bg-white/5 active:scale-95"
            >
              <div className="flex flex-col items-start">
                <span className="text-white/30 text-[9px] uppercase font-mono tracking-widest">Contract</span>
                <span className="text-white/80 font-mono text-xs">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white/5">
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
              </div>
            </button>
          </div>
        </div>
      </div>



      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-30 z-10">
        <span className="text-white/40 font-mono text-[9px] uppercase tracking-widest">Protocol Metrics</span>
        <ChevronDown size={16} className="text-white/60" />
      </div>
    </section>
  );
};

export default HeroSection;
