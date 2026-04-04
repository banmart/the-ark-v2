import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calculator, CheckCircle } from 'lucide-react';
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

  if (!isEarlyUnlock) {
    return (
      <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-3xl">
        <div className="flex items-center gap-4 text-white/40">
          <CheckCircle className="w-4 h-4" />
          <span className="text-[10px] font-black font-mono tracking-widest uppercase">STABILITY SECURED</span>
        </div>
        <p className="text-[10px] text-white/60 font-mono mt-2 uppercase tracking-widest">
          This bond has matured. Releasing it now incurs zero penalties.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 backdrop-blur-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-white/60">
          <div className="p-2 bg-white/5 rounded-lg">
            <Calculator className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-black font-mono tracking-widest uppercase block">SEVERANCE PROJECTION</span>
            <p className="text-xs text-white/50 font-mono uppercase tracking-[0.2em]">Based on current protocol statutes</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-black font-mono tracking-widest text-white/50 uppercase mb-1">PROMINENT LOSS</div>
            <div className="text-lg font-black text-white tracking-tighter">
              {penaltyInfo ? `-${penaltyInfo.penaltyAmount.toFixed(0)}` : '--'} <span className="text-xs text-white/60">ARK</span>
            </div>
          </div>
          <div className="text-right border-l border-white/5 pl-6">
            <div className="text-xs font-black font-mono tracking-widest text-white/50 uppercase mb-1">RECOVERABLE</div>
            <div className="text-lg font-black text-white tracking-tighter">
              {penaltyInfo ? penaltyInfo.userReceives.toFixed(0) : '--'} <span className="text-xs text-white/60">ARK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenaltyCalculatorCard;