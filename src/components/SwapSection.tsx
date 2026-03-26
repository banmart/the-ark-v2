import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Zap, Shield, Activity, Database, Cpu, Info, Settings, ArrowDown } from 'lucide-react';

interface SwapSectionProps {
  fromAmount: string;
  toAmount: string;
  plsBalance: string;
  arkBalance: string;
  swapLoading: boolean;
  slippage: number;
  canSwap: boolean;
  isConnected: boolean;
  setFromAmount: (amount: string) => void;
  setSlippage?: (amount: number) => void;
  handleSwap: () => void;
}

const SwapSection = ({
  fromAmount,
  toAmount,
  plsBalance,
  arkBalance,
  swapLoading,
  slippage,
  canSwap,
  isConnected,
  setFromAmount,
  handleSwap
}: SwapSectionProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('swap');

  return (
    <section id="swap" className="relative z-10 py-24 px-6 bg-black">
      <div className="max-w-xl mx-auto relative group">
        
        {/* Main Swap Card - LIQUID GLASS */}
        <div className="relative liquid-glass rounded-[2rem] p-1 shadow-2xl">
          <div className="p-8 space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">COVENANT EXCHANGE</h3>
                <p className="text-[10px] text-white/40 font-mono tracking-[0.3em] uppercase">[STATION-01 INTERFACE]</p>
              </div>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white transition-all"
              >
                <Settings size={18} className={showSettings ? 'rotate-90' : ''} />
              </button>
            </div>

            {/* From Input (PLS) */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] font-mono">SOURCE TENSION (PLS)</span>
                <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase">RESERVES: {parseFloat(plsBalance).toLocaleString()}</span>
              </div>
              <div className="relative p-10 rounded-3xl bg-white/[0.02] border border-white/10 group/input hover:border-white/20 transition-all duration-500">
                <div className="flex justify-between items-center gap-8">
                  <input 
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent border-none text-5xl font-black text-white placeholder:text-white/5 focus:ring-0 p-0 font-mono tracking-tighter"
                  />
                  <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-6 h-6 bg-white/10 rounded-full border border-white/20" />
                    <span className="text-sm font-black text-white tracking-[0.2em] font-mono">PLS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Divider */}
            <div className="relative flex justify-center -my-4 z-20">
              <button className="w-12 h-12 rounded-xl bg-white text-black border border-white flex items-center justify-center hover:scale-110 transition-all shadow-2xl">
                <ArrowDown size={20} strokeWidth={3} />
              </button>
            </div>

            {/* To Input (ARK) */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] font-mono">REVELATION MAGNITUDE (ARK)</span>
                <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase">EXPECTED: {parseFloat(arkBalance).toLocaleString()}</span>
              </div>
              <div className="relative p-10 rounded-3xl bg-white/5 border border-white/20">
                <div className="flex justify-between items-center gap-8">
                  <div className="text-5xl font-black text-white font-mono tracking-tighter">
                    {toAmount || '0.00'}
                  </div>
                  <div className="flex items-center gap-4 px-6 py-3 bg-white text-black rounded-2xl">
                    <div className="w-6 h-6 bg-black rounded-full" />
                    <span className="text-sm font-black tracking-[0.2em] font-mono">ARK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Info */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] mb-1 font-mono">Exchange</p>
                <p className="text-xs text-white/60 font-mono italic">1 PLS = 0.00045 ARK</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] mb-1 font-mono">Slip</p>
                <p className="text-xs text-white/60 font-mono">0.05%</p>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={handleSwap}
              disabled={swapLoading || !canSwap}
              className="w-full relative py-8 mt-10 bg-white hover:bg-neutral-200 disabled:opacity-5 disabled:grayscale transition-all duration-500 rounded-3xl overflow-hidden group/btn shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.15)] active:scale-[0.98]"
            >
              <div className="relative flex items-center justify-center gap-4">
                {swapLoading ? (
                  <>
                    <Cpu size={20} className="text-black animate-spin" />
                    <span className="text-black font-black uppercase tracking-[0.4em] text-[10px] font-mono">SYNCING COVENANT...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} className="text-black group-hover/btn:scale-125 transition-transform duration-500" />
                    <span className="text-black font-black uppercase tracking-[0.4em] text-[10px] font-mono">
                      {isConnected ? 'INITIATE RITUAL' : 'AWAKEN SOUL'}
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwapSection;