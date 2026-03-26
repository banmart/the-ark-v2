
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
    <div className={`liquid-glass rounded-2xl p-6 border transition-all duration-500 backdrop-blur-3xl ${needsApproval ? 'border-white/20 bg-white/5' : 'border-white/10 bg-white/5 opacity-40'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${needsApproval ? 'bg-white/10' : 'bg-white/5'}`}>
          {needsApproval ? (
            <Info className="w-5 h-5 text-white" />
          ) : (
            <CheckCircle className="w-5 h-5 text-white/40" />
          )}
        </div>
        <div className="space-y-1">
          <div className="text-[10px] font-black font-mono tracking-[0.2em] text-white/40 uppercase">PROTOCOL AUTHORIZATION</div>
          <div className={`text-[10px] font-black font-mono tracking-widest uppercase ${needsApproval ? 'text-white' : 'text-white/40'}`}>
            {needsApproval ? (
              `REQUIRED: ${amount.toLocaleString()} ARK`
            ) : (
              `AUTHORIZED: ${currentAllowance.toLocaleString()} ARK`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalStatus;
