
import React from 'react';
import CustomIcon from './ui/CustomIcon';

const ProphecySection = () => {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          The Prophecy of Noah's ARK
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* The Flood */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <div className="flex justify-center mb-4">
              <CustomIcon name="flood" size={48} className="hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">The Flood</h3>
            <p className="text-gray-300 text-center">
              As the crypto waters rise and projects sink, only those aboard the ARK shall survive the great cleansing.
            </p>
          </div>

          {/* The Chosen */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <div className="flex justify-center mb-4">
              <CustomIcon name="lightning" size={48} className="hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">The Chosen</h3>
            <p className="text-gray-300 text-center">
              ARK holders are the chosen ones, guided by divine tokenomics to weather any storm in the crypto seas.
            </p>
          </div>

          {/* New World */}
          <div className="glass-card rounded-xl p-6 hover:scale-105 hover:glass-strong transition-all">
            <div className="flex justify-center mb-4">
              <CustomIcon name="dove" size={48} className="hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-400 text-center">New World</h3>
            <p className="text-gray-300 text-center">
              When the waters recede, ARK passengers will rebuild the crypto world, stronger and more united than before.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProphecySection;
