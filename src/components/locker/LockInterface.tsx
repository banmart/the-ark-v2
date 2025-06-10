
import React from 'react';

interface LockTier {
  name: string;
  duration: number;
  multiplier: string;
  color: string;
  minDays: number;
  maxDays: number;
}

interface LockInterfaceProps {
  lockAmount: string;
  setLockAmount: (amount: string) => void;
  lockDuration: number;
  setLockDuration: (duration: number) => void;
  lockTiers: LockTier[];
  getCurrentTier: (days: number) => LockTier;
  isConnected: boolean;
}

const LockInterface = ({
  lockAmount,
  setLockAmount,
  lockDuration,
  setLockDuration,
  lockTiers,
  getCurrentTier,
  isConnected
}: LockInterfaceProps) => {
  return (
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
  );
};

export default LockInterface;
