
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmergencyStatusProps {
  emergencyMode: boolean;
  contractPaused: boolean;
}

const EmergencyStatus = ({ emergencyMode, contractPaused }: EmergencyStatusProps) => {
  if (!emergencyMode && !contractPaused) return null;

  return (
    <div className="mt-6">
      <div className="inline-block bg-red-900/40 border border-red-500/50 rounded-xl px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
          <span className="text-red-400 font-bold">
            {emergencyMode ? 'Emergency Mode Active' : 'Contract Paused'}
          </span>
          <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatus;
