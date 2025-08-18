
import React from 'react';
import { Loader2, CheckCircle, Shield } from 'lucide-react';
import StepIndicator from '../StepIndicator';

interface LockButtonProps {
  isConnected: boolean;
  lockAmount: string;
  isValidDuration: boolean;
  emergencyMode: boolean;
  contractPaused: boolean;
  isProcessing: boolean;
  hasInsufficientBalance: boolean;
  needsApproval: boolean;
  currentStep: number;
  onApprove: () => void;
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
  currentStep,
  onApprove,
  onLock 
}: LockButtonProps) => {
  const amount = parseFloat(lockAmount || '0');

  // Single-step flow (no approval needed)
  if (!needsApproval) {
    const getButtonText = () => {
      if (!isConnected) return 'Connect Wallet First';
      if (isProcessing) return 'Processing...';
      if (emergencyMode) return 'Emergency Mode - Locked';
      if (contractPaused) return 'Contract Paused';
      if (!isValidDuration) return 'Invalid Duration';
      if (hasInsufficientBalance) return 'Insufficient ARK Balance';
      return `Lock ${amount} ARK Tokens`;
    };

    return (
      <button
        onClick={onLock}
        disabled={!isConnected || !lockAmount || !isValidDuration || emergencyMode || contractPaused || isProcessing || hasInsufficientBalance}
        className="w-full bg-cyan-500 text-black font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform flex items-center justify-center gap-2"
      >
        {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
        <Shield className="w-5 h-5" />
        {getButtonText()}
      </button>
    );
  }

  // Two-step flow (approval needed)
  const isDisabled = !isConnected || !lockAmount || !isValidDuration || emergencyMode || contractPaused || hasInsufficientBalance;

  return (
    <div className="space-y-4">
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={2} />
      
      <div className="space-y-3">
        {/* Step 1: Approval Button */}
        <button
          onClick={onApprove}
          disabled={isDisabled || isProcessing || currentStep > 1}
          className={`w-full font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            currentStep === 1 
              ? 'bg-cyan-500 text-black hover:scale-105' 
              : currentStep > 1 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-600/20 text-gray-400'
          } ${isDisabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {currentStep > 1 ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Approved {amount} ARK
            </>
          ) : (
            <>
              {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
              <Shield className="w-5 h-5" />
              Step 1: Approve {amount} ARK
            </>
          )}
        </button>

        {/* Step 2: Lock Button */}
        <button
          onClick={onLock}
          disabled={isDisabled || isProcessing || currentStep < 2}
          className={`w-full font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            currentStep === 2 
              ? 'bg-cyan-500 text-black hover:scale-105' 
              : 'bg-gray-600/20 text-gray-400'
          } ${isDisabled || isProcessing || currentStep < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing && currentStep === 2 && <Loader2 className="w-5 h-5 animate-spin" />}
          <Shield className="w-5 h-5" />
          Step 2: Lock {amount} ARK Tokens
        </button>
      </div>
    </div>
  );
};

export default LockButton;
