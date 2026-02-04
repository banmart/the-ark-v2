import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useContractData } from '../../hooks/useContractData';
import { useWalletContext } from '../providers/WalletProvider';
import { useSwapContext } from '../providers/SwapProvider';
import { useOnboardingContext } from '../providers/OnboardingProvider';
import OnboardingModal from '../OnboardingModal';
import PremiumBackground from './PremiumBackground';
import Navigation from '../Navigation';
import HeroSection from '../HeroSection';
import ContractAddressSection from '../ContractAddressSection';
import SwapSection from '../SwapSection';
import StatsSection from '../StatsSection';
import SimplifiedFeesSection from '../fees/SimplifiedFeesSection';
import FeaturesSection from '../FeaturesSection';
import ContractTransparencySection from '../ContractTransparencySection';
import LockerTiersSection from '../LockerTiersSection';
import ProphecySection from '../ProphecySection';
import ChartSection from '../ChartSection';
import Footer from '../Footer';

interface PageLayoutProps {
  children?: React.ReactNode;
}

// Hoist static contract address (rule: rendering-hoist-jsx)
const CONTRACT_ADDRESS = '0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67';

// Hoist static background image URL
const BACKGROUND_IMAGE_URL = 'https://crypto-genesis-beacon.lovable.app/lovable-uploads/00beb11a-64d8-4ae5-8c77-2846b0ef503c.jpg';

const PageLayout = memo(({ children }: PageLayoutProps) => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  const { data: contractData, loading: contractLoading } = useContractData();
  const { isConnected, account, plsBalance, arkBalance, isConnecting, handleConnectWallet } = useWalletContext();
  const { fromAmount, toAmount, isLoading: swapLoading, slippage, canSwap, setFromAmount, handleSwap } = useSwapContext();
  const { showOnboarding, setShowOnboarding } = useOnboardingContext();

  // Preload background image (rule: bundle-preload)
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBackgroundLoaded(true);
    img.src = BACKGROUND_IMAGE_URL;
  }, []);

  // Stable clipboard handler (rule: rerender-functional-setstate)
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for mobile browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      toast({
        title: "Copied!",
        description: "Contract address copied to clipboard"
      });
    } catch (err) {
      // Final fallback - show address in toast for manual copy
      toast({
        title: "Copy manually:",
        description: text,
        duration: 8000
      });
    }
  }, []);

  // Stable callback for closing onboarding
  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, [setShowOnboarding]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={handleCloseOnboarding} 
      />

      {/* Premium Background System */}
      <PremiumBackground variant="default" />

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
        contractAddress={CONTRACT_ADDRESS}
        setShowOnboarding={setShowOnboarding}
      />

      {/* Stats Section */}
      <StatsSection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Simplified Fees Section */}
      <SimplifiedFeesSection />

      {/* Features Section - Updated Four Pillars */}
      <FeaturesSection />

      {/* Locker Tiers Section */}
      <LockerTiersSection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Prophecy Section */}
      <ProphecySection />

      {/* Render children if provided */}
      {children}

      {/* Footer */}
      <Footer />
    </div>
  );
});

PageLayout.displayName = 'PageLayout';

export default PageLayout;
