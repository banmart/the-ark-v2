
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calculator, Info, Flame, TrendingDown } from 'lucide-react';
import { useLockerContractData } from '../../hooks/useLockerContractData';

interface PenaltyCalculatorCardProps {
  userAddress?: string;
  lockId?: number;
  lockAmount?: number;
  lockTimeRemaining?: number;
  totalLockDuration?: number;
}

const PenaltyCalculatorCard = ({ 
  userAddress, 
  lockId, 
  lockAmount = 0, 
  lockTimeRemaining = 0, 
  totalLockDuration = 0 
}: PenaltyCalculatorCardProps) => {
  const { calculatePenaltyPreview, earlyUnlockSettings } = useLockerContractData();
  const [penaltyInfo, setPenaltyInfo] = useState<{
    penaltyAmount: number;
    userReceives: number;
    penaltyRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPenalty = async () => {
      if (!userAddress || lockId === undefined) return;
      
      setLoading(true);
      try {
        const penalty = await calculatePenaltyPreview(userAddress, lockId);
        setPenaltyInfo(penalty);
      } catch (error) {
        console.error('Error fetching penalty preview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPenalty();
  }, [userAddress, lockId, calculatePenaltyPreview]);

  const isEarlyUnlock = lockTimeRemaining > 0;
  const progressPercentage = totalLockDuration > 0 ? 
    ((totalLockDuration - lockTimeRemaining) / totalLockDuration) * 100 : 0;

  if (!isEarlyUnlock) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-400">
          <Calculator className="w-5 h-5" />
          <span className="font-semibold">No Penalty</span>
        </div>
        <p className="text-sm text-green-300 mt-2">
          This lock can be unlocked without any penalty.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-red-500/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-500/20 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-400">Early Unlock Penalty</h3>
          <p className="text-sm text-gray-400">Calculated in real-time from contract</p>
        </div>
      </div>

      {/* Penalty Breakdown */}
      {loading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-400 mt-2">Calculating penalty...</p>
        </div>
      ) : penaltyInfo ? (
        <div className="space-y-4">
          {/* Main Penalty Display */}
          <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Penalty Amount</div>
                <div className="text-xl font-bold text-red-400">
                  {penaltyInfo.penaltyAmount.toFixed(2)} ARK
                </div>
                <div className="text-xs text-red-300">
                  {penaltyInfo.penaltyRate.toFixed(1)}% of locked amount
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">You Receive</div>
                <div className="text-xl font-bold text-white">
                  {penaltyInfo.userReceives.toFixed(2)} ARK
                </div>
                <div className="text-xs text-gray-300">
                  After penalty deduction
                </div>
              </div>
            </div>
          </div>

          {/* Penalty Distribution */}
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Penalty Distribution
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Burned:</span>
                <span className="text-red-400 font-semibold">
                  {((penaltyInfo.penaltyAmount * earlyUnlockSettings.burnShare) / 10000).toFixed(2)} ARK
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">To Lockers:</span>
                <span className="text-cyan-400 font-semibold">
                  {((penaltyInfo.penaltyAmount * earlyUnlockSettings.rewardShare) / 10000).toFixed(2)} ARK
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {earlyUnlockSettings.burnShare / 100}% burned • {earlyUnlockSettings.rewardShare / 100}% distributed to other lockers
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Lock Progress</span>
              <span>{progressPercentage.toFixed(1)}% complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              {Math.ceil(lockTimeRemaining / (24 * 60 * 60))} days remaining • 
              Penalty decreases as time progresses
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400">
          <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Unable to calculate penalty</p>
        </div>
      )}

      {/* Info Panel */}
      <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-300">
            <p className="font-semibold mb-1">How penalties work:</p>
            <p>Penalties are calculated based on time remaining. The closer you are to unlock time, the lower the penalty.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenaltyCalculatorCard;
