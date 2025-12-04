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
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          glow: 'shadow-blue-500/40',
          gradient: 'from-blue-500 to-indigo-500',
          ring: 'from-blue-500/40 via-indigo-500/40 to-blue-500/40'
        };
      case 'green':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/40',
          text: 'text-green-400',
          glow: 'shadow-green-500/40',
          gradient: 'from-green-500 to-emerald-500',
          ring: 'from-green-500/40 via-emerald-500/40 to-green-500/40'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/40',
          text: 'text-purple-400',
          glow: 'shadow-purple-500/40',
          gradient: 'from-purple-500 to-violet-500',
          ring: 'from-purple-500/40 via-violet-500/40 to-purple-500/40'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/40',
          text: 'text-yellow-400',
          glow: 'shadow-yellow-500/40',
          gradient: 'from-yellow-500 to-amber-500',
          ring: 'from-yellow-500/40 via-amber-500/40 to-yellow-500/40'
        };
      default:
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/40',
          text: 'text-cyan-400',
          glow: 'shadow-cyan-500/40',
          gradient: 'from-cyan-500 to-teal-500',
          ring: 'from-cyan-500/40 via-teal-500/40 to-cyan-500/40'
        };
    }
  };

  return (
    <div className="relative">
      {/* Premium container with outer glow */}
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-60" />
        
        <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 md:p-10">
          {/* Top edge highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
          
          {/* Desktop Flow */}
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6">
            {steps.map((step, index) => {
              const colors = getColorClasses(step.color);
              return (
                <div key={step.id} className="flex items-center">
                  {/* Step Circle with outer glow */}
                  <div className="flex flex-col items-center group">
                    <div className="relative">
                      {/* Outer glow ring */}
                      <div className={`absolute -inset-2 bg-gradient-to-r ${colors.ring} rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                      
                      <button 
                        onClick={() => scrollToSection(step.sectionId)}
                        className={`
                          relative w-16 h-16 lg:w-20 lg:h-20 rounded-full 
                          bg-white/[0.03] backdrop-blur-xl border border-white/[0.1]
                          flex items-center justify-center overflow-hidden
                          transition-all duration-500 
                          hover:scale-110 hover:border-white/[0.2]
                          hover:shadow-xl ${colors.glow}
                          ${step.sectionId ? 'cursor-pointer' : 'cursor-default'}
                        `}
                        disabled={!step.sectionId}
                      >
                        {/* Inner gradient background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                        
                        {/* Top highlight */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-full" />
                        
                        {/* Scanning effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        <step.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${colors.text} relative z-10 group-hover:scale-110 transition-transform duration-300`} />
                      </button>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <div className={`font-mono font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent text-xs lg:text-sm tracking-wider`}>
                        {step.title}
                      </div>
                      <div className="text-white/40 text-xs mt-1 max-w-20 lg:max-w-24">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {/* Premium Arrow Connector */}
                  {index < steps.length - 1 && (
                    <div className="mx-2 lg:mx-4 relative">
                      {/* Arrow glow */}
                      <div className="absolute inset-0 bg-cyan-400/20 blur-md" />
                      <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-400/60 relative animate-[pulse_2s_ease-in-out_infinite]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Flow */}
          <div className="md:hidden space-y-4">
            {steps.map((step, index) => {
              const colors = getColorClasses(step.color);
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className="flex items-center gap-4 w-full group">
                    {/* Mobile step circle with glow */}
                    <div className="relative">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${colors.ring} rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                      
                      <button 
                        onClick={() => scrollToSection(step.sectionId)}
                        className={`
                          relative w-14 h-14 rounded-full 
                          bg-white/[0.03] backdrop-blur-xl border border-white/[0.1]
                          flex items-center justify-center overflow-hidden
                          transition-all duration-300 
                          hover:scale-105 hover:shadow-lg ${colors.glow}
                          ${step.sectionId ? 'cursor-pointer' : 'cursor-default'}
                        `}
                        disabled={!step.sectionId}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-10`} />
                        <step.icon className={`w-6 h-6 ${colors.text} relative z-10`} />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className={`font-mono font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent text-base tracking-wider`}>
                        {step.title}
                      </div>
                      <div className="text-white/40 text-sm">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  {/* Vertical connector */}
                  {index < steps.length - 1 && (
                    <div className="my-3 flex justify-start pl-7">
                      <div className="w-px h-6 bg-gradient-to-b from-cyan-400/40 to-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced quantum field effect */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-teal-500/30 to-transparent animate-[pulse_4s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default ProcessFlow;
