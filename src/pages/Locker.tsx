import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import Navigation from '../components/Navigation';
import MobileDock from '../components/MobileDock';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import ProtocolStats from '../components/locker/ProtocolStats';
import LockInterface from '../components/locker/LockInterface';
import TierBenefits from '../components/locker/TierBenefits';
import UserDashboard from '../components/locker/UserDashboard';

interface LockPosition {
  id: number;
  amount: number;
  lockTime: number;
  unlockTime: number;
  tier: string;
  active: boolean;
  totalRewards: number;
}

const Locker = () => {
  const [lockAmount, setLockAmount] = useState('');
  const [lockDuration, setLockDuration] = useState(30);
  const [userLocks, setUserLocks] = useState<LockPosition[]>([]);
  const [pendingRewards, setPendingRewards] = useState(0);

  const {
    isConnected,
    account,
    isConnecting,
    connectWallet,
  } = useWallet();

  const lockTiers = [
    { name: 'Bronze', duration: 30, multiplier: '1x', color: '#CD7F32', minDays: 30, maxDays: 89 },
    { name: 'Silver', duration: 90, multiplier: '1.5x', color: '#C0C0C0', minDays: 90, maxDays: 179 },
    { name: 'Gold', duration: 180, multiplier: '2x', color: '#FFD700', minDays: 180, maxDays: 364 },
    { name: 'Diamond', duration: 365, multiplier: '3x', color: '#B9F2FF', minDays: 365, maxDays: 1094 },
    { name: 'Platinum', duration: 1095, multiplier: '5x', color: '#E5E4E2', minDays: 1095, maxDays: 1459 },
    { name: 'Legendary', duration: 1460, multiplier: '8x', color: '#FF6B35', minDays: 1460, maxDays: 1826 }
  ];

  const getCurrentTier = (days: number) => {
    return lockTiers.find(tier => days >= tier.minDays && days <= tier.maxDays) || lockTiers[0];
  };

  const calculatePenalty = (lockTime: number, unlockTime: number, amount: number) => {
    const now = Date.now() / 1000;
    if (now >= unlockTime) return { penalty: 0, userReceives: amount };
    
    const timeRemaining = unlockTime - now;
    const totalLockTime = unlockTime - lockTime;
    const penaltyRate = (50 * timeRemaining) / totalLockTime; // 50% max penalty
    const penalty = (amount * penaltyRate) / 100;
    
    return { penalty, userReceives: amount - penalty };
  };

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
            🔒 THE ARK LOCKER 🔒
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Lock your ARK tokens and ascend through divine tiers. The longer you lock, the greater your blessings.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          {/* Protocol Stats */}
          <ProtocolStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Lock Interface */}
            <div className="space-y-8">
              <LockInterface
                lockAmount={lockAmount}
                setLockAmount={setLockAmount}
                lockDuration={lockDuration}
                setLockDuration={setLockDuration}
                lockTiers={lockTiers}
                getCurrentTier={getCurrentTier}
                isConnected={isConnected}
              />

              {/* Tier Information */}
              <TierBenefits lockTiers={lockTiers} />
            </div>

            {/* User Dashboard */}
            <UserDashboard
              isConnected={isConnected}
              pendingRewards={pendingRewards}
              userLocks={userLocks}
              calculatePenalty={calculatePenalty}
            />
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
