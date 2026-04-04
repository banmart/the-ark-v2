import React from 'react';
const LockerHeader = () => {
  return (
    <div className="relative">
      <div className="relative z-10 text-center py-24 px-6">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
            The ARK Locker
          </h1>

        </div>

        {/* System Description */}
        <div className="max-w-2xl mx-auto mb-16 px-6">
          <p className="text-white/60 text-lg md:text-xl font-mono leading-relaxed uppercase tracking-tighter">
            Integrate assets with the protocol ecosystem. Accumulate yield multipliers based on time-weighted lock duration and participation depth.
          </p>
        </div>
      </div>
    </div>
  );
};
export default LockerHeader;