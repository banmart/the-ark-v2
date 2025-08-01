import React from 'react';

// Optimized Dialog Components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-300" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 animate-in zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ className = "", children, ...props }) => (
  <div className={`relative rounded-2xl shadow-2xl ${className}`} {...props}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="p-6 pb-4">
    {children}
  </div>
);

const DialogTitle = ({ className = "", children }) => (
  <h1 className={`text-xl font-bold ${className}`}>
    {children}
  </h1>
);

// Enhanced Button Component
const Button = ({ 
  variant = "default", 
  size = "default", 
  disabled = false, 
  onClick, 
  className = "", 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 active:scale-95";
  
  const variants = {
    default: "bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/30",
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

// Enhanced Step Indicator with animations
const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center space-x-2 px-6 py-4">
    {[...Array(totalSteps)].map((_, index) => (
      <div key={index} className="flex items-center">
        <div className={`relative w-4 h-4 rounded-full transition-all duration-500 ${
          index + 1 === currentStep 
            ? 'bg-gradient-to-r from-cyan-400 to-teal-500 shadow-lg shadow-cyan-400/50 scale-125' 
            : index + 1 < currentStep 
            ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/30' 
            : 'bg-gray-600'
        }`}>
          {index + 1 === currentStep && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 animate-pulse" />
          )}
          {index + 1 < currentStep && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {index < totalSteps - 1 && (
          <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${
            index + 1 < currentStep 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
              : 'bg-gray-600'
          }`} />
        )}
      </div>
    ))}
  </div>
);

// Icons as simple SVG components
const ArrowRight = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const ArrowLeft = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const X = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const Shield = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Coins = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M16.71 13.88A6 6 0 1 0 16.71 13.88"/>
  </svg>
);

const Users = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Lock = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const Sparkles = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
);

const Star = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const Crown = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm0 16h20"/>
  </svg>
);

const Flame = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

// Main Onboarding Modal Component
const OnboardingModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isAnimating, setIsAnimating] = React.useState(false);
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
    }, 200);
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
      setIsAnimating(false);
    }, 200);
  };

  const handleComplete = () => {
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  // Enhanced data with better styling
  const pillars = [
    {
      emoji: '🔥',
      icon: Flame,
      title: 'Scarcity',
      description: 'Burns on every transaction',
      color: 'text-red-400',
      bgColor: 'bg-gradient-to-br from-red-500/10 to-orange-500/10',
      borderColor: 'border-red-500/30',
      glowColor: 'shadow-red-500/20'
    },
    {
      emoji: '💰',
      icon: Coins,
      title: 'Rewards', 
      description: 'Reflections for holders',
      color: 'text-green-400',
      bgColor: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/30',
      glowColor: 'shadow-green-500/20'
    },
    {
      emoji: '🫂',
      icon: Users,
      title: 'Community',
      description: 'Strong, united believers',
      color: 'text-blue-400',
      bgColor: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-500/20'
    },
    {
      emoji: '🛡️',
      icon: Shield,
      title: 'Security',
      description: 'Audited & transparent',
      color: 'text-purple-400',
      bgColor: 'bg-gradient-to-br from-purple-500/10 to-violet-500/10',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-purple-500/20'
    }
  ];

  const tiers = [
    {
      emoji: '⛵',
      title: 'Bronze',
      duration: '30-89 days',
      multiplier: '1x',
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-600/10 to-amber-600/10',
      borderColor: 'border-yellow-600/30'
    },
    {
      emoji: '🛡️',
      title: 'Silver',
      duration: '90-179 days',
      multiplier: '1.5x',
      color: 'text-gray-400',
      bgColor: 'bg-gradient-to-br from-gray-400/10 to-slate-400/10',
      borderColor: 'border-gray-400/30'
    },
    {
      emoji: '👑',
      title: 'Gold',
      duration: '180-364 days',
      multiplier: '2x',
      color: 'text-yellow-400',
      bgColor: 'bg-gradient-to-br from-yellow-400/10 to-amber-400/10',
      borderColor: 'border-yellow-400/30'
    }
  ];

  const steps = [
    {
      title: 'Connect Your Wallet',
      description: 'Use the "Connect Wallet" button in the top navigation',
      icon: Lock,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      title: 'Swap PLS for ARK',
      description: 'Use our built-in swap interface below',
      icon: Coins,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Lock for Rewards',
      description: 'Visit the Locker to start earning multiplied rewards',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  const renderStepContent = () => {
    const contentClass = `transition-all duration-500 ${
      isAnimating 
        ? 'opacity-0 scale-95 translate-y-4' 
        : 'opacity-100 scale-100 translate-y-0'
    }`;
    
    switch (currentStep) {
      case 1:
        return (
          <div className={`text-center py-8 ${contentClass}`}>
            <div className="relative mb-8">
              <div className="text-9xl mb-6 animate-pulse">
                ⚓
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              Welcome Aboard The ARK
            </h2>
            
            <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed mb-8">
              While others drown in market chaos, <span className="text-cyan-400 font-bold">THE ARK</span> saves those who board early. 
              You're about to discover revolutionary tokenomics that reward the faithful.
            </p>
            
            <div className="flex items-center justify-center space-x-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 300}ms` }}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`py-8 ${contentClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                The Four Pillars of Salvation
              </h2>
              <p className="text-gray-400">
                Each transaction strengthens our divine ecosystem
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {pillars.map((pillar, index) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={index}
                    className={`${pillar.bgColor} ${pillar.borderColor} border-2 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 group shadow-lg ${pillar.glowColor} hover:shadow-xl`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-4xl mr-3 group-hover:scale-110 transition-transform duration-300">
                        {pillar.emoji}
                      </div>
                      <IconComponent className={`w-7 h-7 ${pillar.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <h3 className={`font-bold text-lg mb-3 ${pillar.color}`}>
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-cyan-400 mr-3 animate-pulse" />
                <span className="text-cyan-300 font-medium">United in purpose, stronger together</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`py-8 ${contentClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                The Sacred Locker System
              </h2>
              <p className="text-gray-400">
                Ascend through divine tiers for greater blessings
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-6 ${tier.bgColor} ${tier.borderColor} border-2 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl">{tier.emoji}</div>
                  <div className="flex-1">
                    <div className={`font-bold text-lg ${tier.color}`}>
                      {tier.title}
                    </div>
                    <div className="text-gray-400">
                      {tier.duration}
                    </div>
                  </div>
                  <div className={`text-2xl font-black ${tier.color} bg-black/20 px-4 py-2 rounded-lg`}>
                    {tier.multiplier}
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-full">
                  <Crown className="w-5 h-5 text-orange-400 mr-2" />
                  <span className="text-orange-300 font-medium">...and 3 more legendary tiers!</span>
                </div>
              </div>
            </div>
            
            <div className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 shadow-lg">
              <div className="text-2xl mb-2">💎</div>
              <p className="text-gray-300 font-medium">
                The longer you lock, the greater your share of the divine vault rewards
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={`text-center py-8 ${contentClass}`}>
            <div className="text-6xl mb-6 animate-bounce">🚀</div>
            
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Ready to Board The ARK?
            </h2>
            
            <div className="space-y-6 max-w-md mx-auto mb-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className={`${step.bgColor} backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 group shadow-lg hover:shadow-xl`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-cyan-400 font-bold">{index + 1}</span>
                      </div>
                      <IconComponent className={`w-6 h-6 ${step.color} mr-3`} />
                      <h3 className={`font-bold text-lg ${step.color}`}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-left ml-14 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-cyan-400 mr-3 animate-pulse" />
              <span className="text-cyan-300 font-bold">Your journey begins now</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 border-2 border-cyan-500/30 text-white shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent flex items-center">
              <Sparkles className="w-7 h-7 text-cyan-400 mr-3 animate-pulse" />
              ARK Token Onboarding
            </DialogTitle>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Skip Tour
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 transition-colors"
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="min-h-[500px] flex items-center px-6">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-cyan-500/20 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-sm">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isAnimating}
            className="flex items-center gap-2 transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Previous
          </Button>

          <div className="text-gray-400 font-medium">
            Step {currentStep} of {totalSteps}
          </div>

          <Button
            onClick={handleNext}
            disabled={isAnimating}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-200"
          >
            {currentStep === totalSteps ? (
              <>
                <Sparkles size={18} />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;