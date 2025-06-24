
import React, { useState, useEffect } from 'react';
import { Lock, Wallet } from 'lucide-react';
import AmountInput from './AmountInput';
import DurationControls from './DurationControls';
import TierDisplay from './TierDisplay';
import RewardsEstimation from './RewardsEstimation';
import InfoPanel from './InfoPanel';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [userBalance, setUserBalance] = useState(100000); // Mock balance
  const [estimatedRewards, setEstimatedRewards] = useState(0);
  const [unlockDate, setUnlockDate] = useState<Date | null>(null);
  const [validationError, setValidationError] = useState('');

  // Default tiers if none provided
  const defaultTiers: LockTier[] = [
    { name: 'Bronze', duration: 1, multiplier: '1x', color: '#ca8a04', minDays: 1, maxDays: 29 },
    { name: 'Silver', duration: 30, multiplier: '1.5x', color: '#9ca3af', minDays: 30, maxDays: 89 },
    { name: 'Gold', duration: 90, multiplier: '2x', color: '#fbbf24', minDays: 90, maxDays: 179 },
    { name: 'Diamond', duration: 180, multiplier: '3x', color: '#06b6d4', minDays: 180, maxDays: 364 },
    { name: 'Platinum', duration: 365, multiplier: '5x', color: '#8b5cf6', minDays: 365, maxDays: 1094 },
    { name: 'Legendary', duration: 1095, multiplier: '8x', color: '#f97316', minDays: 1095, maxDays: 1826 }
  ];

  const displayTiers = lockTiers?.length > 0 ? lockTiers : defaultTiers;

  // Calculate estimated rewards and unlock date
  useEffect(() => {
    if (lockAmount && lockDuration) {
      const amount = parseFloat(lockAmount);
      const tier = getCurrentTier ? getCurrentTier(lockDuration) : displayTiers.find(t => lockDuration >= t.minDays && lockDuration <= t.maxDays) || displayTiers[0];
      const multiplier = parseFloat(tier.multiplier.replace('x', ''));
      
      // Estimate annual rewards (simplified calculation)
      const annualRewards = amount * 0.15 * multiplier; // 15% base APY
      const dailyRewards = annualRewards / 365;
      const totalRewards = dailyRewards * lockDuration;
      
      setEstimatedRewards(totalRewards);
      
      // Calculate unlock date
      const unlock = new Date();
      unlock.setDate(unlock.getDate() + lockDuration);
      setUnlockDate(unlock);
    }
  }, [lockAmount, lockDuration]);

  // Validation
  useEffect(() => {
    const amount = parseFloat(lockAmount);
    if (lockAmount && amount <= 0) {
      setValidationError('Amount must be greater than 0');
    } else if (lockAmount && amount > userBalance) {
      setValidationError('Insufficient balance');
    } else if (lockAmount && amount < 1000) {
      setValidationError('Minimum lock amount is 1,000 ARK');
    } else {
      setValidationError('');
    }
  }, [lockAmount, userBalance]);

  const currentTier = getCurrentTier ? getCurrentTier(lockDuration) : 
    displayTiers.find(t => lockDuration >= t.minDays && lockDuration <= t.maxDays) || displayTiers[0];

  const handleLock = async () => {
    if (!isConnected || !lockAmount || validationError) return;
    
    setIsProcessing(true);
    // Simulate transaction
    setTimeout(() => {
      setIsProcessing(false);
      // Reset form or show success message
    }, 3000);
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 hover:border-cyan-500/40 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Lock className="w-8 h-8 text-cyan-400 mr-3" />
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">Sacred Token Locker</h2>
          <p className="text-sm text-gray-400">Lock your ARK tokens to earn multiplied rewards</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Amount Input Section */}
        <AmountInput
          lockAmount={lockAmount}
          setLockAmount={setLockAmount}
          userBalance={userBalance}
          isConnected={isConnected}
          validationError={validationError}
        />

        {/* Duration Selection */}
        <DurationControls
          lockDuration={lockDuration}
          setLockDuration={setLockDuration}
          currentTier={currentTier}
        />

        {/* Current Tier Display */}
        <TierDisplay currentTier={currentTier} />

        {/* Rewards Estimation */}
        <RewardsEstimation
          lockAmount={lockAmount}
          lockDuration={lockDuration}
          estimatedRewards={estimatedRewards}
          unlockDate={unlockDate}
          validationError={validationError}
        />

        {/* Action Button */}
        <button
          onClick={handleLock}
          disabled={!isConnected || !lockAmount || !!validationError || isProcessing}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              Processing Lock...
            </>
          ) : !isConnected ? (
            <>
              <Wallet className="w-5 h-5" />
              Connect Wallet First
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Lock Tokens for {currentTier.name} Tier
            </>
          )}
        </button>

        {/* Info Panel */}
        <InfoPanel />
      </div>
    </div>
  );
};

export default LockInterface;
