
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
import PremiumBackground from '../components/layout/PremiumBackground';

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
        {/* Premium Background */}
        <PremiumBackground variant="locker" particleCount={16} />

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
