import React, { useState, useEffect } from 'react';
import { Shield, Lock, Target, Zap, Database, Activity, Cpu, Info } from 'lucide-react';
import { CONTRACT_CONSTANTS } from '../utils/constants';
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
      }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        

        {/* Fixed Fee Structure */}
        <div className={`transition-all duration-1000 delay-500 ${liquidityPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          

          {/* Swap Settings Display */}
          <div className="relative bg-black/40 backdrop-blur-xl border-2 border-green-500/30 rounded-xl p-8 overflow-hidden group hover:scale-105 hover:border-green-500/60 transition-all duration-500 mb-12">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-green-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono text-xs">AUTO_SWAP_ACTIVE</span>
            </div>

            <div className="relative z-10">
              <div className="text-center">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-3xl font-bold text-green-400 mb-4 font-mono">
                  [AUTO_LIQUIDITY_ENGINE]
                </h3>
                <p className="text-gray-300 mb-6 font-mono leading-relaxed">
                  <span className="text-green-400">[MECHANISM]:</span> When the contract accumulates the swap threshold amount,
                  it automatically converts half to PLS and adds both to the liquidity pool, with LP tokens sent to the burn address.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-black/30 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 text-center hover:border-green-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-green-300 font-semibold font-mono">SWAP_THRESHOLD</span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-green-400 font-mono">
                      {contractLoading ? '[SCANNING...]' : `${parseFloat(contractData.swapSettings.threshold || '50000').toLocaleString()}`}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-2">[TOKENS]</div>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 text-center hover:border-green-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-green-300 font-semibold font-mono">LP_BURN_RATE</span>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-green-400 font-mono">100%</div>
                    <div className="text-xs text-gray-400 font-mono mt-2">[LP_TO_BURN_ADDRESS]</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 via-teal-500/10 to-green-500/10 border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-green-400" />
                      <h4 className="text-lg font-bold text-green-400 font-mono">
                        [AUTO_LP_DIAGNOSTICS]
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>ENGINE_OPERATIONAL</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded">
                      <div className="text-green-400 mb-1">TRIGGER</div>
                      <div className="text-white font-bold">THRESHOLD</div>
                    </div>
                    <div className="text-center p-3 bg-teal-500/10 border border-teal-500/30 rounded">
                      <div className="text-teal-400 mb-1">SPLIT_RATIO</div>
                      <div className="text-white font-bold">50/50</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded">
                      <div className="text-red-400 mb-1">LP_DESTINATION</div>
                      <div className="text-white font-bold">BURN</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* Contract Security Info */}
          <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-2">
                  Contract Immutability & Security
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <span className="text-cyan-400 font-semibold">Fixed Fee Structure:</span> All fees are immutable constants set at deployment - cannot be changed by anyone, including the owner.
                  </div>
                  <div>
                    <span className="text-green-400 font-semibold">Automatic Functions:</span> Liquidity generation and fee distribution happen automatically during transactions.
                  </div>
                  <div>
                    <span className="text-purple-400 font-semibold">Burn Mechanism:</span> LP tokens are automatically sent to the burn address, making liquidity permanently locked.
                  </div>
                  <div>
                    <span className="text-yellow-400 font-semibold">Reflection System:</span> Holders earn rewards proportional to their holdings through the reflection mechanism.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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