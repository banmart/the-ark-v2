import React, { useState } from 'react';
import { 
  Wallet, 
  Coins,
  Gift
} from 'lucide-react';
import { useLockerData } from '../../hooks/useLockerData';
import { useLockerContractData } from '../../hooks/useLockerContractData';
import { useWalletContext } from '../providers/WalletProvider';
import { formatPoolSharePercentage, formatTokenPoolShare } from '../../lib/utils';
import { toast } from "@/components/ui/use-toast";

interface UserStatsSectionProps {
  isConnected: boolean;
}

const UserStatsSection = ({ isConnected }: UserStatsSectionProps) => {
  const { userStats, claimRewards, userLocks } = useLockerData();
  const { protocolStats, totalProtocolWeight } = useLockerContractData();
  const { arkBalance } = useWalletContext();
  const [claimingRewards, setClaimingRewards] = useState(false);

  // Mock data for demonstration when not connected
  const displayStats = isConnected ? userStats : {
    totalLocked: 150000,
    totalRewardsEarned: 23500,
    pendingRewards: 12847,
    activeLocksCount: 2,
    userWeight: 85000
  };

  const displayRewards = isConnected ? userStats.pendingRewards : 12847;
  const displayArkBalance = isConnected ? parseFloat(arkBalance) : 250000;

  // Calculate average lock period from user's active locks
  const calculateAverageLockPeriod = () => {
    if (!isConnected || !userLocks || userLocks.length === 0) {
      return "90 days"; // Mock data for demo
    }
    
    const activeLocks = userLocks.filter(lock => lock.active);
    if (activeLocks.length === 0) return "0 days";
    
    const totalWeightedDuration = activeLocks.reduce((sum, lock) => {
      return sum + (lock.lockPeriod * lock.amount);
    }, 0);
    
    const totalAmount = activeLocks.reduce((sum, lock) => sum + lock.amount, 0);
    const averageDays = totalAmount > 0 ? Math.round(totalWeightedDuration / totalAmount) : 0;
    
    if (averageDays >= 365) {
      return `${Math.round(averageDays / 365)} years`;
    } else if (averageDays >= 30) {
      return `${Math.round(averageDays / 30)} months`;
    } else {
      return `${averageDays} days`;
    }
  };

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

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-orange-400 mr-3" />
            <h3 className="text-xl font-bold text-orange-400">Demo Mode</h3>
          </div>
          <p className="text-center text-gray-300 mb-4">
            Connect your wallet to view your actual positions and claim real rewards
          </p>
        </div>
      )}

      {/* Enhanced Stats Overview - 6 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {/* System Total */}
        <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">System Total</div>
            <div className="text-xl font-bold text-blue-300">
              {protocolStats.totalLockedTokens.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">ARK</div>
          </div>
        </div>

        {/* Total ARK Tokens */}
        <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-all duration-300">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Total ARK Tokens</div>
            <div className="text-xl font-bold text-orange-300">
              {displayArkBalance.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">In Wallet</div>
          </div>
        </div>

        {/* Your Locked */}
        <div className="bg-black/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Your Locked</div>
            <div className="text-xl font-bold text-green-300">
              {displayStats.totalLocked.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">ARK</div>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-black/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-300">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Total Earned</div>
            <div className="text-xl font-bold text-yellow-300">
              {displayStats.totalRewardsEarned.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">ARK</div>
          </div>
        </div>

        {/* Pool Share */}
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Pool Share</div>
            <div className="text-lg font-bold text-purple-300">
              {protocolStats?.totalLockedTokens ? formatTokenPoolShare(displayStats.totalLocked, protocolStats.totalLockedTokens) : '0.00%'}
            </div>
            <div className="text-xs text-gray-500">
              Weight: {totalProtocolWeight > 0 ? formatPoolSharePercentage(displayStats.userWeight, totalProtocolWeight) : '0.00%'}
            </div>
          </div>
        </div>

        {/* Average Lock Period */}
        <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Average Lock</div>
            <div className="text-xl font-bold text-cyan-300">
              {calculateAverageLockPeriod()}
            </div>
            <div className="text-xs text-gray-500">Period</div>
          </div>
        </div>
      </div>

      {/* Enhanced Rewards Section */}
      <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-2 border-green-500/30 rounded-xl p-8 shadow-2xl shadow-green-500/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-green-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-green-400">Pending Rewards</h2>
              <p className="text-sm text-gray-400">
                From protocol fees • Pool: {protocolStats.rewardPool.toLocaleString()} ARK
              </p>
            </div>
          </div>
          <button
            disabled={!isConnected || displayRewards === 0 || claimingRewards}
            onClick={handleClaimRewards}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center gap-2"
          >
            {claimingRewards ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
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
        
        <div className="flex items-center">
          <div className="text-4xl font-black text-green-400 mr-4">
            {displayRewards.toLocaleString()} ARK
          </div>
          {!isConnected && (
            <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg px-3 py-1">
              <span className="text-xs text-orange-300 font-medium">DEMO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStatsSection;