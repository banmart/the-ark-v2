
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useContractData } from '../hooks/useContractData';
import { useWallet } from '../hooks/useWallet';
import { useSwap } from '../hooks/useSwap';
import OnboardingModal from '../components/OnboardingModal';
import AnimatedBackground from '../components/AnimatedBackground';
import Navigation from '../components/Navigation';
import MobileDock from '../components/MobileDock';
import HeroSection from '../components/HeroSection';
import ContractAddressSection from '../components/ContractAddressSection';
import SwapSection from '../components/SwapSection';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import LockerTiersSection from '../components/LockerTiersSection';
import ProphecySection from '../components/ProphecySection';
import CountdownSection from '../components/CountdownSection';
import ChartSection from '../components/ChartSection';
import Footer from '../components/Footer';

const Index = () => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
    connectWallet,
  } = useWallet();

  const {
    fromAmount,
    toAmount,
    isLoading: swapLoading,
    slippage,
    setFromAmount,
    setSlippage,
    executeSwap,
    canSwap,
  } = useSwap();

  useEffect(() => {
    // Preload background image and trigger fade-in
    const img = new Image();
    img.onload = () => {
      setBackgroundLoaded(true);
    };
    img.src = 'https://crypto-genesis-beacon.lovable.app/lovable-uploads/00beb11a-64d8-4ae5-8c77-2846b0ef503c.jpg';
  }, []);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('ark-onboarding-seen');
    
    if (!hasSeenOnboarding) {
      // Set timer to show onboarding after 10 seconds
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 10000);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Connected!",
        description: `Wallet connected successfully`
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet"
      });
    }
  };

  const handleSwap = async () => {
    try {
      const result = await executeSwap();
      toast({
        title: "Swap Successful!",
        description: `Transaction hash: ${result.hash.slice(0, 10)}...`
      });
    } catch (error: any) {
      console.error("Swap error:", error);
      toast({
        variant: "destructive",
        title: "Swap Failed",
        description: error.message || "Failed to execute swap"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard"
    });
  };

  const contractAddress = "0x1234567890abcdef1234567890abcdef12345678";

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

      {/* Contract Address Section */}
      <ContractAddressSection 
        contractAddress={contractAddress}
        copyToClipboard={copyToClipboard}
      />

      {/* Swap Section */}
      <SwapSection 
        fromAmount={fromAmount}
        toAmount={toAmount}
        plsBalance={plsBalance}
        arkBalance={arkBalance}
        swapLoading={swapLoading}
        slippage={slippage}
        canSwap={canSwap}
        isConnected={isConnected}
        setFromAmount={setFromAmount}
        handleSwap={handleSwap}
      />

      {/* Stats Section */}
      <StatsSection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Locker Tiers Section */}
      <LockerTiersSection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Prophecy Section */}
      <ProphecySection />

      {/* Countdown Section */}
      <CountdownSection />

      {/* Chart Section */}
      <ChartSection />

      {/* Footer */}
      <Footer />

      {/* Mobile Dock */}
      <MobileDock />
    </div>
  );
};

export default Index;
