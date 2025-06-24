
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LockButtonProps {
  isConnected: boolean;
  lockAmount: string;
  isValidDuration: boolean;
  emergencyMode: boolean;
  contractPaused: boolean;
  isProcessing: boolean;
  hasInsufficientBalance: boolean;
  needsApproval: boolean;
  onLock: () => void;
}

const LockButton = ({ 
  isConnected, 
  lockAmount, 
  isValidDuration, 
  emergencyMode, 
  contractPaused, 
  isProcessing, 
  hasInsufficientBalance, 
  needsApproval,
  onLock 
}: LockButtonProps) => {
  const amount = parseFloat(lockAmount || '0');

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet First';
    if (isProcessing) return 'Processing...';
    if (emergencyMode) return 'Emergency Mode - Locked';
    if (contractPaused) return 'Contract Paused';
    if (!isValidDuration) return 'Invalid Duration';
    if (hasInsufficientBalance) return 'Insufficient ARK Balance';
    if (needsApproval) return `Approve & Lock ${amount} ARK`;
    return `Lock ${amount} ARK Tokens`;
  };

  return (
    <button
      onClick={onLock}
      disabled={!isConnected || !lockAmount || !isValidDuration || emergencyMode || contractPaused || isProcessing || hasInsufficientBalance}
      className="w-full bg-cyan-500 text-black font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform flex items-center justify-center gap-2"
    >
      {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
      {getButtonText()}
    </button>
  );
};

export default LockButton;
