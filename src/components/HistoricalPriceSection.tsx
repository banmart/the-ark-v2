import React from 'react';
import { Terminal, Activity, Zap } from 'lucide-react';
import HistoricalChart from './charts/HistoricalChart';

const HistoricalPriceSection = () => {
  return (
    <section className="relative z-30 py-10 md:py-16 lg:py-20 px-4 md:px-6 bg-gradient-to-b from-black/20 to-black/40">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 md:mb-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider">PRICE_ANALYTICS</span>
          </div>
          <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
          
          {/* System Status Indicators */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-green-400">LIVE_DATA</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">REAL_TIME</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-2">
              ARK Token Price History
            </h2>
            <p className="text-gray-400 text-sm">
              Historical price data and market analytics for ARK token
            </p>
          </div>
          
          <HistoricalChart 
            dataSource="PLS/ARK" 
            baseCurrency="PLS"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default HistoricalPriceSection;