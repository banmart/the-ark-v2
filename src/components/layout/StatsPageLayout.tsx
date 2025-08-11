import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useContractData } from '../../hooks/useContractData';
import { useWalletContext } from '../providers/WalletProvider';
import { useSwapContext } from '../providers/SwapProvider';
import { useOnboardingContext } from '../providers/OnboardingProvider';
import OnboardingModal from '../OnboardingModal';
import AnimatedBackground from '../AnimatedBackground';
import Navigation from '../Navigation';
import ContractAddressSection from '../ContractAddressSection';
import SwapSection from '../SwapSection';
import StatsSection from '../StatsSection';
import FeaturesSection from '../FeaturesSection';
import ContractTransparencySection from '../ContractTransparencySection';
import LockerTiersSection from '../LockerTiersSection';
import ProphecySection from '../ProphecySection';
import ChartSection from '../ChartSection';
import Footer from '../Footer';

interface StatsPageLayoutProps {
  children?: React.ReactNode;
}

const StatsPageLayout = ({ children }: StatsPageLayoutProps) => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  const {
    data: contractData,
    loading: contractLoading
  } = useContractData();

  const {
    isConnected,
    account,
    plsBalance,
    arkBalance,
    isConnecting,
    handleConnectWallet,
  } = useWalletContext();

  const {
    fromAmount,
    toAmount,
    isLoading: swapLoading,
    slippage,
    canSwap,
    setFromAmount,
    handleSwap,
  } = useSwapContext();

  const {
    showOnboarding,
    setShowOnboarding,
  } = useOnboardingContext();

  useEffect(() => {
    // Preload background image and trigger fade-in
    const img = new Image();
    img.onload = () => {
      setBackgroundLoaded(true);
    };
    img.src = 'https://crypto-genesis-beacon.lovable.app/lovable-uploads/00beb11a-64d8-4ae5-8c77-2846b0ef503c.jpg';
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard"
    });
  };

  // Updated to use the live ARK contract address
  const contractAddress = '0x4d547181427Ee90342b4781E0eF2cd46F189cb2C';

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />

      {/* Animated Background System */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navigation 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />

      {/* Stats Section */}
      <StatsSection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Features Section - Updated Four Pillars */}
      <FeaturesSection />

      {/* NEW: Contract Transparency Section */}
      <ContractTransparencySection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Locker Tiers Section */}
      <LockerTiersSection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Prophecy Section */}
      <ProphecySection />

      {/* Chart Section */}
      <ChartSection />

      {/* Render children if provided */}
      {children}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StatsPageLayout;