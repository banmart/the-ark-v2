import React, { useState, useEffect } from 'react';
import { Shield, Lock, Target, Zap, Database, Activity, Cpu } from 'lucide-react';
interface ContractTransparencySectionProps {
  contractData: any;
  contractLoading: boolean;
}
const ContractTransparencySection = ({
  contractData,
  contractLoading
}: ContractTransparencySectionProps) => {
  const [liquidityPhase, setLiquidityPhase] = useState(0);
  useEffect(() => {
    // Cinematic reveal sequence
    const phases = [{
      delay: 300,
      phase: 1
    },
    // System scan
    {
      delay: 1000,
      phase: 2
    },
    // Engine detected
    {
      delay: 1800,
      phase: 3
    } // Full activation
    ];
    phases.forEach(({
      delay,
      phase
    }) => {
      setTimeout(() => setLiquidityPhase(phase), delay);
    });
  }, []);
  return <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 to-black/30">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
        backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(251, 146, 60, 0.3) 2px, transparent 2px)
          `,
        backgroundSize: '100px 100px'
      }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${liquidityPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/60 font-mono text-xs mb-4">
            <Database className="w-3 h-3 animate-pulse" />
            <span>[LIQUIDITY_ENGINE_DIAGNOSTICS]</span>
            <Database className="w-3 h-3 animate-pulse" />
          </div>
          
          <h3 className="text-4xl md:text-5xl font-black mb-6 text-cyan-400 font-mono">
            <span className="animate-[glitch_4s_ease-in-out_infinite]">AUTOMATED</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_0.5s_infinite]">LIQUIDITY</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_1s_infinite]">SYSTEM</span>
          </h3>
          
          <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6">
            <p className="text-lg text-gray-200 mb-2 font-mono">
              <span className="text-cyan-400 font-mono">[ENGINE_BRIEF]</span> Quantum fluid dynamics control with automated 
              <span className="text-teal-400 font-bold"> slippage protection</span> and 
              <span className="text-green-400 font-semibold"> threshold-based synthesis</span>.
            </p>
            <div className="text-sm text-gray-400 font-mono">
              Maximum market equilibrium through intelligent liquidity management protocols.
            </div>
          </div>
        </div>

        {/* LP Token Burning Section */}
        <div className={`transition-all duration-1000 delay-500 ${liquidityPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative bg-black/40 backdrop-blur-xl border-2 border-orange-500/30 rounded-xl p-8 overflow-hidden group hover:scale-105 hover:border-orange-500/60 transition-all duration-500">
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-orange-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Status Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-400 font-mono text-xs">BURN_PROTOCOL_ACTIVE</span>
            </div>

            <div className="relative z-10">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">🔥</div>
                <h3 className="text-3xl font-bold text-orange-400 mb-4 font-mono">
                  [AUTOMATED_LP_BURN_PROTOCOL]
                </h3>
                <p className="text-gray-300 mb-6 font-mono leading-relaxed">
                  <span className="text-orange-400">[MECHANISM]:</span> Every liquidity addition triggers automated molecular disintegration of 50% generated LP tokens, 
                  creating permanent deflationary pressure on the liquidity pool matrix itself through quantum incineration protocols.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-black/30 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 text-center hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 text-orange-400 mr-2" />
                        <span className="text-orange-300 font-semibold font-mono">TOTAL_LP_BURNED</span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-orange-400 font-mono">
                      {contractLoading ? '[SCANNING...]' : `${contractData.liquidityData.lpTokensBurned}`}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-2">[VOID_ADDRESS_TRANSFERS]</div>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 text-center hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-orange-400 mr-2" />
                        <span className="text-orange-300 font-semibold font-mono">TOKENS_READY</span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-orange-400 font-mono">
                      {contractLoading ? '[SCANNING...]' : `${contractData.liquidityData.tokensForLiquidity}`}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-2">[LIQUIDITY_BUFFER]</div>
                  </div>
                </div>

                {/* System Status Panel */}
                <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-orange-400" />
                      <h4 className="text-lg font-bold text-orange-400 font-mono">
                        [LP_BURN_DIAGNOSTICS]
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>BURN_ENGINE_OPERATIONAL</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="text-center p-3 bg-orange-500/10 border border-orange-500/30 rounded">
                      <div className="text-orange-400 mb-1">BURN_RATE</div>
                      <div className="text-white font-bold">50% AUTO</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded">
                      <div className="text-red-400 mb-1">TRIGGER_EVENT</div>
                      <div className="text-white font-bold">LP_ADD</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                      <div className="text-yellow-400 mb-1">DEFLATIONARY</div>
                      <div className="text-white font-bold">PERMANENT</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>

        {/* Additional System Information */}
        
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-2px); }
          20% { transform: translateX(2px); }
          30% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          50% { transform: translateX(0); }
        }
      `}</style>
    </section>;
};
export default ContractTransparencySection;