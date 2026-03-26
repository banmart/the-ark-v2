import React from 'react';
const LockerHeader = () => {
  return (
    <div className="relative">
      <div className="relative z-10 text-center py-24 px-6">
        {/* System Status Indicator */}
        <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
          <span className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">[VAULT STATUS: ACTIVE]</span>
        </div>

        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
            THE OUTER SANCTUARIES
          </h1>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-12" />
        </div>

        {/* System Description */}
        <div className="max-w-2xl mx-auto mb-16 px-6">
          <p className="text-white/40 text-lg md:text-xl font-mono leading-relaxed uppercase tracking-tighter italic">
            Bind your tokens to the Covenant of the Ark. The strength of your seal determines your standing in the hierarchy.
          </p>
        </div>
      </div>
    </div>
  );
};
export default LockerHeader;