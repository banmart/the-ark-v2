import React, { useState, useEffect } from 'react';
import { Lock, Shield, Trophy } from 'lucide-react';
import LockerFeesMeter from './LockerFeesMeter';
import { lockerFeesService } from '../../services/lockerFeesService';
import { useWallet } from '../../hooks/useWallet';

interface LockerRewardsSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const LockerRewardsSection = ({
  contractData,
  contractLoading
}: LockerRewardsSectionProps) => {
  const { account } = useWallet();
  const [lockerPhase, setLockerPhase] = useState(0);
  
  // State for locker data
  const [lockerData, setLockerData] = useState({
    accumulatedFees: 75000,
    distributionThreshold: 100000,
    totalLockers: 150,
    userPendingRewards: 0,
    userTier: 0,
    lastDistribution: Date.now() - 86400000
  });
  const [loading, setLoading] = useState(contractLoading);

  // Fetch locker data
  const fetchLockerData = async () => {
    try {
      setLoading(true);
      const lockerFees = await lockerFeesService.getLockerFeesData();
      setLockerData({
        accumulatedFees: lockerFees.totalFeesCollected,
        distributionThreshold: lockerFees.pendingDistribution,
        totalLockers: lockerFees.totalParticipants,
        userPendingRewards: 0,
        userTier: 0,
        lastDistribution: Date.now() - 86400000
      });

      // Get user-specific data if connected
      if (account) {
        const userRewards = await lockerFeesService.calculateTierRewards('bronze', 10000);
        setLockerData(prev => ({
          ...prev,
          userPendingRewards: userRewards,
          userTier: 1
        }));
      }
    } catch (error) {
      console.error('Error fetching locker data:', error);
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
      setTimeout(() => setLockerPhase(phase), delay);
    });
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchLockerData();
    const interval = setInterval(fetchLockerData, 30000);
    return () => clearInterval(interval);
  }, [account]);

  // Update loading state when contract data changes
  useEffect(() => {
    setLoading(contractLoading);
  }, [contractLoading]);

  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/20 to-black/40">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(168, 85, 247, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, rgba(124, 58, 237, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 delay-500 ${lockerPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Locker Rewards Display */}
          <div className="relative bg-black/40 backdrop-blur-xl border-2 border-violet-500/30 rounded-xl p-8 overflow-hidden group hover:scale-105 hover:border-violet-500/60 transition-all duration-500 mb-12">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-violet-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse"></div>
              <span className="text-violet-400 font-mono text-xs">VAULT_ACTIVE</span>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-3xl font-bold text-violet-400 mb-4 font-mono">
                  [LOCKER_REWARDS_VAULT]
                </h3>
                <p className="text-gray-300 mb-6 font-mono leading-relaxed">
                  <span className="text-violet-400">[MECHANISM]:</span> Lock your ARK tokens to earn
                  rewards from transaction fees. Longer locks and higher amounts unlock better tier multipliers.
                </p>
              </div>

              {/* Locker Meter Integration */}
              <div className="max-w-2xl mx-auto">
                <LockerFeesMeter 
                  accumulatedFees={lockerData.accumulatedFees}
                  distributionThreshold={lockerData.distributionThreshold}
                  totalLockers={lockerData.totalLockers}
                  userPendingRewards={lockerData.userPendingRewards}
                  userTier={lockerData.userTier}
                  lastDistribution={lockerData.lastDistribution}
                  loading={loading}
                />
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
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

export default LockerRewardsSection;