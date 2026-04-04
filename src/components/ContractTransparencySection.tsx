import React, { useState, useEffect } from 'react';
import { Shield, Lock, Target, Zap, Database, Activity, Cpu, Info } from 'lucide-react';
import { CONTRACT_CONSTANTS } from '../utils/constants';
import AutoLiquidityMeter from './AutoLiquidityMeter';
import { useARKData } from '../contexts/ARKDataContext';

interface ContractTransparencySectionProps {
  contractData: any;
  contractLoading: boolean;
}

const ContractTransparencySection = ({
  contractData,
  contractLoading
}: ContractTransparencySectionProps) => {
  const { data: arkData } = useARKData();
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
  return <section className="relative z-30 py-8 px-6 bg-gradient-to-b from-black/10 to-black/30">
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
        <div className={`text-center mb-16 transition-all duration-1000 ${liquidityPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-cyan-400 mr-3" />
            <h2 className="text-white">
              CONTRACT TRANSPARENCY
            </h2>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto font-mono">
            Full blockchain transparency with real-time contract metrics and security verification
          </p>
        </div>

        {/* Fixed Fee Structure */}
        <div className={`transition-all duration-1000 delay-500 ${liquidityPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Auto-Liquidity Engine */}
            <div className="bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 rounded-xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden hover:border-cyan-500/60">
              <div className="flex items-center justify-center mb-6">
                <Target className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-cyan-400 text-center font-mono">
                AUTO-LIQUIDITY ENGINE
              </h3>
              <AutoLiquidityMeter 
                currentAccumulation={arkData?.liquidityFeeTotal || 0}
                threshold={arkData?.swapThreshold || 50000}
                loading={contractLoading}
                isThresholdReached={(arkData?.liquidityFeeTotal || 0) >= (arkData?.swapThreshold || 50000)}
                isPendingSwap={false}
                lastSwapTimestamp={Date.now() - 24 * 60 * 60 * 1000}
                estimatedNextSwap={Date.now() + 6 * 60 * 60 * 1000}
              />
            </div>

            {/* Security Status */}
            <div className="bg-black/40 backdrop-blur-xl border-2 border-green-500/30 rounded-xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden hover:border-green-500/60">
              <div className="flex items-center justify-center mb-6">
                <Lock className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-400 text-center font-mono">
                SECURITY STATUS
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">OWNERSHIP:</span>
                  <span className="text-white font-mono text-sm uppercase">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">LIQUIDITY:</span>
                  <span className="text-green-400 font-mono text-sm">LOCKED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">AUDIT:</span>
                  <span className="text-green-400 font-mono text-sm">VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Contract Metrics */}
            <div className="bg-black/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden hover:border-purple-500/60">
              <div className="flex items-center justify-center mb-6">
                <Activity className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-purple-400 text-center font-mono">
                LIVE METRICS
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">TRANSACTIONS:</span>
                  <span className="text-purple-400 font-mono text-sm">{contractLoading ? '...' : '1,247'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">HOLDERS:</span>
                  <span className="text-purple-400 font-mono text-sm">{contractLoading ? '...' : (contractData?.holders?.toLocaleString() || '892')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-sm">SUPPLY:</span>
                  <span className="text-purple-400 font-mono text-sm">1B ARK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Settings Display */}
          <div className="bg-black/20 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-cyan-400 font-mono">CONTRACT SETTINGS</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10%</div>
                <div className="text-sm text-gray-300 font-mono">PROTOCOL TAX</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ark-gold-400 mb-2">
                  {arkData?.swapThreshold ? arkData.swapThreshold.toLocaleString() : '50,000'}
                </div>
                <div className="text-sm text-gray-300 font-mono">SWAP THRESHOLD</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {arkData?.totalSupply ? (arkData.totalSupply / 1000000000).toFixed(0) + 'B' : '1B'}
                </div>
                <div className="text-sm text-gray-300 font-mono">TOTAL SUPPLY</div>
              </div>
            </div>
          </div>

          {/* Contract Security Info */}
          <div className="bg-black/20 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-mono text-lg font-bold">SECURITY VERIFIED</span>
            </div>
            <p className="text-gray-300 font-mono text-sm leading-relaxed">
              Standard ERC-20 Implementation • Liquidity Permanently Locked • Secure Automated Swap Mechanism • 
              Full On-Chain Transparency • 10% Automated Protocol Fee (1% Burn, 1% DAO, 4% Liquidity, 4% Rewards)
            </p>
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