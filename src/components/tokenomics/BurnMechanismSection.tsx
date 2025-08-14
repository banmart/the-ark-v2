import React, { useState, useEffect } from 'react';
import { Flame, TrendingDown, AlertTriangle } from 'lucide-react';
import BurnVisualization from './BurnVisualization';
import { burnTrackingService } from '../../services/burnTrackingService';
import { useWallet } from '../../hooks/useWallet';

interface BurnMechanismSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const BurnMechanismSection = ({
  contractData,
  contractLoading
}: BurnMechanismSectionProps) => {
  const { account } = useWallet();
  const [burnPhase, setBurnPhase] = useState(0);
  
  // State for burn data
  const [burnData, setBurnData] = useState({
    totalBurned: 150000000,
    dailyBurnRate: 25000,
    circulatingSupply: 850000000,
    recentBurns: [5000, 8000, 12000, 6000, 9000],
    burnVelocity: 15000
  });
  const [loading, setLoading] = useState(contractLoading);

  // Fetch burn data
  const fetchBurnData = async () => {
    try {
      setLoading(true);
      const burns = await burnTrackingService.getBurnData();
      setBurnData({
        totalBurned: burns.totalBurned,
        dailyBurnRate: burns.burnRate24h,
        circulatingSupply: 850000000,
        recentBurns: burns.recentBurns,
        burnVelocity: burns.burnVelocity
      });
    } catch (error) {
      console.error('Error fetching burn data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cinematic reveal sequence
  useEffect(() => {
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 1000, phase: 2 },
      { delay: 1800, phase: 3 }
    ];
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setBurnPhase(phase), delay);
    });
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchBurnData();
    const interval = setInterval(fetchBurnData, 30000);
    return () => clearInterval(interval);
  }, [account]);

  // Update loading state when contract data changes
  useEffect(() => {
    setLoading(contractLoading);
  }, [contractLoading]);

  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/30 to-black/50">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(251, 146, 60, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(239, 68, 68, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(220, 38, 38, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(185, 28, 28, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 delay-500 ${burnPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Burn Mechanism Display */}
          <div className="relative bg-black/40 backdrop-blur-xl border-2 border-orange-500/30 rounded-xl p-8 overflow-hidden group hover:scale-105 hover:border-orange-500/60 transition-all duration-500 mb-12">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-orange-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-400 font-mono text-xs">BURN ACTIVE</span>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔥</div>
                <h3 className="text-3xl font-bold text-orange-400 mb-4 font-mono">
                  [BURN MECHANISM]
                </h3>
                <p className="text-gray-300 mb-6 font-mono leading-relaxed">
                  <span className="text-orange-400">[MECHANISM]:</span> Every transaction burns
                  2% of tokens permanently, reducing total supply and creating deflationary pressure.
                </p>
              </div>

              {/* Burn Visualization Integration */}
              <div className="max-w-2xl mx-auto">
                <BurnVisualization 
                  totalBurned={burnData.totalBurned}
                  dailyBurnRate={burnData.dailyBurnRate}
                  circulatingSupply={burnData.circulatingSupply}
                  recentBurns={burnData.recentBurns}
                  burnVelocity={burnData.burnVelocity}
                  loading={loading}
                />
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </section>
  );
};

export default BurnMechanismSection;