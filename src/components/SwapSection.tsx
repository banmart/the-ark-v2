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
    const phases = [{
      delay: 200,
      phase: 1
    },
    // System online
    {
      delay: 800,
      phase: 2
    },
    // Interface ready
    {
      delay: 1400,
      phase: 3
    } // Full activation
    ];
    phases.forEach(({
      delay,
      phase
    }) => {
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
  return <section id="swap" className="relative z-10 py-20 px-6 bg-gradient-to-b from-black/20 to-black/40">
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

      
    </section>;
};
export default SwapSection;