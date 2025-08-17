import React, { useState, useEffect } from 'react';
import { useLockerData } from '../../hooks/useLockerData';
import { AlertTriangle, Lock, Zap, Shield, Activity } from 'lucide-react';
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

const EnhancedLockInterface: React.FC<EnhancedLockInterfaceProps> = ({
  isConnected
}) => {
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
  const [isVisible, setIsVisible] = useState(false);
  const [scanningActive, setScanningActive] = useState(false);

  const currentTier = determineLockTier(lockDuration);
  const amount = parseFloat(lockAmount || '0');
  const needsApproval = amount > 0 && currentAllowance < amount;
  const hasInsufficientBalance = amount > userArkBalance;
  const isProcessing = isProcessingApproval || isProcessingLock;
  const isValidDuration = lockDuration >= CONTRACT_CONSTANTS.MIN_LOCK_DURATION && lockDuration <= CONTRACT_CONSTANTS.MAX_LOCK_DURATION;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isProcessing) {
      setScanningActive(true);
      const timer = setTimeout(() => setScanningActive(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

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
    if (!lockAmount || !isConnected || hasInsufficientBalance) return;
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

  return (
    <div className="relative overflow-hidden">
      {/* Enhanced Quantum Field Background */}
      <div className="absolute inset-0 -inset-8 pointer-events-none">
        {/* Primary quantum field */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl animate-pulse" />
        
        {/* Rotating energy rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-conic from-cyan-500/20 via-transparent to-cyan-500/20 rounded-full blur-2xl animate-[spin_20s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-conic from-purple-500/15 via-transparent to-purple-500/15 rounded-full blur-xl animate-[spin_30s_linear_infinite_reverse]" />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
      </div>

      {/* Main Container */}
      <div className={`
        relative z-10 backdrop-blur-xl border-2 rounded-2xl p-8 overflow-hidden
        bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40
        border-cyan-500/30 hover:border-cyan-400/50
        transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20
      `}>

        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        
        {/* Scanning Line Effect */}
        {scanningActive && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        )}

        {/* Enhanced System Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-xl backdrop-blur-sm">
              <div className="relative">
                <Lock className="w-5 h-5 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md animate-pulse" />
              </div>
              <span className="text-sm font-mono text-cyan-300 tracking-wider font-bold">LOCK_PROTOCOL</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-xs font-mono text-green-400 tracking-wide">SYSTEM_ONLINE</span>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            {(emergencyMode || contractPaused) && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-xl backdrop-blur-sm animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs font-mono text-red-400 tracking-wider font-bold">ALERT</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/40 rounded-xl backdrop-blur-sm">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono text-purple-400 tracking-wider">SECURE</span>
            </div>
          </div>
        </div>

        {/* Enhanced Title Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-sm font-mono text-cyan-400/70 tracking-[0.2em] uppercase">
              [QUANTUM_LOCK_INTERFACE_v2.1]
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 via-purple-500/30 to-transparent" />
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Quantum Token Lock
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-sm font-mono text-green-400 tracking-wide">READY_FOR_OPERATIONS</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-mono text-yellow-400 tracking-wide">ENHANCED_SECURITY</span>
            </div>
          </div>
        </div>

        {/* Emergency Mode Alert */}
        <EmergencyModeAlert emergencyMode={emergencyMode} />

        {/* Main Interface Grid */}
        <div className="space-y-8">
          <div className="grid gap-8">
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
              currentStep={currentStep}
              onApprove={handleApproval}
              onLock={handleLock} 
            />
          </div>
        </div>

        {/* Enhanced Visual Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {/* Corner accent lights */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-cyan-400/20 to-transparent blur-xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent blur-xl" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(-100%); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedLockInterface;