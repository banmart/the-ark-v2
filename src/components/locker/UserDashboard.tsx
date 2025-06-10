
import React from 'react';

interface LockPosition {
  id: number;
  amount: number;
  lockTime: number;
  unlockTime: number;
  tier: string;
  active: boolean;
  totalRewards: number;
}

interface UserDashboardProps {
  isConnected: boolean;
  pendingRewards: number;
  userLocks: LockPosition[];
  calculatePenalty: (lockTime: number, unlockTime: number, amount: number) => { penalty: number; userReceives: number };
}

const UserDashboard = ({ isConnected, pendingRewards, userLocks, calculatePenalty }: UserDashboardProps) => {
  return (
    <div className="space-y-8">
      {/* Pending Rewards */}
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Pending Rewards</h2>
          <button
            disabled={!isConnected || pendingRewards === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            Claim
          </button>
        </div>
        <div className="text-3xl font-black text-green-400">
          {isConnected ? `${pendingRewards.toLocaleString()} ARK` : 'Connect wallet'}
        </div>
      </div>

      {/* Active Locks */}
      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">Your Active Locks</h2>
        
        {!isConnected ? (
          <div className="text-center py-8 text-gray-400">
            Connect your wallet to view your locks
          </div>
        ) : userLocks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No active locks found. Lock some tokens to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {userLocks.map((lock) => {
              const now = Date.now() / 1000;
              const isUnlocked = now >= lock.unlockTime;
              const penalty = calculatePenalty(lock.lockTime, lock.unlockTime, lock.amount);
              
              return (
                <div key={lock.id} className="bg-black/30 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-lg font-bold text-white">
                        {lock.amount.toLocaleString()} ARK
                      </div>
                      <div className="text-sm text-cyan-400 font-medium">
                        {lock.tier} Tier
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {isUnlocked ? 'Ready to unlock' : `${Math.ceil((lock.unlockTime - now) / 86400)} days left`}
                      </div>
                      <div className="text-sm text-green-400">
                        +{lock.totalRewards.toLocaleString()} ARK earned
                      </div>
                    </div>
                  </div>
                  
                  {!isUnlocked && penalty.penalty > 0 && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded p-2 mb-3">
                      <div className="text-xs text-red-400">
                        Early unlock penalty: {penalty.penalty.toFixed(2)} ARK
                      </div>
                      <div className="text-xs text-gray-400">
                        You would receive: {penalty.userReceives.toFixed(2)} ARK
                      </div>
                    </div>
                  )}
                  
                  <button
                    className={`w-full py-2 rounded font-bold text-sm transition-transform hover:scale-105 ${
                      isUnlocked 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-black' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }`}
                  >
                    {isUnlocked ? 'Unlock Tokens' : 'Early Unlock (Penalty)'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
