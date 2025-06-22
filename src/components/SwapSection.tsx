import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Zap, Shield, Activity, Database, Cpu } from 'lucide-react';

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
  const [swapPhase, setSwapPhase] = useState(0);
  const [scanningTokens, setScanningTokens] = useState(false);

  useEffect(() => {
    // Cinematic entrance sequence
    const phases = [
      { delay: 200, phase: 1 },   // System online
      { delay: 800, phase: 2 },   // Interface ready
      { delay: 1400, phase: 3 },  // Full activation
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setSwapPhase(phase), delay);
    });
  }, []);

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      setScanningTokens(true);
      const timer = setTimeout(() => setScanningTokens(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [fromAmount]);

  return (
    <section id="swap" className="relative z-10 py-20 px-6 bg-gradient-to-b from-black/20 to-black/40">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* System Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${swapPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/60 font-mono text-xs mb-2">
            <Database className="w-3 h-3 animate-pulse" />
            <span>[QUANTUM_EXCHANGE_PROTOCOL]</span>
            <Database className="w-3 h-3 animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
            <span className="animate-[glitch_3s_ease-in-out_infinite]">QUANTUM</span>{' '}
            <span className="animate-[glitch_3s_ease-in-out_0.5s_infinite]">EXCHANGE</span>
          </h2>
          
          <p className="text-gray-300 font-mono text-sm max-w-2xl mx-auto">
            <span className="text-cyan-400">[PROTOCOL_STATUS]</span> Molecular conversion chamber online. 
            Transform legacy PLS tokens into sacred ARK vessels through quantum entanglement.
          </p>
        </div>

        {/* Main Exchange Interface */}
        <div className={`relative transition-all duration-1000 delay-300 ${swapPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Outer Container with Tech Border */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-1 shadow-2xl shadow-cyan-500/20">
            {/* Animated Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-teal-500/20 rounded-2xl animate-[pulse_3s_ease-in-out_infinite]"></div>
            
            <div className="relative bg-black/60 rounded-xl p-8">
              {/* System Status Bar */}
              <div className="flex items-center justify-between mb-6 text-xs font-mono">
                <div className="flex items-center gap-2 text-green-400">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>EXCHANGE_ONLINE</span>
                </div>
                <div className="text-cyan-400">
                  RATE: 1:100 | LATENCY: 0.003ms
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Shield className="w-3 h-3" />
                  <span>SECURED</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* From Token - Enhanced */}
                <div className="relative">
                  <div className="absolute -top-2 -left-2 text-cyan-400/40 font-mono text-xs">
                    [INPUT_TERMINAL]
                  </div>
                  
                  <div className="bg-black/50 border border-cyan-500/40 rounded-xl p-4 hover:border-cyan-500/60 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-cyan-400 font-mono">SOURCE_TOKEN</span>
                      <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                        <Cpu className="w-3 h-3" />
                        <span>BALANCE: {parseFloat(plsBalance).toFixed(4)} PLS</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        placeholder="0.0" 
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-500 outline-none font-mono" 
                      />
                      <div className="flex items-center gap-3 bg-red-500/20 border border-red-500/40 px-4 py-2 rounded-lg">
                        <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse"></div>
                        <span className="font-bold text-red-300">PLS</span>
                      </div>
                    </div>
                    
                    {scanningTokens && (
                      <div className="mt-2 text-xs text-yellow-400 font-mono animate-pulse">
                        → ANALYZING MOLECULAR STRUCTURE...
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantum Converter */}
                <div className="flex justify-center">
                  <div className="relative">
                    <button className="p-4 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/50 hover:border-cyan-400 rounded-full transition-all hover:scale-110 group">
                      <ArrowUpDown className="w-6 h-6 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    
                    {/* Quantum Field Effect */}
                    <div className="absolute inset-0 bg-cyan-400/10 rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full animate-[spin_3s_linear_infinite] opacity-50"></div>
                    
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-mono text-cyan-400/60">
                      [QUANTUM_FIELD]
                    </div>
                  </div>
                </div>

                {/* To Token - Enhanced */}
                <div className="relative">
                  <div className="absolute -top-2 -left-2 text-teal-400/40 font-mono text-xs">
                    [OUTPUT_TERMINAL]
                  </div>
                  
                  <div className="bg-black/50 border border-teal-500/40 rounded-xl p-4 hover:border-teal-500/60 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-teal-400 font-mono">TARGET_TOKEN</span>
                      <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                        <Cpu className="w-3 h-3" />
                        <span>BALANCE: {parseFloat(arkBalance).toFixed(2)} ARK</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        placeholder="0.0" 
                        value={toAmount}
                        className="flex-1 bg-transparent text-3xl font-bold text-white placeholder-gray-500 outline-none font-mono" 
                        readOnly 
                      />
                      <div className="flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/40 px-4 py-2 rounded-lg">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full animate-pulse"></div>
                        <span className="font-bold text-cyan-300">ARK</span>
                      </div>
                    </div>
                    
                    {toAmount && parseFloat(toAmount) > 0 && (
                      <div className="mt-2 text-xs text-green-400 font-mono">
                        → CONVERSION CALCULATED: {toAmount} ARK TOKENS READY
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantum Exchange Button */}
                <div className={`transition-all duration-1000 delay-600 ${swapPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <button 
                    onClick={handleSwap}
                    disabled={!canSwap || swapLoading}
                    className="w-full relative bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all text-lg overflow-hidden group"
                  >
                    <span className="relative z-10 font-mono">
                      {swapLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5 animate-spin" />
                          QUANTUM_PROCESSING...
                        </span>
                      ) : !isConnected ? (
                        '[WALLET_CONNECTION_REQUIRED]'
                      ) : !canSwap ? (
                        '[INPUT_AMOUNT_REQUIRED]'
                      ) : (
                        'INITIATE QUANTUM EXCHANGE'
                      )}
                    </span>
                    
                    {/* Button Energy Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {!(!canSwap || swapLoading) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
                    )}
                  </button>
                </div>

                {/* System Diagnostics */}
                <div className="bg-black/30 border border-gray-500/30 rounded-xl p-4">
                  <div className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    [SYSTEM_DIAGNOSTICS]
                  </div>
                  
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">CONVERSION_RATE</span>
                      <span className="text-cyan-400">1 PLS → 100 ARK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">SLIPPAGE_TOLERANCE</span>
                      <span className="text-yellow-400">{slippage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">NETWORK_FEE</span>
                      <span className="text-green-400">~$0.01</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">SECURITY_LEVEL</span>
                      <span className="text-blue-400">MAXIMUM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tech Info */}
        <div className={`text-center mt-8 transition-all duration-1000 delay-900 ${swapPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-xs font-mono text-gray-500">
            <span className="text-cyan-400">[PROTOCOL_INFO]</span> Quantum exchange powered by ARK deflationary matrix • 
            Real-time molecular conversion • Zero-knowledge security protocols active
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwapSection;