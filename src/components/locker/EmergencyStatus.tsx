
import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

interface EmergencyStatusProps {
  emergencyMode: boolean;
  contractPaused: boolean;
}

const EmergencyStatus = ({ emergencyMode, contractPaused }: EmergencyStatusProps) => {
  if (!emergencyMode && !contractPaused) return null;

  return (
    <div className="flex justify-center -mt-8 mb-16 animate-fade-in px-6">
      <div className="relative w-full max-w-4xl">
        <div className="relative z-10 liquid-glass border-2 border-red-500/20 rounded-2xl p-8 backdrop-blur-3xl overflow-hidden group">
          {/* Animated red pulse for critical state */}
          <div className="absolute inset-0 bg-red-500/[0.02] animate-pulse pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                <span className="text-red-500 font-mono text-[10px] font-black tracking-[0.3em] uppercase">SYSTEM RESTRICTION</span>
              </div>
              
              <h4 className="text-2xl font-black text-white tracking-tighter uppercase mb-2 font-sans">
                {emergencyMode ? 'EMERGENCY_LOCKDOWN_ACTIVE' : 'PROTOCOL_OPERATIONS_PAUSED'}
              </h4>
              
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest leading-relaxed">
                {emergencyMode 
                  ? 'Protocol security measures active. All asset integration functions currently disabled.' 
                  : 'Protocol operations temporarily suspended for administrative technical validation.'}
              </p>
            </div>
          </div>

          {/* Scanning effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatus;
