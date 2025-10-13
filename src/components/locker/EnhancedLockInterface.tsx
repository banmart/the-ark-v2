import React, { useState, useEffect } from 'react';
import { useLockerData } from '../../hooks/useLockerData';
import { AlertTriangle, Lock, Zap } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import EmergencyModeAlert from './EmergencyModeAlert';
import LockAmountInput from './LockAmountInput';
import LockDurationSlider from './LockDurationSlider';
import TierDisplay from './TierDisplay';
import ApprovalStatus from './ApprovalStatus';
import SecurityInfoPanel from './SecurityInfoPanel';
import LockButton from './LockButton';
interface EnhancedLockInterfaceProps {
  isConnected: boolean;
}
const MINIMUM_LOCK_AMOUNT = 20000;

const EnhancedLockInterface = ({
  isConnected
}: EnhancedLockInterfaceProps) => {
  const {
    lockTiers,
    determineLockTier,
    CONTRACT_CONSTANTS,
    lockTokens,
    approveTokens,
    emergencyMode,
    contractPaused,
    loading,
    userArkBalance,
    currentAllowance,
    isProcessingApproval,
    isProcessingLock
  } = useLockerData();
  const [lockAmount, setLockAmount] = useState('');
  const [lockDuration, setLockDuration] = useState(30);
  const [currentStep, setCurrentStep] = useState(1);
  const currentTier = determineLockTier(lockDuration);
  const amount = parseFloat(lockAmount || '0');
  const needsApproval = amount > 0 && currentAllowance < amount;
  const hasInsufficientBalance = amount > userArkBalance;
  const isBelowMinimum = amount > 0 && amount < MINIMUM_LOCK_AMOUNT;
  const isProcessing = isProcessingApproval || isProcessingLock;
  const isValidDuration = lockDuration >= CONTRACT_CONSTANTS.MIN_LOCK_DURATION && lockDuration <= CONTRACT_CONSTANTS.MAX_LOCK_DURATION;

  // Reset step when amount changes or approval is no longer needed
  useEffect(() => {
    if (!needsApproval) {
      setCurrentStep(1);
    } else if (needsApproval && currentAllowance >= amount && amount > 0) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [needsApproval, currentAllowance, amount]);

  const handleApproval = async () => {
    if (!lockAmount || !isConnected || hasInsufficientBalance) return;
    
    try {
      const success = await approveTokens(amount);
      if (success) {
        setCurrentStep(2);
        toast({
          title: "Approval Successful!",
          description: `Approved ${amount} ARK tokens for locking`
        });
      }
    } catch (error: any) {
      console.error('Approval failed:', error);
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: error.message || "Failed to approve tokens"
      });
    }
  };
  const handleLock = async () => {
    if (!lockAmount || !isConnected || hasInsufficientBalance || isBelowMinimum) return;
    try {
      await lockTokens(amount, lockDuration);
      toast({
        title: "Success!",
        description: `Successfully locked ${amount} ARK tokens for ${lockDuration} days`
      });
      setLockAmount('');
      setLockDuration(30);
      setCurrentStep(1);
    } catch (error: any) {
      console.error('Lock failed:', error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to lock tokens"
      });
    }
  };
  return <div className="relative">
      {/* Quantum field background */}
      <div className="absolute inset-0 -inset-4">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent blur-2xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-conic from-teal-500/10 via-cyan-500/10 to-teal-500/10 rounded-full blur-3xl animate-[spin_30s_linear_infinite]"></div>
      </div>

      <div className="relative z-10 bg-black/20 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-8 hover:border-cyan-500/50 transition-all duration-500">
        {/* System Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider">LOCK_PROTOCOL</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
          {(emergencyMode || contractPaused) && <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs font-mono text-red-400 tracking-wider">ALERT</span>
            </div>}
        </div>

        {/* Main Title */}
        <div className="mb-8">
          <div className="text-sm font-mono text-cyan-400/60 mb-2 tracking-[0.15em]">
            [LOCK_PROTOCOL_INTERFACE]
          </div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Quantum Token Lock</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-green-400">READY_FOR_OPERATIONS</span>
          </div>
        </div>

        <EmergencyModeAlert emergencyMode={emergencyMode} />

        <div className="space-y-8">
          <LockAmountInput lockAmount={lockAmount} setLockAmount={setLockAmount} userArkBalance={userArkBalance} isConnected={isConnected} emergencyMode={emergencyMode} contractPaused={contractPaused} isProcessing={isProcessing} />

          <LockDurationSlider lockDuration={lockDuration} setLockDuration={setLockDuration} CONTRACT_CONSTANTS={CONTRACT_CONSTANTS} emergencyMode={emergencyMode} contractPaused={contractPaused} isProcessing={isProcessing} />

          <TierDisplay currentTier={currentTier} lockAmount={lockAmount} lockDuration={lockDuration} CONTRACT_CONSTANTS={CONTRACT_CONSTANTS} />

          <ApprovalStatus lockAmount={lockAmount} isConnected={isConnected} needsApproval={needsApproval} currentAllowance={currentAllowance} />

          {/* 30-Day Minimum Lock Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-400 mb-1">Important Lock Notice</p>
                <p className="text-sm text-yellow-400/80">
                  Lock durations start at a minimum of 30 days. Early unlock penalties apply based on time remaining.
                </p>
              </div>
            </div>
          </div>

          <SecurityInfoPanel CONTRACT_CONSTANTS={CONTRACT_CONSTANTS} />

          <LockButton 
            isConnected={isConnected} 
            lockAmount={lockAmount} 
            isValidDuration={isValidDuration} 
            emergencyMode={emergencyMode} 
            contractPaused={contractPaused} 
            isProcessing={isProcessing} 
            hasInsufficientBalance={hasInsufficientBalance || isBelowMinimum} 
            needsApproval={needsApproval}
            currentStep={currentStep}
            onApprove={handleApproval}
            onLock={handleLock} 
          />
        </div>

        {/* Scanning Effect */}
        
      </div>
    </div>;
};
export default EnhancedLockInterface;