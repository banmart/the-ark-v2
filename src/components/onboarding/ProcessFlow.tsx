import React from 'react';
import { ArrowRight, GitBranch, ShoppingCart, Lock, Building, Wallet } from 'lucide-react';
const ProcessFlow = () => {
  const steps = [{
    id: 1,
    title: 'WALLET',
    description: 'Setup crypto wallet',
    icon: Wallet,
    color: 'purple',
    sectionId: 'wallet'
  }, {
    id: 2,
    title: 'BANK',
    description: 'Connect bank account',
    icon: Building,
    color: 'cyan',
    sectionId: 'bank'
  }, {
    id: 3,
    title: 'BRIDGE',
    description: 'Move assets to PulseChain',
    icon: GitBranch,
    color: 'blue',
    sectionId: 'bridge'
  }, {
    id: 4,
    title: 'BUY',
    description: 'Purchase ARK tokens',
    icon: ShoppingCart,
    color: 'green',
    sectionId: 'buy'
  }, {
    id: 5,
    title: 'LOCK',
    description: 'Lock tokens for rewards',
    icon: Lock,
    color: 'yellow',
    sectionId: 'lock'
  }];

  const scrollToSection = (sectionId: string | null) => {
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/50',
          text: 'text-blue-400',
          glow: 'shadow-blue-500/50'
        };
      case 'green':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/50',
          text: 'text-green-400',
          glow: 'shadow-green-500/50'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/20',
          border: 'border-purple-500/50',
          text: 'text-purple-400',
          glow: 'shadow-purple-500/50'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/50',
          text: 'text-yellow-400',
          glow: 'shadow-yellow-500/50'
        };
      default:
        return {
          bg: 'bg-cyan-500/20',
          border: 'border-cyan-500/50',
          text: 'text-cyan-400',
          glow: 'shadow-cyan-500/50'
        };
    }
  };
  return <div className="relative">
      {/* Desktop Flow */}
      <div className="hidden md:flex items-center justify-center gap-8">
        {steps.map((step, index) => {
        const colors = getColorClasses(step.color);
        return <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center group">
                <button 
                  onClick={() => scrollToSection(step.sectionId)}
                  className={`
                    w-20 h-20 rounded-full border-2 ${colors.border} ${colors.bg} 
                    flex items-center justify-center relative overflow-hidden
                    transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${colors.glow}
                    ${step.sectionId ? 'cursor-pointer hover:brightness-110' : 'cursor-default'}
                  `}
                  disabled={!step.sectionId}
                >
                  {/* Scanning effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`}></div>
                  
                  <step.icon className={`w-8 h-8 ${colors.text} relative z-10`} />
                </button>
                
                <div className="mt-4 text-center">
                  <div className={`font-mono font-bold ${colors.text} text-sm tracking-wider`}>
                    {step.title}
                  </div>
                  <div className="text-gray-400 text-xs mt-1 max-w-24">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && <div className="mx-6">
                  <ArrowRight className="w-6 h-6 text-cyan-400/60 animate-pulse" />
                </div>}
            </div>;
      })}
      </div>

      {/* Duplicate Desktop Flow */}
      

      {/* Mobile Flow */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => {
        const colors = getColorClasses(step.color);
        return <div key={step.id} className="flex flex-col items-center">
              {/* Step Circle */}
              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={() => scrollToSection(step.sectionId)}
                  className={`
                    w-16 h-16 rounded-full border-2 ${colors.border} ${colors.bg} 
                    flex items-center justify-center relative overflow-hidden
                    transition-all duration-300 hover:scale-105 hover:shadow-lg ${colors.glow}
                    ${step.sectionId ? 'cursor-pointer hover:brightness-110' : 'cursor-default'}
                  `}
                  disabled={!step.sectionId}
                >
                  <step.icon className={`w-6 h-6 ${colors.text}`} />
                </button>
                
                <div className="flex-1">
                  <div className={`font-mono font-bold ${colors.text} text-lg tracking-wider`}>
                    {step.title}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && <div className="my-4">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400/60 to-transparent"></div>
                </div>}
            </div>;
      })}
      </div>

      {/* Quantum field effect */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse"></div>
      </div>
    </div>;
};
export default ProcessFlow;