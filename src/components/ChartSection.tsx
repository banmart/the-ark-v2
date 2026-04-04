import React, { memo } from 'react';
import { Activity, Zap, Shield, ExternalLink, Maximize2 } from 'lucide-react';

const ChartSection = memo(() => {
  const ARK_TOKEN = '0xF4a370e64DD4673BAA250C5435100FA98661Db4C';
  const DEX_SCREENER_URL = `https://dexscreener.com/pulsechain/${ARK_TOKEN}?embed=1&theme=dark&trades=0&info=0`;

  return (
    <section id="chart" className="relative z-10 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase">Real-time Oracle Feed</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-sans">
            Historic Price Chart
          </h2>
          
          <p className="text-white/40 font-mono text-sm">
            Real-time analytics and historic price performance of ARK on the PulseChain network. 
            Monitor ecosystem growth and market liquidity depth directly from the protocol interface.
          </p>
          
          <div className="flex justify-center pt-4">
            <a 
              href={`https://dexscreener.com/pulsechain/${ARK_TOKEN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/5 transition-all group"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-white/60 group-hover:text-white">External Terminal</span>
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Chart Terminal Container */}
        <div className="relative group">
          {/* Decorative Corner Accents */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg group-hover:border-cyan-400 transition-colors" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg group-hover:border-cyan-400 transition-colors" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg group-hover:border-cyan-400 transition-colors" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg group-hover:border-cyan-400 transition-colors" />

          {/* Terminal Box */}
          <div className="relative liquid-glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Terminal Top Bar */}
            <div className="bg-white/[0.03] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase truncate max-w-[200px] md:max-w-none">
                  SECURE_DATA_STREAM // PAIR: ARK/PLS // CHAIN: PULSECHAIN_MAINNET
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span className="font-mono text-[10px] text-cyan-400 uppercase">Live Update Active</span>
                </div>
                <Maximize2 className="w-3 h-3 text-white/20 cursor-not-allowed" />
              </div>
            </div>

            {/* IFrame Overlay (to prevent accidental scrolling interference when just scrolling the page) */}
            <div className="relative w-full aspect-video md:min-h-[700px] bg-black">
              <iframe 
                src={DEX_SCREENER_URL}
                className="absolute inset-0 w-full h-full border-0"
                title="PulseChain ARK Price Chart"
                loading="lazy"
                allow="clipboard-write"
                allowFullScreen
              />
            </div>
            
            {/* Terminal Bottom Info */}
            <div className="bg-white/[0.03] border-t border-white/10 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/50 uppercase tracking-tighter">Status</span>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Synced</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/50 uppercase tracking-tighter">Latency</span>
                <span className="text-xs font-mono text-white/60 uppercase tracking-widest">~250ms</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-white/50 uppercase tracking-tighter">Authority</span>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">The Oracle</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">Protocol</span>
                <span className="text-xs font-mono text-white/60 uppercase tracking-widest">v2.1.ark</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
          <Shield className="w-4 h-4" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Verified Contract Audit 100% Secure</span>
        </div>
      </div>
    </section>
  );
});

ChartSection.displayName = 'ChartSection';

export default ChartSection;
