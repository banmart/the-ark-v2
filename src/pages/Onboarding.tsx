import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, DollarSign, Lock, Gift, ExternalLink, Wallet, CheckCircle, Circle, ArrowDown, Sparkles, Shield, Coins, ArrowLeftRight, TrendingUp } from 'lucide-react';

const OptimizedOnboarding = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Optimized data structure with better organization
  const onboardingSteps = [
    {
      id: 'wallet',
      title: 'Setup Wallet',
      subtitle: 'Your gateway to DeFi',
      icon: Wallet,
      color: 'from-purple-500 to-violet-600',
      description: 'Install and configure your crypto wallet to access the ARK ecosystem',
      services: [
        {
          name: 'MetaMask',
          description: 'Most popular crypto wallet',
          icon: Wallet,
          url: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
          isPrimary: true
        }
      ],
      estimatedTime: '2-3 min'
    },
    {
      id: 'fund',
      title: 'Fund Account',
      subtitle: 'Add money to your wallet',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      description: 'Purchase cryptocurrency using your preferred payment method',
      services: [
        {
          name: '0xCoast',
          description: 'Buy crypto with credit card',
          icon: DollarSign,
          url: 'https://0xcoast.com',
          isPrimary: true
        },
        {
          name: 'RampNow',
          description: 'Fast fiat on-ramp service',
          icon: Zap,
          url: 'https://app.rampnow.io/',
          isPrimary: false
        },
        {
          name: 'Coinbase',
          description: 'Leading crypto exchange',
          icon: TrendingUp,
          url: 'https://www.coinbase.com/',
          isPrimary: false
        }
      ],
      estimatedTime: '5-10 min'
    },
    {
      id: 'bridge',
      title: 'Bridge Assets',
      subtitle: 'Move to PulseChain',
      icon: ArrowLeftRight,
      color: 'from-blue-500 to-cyan-600',
      description: 'Transfer your assets to PulseChain network for ARK access',
      services: [
        {
          name: 'ChangeNow',
          description: 'Exchange crypto instantly',
          icon: ArrowRight,
          url: 'https://changenow.app.link/referral?link_id=e49c221824244a',
          isPrimary: true
        },
        {
          name: 'Liberty Swap',
          description: 'Decentralized exchange',
          icon: ArrowRight,
          url: 'https://libertyswap.finance/',
          isPrimary: false
        }
      ],
      actions: [
        {
          name: 'Official Bridge',
          description: 'Use the official PulseChain bridge',
          url: 'https://bridge.mypinata.cloud/ipfs/bafybeif242ld54nzjg2aqxvfse23wpbkqbyqasj3usgslccuajnykonzo4/#/bridge',
          icon: ArrowLeftRight
        }
      ],
      estimatedTime: '3-5 min'
    },
    {
      id: 'acquire',
      title: 'Get ARK Tokens',
      subtitle: 'Purchase your ARK',
      icon: Coins,
      color: 'from-amber-500 to-orange-600',
      description: 'Buy ARK tokens on PulseX decentralized exchange',
      actions: [
        {
          name: 'Buy ARK on PulseX',
          description: 'Get ARK tokens now',
          url: 'https://ipfs.app.pulsex.com/?inputCurrency=0xefD766cCb38EaF1dfd701853BFCe31359239F305&outputCurrency=0x4d547181427Ee90342b4781E0eF2cd46F189cb2C',
          icon: Coins
        }
      ],
      estimatedTime: '2-3 min'
    },
    {
      id: 'stake',
      title: 'Lock & Earn',
      subtitle: 'Maximize your rewards',
      icon: Lock,
      color: 'from-rose-500 to-pink-600',
      description: 'Lock your ARK tokens to earn rewards and participate in governance',
      actions: [
        {
          name: 'Vault (Locker)',
          description: 'Lock tokens for rewards',
          url: '/locker',
          icon: Lock,
          isInternal: true
        },
        {
          name: 'Add Liquidity',
          description: 'Provide liquidity to earn fees',
          url: 'https://pulsex.mypinata.cloud/ipfs/bafybeibzu7nje2o2tufb3ifitjrto3n3xcwon7fghq2igtcupulfubnrim/#/add/v2/0x4d547181427Ee90342b4781E0eF2cd46F189cb2C/0xefD766cCb38EaF1dfd701853BFCe31359239F305',
          icon: Zap
        }
      ],
      estimatedTime: '2-3 min'
    }
  ];

  const handleStepComplete = (stepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handleExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const calculateProgress = () => {
    return Math.round((completedSteps.size / onboardingSteps.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-black/30 backdrop-blur-xl border border-cyan-500/30 rounded-full">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-green-400 tracking-wider">SYSTEM_ONLINE</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Welcome to ARK
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Follow these steps to join the ARK ecosystem and start your journey to divine ascension
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-cyan-400">PROGRESS</span>
              <span className="text-sm font-mono text-cyan-400">{calculateProgress()}%</span>
            </div>
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">{completedSteps.size} of {onboardingSteps.length} steps completed</div>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="max-w-4xl mx-auto">
          {onboardingSteps.map((step, index) => (
            <div key={step.id} className="relative mb-8">
              {/* Connection Line */}
              {index < onboardingSteps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-20 bg-gradient-to-b from-cyan-500/50 to-transparent z-0"></div>
              )}
              
              {/* Step Card */}
              <div className={`relative bg-black/40 backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] group ${
                completedSteps.has(step.id) 
                  ? 'border-green-500/50 shadow-green-500/20' 
                  : 'border-gray-600/30 hover:border-cyan-500/50'
              } rounded-2xl overflow-hidden`}>
                
                {/* Animated Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                
                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-start gap-6">
                    {/* Step Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                        {completedSteps.has(step.id) && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-mono text-gray-400">STEP {index + 1}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        <div className="text-xs font-mono text-gray-400 bg-black/30 px-2 py-1 rounded">
                          {step.estimatedTime}
                        </div>
                      </div>
                      <p className="text-cyan-300 text-sm mb-2">{step.subtitle}</p>
                      <p className="text-gray-300 mb-6">{step.description}</p>

                      {/* Services */}
                      {step.services && (
                        <div className="grid gap-3 mb-4">
                          {step.services.map((service) => (
                            <div key={service.name} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 ${
                              service.isPrimary 
                                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' 
                                : 'bg-black/30 border border-gray-600/30 hover:border-gray-500/50'
                            }`}
                            onClick={() => handleExternalLink(service.url)}>
                              <div className="flex items-center gap-3">
                                <service.icon className="w-6 h-6 text-cyan-400" />
                                <div>
                                  <div className="font-semibold text-white">{service.name}</div>
                                  <div className="text-sm text-gray-400">{service.description}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {service.isPrimary && (
                                  <span className="text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-2 py-1 rounded font-mono">
                                    RECOMMENDED
                                  </span>
                                )}
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      {step.actions && (
                        <div className="grid gap-3 mb-4">
                          {step.actions.map((action) => (
                            <button
                              key={action.name}
                              onClick={() => handleExternalLink(action.url)}
                              className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl hover:scale-105 transition-all duration-300 group"
                            >
                              <div className="flex items-center gap-3">
                                <action.icon className="w-6 h-6 text-emerald-400" />
                                <div className="text-left">
                                  <div className="font-semibold text-white">{action.name}</div>
                                  <div className="text-sm text-gray-400">{action.description}</div>
                                </div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Complete Button */}
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        disabled={completedSteps.has(step.id)}
                        className={`w-full mt-4 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                          completedSteps.has(step.id)
                            ? 'bg-green-500/20 border border-green-500/50 text-green-400 cursor-default'
                            : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold hover:scale-105'
                        }`}
                      >
                        {completedSteps.has(step.id) ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            STEP COMPLETED
                          </div>
                        ) : (
                          'MARK AS COMPLETED'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Celebration */}
        {completedSteps.size === onboardingSteps.length && (
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 backdrop-blur-xl">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Onboarding Complete!
              </h3>
              <p className="text-gray-300 mb-6">
                Welcome to the ARK ecosystem! You're now ready to begin your journey to divine ascension.
              </p>
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300">
                ENTER ARK ECOSYSTEM
              </button>
            </div>
          </div>
        )}

        {/* Wallet Connection CTA */}
        {!isConnected && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-8 backdrop-blur-xl text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-orange-400" />
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Connect Your Wallet</h3>
              <p className="text-gray-300 mb-6">
                Connect your wallet to access all ARK features and track your progress automatically.
              </p>
              <button 
                onClick={() => setIsConnected(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300"
              >
                CONNECT WALLET
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default OptimizedOnboarding;