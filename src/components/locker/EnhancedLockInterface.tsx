
import React, { useState } from 'react';
import { useLockerData } from '../../hooks/useLockerData';
import { AlertTriangle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

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
  const [lockDuration, setLockDuration] = useState(CONTRACT_CONSTANTS.MIN_LOCK_DURATION); // Set to minimum 1 day

  const currentTier = determineLockTier(lockDuration);
  const estimatedWeight = lockAmount ? parseFloat(lockAmount) * lockDuration * (currentTier.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS) : 0;
  const amount = parseFloat(lockAmount || '0');
  const needsApproval = amount > 0 && currentAllowance < amount;
  const hasInsufficientBalance = amount > userArkBalance;
  const isProcessing = isProcessingApproval || isProcessingLock;

  const handleLock = async () => {
    if (!lockAmount || !isConnected || hasInsufficientBalance) return;
    
    console.log('Lock attempt with:', {
      amount,
      lockDuration,
      lockDurationSeconds: lockDuration * 24 * 60 * 60,
      minDuration: CONTRACT_CONSTANTS.MIN_LOCK_DURATION,
      maxDuration: CONTRACT_CONSTANTS.MAX_LOCK_DURATION
    });
    
    try {
      await lockTokens(amount, lockDuration);
      
      toast({
        title: "Success!",
        description: `Successfully locked ${amount} ARK tokens for ${lockDuration} days`,
      });
      
      // Reset form
      setLockAmount('');
      setLockDuration(CONTRACT_CONSTANTS.MIN_LOCK_DURATION);
      
    } catch (error: any) {
      console.error('Lock failed:', error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to lock tokens"
      });
    }
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet First';
    if (isProcessingApproval) return 'Approving Tokens...';
    if (isProcessingLock) return 'Locking Tokens...';
    if (emergencyMode) return 'Emergency Mode - Locked';
    if (contractPaused) return 'Contract Paused';
    if (!isValidDuration) return 'Invalid Duration';
    if (hasInsufficientBalance) return 'Insufficient ARK Balance';
    if (needsApproval) return `Approve & Lock ${amount} ARK`;
    return `Lock ${amount} ARK Tokens`;
  };

  const isValidDuration = lockDuration >= CONTRACT_CONSTANTS.MIN_LOCK_DURATION && 
                         lockDuration <= CONTRACT_CONSTANTS.MAX_LOCK_DURATION;

  return (
    <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-cyan-400">Lock Tokens</h2>
        {(emergencyMode || contractPaused) && (
          <AlertTriangle className="w-5 h-5 text-red-400" />
        )}
      </div>

      {emergencyMode && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">Emergency Mode Active</span>
          </div>
          <p className="text-sm text-red-300 mt-1">
            New locks are temporarily disabled. Existing locks can be unlocked after 3 days.
          </p>
        </div>
      )}

      <div className="space-y-6">
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Lock Duration (Days)</label>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Info className="w-3 h-3" />
              Min: {CONTRACT_CONSTANTS.MIN_LOCK_DURATION}, Max: {CONTRACT_CONSTANTS.MAX_LOCK_DURATION}
            </div>
          </div>
          <input
            type="range"
            min={CONTRACT_CONSTANTS.MIN_LOCK_DURATION}
            max={CONTRACT_CONSTANTS.MAX_LOCK_DURATION}
            value={lockDuration}
            onChange={(e) => setLockDuration(Number(e.target.value))}
            disabled={emergencyMode || contractPaused || isProcessing}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{CONTRACT_CONSTANTS.MIN_LOCK_DURATION} days</span>
            <span className={`font-bold ${isValidDuration ? 'text-cyan-400' : 'text-red-400'}`}>
              {lockDuration} days
            </span>
            <span>{CONTRACT_CONSTANTS.MAX_LOCK_DURATION} days</span>
          </div>
        </div>

        {/* Current Tier Display */}
        <div className="bg-black/30 rounded-lg p-4 border" style={{ borderColor: currentTier.color }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-lg font-bold" style={{ color: currentTier.color }}>
                {currentTier.name} Tier
              </div>
              <div className="text-sm text-gray-400">
                {(currentTier.multiplier / CONTRACT_CONSTANTS.BASIS_POINTS).toFixed(1)}x reward multiplier
              </div>
            </div>
            <div className="text-3xl">
              {currentTier.icon}
            </div>
          </div>
          
          {lockAmount && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Weight:</span>
                <span className="text-white font-medium">{estimatedWeight.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration Range:</span>
                <span className="text-white">{currentTier.minDays}-{currentTier.maxDays} days</span>
              </div>
            </div>
          )}
        </div>

        {/* Approval Status */}
        {lockAmount && amount > 0 && isConnected && (
          <div className={`rounded-lg p-4 border ${needsApproval ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
            <div className="flex items-center gap-2">
              {needsApproval ? (
                <>
                  <Info className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-300 text-sm">
                    Token approval required: {amount.toLocaleString()} ARK
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-sm">
                    Sufficient allowance: {currentAllowance.toLocaleString()} ARK approved
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Contract Security Info */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Contract Security Features
            </div>
            <ul className="text-xs text-green-300 space-y-1 ml-4">
              <li>• ReentrancyGuard protection against attacks</li>
              <li>• {CONTRACT_CONSTANTS.EARLY_UNLOCK_PENALTY / 100}% max early unlock penalty</li>
              <li>• 50% penalty burned, 50% distributed to lockers</li>
              <li>• Renounced ownership - fully decentralized</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleLock}
          disabled={!isConnected || !lockAmount || !isValidDuration || emergencyMode || contractPaused || isProcessing || hasInsufficientBalance}
          className="w-full bg-cyan-500 text-black font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default EnhancedLockInterface;
