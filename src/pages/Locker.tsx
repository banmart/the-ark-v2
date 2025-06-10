import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import Navigation from '../components/Navigation';
import MobileDock from '../components/MobileDock';

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
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
        <div className="absolute inset-0 bg-grid animate-grid-move opacity-20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }}></div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🏛️</div>
              <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Total Locked</div>
              <div className="text-2xl font-bold">12.5M ARK</div>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Active Lockers</div>
              <div className="text-2xl font-bold">2,847</div>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Rewards Pool</div>
              <div className="text-2xl font-bold">850K ARK</div>
            </div>
            <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">APY Range</div>
              <div className="text-2xl font-bold">15-150%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Lock Interface */}
            <div className="space-y-8">
              <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-cyan-400">Lock Tokens</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount to Lock</label>
                    <input
                      type="number"
                      value={lockAmount}
                      onChange={(e) => setLockAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Lock Duration (Days)</label>
                    <input
                      type="range"
                      min="30"
                      max="1826"
                      value={lockDuration}
                      onChange={(e) => setLockDuration(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>30 days</span>
                      <span className="text-cyan-400 font-bold">{lockDuration} days</span>
                      <span>5 years</span>
                    </div>
                  </div>

                  {/* Current Tier Display */}
                  <div className="bg-black/30 rounded-lg p-4 border" style={{ borderColor: getCurrentTier(lockDuration).color }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold" style={{ color: getCurrentTier(lockDuration).color }}>
                          {getCurrentTier(lockDuration).name} Tier
                        </div>
                        <div className="text-sm text-gray-400">
                          {getCurrentTier(lockDuration).multiplier} reward multiplier
                        </div>
                      </div>
                      <div className="text-2xl">
                        {getCurrentTier(lockDuration).name === 'Bronze' && '⛵'}
                        {getCurrentTier(lockDuration).name === 'Silver' && '🛡️'}
                        {getCurrentTier(lockDuration).name === 'Gold' && '👑'}
                        {getCurrentTier(lockDuration).name === 'Diamond' && '💎'}
                        {getCurrentTier(lockDuration).name === 'Platinum' && '⭐'}
                        {getCurrentTier(lockDuration).name === 'Legendary' && '⚡'}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!isConnected || !lockAmount}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                  >
                    {!isConnected ? 'Connect Wallet First' : 'Lock Tokens'}
                  </button>
                </div>
              </div>

              {/* Tier Information */}
              <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6 text-cyan-400">Lock Tier Benefits</h3>
                <div className="grid grid-cols-2 gap-4">
                  {lockTiers.map((tier, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-gray-600">
                      <div className="text-sm font-bold mb-1" style={{ color: tier.color }}>
                        {tier.name}
                      </div>
                      <div className="text-xs text-gray-400 mb-1">
                        {tier.minDays}-{tier.maxDays} days
                      </div>
                      <div className="text-sm font-bold text-white">
                        {tier.multiplier} rewards
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Dashboard */}
            <div className="space-y-8">
              {/* Pending Rewards */}
              <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-cyan-400">Pending Rewards</h2>
                  <button
                    disabled={!isConnected || pendingRewards === 0}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                  >
                    Claim
                  </button>
                </div>
                <div className="text-3xl font-black text-green-400">
                  {isConnected ? `${pendingRewards.toLocaleString()} ARK` : 'Connect wallet'}
                </div>
              </div>

              {/* Active Locks */}
              <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-cyan-400">Your Active Locks</h2>
                
                {!isConnected ? (
                  <div className="text-center py-8 text-gray-400">
                    Connect your wallet to view your locks
                  </div>
                ) : userLocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No active locks found. Lock some tokens to get started!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userLocks.map((lock) => {
                      const now = Date.now() / 1000;
                      const isUnlocked = now >= lock.unlockTime;
                      const penalty = calculatePenalty(lock.lockTime, lock.unlockTime, lock.amount);
                      
                      return (
                        <div key={lock.id} className="bg-black/30 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-lg font-bold text-white">
                                {lock.amount.toLocaleString()} ARK
                              </div>
                              <div className="text-sm text-cyan-400 font-medium">
                                {lock.tier} Tier
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">
                                {isUnlocked ? 'Ready to unlock' : `${Math.ceil((lock.unlockTime - now) / 86400)} days left`}
                              </div>
                              <div className="text-sm text-green-400">
                                +{lock.totalRewards.toLocaleString()} ARK earned
                              </div>
                            </div>
                          </div>
                          
                          {!isUnlocked && penalty.penalty > 0 && (
                            <div className="bg-red-900/20 border border-red-500/30 rounded p-2 mb-3">
                              <div className="text-xs text-red-400">
                                Early unlock penalty: {penalty.penalty.toFixed(2)} ARK
                              </div>
                              <div className="text-xs text-gray-400">
                                You would receive: {penalty.userReceives.toFixed(2)} ARK
                              </div>
                            </div>
                          )}
                          
                          <button
                            className={`w-full py-2 rounded font-bold text-sm transition-transform hover:scale-105 ${
                              isUnlocked 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-black' 
                                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            }`}
                          >
                            {isUnlocked ? 'Unlock Tokens' : 'Early Unlock (Penalty)'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dock */}
      <MobileDock />
    </div>
  );
};

export default Locker;
