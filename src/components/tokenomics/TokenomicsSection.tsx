import React, { useState, useEffect } from 'react';
import { Coins, Activity, TrendingUp } from 'lucide-react';
import ReflectionsMeter from './ReflectionsMeter';
import LockerFeesMeter from './LockerFeesMeter';
import BurnVisualization from './BurnVisualization';
import { reflectionTrackingService } from '../../services/reflectionTrackingService';
import { burnTrackingService } from '../../services/burnTrackingService';
import { lockerFeesService } from '../../services/lockerFeesService';
import { useWallet } from '../../hooks/useWallet';
interface TokenomicsSectionProps {
  contractData: any;
  contractLoading: boolean;
}
const TokenomicsSection = ({
  contractData,
  contractLoading
}: TokenomicsSectionProps) => {
  const {
    account
  } = useWallet();

  // State for all tokenomics data
  const [reflectionData, setReflectionData] = useState({
    currentReflectionPool: 50000,
    totalHolders: 2500,
    userHoldings: 0,
    userReflections: 0,
    dailyReflectionRate: 10000
  });
  const [lockerData, setLockerData] = useState({
    accumulatedFees: 75000,
    distributionThreshold: 100000,
    totalLockers: 150,
    userPendingRewards: 0,
    userTier: 0,
    lastDistribution: Date.now() - 86400000
  });
  const [burnData, setBurnData] = useState({
    totalBurned: 150000000,
    dailyBurnRate: 25000,
    circulatingSupply: 850000000,
    recentBurns: [5000, 8000, 12000, 6000, 9000],
    burnVelocity: 15000
  });
  const [loading, setLoading] = useState(contractLoading);

  // Fetch all tokenomics data
  const fetchTokenomicsData = async () => {
    try {
      setLoading(true);
      const [reflections, lockerFees, burns] = await Promise.all([reflectionTrackingService.getReflectionData(), lockerFeesService.getLockerFeesData(), burnTrackingService.getBurnData()]);
      setReflectionData({
        currentReflectionPool: reflections.reflectionPool,
        totalHolders: reflections.holdersCount,
        userHoldings: 0,
        userReflections: 0,
        dailyReflectionRate: reflections.reflectionRate
      });
      setLockerData({
        accumulatedFees: lockerFees.totalFeesCollected,
        distributionThreshold: lockerFees.pendingDistribution,
        totalLockers: lockerFees.totalParticipants,
        userPendingRewards: 0,
        userTier: 0,
        lastDistribution: Date.now() - 86400000
      });
      setBurnData({
        totalBurned: burns.totalBurned,
        dailyBurnRate: burns.burnRate24h,
        circulatingSupply: 850000000,
        recentBurns: burns.recentBurns,
        burnVelocity: burns.burnVelocity
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
      console.error('Error fetching tokenomics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchTokenomicsData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTokenomicsData, 30000);
    return () => clearInterval(interval);
  }, [account]);

  // Update loading state when contract data changes
  useEffect(() => {
    setLoading(contractLoading);
  }, [contractLoading]);
  return <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/20 to-black/40">
      {/* Tokenomics Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
        backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.4) 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.4) 2px, transparent 2px),
            radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.4) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.4) 2px, transparent 2px)
          `,
        backgroundSize: '120px 120px'
      }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
              [TOKENOMICS_ENGINE]
            </h2>
            <TrendingUp className="w-8 h-8 text-green-400 animate-pulse" />
          </div>
          
          <p className="text-gray-300 text-lg font-mono max-w-3xl mx-auto leading-relaxed">
            Real-time visualization of ARK's automated tokenomics system
            <br />
            <span className="text-cyan-400">[REFLECTIONS]</span> • <span className="text-blue-400">[LOCKER_REWARDS]</span> • <span className="text-orange-400">[DEFLATIONARY_BURNS]</span>
          </p>
        </div>

        {/* Tokenomics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Reflections Engine */}
          <div className="order-1">
            <ReflectionsMeter currentReflectionPool={reflectionData.currentReflectionPool} totalHolders={reflectionData.totalHolders} userHoldings={reflectionData.userHoldings} userReflections={reflectionData.userReflections} dailyReflectionRate={reflectionData.dailyReflectionRate} loading={loading} />
          </div>

          {/* Locker Rewards Engine */}
          <div className="order-2">
            <LockerFeesMeter accumulatedFees={lockerData.accumulatedFees} distributionThreshold={lockerData.distributionThreshold} totalLockers={lockerData.totalLockers} userPendingRewards={lockerData.userPendingRewards} userTier={lockerData.userTier} lastDistribution={lockerData.lastDistribution} loading={loading} />
          </div>

          {/* Burn Mechanism */}
          <div className="order-3">
            <BurnVisualization totalBurned={burnData.totalBurned} dailyBurnRate={burnData.dailyBurnRate} circulatingSupply={burnData.circulatingSupply} recentBurns={burnData.recentBurns} burnVelocity={burnData.burnVelocity} loading={loading} />
          </div>
        </div>

        {/* Tokenomics Summary */}
        
      </div>

      {/* Enhanced Scanning Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-[scan_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-purple-500/50 to-transparent animate-[scan_6s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </section>;
};
export default TokenomicsSection;