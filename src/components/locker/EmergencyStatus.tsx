
import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

interface EmergencyStatusProps {
  emergencyMode: boolean;
  contractPaused: boolean;
}

const EmergencyStatus = ({ emergencyMode, contractPaused }: EmergencyStatusProps) => {
  if (!emergencyMode && !contractPaused) return null;

  return (
    <div className="flex justify-center mt-6 mb-8 animate-fade-in">
      <div className="relative">
        {/* Quantum field background */}
        <div className="absolute inset-0 -inset-4">
          <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-transparent to-transparent blur-2xl animate-pulse"></div>
        </div>

        <div className="relative z-10 bg-black/40 backdrop-blur-xl border-2 border-red-500/50 rounded-xl px-8 py-4">
          {/* System Alert Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-lg">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono text-red-400 tracking-wider">SYSTEM_ALERT</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
          </div>

          {/* Alert Content */}
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            <div>
              <div className="text-sm font-mono text-red-400/60 mb-1 tracking-[0.1em]">
                [PROTOCOL_STATUS]
              </div>
              <span className="text-red-400 font-bold text-lg">
                {emergencyMode ? 'EMERGENCY_MODE_ACTIVE' : 'CONTRACT_PAUSED'}
              </span>
              <div className="text-xs font-mono text-red-300 mt-1">
                {emergencyMode ? 'Emergency protocols engaged. New locks disabled.' : 'Contract operations temporarily suspended.'}
              </div>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
          </div>

          {/* Scanning Effect */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/80 to-transparent animate-scan"></div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatus;
