import React, { useState } from 'react';
import { 
  Wallet, 
  Lock, 
  TrendingUp, 
  BarChart3,
  Coins,
  Gift,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useLockerData } from '../../hooks/useLockerData';
import { useLockerContractData } from '../../hooks/useLockerContractData';
import { formatPoolSharePercentage, formatTokenPoolShare } from '../../lib/utils';
import { toast } from "@/components/ui/use-toast";

interface UserStatsSectionProps {
  isConnected: boolean;
}

const UserStatsSection = ({ isConnected }: UserStatsSectionProps) => {
  const { userStats, claimRewards } = useLockerData();
  const { protocolStats, totalProtocolWeight } = useLockerContractData();
  const [claimingRewards, setClaimingRewards] = useState(false);

  const displayStats = isConnected ? userStats : {
    totalLocked: 150000,
    totalRewardsEarned: 23500,
    pendingRewards: 12847,
    activeLocksCount: 2,
    userWeight: 85000,
    readyToUnlockCount: 1,
    inProgressCount: 1
  };

  const displayRewards = isConnected ? userStats.pendingRewards : 12847;

  const handleClaimRewards = async () => {
    if (!isConnected) return;
    
    setClaimingRewards(true);
    try {
      await claimRewards();
      toast({
        title: "Success!",
        description: `Successfully claimed ${displayRewards.toLocaleString()} ARK rewards`,
      });
    } catch (error: any) {
      console.error('Claim failed:', error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to claim rewards"
      });
    } finally {
      setClaimingRewards(false);
    }
  };

  const statCards = [
    {
      icon: Lock,
      label: 'Covenant Total',
      value: protocolStats.totalLockedTokens.toLocaleString(),
      unit: 'ARK',
      colorRGB: '255, 255, 255',
    },
    {
      icon: Lock,
      label: 'Your Bound Amount',
      value: displayStats.totalLocked.toLocaleString(),
      unit: 'ARK',
      colorRGB: '255, 255, 255',
      extra: (
        <div className="text-[10px] font-mono font-bold tracking-widest text-white/20 mt-2 uppercase">
          <span className="text-white/60">{displayStats.readyToUnlockCount}</span> RELEASED • 
          <span className="text-white/60 ml-1">{displayStats.inProgressCount}</span> BINDING
        </div>
      )
    },
    {
      icon: TrendingUp,
      label: 'Total Tithes',
      value: displayStats.totalRewardsEarned.toLocaleString(),
      unit: 'ARK',
      colorRGB: '255, 255, 255',
    },
    {
      icon: BarChart3,
      label: 'Covenant Share',
      value: protocolStats?.totalLockedTokens ? formatTokenPoolShare(displayStats.totalLocked, protocolStats.totalLockedTokens) : '0.00%',
      unit: 'OF TOTAL',
      colorRGB: '255, 255, 255',
      extra: (
        <div className="text-[10px] font-mono font-bold tracking-widest text-white/20 mt-2 uppercase">
          STRENGTH: {totalProtocolWeight > 0 ? formatPoolSharePercentage(displayStats.userWeight, totalProtocolWeight) : '0.00%'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Premium Demo Mode Banner */}
      {/* Premium Demo Mode Banner */}
      {!isConnected && (
        <div className="relative group">
          <div className="relative liquid-glass border border-white/10 rounded-2xl p-8 backdrop-blur-3xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white/40" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">TEMPORARY REVELATION</h3>
                  <p className="text-[10px] text-white/20 font-mono tracking-[0.2em] uppercase">VIEWING PROTOCOL METRICS IN OBSERVER MODE</p>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest text-center md:text-right max-w-xs leading-relaxed">
                Connect your soul to the Ark to view your actual standing and claim your deserved tithes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.label} className="group relative">
              {/* Outer glow */}
              <div 
                className="absolute -inset-0.5 rounded-2xl blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ background: `rgba(${stat.colorRGB}, 0.5)` }}
              ></div>
              
              {/* Card */}
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all duration-500 overflow-hidden h-full">
                {/* Inner gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ 
                    background: `radial-gradient(ellipse at top, rgba(${stat.colorRGB}, 0.08) 0%, transparent 60%)`
                  }}
                ></div>
                
                <div className="relative z-10 flex items-start justify-between h-full">
                  <div className="relative">
                    <div 
                      className="absolute inset-0 blur-xl opacity-30"
                      style={{ background: `rgba(${stat.colorRGB}, 0.5)` }}
                    ></div>
                    <div 
                      className="relative p-3 rounded-xl border"
                      style={{ 
                        background: `rgba(${stat.colorRGB}, 0.1)`,
                        borderColor: `rgba(${stat.colorRGB}, 0.3)`
                      }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: `rgb(${stat.colorRGB})` }} />
                    </div>
                  </div>
                  
                  <div className="text-right flex-1 ml-4">
                    <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                    <div 
                      className="text-xl md:text-2xl font-bold"
                      style={{ color: `rgb(${stat.colorRGB})` }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.unit}</div>
                    {stat.extra}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium Rewards Section */}
      <div className="relative group">
        <div className="relative liquid-glass border border-white/10 rounded-22xl p-8 md:p-12 overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="relative p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                <Gift className="w-10 h-10 text-white/60" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  UNCLAIMED TITHES
                  <Sparkles className="w-4 h-4 text-white/20" />
                </h2>
                <p className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase">
                  FROM PROTOCOL FEES • ARK POOL: {protocolStats.rewardPool.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Claim Button */}
            <button
              disabled={!isConnected || displayRewards === 0 || claimingRewards}
              onClick={handleClaimRewards}
              className="relative bg-white text-black font-black font-mono text-[10px] tracking-[0.3em] uppercase px-12 py-4 rounded-xl disabled:opacity-20 hover:scale-[1.05] transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center"
            >
              {claimingRewards ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  CLAIMING...
                </>
              ) : (
                <>
                  <Coins className="w-3 h-3" />
                  CLAIM TITHES
                </>
              )}
            </button>
          </div>
          
          {/* Reward Amount */}
          <div className="relative z-10 flex items-center gap-6 mt-12 bg-white/[0.03] border border-white/5 rounded-2xl p-8">
            <div className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              {displayRewards.toLocaleString()} <span className="text-xl md:text-2xl text-white/20 font-mono tracking-widest ml-4">ARK</span>
            </div>
            {!isConnected && (
              <div className="bg-white/10 border border-white/20 rounded-md px-3 py-1">
                <span className="text-[8px] text-white/40 font-black font-mono tracking-widest">OBSERVER</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsSection;
