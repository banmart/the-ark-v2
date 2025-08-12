import React from 'react';
import { WalletProvider } from '../components/providers/WalletProvider';
import { SwapProvider } from '../components/providers/SwapProvider';
import { OnboardingProvider } from '../components/providers/OnboardingProvider';
import { BrowserPopupProvider } from '../components/providers/BrowserPopupProvider';
import { useContractData } from '../hooks/useContractData';
import AnimatedBackground from '../components/AnimatedBackground';
import Navigation from '../components/Navigation';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import ContractTransparencySection from '../components/ContractTransparencySection';
import LockerTiersSection from '../components/LockerTiersSection';
import ProphecySection from '../components/ProphecySection';
import ChartSection from '../components/ChartSection';
import Footer from '../components/Footer';
import { useWalletContext } from '../components/providers/WalletProvider';

const StatsContent = () => {
  const {
    data: contractData,
    loading: contractLoading
  } = useContractData();

  const {
    isConnected,
    account,
    isConnecting,
    handleConnectWallet,
  } = useWalletContext();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background System */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navigation 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />

      {/* Page Header */}
      <section className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold michroma-regular bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-4">
              [LIVE_DATA_MATRIX]
            </h1>
            <p className="text-xl text-gray-300 font-mono">
              Real-time analytics and protocol statistics
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection 
        contractData={contractData}
        contractLoading={contractLoading}
      />

      {/* Features Section - Four Quantum Pillars */}
      <FeaturesSection />

      {/* Contract Transparency Section */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

const Stats = () => {
  return <StatsContent />;
};

export default Stats;