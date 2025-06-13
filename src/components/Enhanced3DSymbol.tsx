
import React from 'react';

const Enhanced3DSymbol = () => {
  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Orbital elements */}
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-cyan-400 text-2xl animate-pulse">
          ❍
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cyan-400 text-2xl animate-pulse">
          ❍
        </div>
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-cyan-400 text-2xl animate-pulse">
          ❍
        </div>
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-cyan-400 text-2xl animate-pulse">
          ❍
        </div>
      </div>

      {/* Energy rings */}
      <div className="absolute inset-12 border border-cyan-400/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
      <div className="absolute inset-20 border border-cyan-400/20 rounded-full animate-[spin_25s_linear_infinite]"></div>
      <div className="absolute inset-28 border border-cyan-400/10 rounded-full animate-[spin_18s_linear_infinite_reverse]"></div>

      {/* Holographic layers */}
      <div className="absolute inset-0 rounded-full bg-gradient-conic from-cyan-400/20 via-transparent to-cyan-400/20 animate-[spin_30s_linear_infinite]"></div>
      <div className="absolute inset-4 rounded-full bg-gradient-conic from-transparent via-cyan-400/10 to-transparent animate-[spin_25s_linear_infinite_reverse]"></div>

      {/* Main symbol with enhanced effects */}
      <div className="relative z-10 group cursor-pointer">
        {/* Glow effect */}
        <div className="absolute inset-0 text-[24rem] font-black text-cyan-400 animate-[rotate-3d_15s_linear_infinite] blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300">
          ❍
        </div>
        
        {/* Main symbol */}
        <div className="relative text-[24rem] font-black text-cyan-400 animate-[rotate-3d_15s_linear_infinite] group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.7)]">
          ❍
        </div>

        {/* Interactive zones */}
        <div className="absolute inset-0 rounded-full hover:bg-cyan-400/5 transition-colors duration-300"></div>
      </div>

      {/* Floating data streams */}
      <div className="absolute top-16 left-16 text-cyan-400/60 text-sm font-mono animate-pulse">
        <div className="animate-[fade-in_2s_infinite]">0x1A2B...</div>
      </div>
      <div className="absolute bottom-16 right-16 text-cyan-400/60 text-sm font-mono animate-pulse">
        <div className="animate-[fade-in_2s_infinite_1s]">BLOCK: 847392</div>
      </div>
      <div className="absolute top-1/3 right-12 text-cyan-400/60 text-sm font-mono animate-pulse">
        <div className="animate-[fade-in_2s_infinite_0.5s]">TXN: 0.0001</div>
      </div>
    </div>
  );
};

export default Enhanced3DSymbol;
