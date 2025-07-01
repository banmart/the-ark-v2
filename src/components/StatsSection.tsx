import React from 'react';
import { TrendingUp, Users, DollarSign, Zap } from 'lucide-react';
import { useContractData } from '../hooks/useContractData';
import { useLockerData } from '../hooks/useLockerData';

const StatsSection = () => {
  const { data: contractData, loading } = useContractData();
  const { protocolStats, loading: lockerLoading } = useLockerData();

  const formatNumber = (num: number | string) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(value)) return '0';
    
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const formatTVL = (amount: number) => {
    if (amount >= 1e9) {
      return `${(amount / 1e9).toFixed(2)}B ARK`;
    } else if (amount >= 1e6) {
      return `${(amount / 1e6).toFixed(2)}M ARK`;
    } else if (amount >= 1e3) {
      return `${(amount / 1e3).toFixed(2)}K ARK`;
    }
    return `${amount.toFixed(0)} ARK`;
  };

  const stats = [
    {
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      title: "📈 PRICE",
      value: loading ? "Loading..." : `$${contractData.price?.toFixed(8) || '0.00000000'}`,
      description: "[CURRENT_RATE]",
      glow: "shadow-green-500/20"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-blue-400" />,
      title: "💰 MARKET CAP",
      value: loading ? "Loading..." : `$${formatNumber(contractData.marketCap || 0)}`,
      description: "[TOTAL_VALUE]",
      glow: "shadow-blue-500/20"
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: "🏦 TVL (LOCKER)",
      value: lockerLoading ? "Loading..." : formatTVL(protocolStats.totalLockedTokens),
      description: "[LOCKED_VALUE]",
      glow: "shadow-cyan-500/20"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      title: "🔥 SUPPLY",
      value: loading ? "Loading..." : formatNumber(contractData.totalSupply || 0),
      description: "[CIRCULATING]",
      glow: "shadow-purple-500/20"
    }
  ];

  return (
    <section className="py-16 px-6 relative z-10 bg-gradient-to-b from-black/80 via-gray-900/60 to-black/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            ARK BY THE NUMBERS
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Real-time protocol metrics from the blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 ${stat.glow} hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                {stat.icon}
                <div className="text-xs text-gray-500 font-mono">
                  {stat.description}
                </div>
              </div>
              
              <h3 className="text-sm font-semibold text-gray-400 mb-2 font-mono">
                {stat.title}
              </h3>
              
              <div className="text-2xl md:text-3xl font-bold text-white font-mono">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
