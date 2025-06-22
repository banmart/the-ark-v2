import React from 'react';
// Note: Replace with your routing solution
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);
import { Sparkles, Lock, TrendingUp, Users, Gift } from "lucide-react";

interface LockerTiersSectionProps {
  contractData: any;
  contractLoading: boolean;
}

const LockerTiersSection = ({ contractData, contractLoading }: LockerTiersSectionProps) => {
  const tiers = [
    {
      name: 'BRONZE',
      icon: '⛵',
      color: 'yellow-600',
      accent: 'yellow-400',
      duration: '30-89 Days',
      multiplier: '1x',
      features: ['Entry level blessing', 'Share in vault rewards', 'Bronze role in community', 'Protected from the flood'],
      gradient: 'from-yellow-600/10 via-yellow-700/5 to-transparent',
      border: 'border-yellow-600/30',
      buttonGradient: 'from-yellow-600 to-yellow-500',
      glowColor: 'yellow-600/20'
    },
    {
      name: 'SILVER',
      icon: '🛡️',
      color: 'gray-400',
      accent: 'gray-300',
      duration: '90-179 Days',
      multiplier: '1.5x',
      features: ['1.5x rewards multiplier', 'Enhanced vault share', 'Silver role & privileges', 'Priority support'],
      gradient: 'from-gray-400/10 via-gray-500/5 to-transparent',
      border: 'border-gray-400/30',
      buttonGradient: 'from-gray-400 to-gray-300',
      glowColor: 'gray-400/20'
    },
    {
      name: 'GOLD',
      icon: '👑',
      color: 'yellow-400',
      accent: 'yellow-300',
      duration: '180-364 Days',
      multiplier: '2x',
      features: ['2x rewards multiplier', 'Gold tier benefits', 'Governance participation', 'Exclusive features access'],
      gradient: 'from-yellow-400/10 via-yellow-500/5 to-transparent',
      border: 'border-yellow-400/30',
      buttonGradient: 'from-yellow-400 to-yellow-300',
      glowColor: 'yellow-400/20'
    },
    {
      name: 'DIAMOND',
      icon: '💎',
      color: 'cyan-400',
      accent: 'cyan-300',
      duration: '1-3 Years',
      multiplier: '3x',
      features: ['3x rewards multiplier', 'Diamond hand status', 'VIP community access', 'Special event invites'],
      gradient: 'from-cyan-400/10 via-cyan-500/5 to-transparent',
      border: 'border-cyan-400/30',
      buttonGradient: 'from-cyan-400 to-cyan-300',
      glowColor: 'cyan-400/20'
    },
    {
      name: 'PLATINUM',
      icon: '⭐',
      color: 'purple-400',
      accent: 'purple-300',
      duration: '3-4 Years',
      multiplier: '5x',
      features: ['5x rewards multiplier', 'Platinum elite status', 'Development influence', 'Maximum benefits tier'],
      gradient: 'from-purple-400/10 via-purple-500/5 to-transparent',
      border: 'border-purple-400/30',
      buttonGradient: 'from-purple-400 to-purple-300',
      glowColor: 'purple-400/20'
    },
    {
      name: 'LEGENDARY',
      icon: '⚡',
      color: 'orange-400',
      accent: 'red-400',
      duration: '4-5 Years',
      multiplier: '8x',
      features: ['8x rewards multiplier', 'Legendary ARK status', 'Ultimate vault rewards', 'True Noah privileges', 'Lead the new world'],
      gradient: 'from-orange-500/10 via-red-500/5 to-transparent',
      border: 'border-orange-500/50',
      buttonGradient: 'from-orange-500 to-red-500',
      glowColor: 'orange-500/30',
      special: true
    }
  ];

  const TierCard = ({ tier }) => (
    <div className={`bg-gradient-to-br ${tier.gradient} border-2 ${tier.border} rounded-xl p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300 ${tier.special ? 'shadow-2xl shadow-orange-500/20' : ''}`}>
      {tier.special && (
        <div className="absolute top-2 right-2 bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          LEGENDARY
        </div>
      )}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-${tier.glowColor} to-transparent blur-2xl`}></div>
      
      <div className="relative z-10">
        <div className={`text-4xl text-center mb-4 ${tier.special ? 'animate-pulse' : ''}`}>
          {tier.icon}
        </div>
        <h4 className={`text-xl font-bold text-${tier.color} text-center mb-4`}>
          {tier.name}
        </h4>
        
        <div className="text-center mb-6">
          <div className={`text-lg font-semibold text-${tier.color} mb-2`}>
            {tier.duration}
          </div>
          <div className={`text-3xl font-black ${tier.special ? `bg-gradient-to-r from-${tier.color} to-${tier.accent} bg-clip-text text-transparent` : `text-${tier.accent}`} my-2`}>
            {tier.multiplier} Multiplier
          </div>
        </div>
        
        <ul className="space-y-2 text-sm text-gray-300 mb-6">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <Link 
          to="/locker" 
          className={`block w-full bg-gradient-to-r ${tier.buttonGradient} text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform relative z-10 ${tier.special ? 'shadow-lg shadow-orange-500/30' : ''}`}
        >
          {tier.special ? 'Become Legendary' : `${tier.name === 'BRONZE' ? 'Enter' : 'Ascend to'} ${tier.name.charAt(0) + tier.name.slice(1).toLowerCase()}`}
        </Link>
      </div>
    </div>
  );

  return (
    <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            <Lock className="inline w-10 h-10 mr-3 text-cyan-400" />
            The Sacred Locker Tiers
            <Lock className="inline w-10 h-10 ml-3 text-cyan-400" />
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Lock your ARK tokens and ascend through divine tiers. The longer you lock, the greater your blessings.
            <br />
            <span className="inline-flex items-center mt-2 text-cyan-400">
              <TrendingUp className="w-5 h-5 mr-2" />
              {contractLoading ? (
                <span className="animate-pulse">Loading rewards...</span>
              ) : (
                `${contractData.currentFees.locker}% of every transaction flows to the vault, rewarding the faithful.`
              )}
            </span>
          </p>
        </div>
        
        {/* Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 relative z-10">
          {tiers.map((tier, index) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
          <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center mb-4">
              <Gift className="w-6 h-6 text-cyan-400 mr-3" />
              <h4 className="text-lg font-bold text-cyan-400">Pending Locker Rewards</h4>
            </div>
            <p className="text-3xl font-black text-green-400 mb-2">
              {contractLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${contractData.lockerRewards.pending} ARK`
              )}
            </p>
            <p className="text-sm text-gray-400">Ready for distribution</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-blue-400 mr-3" />
              <h4 className="text-lg font-bold text-blue-400">Total Distributed</h4>
            </div>
            <p className="text-3xl font-black text-blue-400 mb-2">
              {contractLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${contractData.lockerRewards.distributed} ARK`
              )}
            </p>
            <p className="text-sm text-gray-400">All-time rewards paid</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center relative z-10">
          <Link 
            to="/locker" 
            className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-12 py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30 relative z-10"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Enter The Sacred Locker
            <Lock className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LockerTiersSection;