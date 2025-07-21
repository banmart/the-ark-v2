
import React, { useState, useEffect } from 'react';
import { RefreshCw, Database, Activity, Shield, Zap } from 'lucide-react';
import { useLockerData } from '../hooks/useLockerData';

interface StatsSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const StatsSection = ({
  contractData,
  contractLoading
}: StatsSectionProps) => {
  const [statsPhase, setStatsPhase] = useState(0);
  const { protocolStats } = useLockerData();

  useEffect(() => {
    // Cinematic reveal sequence
    const phases = [
      { delay: 300, phase: 1 }, // System scan
      { delay: 1000, phase: 2 }, // Matrix detected
      { delay: 1800, phase: 3 } // Full activation
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setStatsPhase(phase), delay);
    });
  }, []);

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  const formatTVL = (tvl: number) => {
    if (tvl >= 1000000) {
      return `${(tvl / 1000000).toFixed(2)}M`;
    } else if (tvl >= 1000) {
      return `${(tvl / 1000).toFixed(2)}K`;
    }
    return tvl.toFixed(2);
  };

  const formatNumber = (num: string | number) => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return '0';
    
    if (numValue >= 1000000000) {
      return `${(numValue / 1000000000).toFixed(1)}B`;
    } else if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`;
    }
    return numValue.toFixed(2);
  };

  return (
    <section id="stats" className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 to-black/30">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 25% 75%, rgba(34, 197, 94, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.3) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          statsPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/60 font-mono text-xs mb-4">
            <Database className="w-3 h-3 animate-pulse" />
            <span>[ARK_STATISTICS_MATRIX]</span>
            <Database className="w-3 h-3 animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-cyan-400 font-mono">
            <span className="animate-[glitch_4s_ease-in-out_infinite]">$ARK</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_0.5s_infinite]">BY</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_1s_infinite]">THE</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_1.5s_infinite]">NUMBERS</span>
          </h2>

          {contractData.lastUpdated && (
            <div className="flex items-center justify-center gap-2 text-sm text-cyan-400/60 font-mono">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>[LAST_SYNC: {formatLastUpdated(contractData.lastUpdated)}]</span>
            </div>
          )}
        </div>

        {/* Primary Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 transition-all duration-1000 delay-500 ${
          statsPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Market Cap */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 hover:scale-105 hover:border-cyan-500/60 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 font-mono text-xs">ACTIVE</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 font-mono">💰 MARKET_CAP</h3>
              <p className="text-3xl font-black text-white mb-2 font-mono">
                {contractLoading ? (
                  <span className="animate-pulse">[SCANNING...]</span>
                ) : (
                  `$${formatNumber(contractData.marketCap)}`
                )}
              </p>
              <p className="text-sm text-gray-400 font-mono">[REAL_TIME_VALUATION]</p>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* Current Price */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:scale-105 hover:border-blue-500/60 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 font-mono text-xs">LIVE</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-blue-400 font-mono">📈 PRICE_FEED</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl font-black text-white font-mono">
                  {contractLoading ? (
                    <span className="animate-pulse">[SCANNING...]</span>
                  ) : (
                    `$${contractData.price}`
                  )}
                </p>
                {!contractLoading && contractData.priceChange24h && (
                  <span className={`text-sm font-bold font-mono ${
                    contractData.priceChange24h.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {contractData.priceChange24h}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 font-mono">[24H_DELTA]</p>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* TVL (Total Value Locked) */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 hover:scale-105 hover:border-purple-500/60 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 font-mono text-xs">TRACKING</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-purple-400 font-mono">🏦 TVL (LOCKER)</h3>
              <p className="text-3xl font-black text-white mb-2 font-mono">
                {protocolStats.totalLockedTokens ? (
                  `${formatTVL(protocolStats.totalLockedTokens)} ARK`
                ) : (
                  <span className="animate-pulse">[SCANNING...]</span>
                )}
              </p>
              <p className="text-sm text-gray-400 font-mono">[LOCKED_VALUE]</p>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-1000 ${
          statsPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Total Supply */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 hover:scale-105 hover:border-green-500/60 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-green-400 font-mono">💎 TOTAL_SUPPLY</h3>
              <p className="text-2xl font-black text-white mb-2 font-mono">
                {contractLoading ? (
                  <span className="animate-pulse">[SCANNING...]</span>
                ) : (
                  `${formatNumber(contractData.totalSupply)} ARK`
                )}
              </p>
              <p className="text-sm text-gray-400 font-mono">[CONTRACT_SOURCE]</p>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* Circulating Supply */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6 hover:scale-105 hover:border-yellow-500/60 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-yellow-400 font-mono">🔄 CIRCULATING</h3>
              <p className="text-2xl font-black text-white mb-2 font-mono">
                {contractLoading ? (
                  <span className="animate-pulse">[SCANNING...]</span>
                ) : (
                  `${formatNumber(contractData.circulatingSupply)} ARK`
                )}
              </p>
              <p className="text-sm text-gray-400 font-mono">[MARKET_AVAILABLE]</p>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* Burned Tokens */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-xl p-6 hover:scale-105 hover:border-red-500/60 transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-red-400 font-mono">🔥 BURNED</h3>
              <p className="text-2xl font-black text-white mb-2 font-mono">
                {contractLoading ? (
                  <span className="animate-pulse">[SCANNING...]</span>
                ) : (
                  `${formatNumber(contractData.burnedTokens)} ARK`
                )}
              </p>
              <p className="text-sm text-gray-400 font-mono">[VOID_ADDRESS]</p>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-2px); }
          20% { transform: translateX(2px); }
          30% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          50% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
