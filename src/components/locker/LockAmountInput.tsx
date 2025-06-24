
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface LockAmountInputProps {
  lockAmount: string;
  setLockAmount: (amount: string) => void;
  userArkBalance: number;
  isConnected: boolean;
  emergencyMode: boolean;
  contractPaused: boolean;
  isProcessing: boolean;
}

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

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Amount to Lock (ARK)</label>
        <div className="text-sm text-gray-400">
          Balance: {isConnected ? userArkBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'} ARK
        </div>
      </div>
      <div className="relative">
        <input
          type="number"
          value={lockAmount}
          onChange={(e) => setLockAmount(e.target.value)}
          placeholder="0.0"
          disabled={emergencyMode || contractPaused || isProcessing}
          className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={() => setLockAmount(userArkBalance.toString())}
          disabled={!isConnected || isProcessing}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
        >
          MAX
        </button>
      </div>
      
      {hasInsufficientBalance && lockAmount && (
        <div className="flex items-center text-red-400 text-sm mt-2">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Insufficient ARK balance
        </div>
      )}
    </div>
  );
};

export default LockAmountInput;
