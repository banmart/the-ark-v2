import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useWalletContext } from '../providers/WalletProvider';
import { useOnboardingContext } from '../providers/OnboardingProvider';
import OnboardingModal from '../OnboardingModal';
import AnimatedBackground from '../AnimatedBackground';
import Navigation from '../Navigation';
import MobileDock from '../MobileDock';
import Footer from '../Footer';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  const {
    isConnected,
    account,
    isConnecting,
    handleConnectWallet,
  } = useWalletContext();

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

      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Dock */}
      <MobileDock 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />
    </div>
  );
};

export default BaseLayout;