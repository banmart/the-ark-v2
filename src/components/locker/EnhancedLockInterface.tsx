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

const MINIMUM_LOCK_AMOUNT = 20000;

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
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/8 via-transparent to-transparent blur-3xl"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-conic from-teal-500/10 via-cyan-500/10 to-teal-500/10 rounded-full blur-3xl animate-[spin_40s_linear_infinite]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-purple-500/8 to-transparent rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite]"></div>
      </div>

      {/* Main card with premium styling */}
      <div className="relative group">
        {/* Outer glow ring */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 via-teal-500/30 to-cyan-500/30 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Card container */}
        <div className="relative z-10 bg-black/50 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 md:p-8 hover:border-white/[0.12] transition-all duration-500 overflow-hidden">
          {/* Inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5"></div>
          
          {/* Premium System Header */}
          <div className="relative z-10 flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/30 rounded-xl blur-lg"></div>
                <div className="relative flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 rounded-xl">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400 tracking-wider font-semibold">LOCK_PROTOCOL</span>
                </div>
              </div>
              <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent max-w-32"></div>
            </div>
            
            {(emergencyMode || contractPaused) && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/40 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-xs font-mono text-red-400 tracking-wider font-semibold">ALERT</span>
              </div>
            )}
          </div>

          {/* Main Title */}
          <div className="relative z-10 mb-8">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="text-xs font-mono text-cyan-400/80 tracking-[0.15em]">[LOCK_PROTOCOL_INTERFACE]</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
              Quantum Token Lock
              <Sparkles className="w-5 h-5 text-cyan-400/60" />
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-green-400">READY_FOR_OPERATIONS</span>
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
              <div className={`relative bg-black/30 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 ${
                isGiftLock ? 'border-pink-500/40 bg-pink-500/5' : 'border-white/[0.08]'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isGiftLock ? 'bg-pink-500/20' : 'bg-white/5'}`}>
                      <Gift className={`w-4 h-4 transition-colors ${isGiftLock ? 'text-pink-400' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-white cursor-pointer">Lock for Another Wallet</Label>
                      <p className="text-xs text-gray-500">Send a gift lock to any address</p>
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
              <div className="absolute -inset-0.5 bg-yellow-500/20 rounded-xl blur-sm opacity-50"></div>
              <div className="relative bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-yellow-400 mb-1">Important Lock Notice</p>
                    <p className="text-sm text-yellow-400/80">
                      Lock durations start at a minimum of 30 days. Early unlock penalties apply based on time remaining.
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
