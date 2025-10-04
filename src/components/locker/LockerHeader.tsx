import React from 'react';
import { useLockerData } from '../../hooks/useLockerData';
import { formatUnits } from 'ethers/lib/utils';

const TOKEN_DECIMALS = 18; // Adjust if ARK uses a different decimals value

const fmt = (bn: any) => {
  try {
    return Number(formatUnits(bn, TOKEN_DECIMALS)).toLocaleString();
  } catch {
    return '0';
  }
};

const LockerHeader: React.FC = () => {
  const {
    loading,
    totalLocked,
    inProgress,
    readyToUnlock,
  } = useLockerData();

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 -top-20 -bottom-20">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-conic from-cyan-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />
      </div>

      <div className="relative z-10 text-center py-12 px-6">
        {/* Status */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-green-400 tracking-wider">SYSTEM_ONLINE</span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <div className="text-sm font-mono text-cyan-400/60 mb-2 tracking-[0.2em]">
            [TOKEN_LOCKER_SYSTEM]
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
            QUANTUM VAULT
          </h1>
          <div className="text-sm font-mono text-cyan-400/60 tracking-[0.2em]">
            [PROTOCOL_INITIALIZED]
          </div>
        </div>

        {/* Metrics */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/20">
            <div className="text-sm text-cyan-300/70">Currently Locked</div>
            <div className="text-2xl font-semibold text-white">
              {loading ? '...' : `${fmt(totalLocked)} ARK`}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-black/40 border border-teal-500/20">
            <div className="text-sm text-teal-300/70">In Progress</div>
            <div className="text-2xl font-semibold text-white">
              {loading ? '...' : `${fmt(inProgress)} ARK`}
            </div>
          </div>
          <div className={`p-4 rounded-lg border ${readyToUnlock?.gt?.(0) ? 'bg-yellow-500/10 border-yellow-400/30' : 'bg-black/40 border-emerald-500/20'}`}>
            <div className="text-sm text-emerald-300/70">Ready to Unlock</div>
            <div className="text-2xl font-semibold text-white">
              {loading ? '...' : `${fmt(readyToUnlock)} ARK`}
            </div>
          </div>
        </div>

        {readyToUnlock?.gt?.(0) && (
          <div className="mt-3 text-yellow-300">
            You have positions ready to unlock.
          </div>
        )}
      </div>
    </div>
  );
};

export default LockerHeader;