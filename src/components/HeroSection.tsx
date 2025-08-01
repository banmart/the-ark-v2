
import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from './providers/ChatProvider';
import { useBrowserPopup } from './providers/BrowserPopupProvider';

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
      };
      video.addEventListener('canplay', handleCanPlay);
      return () => video.removeEventListener('canplay', handleCanPlay);
    }
  }, []);

  const handleBoardTheArk = () => {
    openPopup('https://ipfs.app.pulsex.com/?inputCurrency=0xefD766cCb38EaF1dfd701853BFCe31359239F305&outputCurrency=0xACC15eF8fa2e702d0138c3662A9E7d696f40F021', 'Buy ARK');
  };
  
  const handleDecodeProtocol = () => {
    setIsOpen(true);
  };

  return (
    <section className="relative z-10 pt-32 md:pt-40 pb-4 px-6 min-h-screen flex flex-col items-center overflow-hidden">
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
          <source src="https://emerald-quickest-swallow-922.mypinata.cloud/ipfs/bafybeiaf2bqhh6mf5ozqxjsqackzi2cfto6oy3voocaikbhfpqhnmmp3zy" type="video/mp4" />
        </video>
        
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ease-out ${videoLoaded ? 'opacity-0' : 'opacity-100'}`} 
          style={{
            backgroundImage: `url('https://emerald-quickest-swallow-922.mypinata.cloud/ipfs/bafkreic2svvnfyvpp3obxoay4ek5i7xpatawhah3lbtaexvdfgvx3lxlke')`
          }} 
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/20 lg:via-transparent lg:to-transparent"></div>
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
