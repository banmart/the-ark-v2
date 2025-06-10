
import React from 'react';

const ProtocolStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">🏛️</div>
        <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Total Locked</div>
        <div className="text-2xl font-bold">12.5M ARK</div>
      </div>
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">👥</div>
        <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Active Lockers</div>
        <div className="text-2xl font-bold">2,847</div>
      </div>
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">💰</div>
        <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">Rewards Pool</div>
        <div className="text-2xl font-bold">850K ARK</div>
      </div>
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">📈</div>
        <div className="text-cyan-400 text-sm uppercase tracking-wider mb-2">APY Range</div>
        <div className="text-2xl font-bold">15-150%</div>
      </div>
    </div>
  );
};

export default ProtocolStats;
