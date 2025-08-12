import React, { useState, useEffect } from 'react';
import { Zap, Flame, Users, Droplets, Lock, Layers } from 'lucide-react';
import '../styles/tokenomics-animations.css';

const TokenomicsVideoSections = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 7);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const sections = [
    {
      id: 'ark-vault',
      title: 'The Ark Vault',
      subtitle: 'Crystalline Foundation',
      description: 'The Ark serves as the central vault for all tokenomics operations. Built with mathematical precision, this crystalline structure contains the core mechanisms that power the entire ecosystem through automated smart contract interactions.',
      icon: <Layers className="w-8 h-8" />,
      color: 'from-cyan-400 to-blue-600',
      features: [
        'Crystalline vault architecture',
        'Mathematical tokenomics patterns',
        'Immutable smart contract foundation',
        'Automated mechanism orchestration'
      ]
    },
    {
      id: 'fee-distribution',
      title: 'Fee Distribution Matrix',
      subtitle: '9% Total Fee Structure',
      description: 'Every transaction triggers a sophisticated distribution mechanism. Four distinct energy streams flow from The Ark, each serving a specific purpose: burn (3%), reflections (2%), liquidity (2%), and locker rewards (2%).',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-purple-400 to-pink-600',
      features: [
        'Burn mechanism: 3% to void',
        'Holder reflections: 2% distributed',
        'Auto-liquidity: 2% for LP creation',
        'Locker rewards: 2% for stakers'
      ]
    },
    {
      id: 'burn-mechanism',
      title: 'Deflationary Engine',
      subtitle: '3% Permanent Destruction',
      description: 'Golden tokens materialize and ignite in controlled flames, sending them forever to the void address. This deflationary mechanism ensures a continuously decreasing supply, creating scarcity and potential value appreciation.',
      icon: <Flame className="w-8 h-8" />,
      color: 'from-red-400 to-orange-600',
      features: [
        'Permanent token destruction',
        'Deflationary supply mechanics',
        'Automatic burn on every transfer',
        'Immutable void address destination'
      ]
    },
    {
      id: 'reflection-rewards',
      title: 'Reflection Network',
      subtitle: '2% Holder Rewards',
      description: 'A network of interconnected wallet nodes receives proportional rewards through prismatic light networks. The more tokens you hold, the larger your share of the automatic reflection rewards distributed to all holders.',
      icon: <Users className="w-8 h-8" />,
      color: 'from-yellow-400 to-amber-600',
      features: [
        'Automatic reward distribution',
        'Proportional to holdings',
        'No staking required',
        'Compound growth potential'
      ]
    },
    {
      id: 'liquidity-operations',
      title: 'Liquidity Automation',
      subtitle: 'Automated LP Management',
      description: 'Blue particle streams flow into sophisticated liquidity pools, automatically swapping tokens for PLS and creating LP tokens. Half of these LP tokens are immediately burned, while the remainder strengthens the liquidity foundation.',
      icon: <Droplets className="w-8 h-8" />,
      color: 'from-blue-400 to-cyan-600',
      features: [
        'Automated token-to-PLS swaps',
        'LP token generation',
        '50% LP token burning',
        'PulseX DEX integration'
      ]
    },
    {
      id: 'locker-vault',
      title: 'Sacred Locker Vault',
      subtitle: '2% Staker Rewards',
      description: 'Purple geometric particles flow into a secure crystalline vault structure, accumulating rewards with mechanical precision. These rewards queue and organize within the vault\'s chambers until manual distribution to committed stakers.',
      icon: <Lock className="w-8 h-8" />,
      color: 'from-purple-400 to-violet-600',
      features: [
        'Secure reward accumulation',
        'Manual distribution control',
        'Enhanced staker benefits',
        'Long-term commitment rewards'
      ]
    },
    {
      id: 'ecosystem-harmony',
      title: 'Ecosystem Synchronization',
      subtitle: 'Perfect Balance',
      description: 'All tokenomics mechanisms operate in perfect synchronization - burn flames, reflection networks, liquidity pools, and locker vaults work together creating a self-sustaining DeFi ecosystem with harmonious balance.',
      icon: <Layers className="w-8 h-8" />,
      color: 'from-emerald-400 to-teal-600',
      features: [
        'Complete ecosystem integration',
        'Self-sustaining mechanisms',
        'Harmonious balance',
        'Continuous optimization'
      ]
    }
  ];

  return (
    <div className="relative z-10">
      {sections.map((section, index) => (
        <section
          key={section.id}
          className="relative py-20 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-5`}></div>
          </div>

          {/* Quantum Field Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 0 ? '' : 'lg:flex-row-reverse'
            }`}>
              
              {/* Content Column */}
              <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                {/* System Header */}
                <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>[TOKENOMICS_MODULE_{(index + 1).toString().padStart(2, '0')}]</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold michroma-regular bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {section.title}
                  </h2>
                  
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${section.color} bg-opacity-10 border border-current/20 rounded-lg`}>
                    <span className="font-mono text-sm font-bold">{section.subtitle}</span>
                  </div>

                  <p className="text-gray-300 leading-relaxed text-lg">
                    {section.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3">
                    {section.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${section.color} rounded-full`}></div>
                        <span className="text-gray-400 font-mono text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Column */}
              <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} relative`}>
                <div className="relative aspect-square max-w-lg mx-auto">
                  {/* Main Visual Container */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-20 rounded-3xl blur-3xl transform ${
                    activeSection === index ? 'scale-110' : 'scale-100'
                  } transition-transform duration-2000`}></div>
                  
                  <div className="relative z-10 h-full bg-black/30 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 flex items-center justify-center">
                    {/* Central Icon */}
                    <div className={`relative p-8 bg-gradient-to-br ${section.color} bg-opacity-10 rounded-2xl border border-current/30 ${
                      activeSection === index ? 'animate-pulse' : ''
                    }`}>
                      <div className={`text-white transform ${
                        activeSection === index ? 'scale-110' : 'scale-100'
                      } transition-transform duration-1000`}>
                        {section.icon}
                      </div>
                      
                      {/* Scan Effect */}
                      {activeSection === index && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-scan"></div>
                      )}
                    </div>

                    {/* Floating Particles */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 bg-gradient-to-r ${section.color} rounded-full opacity-60 animate-float`}
                        style={{
                          top: `${20 + i * 10}%`,
                          left: `${15 + i * 12}%`,
                          animationDelay: `${i * 0.5}s`,
                          animationDuration: `${3 + i * 0.5}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Separator */}
          {index < sections.length - 1 && (
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          )}
        </section>
      ))}

    </div>
  );
};

export default TokenomicsVideoSections;