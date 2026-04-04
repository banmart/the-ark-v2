
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <label className="text-xs font-black font-mono tracking-[0.2em] text-white/60 uppercase">BINDING AMOUNT (ARK)</label>
        <div className="text-xs font-black font-mono tracking-[0.2em] text-white uppercase">
          TREASURY: {isConnected ? userArkBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'}
        </div>
      </div>
      <div className="relative">
        <input
          type="number"
          value={lockAmount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder="0.00"
          step="0.000001"
          disabled={emergencyMode || contractPaused || isProcessing}
          className="w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-xl px-6 py-4 text-xl font-black text-white placeholder:text-white/10 focus:border-white/40 focus:ring-0 focus:outline-none disabled:opacity-20 transition-all duration-300 tracking-tighter"
        />
      </div>
      
      {/* Percentage selector buttons */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[25, 50, 75, 100].map((pct) => (
          <button
            key={pct}
            onClick={() => handlePercentageClick(pct / 100)}
            disabled={!isConnected || isProcessing || emergencyMode || contractPaused}
            className="bg-white/5 border border-white/20 text-white font-black font-mono text-xs tracking-widest py-3 rounded-xl hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-10 uppercase"
          >
            {pct === 100 ? 'MAX' : `${pct}%`}
          </button>
        ))}
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
