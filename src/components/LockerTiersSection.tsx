import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from "lucide-react";

interface LockerTiersSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const LockerTiersSection = ({ contractData, contractLoading }: LockerTiersSectionProps) => {
  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          🔒 The Sacred Locker Tiers 🔒
        </h2>
        <p className="text-xl text-gray-300 text-center max-w-4xl mx-auto mb-16">
          Lock your ARK tokens and ascend through divine tiers. The longer you lock, the greater your blessings. 
          {contractLoading ? <span className="animate-pulse">Loading rewards...</span> : `${contractData.currentFees.locker}% of every transaction flows to the vault, rewarding the faithful.`}
        </p>
        
        {/* 6-tier system */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 relative z-10">
          {/* Bronze Tier */}
          <div className="bg-gradient-to-br from-yellow-600/10 via-yellow-700/5 to-transparent border-2 border-yellow-600/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-yellow-600/20 to-transparent blur-2xl"></div>
            <div className="relative z-10">
              <div className="text-4xl text-center mb-4">⛵</div>
              <h4 className="text-xl font-bold text-yellow-600 text-center mb-4">BRONZE</h4>
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-yellow-600">30-89 Days</div>
                <div className="text-3xl font-black text-yellow-400 my-2">1x Multiplier</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ Entry level blessing</li>
                <li>✓ Share in vault rewards</li>
                <li>✓ Bronze role in community</li>
                <li>✓ Protected from the flood</li>
              </ul>
              <Link to="/locker" className="block w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform relative z-10">
                Enter Bronze Tier
              </Link>
            </div>
          </div>

          {/* Silver Tier */}
          <div className="bg-gradient-to-br from-gray-400/10 via-gray-500/5 to-transparent border-2 border-gray-400/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-gray-400/20 to-transparent blur-2xl"></div>
            <div className="relative z-10">
              <div className="text-4xl text-center mb-4">🛡️</div>
              <h4 className="text-xl font-bold text-gray-400 text-center mb-4">SILVER</h4>
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-gray-400">90-179 Days</div>
                <div className="text-3xl font-black text-gray-300 my-2">1.5x Multiplier</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ 1.5x rewards multiplier</li>
                <li>✓ Enhanced vault share</li>
                <li>✓ Silver role & privileges</li>
                <li>✓ Priority support</li>
              </ul>
              <Link to="/locker" className="block w-full bg-gradient-to-r from-gray-400 to-gray-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform relative z-10">
                Ascend to Silver
              </Link>
            </div>
          </div>

          {/* Gold Tier */}
          <div className="bg-gradient-to-br from-yellow-400/10 via-yellow-500/5 to-transparent border-2 border-yellow-400/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-yellow-400/20 to-transparent blur-2xl"></div>
            <div className="relative z-10">
              <div className="text-4xl text-center mb-4">👑</div>
              <h4 className="text-xl font-bold text-yellow-400 text-center mb-4">GOLD</h4>
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-yellow-400">180-364 Days</div>
                <div className="text-3xl font-black text-yellow-300 my-2">2x Multiplier</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ 2x rewards multiplier</li>
                <li>✓ Gold tier benefits</li>
                <li>✓ Governance participation</li>
                <li>✓ Exclusive features access</li>
              </ul>
              <Link to="/locker" className="block w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform relative z-10">
                Claim Gold Status
              </Link>
            </div>
          </div>

          {/* Diamond Tier */}
          <div className="bg-gradient-to-br from-cyan-400/10 via-cyan-500/5 to-transparent border-2 border-cyan-400/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-cyan-400/20 to-transparent blur-2xl"></div>
            <div className="relative z-10">
              <div className="text-4xl text-center mb-4">💎</div>
              <h4 className="text-xl font-bold text-cyan-400 text-center mb-4">DIAMOND</h4>
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-cyan-400">1-3 Years</div>
                <div className="text-3xl font-black text-cyan-300 my-2">3x Multiplier</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ 3x rewards multiplier</li>
                <li>✓ Diamond hand status</li>
                <li>✓ VIP community access</li>
                <li>✓ Special event invites</li>
              </ul>
              <Link to="/locker" className="block w-full bg-gradient-to-r from-cyan-400 to-cyan-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform relative z-10">
                Achieve Diamond
              </Link>
            </div>
          </div>

          {/* Platinum Tier */}
          <div className="bg-gradient-to-br from-purple-400/10 via-purple-500/5 to-transparent border-2 border-purple-400/30 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent blur-2xl"></div>
            <div className="relative z-10">
              <div className="text-4xl text-center mb-4">⭐</div>
              <h4 className="text-xl font-bold text-purple-400 text-center mb-4">PLATINUM</h4>
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-purple-400">3-4 Years</div>
                <div className="text-3xl font-black text-purple-300 my-2">5x Multiplier</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ 5x rewards multiplier</li>
                <li>✓ Platinum elite status</li>
                <li>✓ Development influence</li>
                <li>✓ Maximum benefits tier</li>
              </ul>
              <Link to="/locker" className="block w-full bg-gradient-to-r from-purple-400 to-purple-300 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform relative z-10">
                Reach Platinum
              </Link>
            </div>
          </div>

          {/* Legendary Tier */}
          <div className="bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border-2 border-orange-500/50 rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform shadow-2xl shadow-orange-500/20">
            <div className="absolute top-2 right-2 bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">LEGENDARY</div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-orange-500/30 to-transparent blur-2xl"></div>
            <div className="relative z-10">
              <div className="text-4xl text-center mb-4 animate-pulse">⚡</div>
              <h4 className="text-xl font-bold text-orange-400 text-center mb-4">LEGENDARY</h4>
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-orange-400">4-5 Years</div>
                <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent my-2">8x Multiplier</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ 8x rewards multiplier</li>
                <li>✓ Legendary ARK status</li>
                <li>✓ Ultimate vault rewards</li>
                <li>✓ True Noah privileges</li>
                <li>✓ Lead the new world</li>
              </ul>
              <Link to="/locker" className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform shadow-lg shadow-orange-500/30 relative z-10">
                Become Legendary
              </Link>
            </div>
          </div>
        </div>

        {/* Locker Rewards Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
          <div className="glass-card rounded-xl p-6 hover:glass-strong transition-all">
            <h4 className="text-lg font-bold text-cyan-400 mb-4">💰 Pending Locker Rewards</h4>
            <p className="text-2xl font-black text-green-400">
              {contractLoading ? <span className="animate-pulse">Loading...</span> : `${contractData.lockerRewards.pending} ARK`}
            </p>
            <p className="text-sm text-gray-400 mt-2">Ready for distribution</p>
          </div>
          <div className="glass-card rounded-xl p-6 hover:glass-strong transition-all">
            <h4 className="text-lg font-bold text-cyan-400 mb-4">🎁 Total Distributed</h4>
            <p className="text-2xl font-black text-blue-400">
              {contractLoading ? <span className="animate-pulse">Loading...</span> : `${contractData.lockerRewards.distributed} ARK`}
            </p>
            <p className="text-sm text-gray-400 mt-2">All-time rewards paid</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center relative z-10">
          <Link to="/locker" className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-12 py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30 relative z-10">
            <Sparkles className="inline w-5 h-5 mr-2" />
            Enter The Sacred Locker
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LockerTiersSection;
