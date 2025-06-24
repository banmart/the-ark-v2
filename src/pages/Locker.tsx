
import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { useLockerData } from '../hooks/useLockerData';
import Navigation from '../components/Navigation';
import MobileDock from '../components/MobileDock';
import Footer from '../components/Footer';
import LockerHeader from '../components/locker/LockerHeader';
import EmergencyStatus from '../components/locker/EmergencyStatus';
import LockerOperations from '../components/locker/LockerOperations';

const Locker = () => {
  const {
    isConnected,
    account,
    isConnecting,
    connectWallet,
  } = useWallet();

  const { emergencyMode, contractPaused } = useLockerData();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
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

        {/* Operations */}
        <LockerOperations isConnected={isConnected} />
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Mobile Dock */}
      <div className="relative z-20">
        <MobileDock 
          handleConnectWallet={handleConnectWallet}
          isConnecting={isConnecting}
          isConnected={isConnected}
          account={account}
        />
      </div>
    </div>
  );
};

export default Locker;
