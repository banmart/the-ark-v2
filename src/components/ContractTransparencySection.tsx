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
    const phases = [
      { delay: 300, phase: 1 },   // System scan
      { delay: 1000, phase: 2 },  // Engine detected
      { delay: 1800, phase: 3 },  // Full activation
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setLiquidityPhase(phase), delay);
    });
  }, []);

  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 to-black/30">
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
    </section>
  );
};

export default ContractTransparencySection;
