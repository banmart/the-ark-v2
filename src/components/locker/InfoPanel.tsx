
import React from 'react';
import { Info } from 'lucide-react';

const InfoPanel = () => {
  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
      <div className="flex items-start">
        <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <div className="text-blue-300 font-semibold mb-1">Important Notes</div>
          <ul className="text-gray-300 space-y-1 text-xs">
            <li>• Tokens are locked for the selected duration and cannot be withdrawn early without penalty</li>
            <li>• Rewards are distributed proportionally based on your tier multiplier</li>
            <li>• Higher tiers receive exponentially more rewards from the same fee pool</li>
            <li>• Your tier status grants special privileges in the ARK community</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
