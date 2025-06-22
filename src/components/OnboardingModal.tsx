import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, X, Shield, Coins, Users, Lock, Sparkles, Star, Crown, Flame } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock shadcn/ui components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => onOpenChange(false)}></div>
      <div className="relative z-50">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ className, children, ...props }) => (
  <div className={`relative rounded-xl shadow-2xl ${className}`} {...props}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="p-6 pb-4">
    {children}
  </div>
);

const DialogTitle = ({ className, children }) => (
  <h1 className={className}>
    {children}
  </h1>
);

const Button = ({ variant = "default", size = "default", disabled, onClick, className, children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50";
  
  const variants = {
    default: "bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-105",
    ghost: "text-gray-400 hover:text-white hover:bg-white/10",
    outline: "border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center space-x-2 px-6">
    {[...Array(totalSteps)].map((_, index) => (
      <div key={index} className="flex items-center">
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          index + 1 === currentStep 
            ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125' 
            : index + 1 < currentStep 
            ? 'bg-green-400' 
            : 'bg-gray-600'
        }`}></div>
        {index < totalSteps - 1 && (
          <div className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${
            index + 1 < currentStep ? 'bg-green-400' : 'bg-gray-600'
          }`}></div>
        )}
      </div>
    ))}
  </div>
);

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSteps = 4;

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
      setIsAnimating(false);
    }, 150);
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
      setIsAnimating(false);
    }, 150);
  };

  const handleComplete = () => {
    // Note: localStorage not available in Claude artifacts
    // localStorage.setItem('ark-onboarding-seen', 'true');
    onClose();
  };

  const handleSkip = () => {
    // Note: localStorage not available in Claude artifacts
    // localStorage.setItem('ark-onboarding-seen', 'true');
    onClose();
  };

  const pillars = [
    {
      emoji: '🔥',
      icon: Flame,
      title: 'Scarcity',
      description: 'Burns on every transaction',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    {
      emoji: '💰',
      icon: Coins,
      title: 'Rewards', 
      description: 'Reflections for holders',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      emoji: '🫂',
      icon: Users,
      title: 'Community',
      description: 'Strong, united believers',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      emoji: '🛡️',
      icon: Shield,
      title: 'Security',
      description: 'Audited & transparent',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    }
  ];

  const tiers = [
    {
      emoji: '⛵',
      title: 'Bronze',
      duration: '30-89 days',
      multiplier: '1x',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-600/10',
      borderColor: 'border-yellow-600/30'
    },
    {
      emoji: '🛡️',
      title: 'Silver',
      duration: '90-179 days',
      multiplier: '1.5x',
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400/30'
    },
    {
      emoji: '👑',
      title: 'Gold',
      duration: '180-364 days',
      multiplier: '2x',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30'
    }
  ];

  const steps = [
    {
      title: 'Connect Your Wallet',
      description: 'Use the "Connect Wallet" button in the top navigation',
      icon: Lock,
      color: 'text-cyan-400'
    },
    {
      title: 'Swap PLS for ARK',
      description: 'Use our built-in swap interface below',
      icon: Coins,
      color: 'text-green-400'
    },
    {
      title: 'Lock for Rewards',
      description: 'Visit the Locker to start earning multiplied rewards',
      icon: Star,
      color: 'text-yellow-400'
    }
  ];

  const renderStepContent = () => {
    const contentClass = `transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`;
    
    switch (currentStep) {
      case 1:
        return (
          <div className={`text-center py-6 ${contentClass}`}>
            <div className="relative mb-6">
              <div className="text-8xl mb-4 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent animate-pulse">
                ⚓
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-teal-500/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              Welcome Aboard The ARK
            </h2>
            
            <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
              While others drown in market chaos, <span className="text-cyan-400 font-semibold">THE ARK</span> saves those who board early. 
              You're about to discover revolutionary tokenomics that reward the faithful.
            </p>
            
            <div className="mt-6 flex items-center justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                ></div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`py-6 ${contentClass}`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                The Four Pillars of Salvation
              </h2>
              <p className="text-sm text-gray-400">
                Each transaction strengthens our divine ecosystem
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, index) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={index}
                    className={`${pillar.bgColor} ${pillar.borderColor} border-2 rounded-xl p-4 text-center hover:scale-105 transition-all duration-300 group`}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div className="text-3xl mr-2">{pillar.emoji}</div>
                      <IconComponent className={`w-6 h-6 ${pillar.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <h3 className={`font-bold mb-2 ${pillar.color}`}>
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-sm text-cyan-300">United in purpose, stronger together</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`py-6 ${contentClass}`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                The Sacred Locker System
              </h2>
              <p className="text-sm text-gray-400">
                Ascend through divine tiers for greater blessings
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${tier.bgColor} ${tier.borderColor} border-2 rounded-xl p-4 hover:scale-105 transition-all duration-300`}
                >
                  <div className="text-2xl">{tier.emoji}</div>
                  <div className="flex-1">
                    <div className={`font-bold ${tier.color}`}>
                      {tier.title} ({tier.duration})
                    </div>
                    <div className="text-sm text-gray-400">
                      {tier.multiplier} Multiplier
                    </div>
                  </div>
                  <div className={`text-xl font-black ${tier.color}`}>
                    {tier.multiplier}
                  </div>
                </div>
              ))}
              
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
                  <Crown className="w-4 h-4 text-orange-400 mr-2" />
                  <span className="text-sm text-orange-300">...and 3 more legendary tiers!</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 text-center bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              💎 The longer you lock, the greater your share of the divine vault rewards
            </p>
          </div>
        );

      case 4:
        return (
          <div className={`text-center py-6 ${contentClass}`}>
            <div className="text-4xl mb-4 animate-bounce">🚀</div>
            
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Ready to Board The ARK?
            </h2>
            
            <div className="space-y-4 max-w-sm mx-auto">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300 group"
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                        <span className="text-cyan-400 font-bold text-sm">{index + 1}</span>
                      </div>
                      <IconComponent className={`w-5 h-5 ${step.color} mr-2`} />
                      <h3 className={`font-semibold ${step.color}`}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-300 text-left ml-11">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-full">
                <Sparkles className="w-4 h-4 text-cyan-400 mr-2 animate-pulse" />
                <span className="text-sm text-cyan-300 font-medium">Your journey begins now</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 border-2 border-cyan-500/30 text-white shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent flex items-center">
              <Sparkles className="w-6 h-6 text-cyan-400 mr-2" />
              ARK Token Onboarding
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-400 hover:text-white"
              >
                Skip Tour
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-2">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <div className="min-h-[400px] flex items-center px-6">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-cyan-500/20 bg-black/20">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isAnimating}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>

          <div className="text-sm text-gray-400">
            Step {currentStep} of {totalSteps}
          </div>

          <Button
            onClick={handleNext}
            disabled={isAnimating}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/30"
          >
            {currentStep === totalSteps ? (
              <>
                <Sparkles size={16} />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;