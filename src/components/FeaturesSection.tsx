import React from 'react';

const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-30 py-20 px-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          The Four Pillars of Salvation
        </h2>
        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-16">
          $ARK is built upon four core principles, ensuring a stable and rewarding ecosystem for its holders.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Scarcity */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all group relative scan-effect overflow-hidden">
            <div className="text-4xl mb-4 text-cyan-400 text-center group-hover:animate-bounce">🔥</div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Scarcity</h3>
            <p className="text-gray-300 text-center">
              Limited supply with continuous burns on transactions creating deflationary pressure.
            </p>
          </div>

          {/* Rewards */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all group relative scan-effect overflow-hidden">
            <div className="text-4xl mb-4 text-cyan-400 text-center group-hover:animate-bounce">💰</div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Rewards</h3>
            <p className="text-gray-300 text-center">
              Vault rewards and reflections for loyal holders who believe in the mission.
            </p>
          </div>

          {/* Community */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all group relative scan-effect overflow-hidden">
            <div className="text-4xl mb-4 text-cyan-400 text-center group-hover:animate-bounce">🫂</div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Community</h3>
            <p className="text-gray-300 text-center">
              A strong, supportive community driving the project forward together.
            </p>
          </div>

          {/* Security */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all group relative scan-effect overflow-hidden">
            <div className="text-4xl mb-4 text-cyan-400 text-center group-hover:animate-bounce">🛡️</div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">Security</h3>
            <p className="text-gray-300 text-center">
              Audited contract ensuring safety and transparency for all passengers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
