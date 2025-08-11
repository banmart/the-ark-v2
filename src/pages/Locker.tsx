import React, { useState, useCallback, useMemo } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useLockerData } from '../hooks/useLockerData';
import { BrowserPopupProvider } from '../components/providers/BrowserPopupProvider';
import { useBrowserPopup } from '../components/providers/BrowserPopupProvider';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LockerHeader from '../components/locker/LockerHeader';
import EmergencyStatus from '../components/locker/EmergencyStatus';
import TierLegend from '../components/locker/TierLegend';
import LockerOperations from '../components/locker/LockerOperations';
import ContractAddressDisplay from '../components/locker/ContractAddressDisplay';
import MobileBrowserPopup from '../components/MobileBrowserPopup';

interface Tier {
  id: string;
  name: string;
  minDays: number;
  maxDays: number;
  color: string;
}

const LockerContent: React.FC = () => {
  const {
    isConnected,
    account,
    isConnecting,
    connectWallet,
  } = useWallet();

  const { emergencyMode, contractPaused } = useLockerData();
  const { isOpen, url, title, closePopup } = useBrowserPopup();

  // State for tier selection and duration
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [duration, setDuration] = useState<number>(30); // Default 30 days

  // Define tier thresholds based on duration
  const tierThresholds = useMemo<Tier[]>(() => [
    { id: 'bronze', name: 'Bronze', minDays: 1, maxDays: 90, color: 'amber' },
    { id: 'silver', name: 'Silver', minDays: 91, maxDays: 180, color: 'gray' },
    { id: 'gold', name: 'Gold', minDays: 181, maxDays: 365, color: 'yellow' },
    { id: 'platinum', name: 'Platinum', minDays: 366, maxDays: 730, color: 'blue' },
    { id: 'diamond', name: 'Diamond', minDays: 731, maxDays: 1095, color: 'purple' },
  ], []);

  // Get highlighted tier based on duration
  const highlightedTier = useMemo<Tier | undefined>(() => {
    return tierThresholds.find(tier => 
      duration >= tier.minDays && duration <= tier.maxDays
    );
  }, [duration, tierThresholds]);

  const handleConnectWallet = useCallback(async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  }, [connectWallet]);

  const handleTierSelect = useCallback((tier: Tier) => {
    setSelectedTier(tier);
    // Set duration to middle of tier range
    const midDuration = Math.floor((tier.minDays + tier.maxDays) / 2);
    setDuration(midDuration);
  }, []);

  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration);
    // Clear selected tier when sliding, let highlighting take over
    setSelectedTier(null);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Quantum Field Background */}
        <div className="fixed inset-0 z-0">
          {/* Base quantum gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-teal-900/20 via-black to-black"></div>
          
          {/* Animated quantum grid */}
          <div className="absolute inset-0 opacity-30">
            <div className="pulse-grid bg-grid bg-grid-size animate-pulse"></div>
          </div>
          
          {/* Floating quantum orbs */}
          <div className="floating-orb orb1 bg-gradient-radial from-cyan-500/20 to-transparent blur-3xl"></div>
          <div className="floating-orb orb2 bg-gradient-radial from-teal-500/20 to-transparent blur-3xl"></div>
          <div className="floating-orb orb3 bg-gradient-radial from-green-500/20 to-transparent blur-3xl"></div>
          
          {/* Breathing Gradient Bursts */}
          <div className="gradient-burst burst1"></div>
          <div className="gradient-burst burst2"></div>
          <div className="gradient-burst burst3"></div>
          <div className="gradient-burst burst4"></div>
          <div className="gradient-burst burst5"></div>
          <div className="gradient-burst burst6"></div>
          
          {/* Scanning lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
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

          {/* Operations - Now with enhanced props for grid functionality */}
          <LockerOperations 
            isConnected={isConnected}
            tiers={tierThresholds}
            selectedTier={selectedTier}
            highlightedTier={highlightedTier}
            duration={duration}
            onTierSelect={handleTierSelect}
            onDurationChange={handleDurationChange}
          />

          {/* Contract Address Section */}
          <div className="relative max-w-6xl mx-auto px-6 py-16">
            {/* Quantum Field Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.2) 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            <div className="relative">
              <div className="text-center mb-8">
                <div className="text-sm font-mono text-cyan-400/60 mb-2 tracking-[0.15em]">
                  [CONTRACT_INFORMATION]
                </div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">Smart Contract Address</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono text-green-400">VERIFIED_ON_PULSECHAIN</span>
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

const Locker: React.FC = () => {
  return (
    <BrowserPopupProvider>
      <LockerContent />
    </BrowserPopupProvider>
  );
};

export default Locker;