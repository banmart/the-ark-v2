
import React from 'react';

const ChartSection = () => {
  return (
    <section id="chart" className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          $ARK Price Chart
        </h2>
        <div className="glass-card rounded-xl p-8 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Interactive Chart Coming Soon</h3>
            <p className="text-gray-300">Real-time price data and trading view integration</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartSection;
