
import React from 'react';
import { Coins, AlertCircle } from 'lucide-react';

interface AmountInputProps {
  lockAmount: string;
  setLockAmount: (amount: string) => void;
  userBalance: number;
  isConnected: boolean;
  validationError: string;
}

const AmountInput = ({ 
  lockAmount, 
  setLockAmount, 
  userBalance, 
  isConnected, 
  validationError 
}: AmountInputProps) => {
  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setLockAmount(value);
    }
  };

  const handleMaxClick = () => {
    setLockAmount(userBalance.toString());
  };

  return (
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
  );
};

export default AmountInput;
