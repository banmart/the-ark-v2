import React, { useState, useEffect } from 'react';
import { useLockerData } from '../../hooks/useLockerData';
import { AlertTriangle, Lock, Zap, Sparkles, Gift, Users } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { ethers } from 'ethers';
import EmergencyModeAlert from './EmergencyModeAlert';
import LockAmountInput from './LockAmountInput';
import LockDurationSlider from './LockDurationSlider';
import TierDisplay from './TierDisplay';
import ApprovalStatus from './ApprovalStatus';
import SecurityInfoPanel from './SecurityInfoPanel';
import LockButton from './LockButton';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EnhancedLockInterfaceProps {
  isConnected: boolean;
}

const MINIMUM_LOCK_AMOUNT = 10000;

const EnhancedLockInterface = ({ isConnected }: EnhancedLockInterfaceProps) => {
  const {
    lockTiers,
    determineLockTier,
    CONTRACT_CONSTANTS,
    lockTokens,
    lockTokensForOthers,
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
  const [isGiftLock, setIsGiftLock] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientError, setRecipientError] = useState('');
  
  const currentTier = determineLockTier(lockDuration);
  const amount = parseFloat(lockAmount || '0');
  const needsApproval = amount > 0 && currentAllowance < amount;
  const hasInsufficientBalance = amount > userArkBalance;
  const isBelowMinimum = amount > 0 && amount < MINIMUM_LOCK_AMOUNT;
  const isProcessing = isProcessingApproval || isProcessingLock;
  const isValidDuration = lockDuration >= CONTRACT_CONSTANTS.MIN_LOCK_DURATION && lockDuration <= CONTRACT_CONSTANTS.MAX_LOCK_DURATION;

  // Validate recipient address
  const validateRecipient = (address: string) => {
    if (!address) {
      setRecipientError('');
      return false;
    }
    if (!ethers.isAddress(address)) {
      setRecipientError('Invalid Ethereum address');
      return false;
    }
    if (address === ethers.ZeroAddress || address === '0x0000000000000000000000000000000000000000') {
      setRecipientError('Cannot send to zero address');
      return false;
    }
    setRecipientError('');
    return true;
  };

  const isRecipientValid = !isGiftLock || (recipientAddress && validateRecipient(recipientAddress) && recipientError === '');

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
    if (isGiftLock && !isRecipientValid) return;

    try {
      if (isGiftLock) {
        await lockTokensForOthers(amount, lockDuration, recipientAddress);
        toast({
          title: "Gift Lock Successful! 🎁",
          description: `Locked ${amount} ARK for ${lockDuration} days for ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`
        });
      } else {
        await lockTokens(amount, lockDuration);
        toast({
          title: "Success!",
          description: `Successfully locked ${amount} ARK tokens for ${lockDuration} days`
        });
      }
      setLockAmount('');
      setLockDuration(30);
      setCurrentStep(1);
      setIsGiftLock(false);
      setRecipientAddress('');
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
    <div className="relative">
      {/* Premium multi-layer background */}
      <div className="absolute inset-0 -inset-4">
        <div className="absolute inset-0 bg-white/[0.02] blur-3xl rounded-full"></div>
      </div>

      {/* Main card with premium styling */}
      <div className="relative group">
        {/* Outer glow ring */}
        <div className="absolute -inset-0.5 bg-white/5 rounded-2xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
        
        {/* Card container */}
        <div className="relative z-10 liquid-glass border border-white/10 rounded-2xl p-8 md:p-12 transition-all duration-500 overflow-hidden backdrop-blur-3xl">
          {/* Inner ambient light */}
          <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
          
          {/* Premium System Header */}
          <div className="relative z-10 flex items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6">
              <div className="relative p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                <Lock className="w-5 h-5 text-white/60" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">LOCKER DASHBOARD</h3>
                <p className="text-xs text-white/50 font-mono tracking-[0.2em] uppercase">[ACCESS GRANTED]</p>
              </div>
            </div>
            
            {(emergencyMode || contractPaused) && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                <span className="text-xs font-mono text-red-500 tracking-widest font-black uppercase">SECURITY_RESTRICTION</span>
              </div>
            )}
          </div>

          {/* Main Title */}
          <div className="relative z-10 mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2 font-sans">
              The ARK Locker
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-white/60 tracking-[0.3em] font-black uppercase">PROTOCOL INTEGRATION ACTIVE</span>
            </div>
          </div>

          <EmergencyModeAlert emergencyMode={emergencyMode} />

          <div className="relative z-10 space-y-8">
            <LockAmountInput 
              lockAmount={lockAmount} 
              setLockAmount={setLockAmount} 
              userArkBalance={userArkBalance} 
              isConnected={isConnected} 
              emergencyMode={emergencyMode} 
              contractPaused={contractPaused} 
              isProcessing={isProcessing} 
            />

            {/* Gift Lock Toggle */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/10 via-transparent to-purple-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className={`relative bg-white/[0.03] backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 ${
                isGiftLock ? 'border-white/40 bg-white/5' : 'border-white/5'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg transition-colors ${isGiftLock ? 'bg-white/10' : 'bg-white/5'}`}>
                      <Gift className={`w-4 h-4 transition-colors ${isGiftLock ? 'text-white' : 'text-white/20'}`} />
                    </div>
                    <div>
                      <Label className="text-sm font-black text-white uppercase tracking-widest cursor-pointer">DELEGATED LOCKING</Label>
                      <p className="text-xs text-white/50 font-mono uppercase tracking-widest">Execute lock for another account</p>
                    </div>
                  </div>
                  <Switch
                    checked={isGiftLock}
                    onCheckedChange={(checked) => {
                      setIsGiftLock(checked);
                      if (!checked) {
                        setRecipientAddress('');
                        setRecipientError('');
                      }
                    }}
                    disabled={emergencyMode || contractPaused || isProcessing}
                  />
                </div>
                
                {isGiftLock && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-400" />
                      <Label className="text-xs text-gray-400">Recipient Address</Label>
                    </div>
                    <Input
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => {
                        setRecipientAddress(e.target.value);
                        if (e.target.value) validateRecipient(e.target.value);
                        else setRecipientError('');
                      }}
                      className={`bg-black/40 border-white/[0.1] text-white font-mono text-sm placeholder:text-gray-600 ${
                        recipientError ? 'border-red-500/60 focus-visible:ring-red-500' : 
                        recipientAddress && !recipientError ? 'border-green-500/40 focus-visible:ring-green-500' : ''
                      }`}
                    />
                    {recipientError && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {recipientError}
                      </p>
                    )}
                    {recipientAddress && !recipientError && ethers.isAddress(recipientAddress) && (
                      <p className="text-xs text-green-400/80">✓ Valid address</p>
                    )}
                  </div>
                )}
              </div>
            </div>

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

            {/* Premium 30-Day Minimum Lock Warning */}
            <div className="relative group/warn">
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-3xl">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/10 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black font-mono tracking-[0.2em] text-white uppercase">IMPORTANT PROTOCOL ADVISORY</h4>
                    <p className="text-xs text-white/50 font-mono uppercase tracking-[0.1em] leading-relaxed">
                      Locker positions require a minimum duration of 30 days. Early withdrawal before maturity incurs standardized protocol penalties as per the documentation.
                    </p>
                  </div>
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
              hasInsufficientBalance={hasInsufficientBalance || isBelowMinimum || (isGiftLock && !isRecipientValid)} 
              needsApproval={needsApproval}
              currentStep={currentStep}
              onApprove={handleApproval}
              onLock={handleLock} 
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedLockInterface;
