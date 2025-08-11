import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useContractData } from '../../hooks/useContractData';
import { useWalletContext } from '../providers/WalletProvider';
import { useSwapContext } from '../providers/SwapProvider';
import { useOnboardingContext } from '../providers/OnboardingProvider';
import OnboardingModal from '../OnboardingModal';
import AnimatedBackground from '../AnimatedBackground';
import Navigation from '../Navigation';
import HeroSection from '../HeroSection';
import StatsSection from '../StatsSection';
import ContentSections from '../ContentSections';
import ChartSection from '../ChartSection';
import Footer from '../Footer';

interface PageLayoutProps {
  children?: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
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

  // Updated to use the new ARK contract address
  const contractAddress = '0xACC15eF8fa2e702d0138c3662A9E7d696f40F021';

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

      {/* Hero Section */}
      <HeroSection 
        copyToClipboard={copyToClipboard}
        contractAddress={contractAddress}
        setShowOnboarding={setShowOnboarding}
      />
      
      {/* Content Sections - New ARK Features */}
      <ContentSections />

      {/* Render children if provided */}
      {children}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageLayout;
