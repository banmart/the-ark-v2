
import React from 'react';
import { useLockerData } from '../../hooks/useLockerData';

const EnhancedProtocolStats = () => {
  const { protocolStats, loading, calculateAPYRange } = useLockerData();
  const apyRange = calculateAPYRange();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
        <div className="text-3xl mb-2">🏛️</div>
        <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Total Locked</div>
        <div className="text-2xl font-bold">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            `${(protocolStats.totalLockedTokens / 1000000).toFixed(1)}M ARK`
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          From SimplifiedLockerVault
        </div>
      </div>

      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
        <div className="text-3xl mb-2">👥</div>
        <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Active Lockers</div>
        <div className="text-2xl font-bold">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            protocolStats.totalActiveLockers.toLocaleString()
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          ReentrancyGuard Protected
        </div>
      </div>

      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
        <div className="text-3xl mb-2">💰</div>
        <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Rewards Distributed</div>
        <div className="text-2xl font-bold">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            `${(protocolStats.totalRewardsDistributed / 1000000).toFixed(1)}M ARK`
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Lifetime total from 2% fees
        </div>
      </div>

      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
        <div className="text-3xl mb-2">📈</div>
        <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">APY Range</div>
        <div className="text-2xl font-bold">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            `${apyRange.min.toFixed(0)}-${apyRange.max.toFixed(0)}%`
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Based on tier multipliers
        </div>
      </div>
    </div>
  );
};

export default EnhancedProtocolStats;
