import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useChatContext } from './providers/ChatProvider';
import { useBrowserPopup } from './providers/BrowserPopupProvider';
import { TextGenerateEffect } from './ui/text-generate-effect';

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
  const [isMuted, setIsMuted] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    setIsOpen
  } = useChatContext();
  const {
    openPopup
  } = useBrowserPopup();
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        setVideoLoaded(true);
        // Start the intro fade sequence
        setTimeout(() => {
          setShowIntro(false);
        }, 800); // Wait 0.8 seconds after video loads before starting fade
      };
      video.addEventListener('canplay', handleCanPlay);
      return () => video.removeEventListener('canplay', handleCanPlay);
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
  
  return (
    <section className="relative z-10 pt-32 md:pt-40 pb-4 px-6 min-h-screen flex flex-col items-center overflow-hidden">
      {/* Black Intro Overlay */}
      <div 
        className={`absolute inset-0 bg-black z-30 transition-opacity duration-[4000ms] ease-in-out ${
          showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      
      {/* Video Background with Vintage Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          loop 
          playsInline 
          className={`w-full h-full object-cover transition-opacity duration-[3000ms] ease-out ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="https://xtailgacbmhdtdxnqjdv.supabase.co/storage/v1/object/public/media/videos/hero-background.mp4" type="video/mp4" />
        </video>
        
        {/* Vintage Outer Gradient Overlay to Soften Edges */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          {/* Left gradient */}
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          {/* Right gradient */}
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-black/60 via-black/30 to-transparent" />
          
          {/* Corner gradients for vintage effect */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-black/40 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-black/40 via-transparent to-transparent" />
        </div>
        
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ease-out ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} 
          style={{
            backgroundImage: `url('https://xtailgacbmhdtdxnqjdv.supabase.co/storage/v1/object/public/media/images/hero-background.jpg')`
          }} 
        />
      </div>
      
      {/* Audio Control Button */}
      <button
        onClick={toggleAudio}
        className="absolute top-6 right-6 z-40 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all duration-200"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Logo Section - The ARK */}
      <div 
        className={`relative z-20 pt-8 md:pt-12 transition-all duration-600 ease-out ${
          showIntro ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="text-center">
          <h1>
            <TextGenerateEffect
              words="The ARK"
              className="text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-400 bg-clip-text text-transparent"
              duration={0.5}
            />
          </h1>
        </div>
      </div>
            
      {/* Content */}
      <div className="flex-grow" />
      
      {/* Bottom Section - Contract Address */}
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="flex justify-center pb-8">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Contract Address</p>
            <button
              onClick={() => copyToClipboard(contractAddress)}
              className="text-cyan-400 font-mono text-sm hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
            >
              {contractAddress}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;