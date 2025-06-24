
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmergencyModeAlertProps {
  emergencyMode: boolean;
}

const EmergencyModeAlert = ({ emergencyMode }: EmergencyModeAlertProps) => {
  if (!emergencyMode) return null;

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 text-red-400">
        <AlertTriangle className="w-4 h-4" />
        <span className="font-semibold">Emergency Mode Active</span>
      </div>
      <p className="text-sm text-red-300 mt-1">
        New locks are temporarily disabled. Existing locks can be unlocked after 3 days.
      </p>
    </div>
  );
};

export default EmergencyModeAlert;
