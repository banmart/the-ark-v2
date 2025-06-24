
import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { useLockerData } from '../hooks/useLockerData';
import Navigation from '../components/Navigation';
import MobileDock from '../components/MobileDock';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
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
      {/* Simplified Animated Background */}
      <div className="opacity-30">
        <AnimatedBackground />
      </div>

      {/* Navigation */}
      <Navigation 
        handleConnectWallet={handleConnectWallet}
        isConnecting={isConnecting}
        isConnected={isConnected}
        account={account}
      />

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
