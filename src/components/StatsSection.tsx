import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Layers, Coins, Activity, Flame } from 'lucide-react';
import { useLockerData } from '../hooks/useLockerData';
import { useARKTokenData } from '../hooks/useARKTokenData';
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
  const { data: arkData, loading: arkLoading } = useARKTokenData();
  useEffect(() => {
    // Cinematic reveal sequence
    const phases = [{
      delay: 300,
      phase: 1
    },
    // System scan
    {
      delay: 1000,
      phase: 2
    },
    // Matrix detected
    {
      delay: 1800,
      phase: 3
    } // Full activation
    ];
    phases.forEach(({
      delay,
      phase
    }) => {
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
    const numValue = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    if (isNaN(numValue)) return '0';
    if (numValue >= 1000000000) {
      return `${(numValue / 1000000000).toFixed(2)}B`;
    } else if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(2)}K`;
    }
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };
  return <section id="stats" className="relative z-30 py-10 md:py-16 lg:py-20 px-4 md:px-6 bg-gradient-to-b from-black/10 to-black/30">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
        backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 25% 75%, rgba(34, 197, 94, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.3) 2px, transparent 2px)
            `,
        backgroundSize: '100px 100px'
      }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Market Cap */}
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-6 w-6 text-cyan-400" />
              <div className="text-right">
                <p className="text-sm text-gray-400 font-mono">MARKET CAP</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-bold font-mono text-white">
                {arkLoading ? (
                  <span className="animate-pulse">$---.--M</span>
                ) : (
                  `$${formatNumber(arkData.marketCap)}`
                )}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Based on current price & supply
              </p>
            </div>
          </div>

          {/* Price Feed */}
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-6 w-6 text-cyan-400" />
              <div className="text-right">
                <p className="text-sm text-gray-400 font-mono">PRICE FEED</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-bold font-mono text-white">
                {arkLoading ? (
                  <span className="animate-pulse">$--.----</span>
                ) : (
                  `$${parseFloat(arkData.price).toFixed(6)}`
                )}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Real-time market price
              </p>
            </div>
          </div>

          {/* TVL */}
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Layers className="h-6 w-6 text-cyan-400" />
              <div className="text-right">
                <p className="text-sm text-gray-400 font-mono">TVL</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-bold font-mono text-white">
                {protocolStats.totalLockedTokens ? (
                  `${formatTVL(protocolStats.totalLockedTokens)} ARK`
                ) : (
                  <span className="animate-pulse">$---.--M</span>
                )}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Total Value Locked
              </p>
            </div>
          </div>

          {/* Total Supply */}
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Coins className="h-6 w-6 text-cyan-400" />
              <div className="text-right">
                <p className="text-sm text-gray-400 font-mono">TOTAL SUPPLY</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-bold font-mono text-white">
                {arkLoading ? (
                  <span className="animate-pulse">---.--B</span>
                ) : (
                  formatNumber(arkData.totalSupply)
                )}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Maximum token supply
              </p>
            </div>
          </div>

          {/* Circulating Supply */}
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-6 w-6 text-cyan-400" />
              <div className="text-right">
                <p className="text-sm text-gray-400 font-mono">CIRCULATING</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-bold font-mono text-white">
                {arkLoading ? (
                  <span className="animate-pulse">---.--B</span>
                ) : (
                  formatNumber(arkData.circulatingSupply)
                )}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Tokens in active circulation
              </p>
            </div>
          </div>

          {/* Burned Tokens */}
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Flame className="h-6 w-6 text-cyan-400" />
              <div className="text-right">
                <p className="text-sm text-gray-400 font-mono">BURNED</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-bold font-mono text-white">
                {arkLoading ? (
                  <span className="animate-pulse">---.--M</span>
                ) : (
                  formatNumber(arkData.burnedTokens)
                )}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Tokens permanently removed
              </p>
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
    </section>;
};
export default StatsSection;