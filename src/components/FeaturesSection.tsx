import React from 'react';

const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-30 py-20 px-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          The Four Sacred Pillars
        </h2>
        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-16">
          $ARK is built upon four divine tokenomics pillars, creating a deflationary ecosystem with maximum security and rewards for the faithful.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Burn Mechanism */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all group relative scan-effect overflow-hidden">
            <div className="text-4xl mb-4 text-red-500 text-center group-hover:animate-bounce">🔥</div>
            <h3 className="text-2xl font-bold mb-4 text-red-400 text-center">Burn Mechanism</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-black text-red-300">3%</div>
              <div className="text-sm text-gray-400">+ LP Token Burns</div>
            </div>
            <p className="text-gray-300 text-center text-sm">
              Permanent token removal through burns to dead address plus automated LP token burning for maximum deflationary pressure.
            </p>
          </div>

          {/* Reflections */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all group relative scan-effect overflow-hidden">
            <div className="text-4xl mb-4 text-blue-500 text-center group-hover:animate-bounce">🫂</div>
            <h3 className="text-2xl font-bold mb-4 text-blue-400 text-center">Reflections</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-black text-blue-300">2%</div>
              <div className="text-sm text-gray-400">Auto Redistribution</div>
            </div>
            <p className="text-gray-300 text-center text-sm">
              Automatic redistribution to all holders based on their holdings. The longer you hold, the more you earn through reflections.
            </p>
          </div>

          {/* Auto-Liquidity */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all group relative scan-effect overflow-hidden">
            <div className="text-4xl mb-4 text-purple-500 text-center group-hover:animate-bounce">💧</div>
            <h3 className="text-2xl font-bold mb-4 text-purple-400 text-center">Auto-Liquidity</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-black text-purple-300">2%</div>
              <div className="text-sm text-gray-400">Smart Threshold</div>
            </div>
            <p className="text-gray-300 text-center text-sm">
              Automated liquidity generation with slippage protection. Threshold: 0.1% supply, Max: 0.2% supply for optimal market stability.
            </p>
          </div>

          {/* Locker Rewards */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all group relative scan-effect overflow-hidden">
            <div className="text-4xl mb-4 text-green-500 text-center group-hover:animate-bounce">🔒</div>
            <h3 className="text-2xl font-bold mb-4 text-green-400 text-center">Locker Rewards</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-black text-green-300">2%</div>
              <div className="text-sm text-gray-400">Vault Accumulation</div>
            </div>
            <p className="text-gray-300 text-center text-sm">
              Dedicated vault rewards for long-term lockers. Earn multiplied rewards based on lock duration with up to 8x multipliers.
            </p>
          </div>
        </div>
        
        {/* Contract Security Features */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400">Built-in Security Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-4">
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-semibold text-green-400 mb-2">ReentrancyGuard</h4>
              <p className="text-sm text-gray-400">Protection against reentrancy attacks</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="text-2xl mb-2">🚫</div>
              <h4 className="font-semibold text-blue-400 mb-2">Renounced Contract</h4>
              <p className="text-sm text-gray-400">No admin keys - fully decentralized</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-semibold text-purple-400 mb-2">Fee Caps</h4>
              <p className="text-sm text-gray-400">Maximum 9% total fees hardcoded</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
