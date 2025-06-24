
import React from 'react';
import { Info, CheckCircle } from 'lucide-react';

interface ApprovalStatusProps {
  lockAmount: string;
  isConnected: boolean;
  needsApproval: boolean;
  currentAllowance: number;
}

const ApprovalStatus = ({ lockAmount, isConnected, needsApproval, currentAllowance }: ApprovalStatusProps) => {
  const amount = parseFloat(lockAmount || '0');

  if (!lockAmount || amount <= 0 || !isConnected) return null;

  return (
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
  );
};

export default ApprovalStatus;
