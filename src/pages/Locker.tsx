
import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useLockerData } from '../hooks/useLockerData';
import Navigation from '../components/Navigation';
import MobileDock from '../components/MobileDock';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import EnhancedLockInterface from '../components/locker/EnhancedLockInterface';
import EnhancedUserDashboard from '../components/locker/EnhancedUserDashboard';
import { AlertTriangle } from 'lucide-react';

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
        {/* Simple Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Token Locker
          </h1>
          <p className="text-gray-400 text-lg">
            Lock your tokens to earn rewards based on commitment duration
          </p>

          {/* Emergency Status */}
          {(emergencyMode || contractPaused) && (
            <div className="mt-6">
              <div className="inline-block bg-red-900/40 border border-red-500/50 rounded-xl px-6 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-bold">
                    {emergencyMode ? 'Emergency Mode Active' : 'Contract Paused'}
                  </span>
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-20 space-y-8">
          {/* Lock Interface */}
          <div className="animate-fade-in">
            <EnhancedLockInterface isConnected={isConnected} />
          </div>

          {/* User Dashboard */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <EnhancedUserDashboard isConnected={isConnected} />
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
