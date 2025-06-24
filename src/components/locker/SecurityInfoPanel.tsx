
import React from 'react';
import { ContractConstants } from '../../hooks/locker/types';

interface SecurityInfoPanelProps {
  CONTRACT_CONSTANTS: ContractConstants;
}

const SecurityInfoPanel = ({ CONTRACT_CONSTANTS }: SecurityInfoPanelProps) => {
  return (
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
  );
};

export default SecurityInfoPanel;
