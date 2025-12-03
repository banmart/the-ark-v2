import React, { useState } from 'react';
import { 
  Wallet, 
  Lock, 
  TrendingUp, 
  BarChart3,
  Coins,
  Gift,
  Sparkles
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
      label: 'System Total',
      value: protocolStats.totalLockedTokens.toLocaleString(),
      unit: 'ARK',
      colorRGB: '96, 165, 250',
    },
    {
      icon: Lock,
      label: 'Your Locked',
      value: displayStats.totalLocked.toLocaleString(),
      unit: 'ARK',
      colorRGB: '74, 222, 128',
      extra: (
        <div className="text-xs text-gray-500 mt-1">
          <span className="text-cyan-400">{displayStats.readyToUnlockCount}</span> ready • 
          <span className="text-blue-400 ml-1">{displayStats.inProgressCount}</span> in progress
        </div>
      )
    },
    {
      icon: TrendingUp,
      label: 'Total Earned',
      value: displayStats.totalRewardsEarned.toLocaleString(),
      unit: 'ARK',
      colorRGB: '250, 204, 21',
    },
    {
      icon: BarChart3,
      label: 'Pool Share',
      value: protocolStats?.totalLockedTokens ? formatTokenPoolShare(displayStats.totalLocked, protocolStats.totalLockedTokens) : '0.00%',
      unit: 'of tokens',
      colorRGB: '167, 139, 250',
      extra: (
        <div className="text-xs text-gray-500 mt-1">
          Weight: {totalProtocolWeight > 0 ? formatPoolSharePercentage(displayStats.userWeight, totalProtocolWeight) : '0.00%'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Premium Demo Mode Banner */}
      {!isConnected && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-orange-500/30 rounded-2xl blur-sm"></div>
          <div className="relative bg-black/50 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Wallet className="w-7 h-7 text-orange-400" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Demo Mode</h3>
            </div>
            <p className="text-center text-gray-300 text-sm">
              Connect your wallet to view your actual positions and claim real rewards
            </p>
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
        {/* Outer glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-green-500/30 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Card */}
        <div className="relative bg-black/50 backdrop-blur-xl border border-green-500/40 rounded-2xl p-6 md:p-8 overflow-hidden">
          {/* Inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/5"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/30 rounded-xl blur-lg animate-pulse"></div>
                <div className="relative p-4 bg-green-500/10 border border-green-500/40 rounded-xl">
                  <Gift className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-green-400 flex items-center gap-2">
                  Pending Rewards
                  <Sparkles className="w-5 h-5 text-green-400/60" />
                </h2>
                <p className="text-sm text-gray-400">
                  From protocol fees • Pool: {protocolStats.rewardPool.toLocaleString()} ARK
                </p>
              </div>
            </div>
            
            {/* Claim Button */}
            <div className="relative group/btn">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition-opacity"></div>
              <button
                disabled={!isConnected || displayRewards === 0 || claimingRewards}
                onClick={handleClaimRewards}
                className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full md:w-auto justify-center"
              >
                {claimingRewards ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Claiming...
                  </>
                ) : (
                  <>
                    <Coins className="w-5 h-5" />
                    Claim Rewards
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Reward Amount */}
          <div className="relative z-10 flex items-center gap-4 mt-6">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {displayRewards.toLocaleString()} ARK
            </div>
            {!isConnected && (
              <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg px-3 py-1.5">
                <span className="text-xs text-orange-300 font-bold tracking-wider">DEMO</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsSection;
