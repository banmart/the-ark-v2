
import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { useLockerData } from '../hooks/useLockerData';
import { BrowserPopupProvider } from '../components/providers/BrowserPopupProvider';
import { useBrowserPopup } from '../components/providers/BrowserPopupProvider';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LockerHeader from '../components/locker/LockerHeader';
import EmergencyStatus from '../components/locker/EmergencyStatus';
import TierLegend from '../components/locker/TierLegend';
import CompactTierDisplay from '../components/locker/CompactTierDisplay';
import LockerOperations from '../components/locker/LockerOperations';
import ContractAddressDisplay from '../components/locker/ContractAddressDisplay';
import MobileBrowserPopup from '../components/MobileBrowserPopup';

const LockerContent = () => {
  const {
    isConnected,
    account,
    isConnecting,
    connectWallet,
  } = useWallet();

  const { emergencyMode, contractPaused } = useLockerData();
  const { isOpen, url, title, closePopup } = useBrowserPopup();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Premium Multi-Layer Background System */}
        <div className="fixed inset-0 z-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"></div>
          
          {/* Deep vignette overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.8)_100%)]"></div>
          
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/15 via-cyan-500/5 to-transparent rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-teal-500/12 via-teal-500/4 to-transparent rounded-full blur-3xl animate-[float_25s_ease-in-out_infinite_reverse]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-purple-500/8 via-purple-500/2 to-transparent rounded-full blur-3xl animate-[float_30s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-radial from-amber-500/6 via-amber-500/2 to-transparent rounded-full blur-3xl animate-[float_22s_ease-in-out_infinite_reverse]"></div>
          
          {/* Film grain texture */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}></div>
          
          {/* Premium tech grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Floating particles */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-[particleFloat_20s_ease-in-out_infinite]"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${['#22d3ee', '#2dd4bf', '#a855f7', '#fbbf24'][Math.floor(Math.random() * 4)]}80 0%, transparent 70%)`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 15}s`,
              }}
            />
          ))}
          
          {/* Corner glow accents */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-teal-500/8 to-transparent blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-purple-500/6 to-transparent blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-amber-500/5 to-transparent blur-3xl"></div>
          
          {/* Animated scan lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-[scanline_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent animate-[scanline_8s_ease-in-out_infinite_reverse]" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Navigation */}
        <div className="relative z-20">
          <Navigation 
            handleConnectWallet={handleConnectWallet}
            isConnecting={isConnecting}
            isConnected={isConnected}
            account={account}
          />
        </div>

        <div className="relative z-10 pt-24">
          {/* Header */}
          <LockerHeader />

          {/* Emergency Status */}
          <EmergencyStatus 
            emergencyMode={emergencyMode} 
            contractPaused={contractPaused} 
          />

          {/* Tier Legend */}
          <TierLegend />

          {/* Compact Tier Display */}
          <CompactTierDisplay />

          {/* Operations */}
          <LockerOperations isConnected={isConnected} />

          {/* Contract Address Section */}
          <div className="relative max-w-6xl mx-auto px-6 py-16">
            {/* Premium background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.15) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            <div className="relative">
              {/* Premium header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-full">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono text-cyan-400 tracking-[0.15em]">[CONTRACT INFORMATION]</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-3">
                  Smart Contract Address
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono text-green-400 tracking-wider">VERIFIED ON PULSECHAIN</span>
                </div>
              </div>
              
              <ContractAddressDisplay />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <Footer />
        </div>

      </div>

      {/* Mobile Browser Popup */}
      <MobileBrowserPopup 
        isOpen={isOpen}
        onClose={closePopup}
        url={url}
        title={title}
      />

      {/* Premium animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px) scale(1.2); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(-20px) scale(0.8); opacity: 0.4; }
          75% { transform: translateY(-45px) translateX(10px) scale(1.1); opacity: 0.5; }
        }
        @keyframes scanline {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </>
  );
};

const Locker = () => {
  return (
    <BrowserPopupProvider>
      <LockerContent />
    </BrowserPopupProvider>
  );
};

export default Locker;
