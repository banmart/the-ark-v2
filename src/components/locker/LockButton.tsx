
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
      if (!isConnected) return 'AWAKEN SOUL';
      if (isProcessing) return 'BINDING...';
      if (emergencyMode) return 'STATION_LOCKED';
      if (contractPaused) return 'COVENANT_PAUSED';
      if (!isValidDuration) return 'INVALID_MATURITY';
      if (hasInsufficientBalance) return 'TREASURY_EXHAUSTED';
      return `BIND ${amount.toLocaleString()} ARK`;
    };

    return (
      <button
        onClick={onLock}
        disabled={!isConnected || !lockAmount || !isValidDuration || emergencyMode || contractPaused || isProcessing || hasInsufficientBalance}
        className="w-full bg-white text-black font-black font-mono text-[10px] tracking-[0.3em] py-5 rounded-2xl disabled:opacity-10 hover:scale-[1.05] transition-all duration-300 flex items-center justify-center gap-3 uppercase"
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Shield className="w-4 h-4" />
        )}
        {getButtonText()}
      </button>
    );
  }

  // Two-step flow (approval needed)
  const isDisabled = !isConnected || !lockAmount || !isValidDuration || emergencyMode || contractPaused || hasInsufficientBalance;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Step 1: Approval Button */}
        <button
          onClick={onApprove}
          disabled={isDisabled || isProcessing || currentStep > 1}
          className={`w-full font-black font-mono text-[10px] tracking-[0.3em] py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase ${
            currentStep === 1 
              ? 'bg-white text-black hover:scale-[1.05]' 
              : currentStep > 1 
                ? 'bg-white/5 border border-white/20 text-white/40' 
                : 'bg-white/5 text-white/10'
          } ${isDisabled || isProcessing ? 'opacity-10 cursor-not-allowed' : ''}`}
        >
          {currentStep > 1 ? (
            <>
              <CheckCircle className="w-4 h-4" />
              AUTHORIZED
            </>
          ) : (
            <>
              {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
              <Shield className="w-4 h-4" />
              AUTHORIZE TITHE
            </>
          )}
        </button>

        {/* Step 2: Lock Button */}
        <button
          onClick={onLock}
          disabled={isDisabled || isProcessing || currentStep < 2}
          className={`w-full font-black font-mono text-[10px] tracking-[0.3em] py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase ${
            currentStep === 2 
              ? 'bg-white text-black hover:scale-[1.05]' 
              : 'bg-white/5 text-white/10'
          } ${isDisabled || isProcessing || currentStep < 2 ? 'opacity-10 cursor-not-allowed' : ''}`}
        >
          {isProcessing && currentStep === 2 && <Loader2 className="w-3 h-3 animate-spin" />}
          <Shield className="w-4 h-4" />
          BIND TO THE ARK
        </button>
      </div>

      {/* Simplified Progress indicator */}
      <div className="flex gap-2">
        <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${currentStep >= 1 ? 'bg-white' : 'bg-white/10'}`} />
        <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${currentStep >= 2 ? 'bg-white' : 'bg-white/10'}`} />
      </div>
    </div>
  );
};

export default LockButton;
