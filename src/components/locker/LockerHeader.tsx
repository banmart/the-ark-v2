
import React from 'react';

const LockerHeader = () => {
  return (
    <div className="relative">
      {/* Quantum field background */}
      <div className="absolute inset-0 -top-20 -bottom-20">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-conic from-cyan-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite]"></div>
      </div>

      <div className="relative z-10 text-center py-12 px-6">
        {/* System Status Indicator */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-green-400 tracking-wider">SYSTEM_ONLINE</span>
        </div>

        {/* Main Title with Diagnostic Styling */}
        <div className="mb-6">
          <div className="text-sm font-mono text-cyan-400/60 mb-2 tracking-[0.2em]">
            [TOKEN_LOCKER_SYSTEM]
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent animate-fade-in">
            QUANTUM VAULT
          </h1>
          <div className="text-sm font-mono text-cyan-400/60 tracking-[0.2em]">
            [PROTOCOL_INITIALIZED]
          </div>
        </div>

        {/* System Description */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/30 backdrop-blur-xl border border-teal-500/30 rounded-xl p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-teal-400 tracking-wider">MISSION_BRIEFING</span>
              <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Lock your tokens in the quantum vault to earn multiplied rewards based on commitment duration.
              <br />
              <span className="text-teal-400 font-mono text-sm">Ascend through divine tiers and unlock exponential gains.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LockerHeader;
