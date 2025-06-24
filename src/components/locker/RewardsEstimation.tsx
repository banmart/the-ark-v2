
import React from 'react';
import { Calculator } from 'lucide-react';

interface RewardsEstimationProps {
  lockAmount: string;
  lockDuration: number;
  estimatedRewards: number;
  unlockDate: Date | null;
  validationError: string;
}

const RewardsEstimation = ({
  lockAmount,
  lockDuration,
  estimatedRewards,
  unlockDate,
  validationError
}: RewardsEstimationProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!lockAmount || validationError) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/30 rounded-xl p-6">
      <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2" />
        Estimated Rewards
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {estimatedRewards.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-gray-400">Total ARK Rewards</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {unlockDate ? formatDate(unlockDate) : '--'}
          </div>
          <div className="text-sm text-gray-400">Unlock Date</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {((estimatedRewards / parseFloat(lockAmount || '1')) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Total Return</div>
        </div>
      </div>
    </div>
  );
};

export default RewardsEstimation;
