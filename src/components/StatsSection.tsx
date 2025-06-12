
import React from 'react';

interface StatsSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const StatsSection = ({ contractData, contractLoading }: StatsSectionProps) => {
  return (
    <section id="stats" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          $ARK By The Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Market Cap */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">💰 Market Cap</h3>
            <p className="text-3xl font-black text-white mb-2">
              {contractLoading ? <span className="animate-pulse">Loading...</span> : `$${contractData.marketCap}`}
            </p>
            <p className="text-sm text-gray-400">Real-time valuation</p>
          </div>

          {/* Total Supply */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">💎 Total Supply</h3>
            <p className="text-3xl font-black text-white mb-2">
              {contractLoading ? <span className="animate-pulse">Loading...</span> : `${contractData.totalSupply} ARK`}
            </p>
            <p className="text-sm text-gray-400">From smart contract</p>
          </div>

          {/* Holders */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">👥 Holders</h3>
            <p className="text-3xl font-black text-white mb-2">
              {contractLoading ? <span className="animate-pulse">Loading...</span> : contractData.holders}
            </p>
            <p className="text-sm text-gray-400">Unique addresses</p>
          </div>
        </div>

        {/* Contract Fees Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card rounded-xl p-6 text-center hover:glass-strong transition-all">
            <h4 className="text-lg font-bold text-cyan-400 mb-2">🔥 Burn Fee</h4>
            <p className="text-2xl font-bold">
              {contractLoading ? '...' : `${contractData.currentFees.burn}%`}
            </p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center hover:glass-strong transition-all">
            <h4 className="text-lg font-bold text-cyan-400 mb-2">🫂 Reflection Fee</h4>
            <p className="text-2xl font-bold">
              {contractLoading ? '...' : `${contractData.currentFees.reflection}%`}
            </p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center hover:glass-strong transition-all">
            <h4 className="text-lg font-bold text-cyan-400 mb-2">💧 Liquidity Fee</h4>
            <p className="text-2xl font-bold">
              {contractLoading ? '...' : `${contractData.currentFees.liquidity}%`}
            </p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center hover:glass-strong transition-all">
            <h4 className="text-lg font-bold text-cyan-400 mb-2">🔒 Locker Fee</h4>
            <p className="text-2xl font-bold">
              {contractLoading ? '...' : `${contractData.currentFees.locker}%`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
