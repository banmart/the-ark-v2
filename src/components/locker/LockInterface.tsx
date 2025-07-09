
import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Calculator, 
  Calendar, 
  TrendingUp, 
  Wallet, 
  Crown, 
  Zap,
  Info,
  AlertCircle,
  CheckCircle,
  Coins,
  Clock,
  Star,
  Flame
} from 'lucide-react';

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
    { name: 'Bronze', duration: 30, multiplier: '1x', color: '#ca8a04', minDays: 30, maxDays: 89 },
    { name: 'Silver', duration: 90, multiplier: '1.5x', color: '#9ca3af', minDays: 90, maxDays: 179 },
    { name: 'Gold', duration: 180, multiplier: '2x', color: '#fbbf24', minDays: 180, maxDays: 364 },
    { name: 'Diamond', duration: 365, multiplier: '3x', color: '#06b6d4', minDays: 365, maxDays: 1094 },
    { name: 'Platinum', duration: 1095, multiplier: '5x', color: '#8b5cf6', minDays: 1095, maxDays: 1459 },
    { name: 'Legendary', duration: 1460, multiplier: '8x', color: '#f97316', minDays: 1460, maxDays: 1826 }
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

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return '⛵';
      case 'silver': return '🛡️';
      case 'gold': return '👑';
      case 'diamond': return '💎';
      case 'platinum': return '⭐';
      case 'legendary': return '⚡';
      default: return '🔒';
    }
  };

  const getTierIconComponent = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze': return Crown;
      case 'silver': return Crown;
      case 'gold': return Crown;
      case 'diamond': return Star;
      case 'platinum': return Star;
      case 'legendary': return Zap;
      default: return Lock;
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setLockAmount(value);
    }
  };

  const handleMaxClick = () => {
    setLockAmount(userBalance.toString());
  };

  const handlePresetDuration = (days: number) => {
    setLockDuration(days);
  };

  const handleLock = async () => {
    if (!isConnected || !lockAmount || validationError) return;
    
    setIsProcessing(true);
    // Simulate transaction
    setTimeout(() => {
      setIsProcessing(false);
      // Reset form or show success message
    }, 3000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDurationPresets = () => [
    { label: '30D', days: 30, tier: 'Bronze' },
    { label: '90D', days: 90, tier: 'Silver' },
    { label: '180D', days: 180, tier: 'Gold' },
    { label: '1Y', days: 365, tier: 'Diamond' },
    { label: '3Y', days: 1095, tier: 'Platinum' },
    { label: '5Y', days: 1826, tier: 'Legendary' }
  ];

  const TierIconComponent = getTierIconComponent(currentTier.name);

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 hover:border-cyan-500/40 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Lock className="w-8 h-8 text-cyan-400 mr-3" />
        <div>
          <h2 className="text-2xl font-bold">Sacred Token Locker</h2>
          <p className="text-sm text-gray-400">Lock your ARK tokens to earn multiplied rewards</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Amount Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <Coins className="w-4 h-4 mr-2" />
              Amount to Lock
            </label>
            <div className="text-sm text-gray-400">
              Balance: {isConnected ? userBalance.toLocaleString() : '--'} ARK
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={lockAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.0"
              className="w-full bg-black/40 border-2 border-gray-600 rounded-lg px-4 py-4 pr-20 text-white text-lg placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
            />
            <button
              onClick={handleMaxClick}
              disabled={!isConnected}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
            >
              MAX
            </button>
          </div>
          
          {validationError && (
            <div className="flex items-center text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {validationError}
            </div>
          )}
        </div>

        {/* Duration Selection */}
        <div className="space-y-4">
          <label className="flex items-center text-sm font-medium text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            Lock Duration
          </label>
          
          {/* Preset Duration Buttons */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {getDurationPresets().map((preset) => (
              <button
                key={preset.days}
                onClick={() => handlePresetDuration(preset.days)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  lockDuration === preset.days
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          {/* Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="30"
              max="1826"
              value={lockDuration}
              onChange={(e) => setLockDuration(Number(e.target.value))}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, ${currentTier.color} 0%, ${currentTier.color} ${(lockDuration - 30) / (1826 - 30) * 100}%, #374151 ${(lockDuration - 30) / (1826 - 30) * 100}%, #374151 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>30 days</span>
              <span className="font-bold text-white">{lockDuration} days</span>
              <span>5 years</span>
            </div>
          </div>
        </div>

        {/* Current Tier Display */}
        <div 
          className="relative bg-gradient-to-r from-black/40 via-gray-900/40 to-black/40 rounded-xl p-6 border-2 overflow-hidden"
          style={{ borderColor: currentTier.color }}
        >
          {/* Background glow */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 blur-2xl opacity-30"
            style={{ background: `radial-gradient(circle, ${currentTier.color}40 0%, transparent 70%)` }}
          ></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="text-3xl mr-3">{getTierIcon(currentTier.name)}</div>
                <TierIconComponent className="w-6 h-6 mr-3" style={{ color: currentTier.color }} />
                <div>
                  <div className="text-xl font-bold" style={{ color: currentTier.color }}>
                    {currentTier.name} Tier
                  </div>
                  <div className="text-sm text-gray-400">
                    {currentTier.multiplier} reward multiplier
                  </div>
                </div>
              </div>
              {currentTier.name === 'Legendary' && (
                <div className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  LEGENDARY
                </div>
              )}
            </div>
            
            {/* Tier Benefits Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-300">
                <TrendingUp className="w-4 h-4 mr-2" style={{ color: currentTier.color }} />
                Enhanced vault rewards
              </div>
              <div className="flex items-center text-gray-300">
                <Crown className="w-4 h-4 mr-2" style={{ color: currentTier.color }} />
                {currentTier.name} community status
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Estimation */}
        {lockAmount && !validationError && (
          <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Estimated Rewards
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {estimatedRewards.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-gray-400">Total ARK Rewards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {unlockDate ? formatDate(unlockDate) : '--'}
                </div>
                <div className="text-sm text-gray-400">Unlock Date</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {((estimatedRewards / parseFloat(lockAmount || '1')) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Total Return</div>
              </div>
            </div>
          </div>
        )}

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
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="text-blue-300 font-semibold mb-1">Important Notes</div>
              <ul className="text-gray-300 space-y-1 text-xs">
                <li>• Tokens are locked for the selected duration and cannot be withdrawn early without penalty</li>
                <li>• Rewards are distributed proportionally based on your tier multiplier</li>
                <li>• Higher tiers receive exponentially more rewards from the same fee pool</li>
                <li>• Your tier status grants special privileges in the ARK community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${currentTier.color};
          cursor: pointer;
          box-shadow: 0 0 10px ${currentTier.color}50;
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${currentTier.color};
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px ${currentTier.color}50;
        }
      `}</style>
    </div>
  );
};

export default LockInterface;
