
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatLockAmount, validateLockAmount, formatPercentageAmount } from '@/lib/utils';

interface LockAmountInputProps {
  lockAmount: string;
  setLockAmount: (amount: string) => void;
  userArkBalance: number;
  isConnected: boolean;
  emergencyMode: boolean;
  contractPaused: boolean;
  isProcessing: boolean;
}

const MINIMUM_LOCK_AMOUNT = 20000;

const LockAmountInput = ({ 
  lockAmount, 
  setLockAmount, 
  userArkBalance, 
  isConnected, 
  emergencyMode, 
  contractPaused, 
  isProcessing 
}: LockAmountInputProps) => {
  const amount = parseFloat(lockAmount || '0');
  const hasInsufficientBalance = amount > userArkBalance;
  const isBelowMinimum = amount > 0 && amount < MINIMUM_LOCK_AMOUNT;
  const validation = validateLockAmount(lockAmount);

  const handleAmountChange = (value: string) => {
    // Allow empty input
    if (value === '') {
      setLockAmount('');
      return;
    }
    
    // Format and validate the input
    const formatted = formatLockAmount(value, 6);
    setLockAmount(formatted);
  };

  const handlePercentageClick = (percentage: number) => {
    const formattedAmount = formatPercentageAmount(userArkBalance, percentage);
    setLockAmount(formattedAmount);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Amount to Lock (ARK)</label>
        <div className="text-2xl font-bold text-green-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
          Balance: {isConnected ? userArkBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'} ARK
        </div>
      </div>
      <div className="relative">
        <input
          type="number"
          value={lockAmount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder="0.0"
          step="0.000001"
          disabled={emergencyMode || contractPaused || isProcessing}
          className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--video-cyan))] focus:ring-1 focus:ring-[hsl(var(--video-cyan))]/50 focus:outline-none disabled:opacity-50 transition-colors"
        />
      </div>
      
      {/* Percentage selector buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => handlePercentageClick(0.25)}
          disabled={!isConnected || isProcessing || emergencyMode || contractPaused}
          className="flex-1 min-w-[64px] bg-cyan-500/20 text-cyan-400 px-3 py-2 rounded text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-50 min-h-[44px]"
        >
          25%
        </button>
        <button
          onClick={() => handlePercentageClick(0.5)}
          disabled={!isConnected || isProcessing || emergencyMode || contractPaused}
          className="flex-1 min-w-[64px] bg-cyan-500/20 text-cyan-400 px-3 py-2 rounded text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-50 min-h-[44px]"
        >
          50%
        </button>
        <button
          onClick={() => handlePercentageClick(0.75)}
          disabled={!isConnected || isProcessing || emergencyMode || contractPaused}
          className="flex-1 min-w-[64px] bg-cyan-500/20 text-cyan-400 px-3 py-2 rounded text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-50 min-h-[44px]"
        >
          75%
        </button>
        <button
          onClick={() => handlePercentageClick(1.0)}
          disabled={!isConnected || isProcessing || emergencyMode || contractPaused}
          className="flex-1 min-w-[64px] bg-cyan-500/20 text-cyan-400 px-3 py-2 rounded text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-50 min-h-[44px]"
        >
          MAX
        </button>
      </div>
      
      {!validation.isValid && lockAmount && (
        <div className="flex items-center text-red-400 text-sm mt-2">
          <AlertTriangle className="w-4 h-4 mr-2" />
          {validation.error}
        </div>
      )}
      
      {validation.isValid && isBelowMinimum && lockAmount && (
        <div className="flex items-center text-red-400 text-sm mt-2">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Minimum lock amount is {MINIMUM_LOCK_AMOUNT.toLocaleString()} ARK
        </div>
      )}
      
      {validation.isValid && !isBelowMinimum && hasInsufficientBalance && lockAmount && (
        <div className="flex items-center text-red-400 text-sm mt-2">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Insufficient ARK balance
        </div>
      )}
    </div>
  );
};

export default LockAmountInput;
