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
import CloudVideoSection from '../CloudVideoSection';
import ChartSection from '../ChartSection';
import Footer from '../Footer';

interface PageLayoutProps {
  children?: React.ReactNode;
}

// Hoist static contract address (rule: rendering-hoist-jsx)
const CONTRACT_ADDRESS = '0xF4a370e64DD4673BAA250C5435100FA98661Db4C';

// Hoist static background image URL
const BACKGROUND_IMAGE_URL = 'https://crypto-genesis-beacon.lovable.app/lovable-uploads/00beb11a-64d8-4ae5-8c77-2846b0ef503c.jpg';

const PageLayout = memo(({ children }: PageLayoutProps) => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  const { data: contractData, loading: contractLoading } = useContractData();
  const { isConnected, account, plsBalance, arkBalance, tokenBalances, isConnecting, handleConnectWallet } = useWalletContext();
  const { fromAmount, fromToken, toAmount, isLoading: swapLoading, slippage, canSwap, setFromAmount, setFromToken, handleSwap } = useSwapContext();
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
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={handleCloseOnboarding} 
      />

      {/* Premium Background System */}
      <PremiumBackground />

      {/* Navigation */}
      <Navigation 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />

      {/* Hero Section */}
      <HeroSection 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
        copyToClipboard={copyToClipboard}
        contractAddress={CONTRACT_ADDRESS}
      />

      {/* Stats Section */}
      <StatsSection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Swap Interface - Restoration */}
      <SwapSection 
        fromAmount={fromAmount}
        fromToken={fromToken}
        toAmount={toAmount}
        plsBalance={plsBalance}
        arkBalance={arkBalance}
        tokenBalances={tokenBalances}
        swapLoading={swapLoading}
        slippage={slippage}
        canSwap={canSwap}
        isConnected={isConnected}
        setFromAmount={setFromAmount}
        setFromToken={setFromToken}
        handleSwap={handleSwap}
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

      {/* Atmospheric Cloud Section */}


      {/* Prophecy Section */}
      <ProphecySection />

      {/* Render children if provided */}
      {children}

      {/* Market Surveillance Chart */}
      <ChartSection />

      {/* Footer */}
      <Footer />
    </div>
  );
});

PageLayout.displayName = 'PageLayout';

export default PageLayout;
