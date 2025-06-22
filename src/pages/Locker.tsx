
import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { useLockerData } from '../hooks/useLockerData';
import Navigation from '../components/Navigation';
import MobileDock from '../components/MobileDock';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import EnhancedProtocolStats from '../components/locker/EnhancedProtocolStats';
import EnhancedLockInterface from '../components/locker/EnhancedLockInterface';
import TierBenefits from '../components/locker/TierBenefits';
import EnhancedUserDashboard from '../components/locker/EnhancedUserDashboard';

const Locker = () => {
  const {
    isConnected,
    account,
    isConnecting,
    connectWallet,
  } = useWallet();

  const { lockTiers, emergencyMode, contractPaused } = useLockerData();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <Navigation 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />

      <div className="relative z-10 pt-24">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🔒 THE SACRED LOCKER 🔒
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Those who commit their tokens to the sacred vault shall be blessed according to their devotion. The longer the covenant, the greater the divine reward.
          </p>
          <div className="text-sm text-gray-400 max-w-2xl mx-auto">
            In the depths of The ARK lies the Sacred Locker—a divine vault where time transforms into treasure. Here, the faithful lock away their tokens, ascending through celestial tiers as their commitment deepens and their blessings multiply.
          </div>
          
          {(emergencyMode || contractPaused) && (
            <div className="mt-4 inline-block bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2">
              <span className="text-red-400 text-sm font-semibold">
                {emergencyMode ? '⚠️ Emergency Mode Active' : '⏸️ Contract Paused'}
              </span>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          {/* Enhanced Protocol Stats */}
          <EnhancedProtocolStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Lock Interface */}
            <div className="space-y-8">
              <EnhancedLockInterface isConnected={isConnected} />

              {/* Tier Information */}
              <TierBenefits lockTiers={lockTiers} />
            </div>

            {/* Enhanced User Dashboard */}
            <EnhancedUserDashboard isConnected={isConnected} />
          </div>

          {/* Contract Information */}
          <div className="mt-12 bg-white/5 border border-cyan-500/30 rounded-xl p-8">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Contract Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">ReentrancyGuard Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Renounced Ownership</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">6 Lock Tiers (1x - 8x multipliers)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm">50% Max Early Unlock Penalty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm">Penalty: 50% Burn + 50% to Lockers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm">Weight-Based Reward Distribution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Locker;
