import React, { useState, useEffect } from 'react';
import { Eye, Target, Users } from 'lucide-react';
import ReflectionsMeter from './ReflectionsMeter';
import { reflectionTrackingService } from '../../services/reflectionTrackingService';
import { useWallet } from '../../hooks/useWallet';

interface ReflectionsEngineSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const ReflectionsEngineSection = ({
  contractData,
  contractLoading
}: ReflectionsEngineSectionProps) => {
  const { account } = useWallet();
  const [reflectionPhase, setReflectionPhase] = useState(0);
  
  // State for reflection data
  const [reflectionData, setReflectionData] = useState({
    currentReflectionPool: 50000,
    totalHolders: 2500,
    userHoldings: 0,
    userReflections: 0,
    dailyReflectionRate: 10000
  });
  const [loading, setLoading] = useState(contractLoading);

  // Fetch reflection data
  const fetchReflectionData = async () => {
    try {
      setLoading(true);
      const reflections = await reflectionTrackingService.getReflectionData();
      setReflectionData({
        currentReflectionPool: reflections.reflectionPool,
        totalHolders: reflections.holdersCount,
        userHoldings: 0,
        userReflections: 0,
        dailyReflectionRate: reflections.reflectionRate
      });
    } catch (error) {
      console.error('Error fetching reflection data:', error);
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
      setTimeout(() => setReflectionPhase(phase), delay);
    });
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchReflectionData();
    const interval = setInterval(fetchReflectionData, 30000);
    return () => clearInterval(interval);
  }, [account]);

  // Update loading state when contract data changes
  useEffect(() => {
    setLoading(contractLoading);
  }, [contractLoading]);

  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 to-black/30">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(168, 85, 247, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(139, 92, 246, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 delay-500 ${reflectionPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Reflections Engine Display */}
          <div className="relative bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 rounded-xl p-8 overflow-hidden group hover:scale-105 hover:border-cyan-500/60 transition-all duration-500 mb-12">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-cyan-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 font-mono text-xs">REFLECTIONS_ACTIVE</span>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-3xl font-bold text-cyan-400 mb-4 font-mono">
                  [REFLECTIONS_ENGINE]
                </h3>
                <p className="text-gray-300 mb-6 font-mono leading-relaxed">
                  <span className="text-cyan-400">[MECHANISM]:</span> Every transaction automatically collects
                  a 2% reflection fee and distributes it proportionally to all token holders based on their holdings.
                </p>
              </div>

              {/* Reflection Meter Integration */}
              <div className="max-w-2xl mx-auto">
                <ReflectionsMeter 
                  currentReflectionPool={reflectionData.currentReflectionPool}
                  totalHolders={reflectionData.totalHolders}
                  userHoldings={reflectionData.userHoldings}
                  userReflections={reflectionData.userReflections}
                  dailyReflectionRate={reflectionData.dailyReflectionRate}
                  loading={loading}
                />
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
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

export default ReflectionsEngineSection;