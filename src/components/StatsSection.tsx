
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface StatsSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const StatsSection = ({
  contractData,
  contractLoading
}: StatsSectionProps) => {
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <section id="stats" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <h2 className="text-4xl font-black text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            $ARK By The Numbers
          </h2>
          {contractData.lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCw className="w-4 h-4" />
              <span>Updated {formatLastUpdated(contractData.lastUpdated)}</span>
            </div>
          )}
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Market Cap */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">💰 Market Cap</h3>
            <p className="text-3xl font-black text-white mb-2">
              {contractLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `$${contractData.marketCap}`
              )}
            </p>
            <p className="text-sm text-gray-400">Real-time valuation</p>
          </div>

          {/* Current Price */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">📈 Price</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-3xl font-black text-white">
                {contractLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  `$${contractData.price}`
                )}
              </p>
              {!contractLoading && contractData.priceChange24h && (
                <span className={`text-sm font-bold ${
                  contractData.priceChange24h.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {contractData.priceChange24h}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">24h change</p>
          </div>

          {/* Holders */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">👥 Holders</h3>
            <p className="text-3xl font-black text-white mb-2">
              {contractLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                contractData.holders
              )}
            </p>
            <p className="text-sm text-gray-400">Unique addresses</p>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Total Supply */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-xl font-bold mb-4 text-purple-400">💎 Total Supply</h3>
            <p className="text-2xl font-black text-white mb-2">
              {contractLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${contractData.totalSupply} ARK`
              )}
            </p>
            <p className="text-sm text-gray-400">From smart contract</p>
          </div>

          {/* Circulating Supply */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-xl font-bold mb-4 text-purple-400">🔄 Circulating</h3>
            <p className="text-2xl font-black text-white mb-2">
              {contractLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${contractData.circulatingSupply} ARK`
              )}
            </p>
            <p className="text-sm text-gray-400">Available in market</p>
          </div>

          {/* Burned Tokens */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <h3 className="text-xl font-bold mb-4 text-purple-400">🔥 Burned</h3>
            <p className="text-2xl font-black text-white mb-2">
              {contractLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${contractData.burnedTokens} ARK`
              )}
            </p>
            <p className="text-sm text-gray-400">Permanently removed</p>
          </div>
        </div>

        {/* Data Source Notice */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Data sourced directly from PulseChain blockchain • Auto-refreshes every 30 seconds
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
