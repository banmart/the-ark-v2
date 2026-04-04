import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Zap, Shield, Activity, Database, Cpu, Info, Settings, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwapSectionProps {
  fromAmount: string;
  fromToken: string;
  toAmount: string;
  plsBalance: string;
  arkBalance: string;
  tokenBalances: Record<string, string>;
  swapLoading: boolean;
  slippage: number;
  canSwap: boolean;
  isConnected: boolean;
  setFromAmount: (amount: string) => void;
  setFromToken: (token: string) => void;
  setSlippage?: (amount: number) => void;
  handleSwap: () => void;
}

const SwapSection = ({
  fromAmount,
  fromToken,
  toAmount,
  plsBalance,
  arkBalance,
  tokenBalances,
  swapLoading,
  slippage,
  canSwap,
  isConnected,
  setFromAmount,
  setFromToken,
  handleSwap
}: SwapSectionProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const tokens = [
    { symbol: 'PLS', name: 'Pulse', color: 'bg-white/10' },
    { symbol: 'USDC', name: 'USD Coin', color: 'bg-blue-500/20' },
    { symbol: 'DAI', name: 'Dai Stablecoin', color: 'bg-yellow-500/20' },
    { symbol: 'WETH', name: 'Wrapped Ether', color: 'bg-purple-500/20' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', color: 'bg-orange-500/20' },
  ];

  const currentBalance = fromToken === 'PLS' ? plsBalance : (tokenBalances[fromToken] || '0');

  return (
    <section id="swap" className="relative z-10 py-24 px-6 bg-black">
      <div className="max-w-xl mx-auto relative group">
        
        {/* Main Swap Card - LIQUID GLASS */}
        <div className="relative liquid-glass rounded-3xl p-1 transition-all duration-700 ease-out hover:bg-white/[0.04] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:-translate-y-2 overflow-hidden shadow-2xl">
          <div className="p-8">
            
            {/* Accordion Header */}
            <div 
              className="flex justify-between items-center cursor-pointer group/header py-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="space-y-1">
                <h3 className="text-3xl md:text-3xl font-black text-white uppercase tracking-tighter group-hover/header:text-ark-gold-400 transition-colors">EXCHANGE FOR ARK</h3>
                <p className="text-[10px] text-white/40 font-mono tracking-[0.3em] uppercase">[STATION-01 INTERFACE]</p>
              </div>

              <div className="flex items-center gap-6">
                <AnimatePresence>
                  {isExpanded && (
                    <motion.button 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                      }}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white transition-all"
                    >
                      <Settings size={18} className={showSettings ? 'rotate-90' : ''} />
                    </motion.button>
                  )}
                </AnimatePresence>

                <div className={`transition-transform duration-500 ease-out ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDown size={42} strokeWidth={2.5} className="text-white/20 group-hover/header:text-white transition-colors" />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6 pt-10">
                    {/* From Input (Selected Token) */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end px-1">
                        <span className="text-xs text-white/50 font-black uppercase tracking-[0.3em] font-mono">INPUT AMOUNT ({fromToken})</span>
                        <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase">
                          RESERVES: {parseFloat(currentBalance).toLocaleString()}
                        </span>
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
                          
                          {/* Token Dropdown Selector */}
                          <div className="relative flex-shrink-0">
                            <select
                              value={fromToken}
                              onChange={(e) => setFromToken(e.target.value)}
                              className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-6 py-3 pr-10 text-sm font-black text-white tracking-[0.2em] font-mono focus:outline-none focus:border-white/30 cursor-pointer hover:bg-white/10 transition-all"
                            >
                              {tokens.map((token) => (
                                <option key={token.symbol} value={token.symbol} className="bg-neutral-900 text-white">
                                  {token.symbol}
                                </option>
                              ))}
                            </select>
                            <ArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
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
                        <span className="text-xs text-white/50 font-black uppercase tracking-[0.3em] font-mono">EXPECTED OUTPUT (ARK)</span>
                        <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase">EXPECTED: {parseFloat(toAmount || '0').toLocaleString()}</span>
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
                        <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-1 font-mono">Current Pair</p>
                        <p className="text-xs text-white/60 font-mono italic">{fromToken} / ARK</p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                        <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-1 font-mono">Slippage</p>
                        <p className="text-xs text-white/60 font-mono">{slippage}%</p>
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
                            <span className="text-black font-black uppercase tracking-[0.4em] text-[10px] font-mono">PROCESSING SWAP...</span>
                          </>
                        ) : (
                          <>
                            <Zap size={20} className="text-black group-hover/btn:scale-125 transition-transform duration-500" />
                            <span className="text-black font-black uppercase tracking-[0.4em] text-[10px] font-mono">
                              {isConnected ? (canSwap ? 'EXECUTE SWAP' : 'INSUFFICIENT LIQUIDITY') : 'CONNECT WALLET'}
                            </span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwapSection;