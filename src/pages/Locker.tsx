
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
        <PremiumBackground />

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
            <div className="relative">
              {/* Premium header */}
              <div className="text-center mb-12 animate-fade-up">
                <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                  <span className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">[STATION LOGS]</span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
                  The Immutable Ledger
                </h3>
                
                <div className="flex items-center justify-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl inline-flex mx-auto">
                  <div className="w-1.5 h-1.5 bg-green-500/50 rounded-full"></div>
                  <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Verified via PulseChain Covenant</span>
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
