import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Lock, TrendingUp, Users, Gift, Database, Activity, Shield, Zap } from "lucide-react";
interface LockerTiersSectionProps {
  contractData: any;
  contractLoading: boolean;
}
const LockerTiersSection = ({
  contractData,
  contractLoading
}: LockerTiersSectionProps) => {
  const [systemPhase, setSystemPhase] = useState(0);
  const [activeTier, setActiveTier] = useState(0);
  useEffect(() => {
    // System initialization sequence
    const phases = [{
      delay: 300,
      phase: 1
    },
    // System scan
    {
      delay: 1000,
      phase: 2
    },
    // Tiers detected
    {
      delay: 1800,
      phase: 3
    } // Full activation
    ];
    phases.forEach(({
      delay,
      phase
    }) => {
      setTimeout(() => setSystemPhase(phase), delay);
    });

    // Rotating tier highlight
    const interval = setInterval(() => {
      setActiveTier(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const tiers = [{
    name: 'BRONZE',
    icon: '⛵',
    color: 'yellow-600',
    accent: 'yellow-400',
    duration: '30-89 Days',
    multiplier: '1x',
    features: ['Entry level blessing', 'Share in vault rewards', 'Bronze role in community', 'Protected from the flood'],
    gradient: 'from-yellow-600/20 via-yellow-700/10 to-transparent',
    border: 'border-yellow-600/40',
    buttonGradient: 'from-yellow-600 to-yellow-500',
    glowColor: 'yellow-600/30',
    status: 'ENTRY_LEVEL'
  }, {
    name: 'SILVER',
    icon: '🛡️',
    color: 'gray-400',
    accent: 'gray-300',
    duration: '90-179 Days',
    multiplier: '1.5x',
    features: ['1.5x rewards multiplier', 'Enhanced vault share', 'Silver role & privileges', 'Priority support'],
    gradient: 'from-gray-400/20 via-gray-500/10 to-transparent',
    border: 'border-gray-400/40',
    buttonGradient: 'from-gray-400 to-gray-300',
    glowColor: 'gray-400/30',
    status: 'ENHANCED'
  }, {
    name: 'GOLD',
    icon: '👑',
    color: 'yellow-400',
    accent: 'yellow-300',
    duration: '180-364 Days',
    multiplier: '2x',
    features: ['2x rewards multiplier', 'Gold tier benefits', 'Governance participation', 'Exclusive features access'],
    gradient: 'from-yellow-400/20 via-yellow-500/10 to-transparent',
    border: 'border-yellow-400/40',
    buttonGradient: 'from-yellow-400 to-yellow-300',
    glowColor: 'yellow-400/30',
    status: 'PRIVILEGED'
  }, {
    name: 'DIAMOND',
    icon: '💎',
    color: 'cyan-400',
    accent: 'cyan-300',
    duration: '1-3 Years',
    multiplier: '3x',
    features: ['3x rewards multiplier', 'Diamond hand status', 'VIP community access', 'Special event invites'],
    gradient: 'from-cyan-400/20 via-cyan-500/10 to-transparent',
    border: 'border-cyan-400/40',
    buttonGradient: 'from-cyan-400 to-cyan-300',
    glowColor: 'cyan-400/30',
    status: 'VIP_ACCESS'
  }, {
    name: 'PLATINUM',
    icon: '⭐',
    color: 'purple-400',
    accent: 'purple-300',
    duration: '3-4 Years',
    multiplier: '5x',
    features: ['5x rewards multiplier', 'Platinum elite status', 'Development influence', 'Maximum benefits tier'],
    gradient: 'from-purple-400/20 via-purple-500/10 to-transparent',
    border: 'border-purple-400/40',
    buttonGradient: 'from-purple-400 to-purple-300',
    glowColor: 'purple-400/30',
    status: 'ELITE_TIER'
  }, {
    name: 'LEGENDARY',
    icon: '⚡',
    color: 'orange-400',
    accent: 'red-400',
    duration: '4-5 Years',
    multiplier: '8x',
    features: ['8x rewards multiplier', 'Legendary ARK status', 'Ultimate vault rewards', 'True Noah privileges', 'Lead the new world'],
    gradient: 'from-orange-500/20 via-red-500/10 to-transparent',
    border: 'border-orange-500/60',
    buttonGradient: 'from-orange-500 to-red-500',
    glowColor: 'orange-500/40',
    special: true,
    status: 'LEGENDARY'
  }];
  const TierCard = ({
    tier,
    index
  }) => {
    const isActive = activeTier === index;
    return <div className={`relative bg-black/40 backdrop-blur-xl border-2 ${tier.border} rounded-xl p-6 hover:scale-105 transition-all duration-300 group overflow-hidden ${tier.special ? 'shadow-2xl shadow-orange-500/30' : ''} ${isActive ? `shadow-lg shadow-${tier.color}/20` : ''}`}>
        
        {/* System Status Indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <div className={`w-2 h-2 bg-${tier.color} rounded-full animate-pulse`}></div>
          <span className={`text-${tier.color} font-mono text-xs`}>
            {tier.status}
          </span>
        </div>

        {/* Special Badge for Legendary */}
        {tier.special && <div className="absolute top-2 left-2 bg-orange-500/20 backdrop-blur border border-orange-500/40 text-orange-400 px-2 py-1 rounded text-xs font-mono animate-pulse">
            [LEGENDARY]
          </div>}

        {/* Quantum Field Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} rounded-xl`}></div>
        
        {/* Active Tier Pulse */}
        {isActive && <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-30 animate-pulse rounded-xl`}></div>}

        <div className="relative z-10">
          {/* Tier Icon */}
          <div className="text-center mb-4">
            <div className={`text-4xl mb-2 ${tier.special ? 'animate-pulse' : ''} ${isActive ? 'animate-bounce' : ''}`}>
              {tier.icon}
            </div>
          </div>

          {/* Tier Title */}
          <h4 className={`text-xl font-bold text-${tier.color} text-center mb-2 font-mono`}>
            [{tier.name}]
          </h4>
          
          <div className="text-center mb-6">
            <div className={`text-sm font-mono text-${tier.color}/80 mb-2`}>
              LOCK_PERIOD: {tier.duration}
            </div>
            <div className={`text-3xl font-black ${tier.special ? `bg-gradient-to-r from-${tier.color} to-${tier.accent} bg-clip-text text-transparent` : `text-${tier.accent}`} font-mono`}>
              {tier.multiplier}
            </div>
            <div className="text-xs text-gray-400 font-mono">
              REWARD MULTIPLIER
            </div>
          </div>
          
          {/* Features List */}
          <ul className="space-y-2 text-sm text-gray-300 mb-6">
            {tier.features.map((feature, index) => <li key={index} className="flex items-center font-mono text-xs">
                <span className="text-green-400 mr-2 font-mono">&gt;</span>
                {feature}
              </li>)}
          </ul>
          
          {/* Action Button */}
          <Link to="/locker" className={`block w-full bg-gradient-to-r ${tier.buttonGradient} text-black font-bold py-3 rounded-lg text-center hover:scale-105 transition-transform relative z-10 font-mono text-sm ${tier.special ? 'shadow-lg shadow-orange-500/30' : ''}`}>
            {tier.special ? '[ASCEND TO LEGEND]' : `[ENTER_${tier.name}]`}
          </Link>
        </div>

        {/* Scan Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tier.buttonGradient} animate-[scan_2s_ease-in-out_infinite]`}></div>
        </div>
      </div>;
  };
  return <section className="relative z-30 py-20 px-6 bg-gradient-to-b from-black/10 via-cyan-500/5 to-black/20">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-5">
        
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* System Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${systemPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-cyan-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
              [LOCKER_TIERS]
            </h2>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto font-mono">
            Advanced tier system with multiplied rewards and exclusive benefits
          </p>
        </div>

        {/* Tiers Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-500 ${systemPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {tiers.map((tier, index) => (
            <div key={tier.name} className={`transition-all duration-1000 ${systemPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 200}ms` }}>
              <TierCard 
                tier={tier}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* System Status */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${systemPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-cyan-400" />
              <span className="text-cyan-400 font-mono text-lg font-bold">TIER SYSTEM: OPERATIONAL</span>
            </div>
            <p className="text-gray-300 font-mono text-sm">
              All tier protocols active. Lock your ARK tokens to access exclusive benefits and multiplied rewards.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </section>;
};
export default LockerTiersSection;