
import React from 'react';

const CountdownSection = () => {
  return (
    <section className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          The Great Flood Approaches
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="glass-card rounded-xl p-4">
            <div className="text-3xl font-black text-cyan-400">07</div>
            <div className="text-sm text-gray-400">Days</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-3xl font-black text-cyan-400">14</div>
            <div className="text-sm text-gray-400">Hours</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-3xl font-black text-cyan-400">32</div>
            <div className="text-sm text-gray-400">Minutes</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-3xl font-black text-cyan-400">18</div>
            <div className="text-sm text-gray-400">Seconds</div>
          </div>
        </div>
        <p className="text-gray-300 mt-6">Until the next major crypto correction. Board the ARK now!</p>
      </div>
    </section>
  );
};

export default CountdownSection;
