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
  const {
    calculatePenaltyPreview,
    earlyUnlockSettings
  } = useLockerContractData();
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
  const progressPercentage = totalLockDuration > 0 ? (totalLockDuration - lockTimeRemaining) / totalLockDuration * 100 : 0;
  if (!isEarlyUnlock) {
    return <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-400">
          <Calculator className="w-5 h-5" />
          <span className="font-semibold">No Penalty</span>
        </div>
        <p className="text-sm text-green-300 mt-2">
          This lock can be unlocked without any penalty.
        </p>
      </div>;
  }
  return;
};
export default PenaltyCalculatorCard;