
import React, { useState } from 'react';
import { useLockerData } from '../../hooks/useLockerData';
import { AlertTriangle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import ContractAddressDisplay from './ContractAddressDisplay';
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

const EnhancedLockInterface = ({ isConnected }: EnhancedLockInterfaceProps) => {
  const { 
    lockTiers, 
    determineLockTier, 
    CONTRACT_CONSTANTS, 
    lockTokens,
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

  const currentTier = determineLockTier(lockDuration);
  const amount = parseFloat(lockAmount || '0');
  const needsApproval = amount > 0 && currentAllowance < amount;
  const hasInsufficientBalance = amount > userArkBalance;
  const isProcessing = isProcessingApproval || isProcessingLock;
  const isValidDuration = lockDuration >= CONTRACT_CONSTANTS.MIN_LOCK_DURATION && 
                         lockDuration <= CONTRACT_CONSTANTS.MAX_LOCK_DURATION;

  const handleLock = async () => {
    if (!lockAmount || !isConnected || hasInsufficientBalance) return;
    
    try {
      await lockTokens(amount, lockDuration);
      
      toast({
        title: "Success!",
        description: `Successfully locked ${amount} ARK tokens for ${lockDuration} days`,
      });
      
      setLockAmount('');
      setLockDuration(30);
      
    } catch (error: any) {
      console.error('Lock failed:', error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to lock tokens"
      });
    }
  };

  return (
    <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-cyan-400">Lock Tokens</h2>
        {(emergencyMode || contractPaused) && (
          <AlertTriangle className="w-5 h-5 text-red-400" />
        )}
      </div>

      <ContractAddressDisplay />
      <EmergencyModeAlert emergencyMode={emergencyMode} />

      <div className="space-y-6">
        <LockAmountInput
          lockAmount={lockAmount}
          setLockAmount={setLockAmount}
          userArkBalance={userArkBalance}
          isConnected={isConnected}
          emergencyMode={emergencyMode}
          contractPaused={contractPaused}
          isProcessing={isProcessing}
        />

        <LockDurationSlider
          lockDuration={lockDuration}
          setLockDuration={setLockDuration}
          CONTRACT_CONSTANTS={CONTRACT_CONSTANTS}
          emergencyMode={emergencyMode}
          contractPaused={contractPaused}
          isProcessing={isProcessing}
        />

        <TierDisplay
          currentTier={currentTier}
          lockAmount={lockAmount}
          lockDuration={lockDuration}
          CONTRACT_CONSTANTS={CONTRACT_CONSTANTS}
        />

        <ApprovalStatus
          lockAmount={lockAmount}
          isConnected={isConnected}
          needsApproval={needsApproval}
          currentAllowance={currentAllowance}
        />

        <SecurityInfoPanel CONTRACT_CONSTANTS={CONTRACT_CONSTANTS} />

        <LockButton
          isConnected={isConnected}
          lockAmount={lockAmount}
          isValidDuration={isValidDuration}
          emergencyMode={emergencyMode}
          contractPaused={contractPaused}
          isProcessing={isProcessing}
          hasInsufficientBalance={hasInsufficientBalance}
          needsApproval={needsApproval}
          onLock={handleLock}
        />
      </div>
    </div>
  );
};

export default EnhancedLockInterface;
