
import React from 'react';
import { ContractConstants } from '../../hooks/locker/types';

interface SecurityInfoPanelProps {
  CONTRACT_CONSTANTS: ContractConstants;
}

const SecurityInfoPanel = ({ CONTRACT_CONSTANTS }: SecurityInfoPanelProps) => {
  return (
    <div className="liquid-glass border border-white/10 rounded-2xl p-8 backdrop-blur-3xl overflow-hidden relative">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
          <div className="text-[10px] font-black font-mono tracking-[0.2em] text-white uppercase">SECURITY PROTOCOLS</div>
        </div>
        <ul className="space-y-3">
          {[
            'REENTRANCY COUNTERMEASURES ACTIVE',
            `${CONTRACT_CONSTANTS.EARLY_UNLOCK_PENALTY / 100}% MAXIMUM EARLY EXIT PENALTY`,
            '50% PENALTY BURNED • 50% DISTRIBUTED TO STAKERS',
            'RENOUNCED OWNERSHIP - FULLY DECENTRALIZED'
          ].map((statute, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-white/40 font-mono text-xs translate-y-px">0{i+1}</span>
              <span className="text-xs font-black font-mono tracking-widest text-white/80 uppercase">{statute}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SecurityInfoPanel;
