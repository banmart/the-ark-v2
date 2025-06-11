import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Shield, Coins, Users, Lock } from "lucide-react";
import StepIndicator from './StepIndicator';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('ark-onboarding-seen', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('ark-onboarding-seen', 'true');
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center py-3 sm:py-6">
            <div className="text-4xl sm:text-6xl md:text-8xl mb-3 sm:mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              ❍
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent px-2">
              Welcome Aboard The ARK
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-md mx-auto leading-relaxed px-4">
              While others drown in market chaos, THE ARK saves those who board early. 
              You're about to discover revolutionary tokenomics that reward the faithful.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="py-3 sm:py-6 px-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              The Four Pillars of Salvation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="glass-card rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl mb-2">🔥</div>
                <h3 className="font-semibold text-cyan-400 mb-1 text-sm sm:text-base">Scarcity</h3>
                <p className="text-xs text-gray-300">Burns on every transaction</p>
              </div>
              <div className="glass-card rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl mb-2">💰</div>
                <h3 className="font-semibold text-cyan-400 mb-1 text-sm sm:text-base">Rewards</h3>
                <p className="text-xs text-gray-300">Reflections for holders</p>
              </div>
              <div className="glass-card rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl mb-2">🫂</div>
                <h3 className="font-semibold text-cyan-400 mb-1 text-sm sm:text-base">Community</h3>
                <p className="text-xs text-gray-300">Strong, united believers</p>
              </div>
              <div className="glass-card rounded-lg p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl mb-2">🛡️</div>
                <h3 className="font-semibold text-cyan-400 mb-1 text-sm sm:text-base">Security</h3>
                <p className="text-xs text-gray-300">Audited & transparent</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 text-center mt-3 sm:mt-4 px-2">
              Each transaction strengthens the ecosystem through burns, rewards, and community growth.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="py-3 sm:py-6 px-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              The Sacred Locker System
            </h2>
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 glass-card rounded-lg p-2 sm:p-3">
                <div className="text-yellow-600 text-lg sm:text-xl">⛵</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-600 text-sm sm:text-base">Bronze (30-89 days)</div>
                  <div className="text-xs text-gray-400">1x Multiplier</div>
                </div>
              </div>
              <div className="flex items-center gap-3 glass-card rounded-lg p-2 sm:p-3">
                <div className="text-gray-400 text-lg sm:text-xl">🛡️</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-400 text-sm sm:text-base">Silver (90-179 days)</div>
                  <div className="text-xs text-gray-400">1.5x Multiplier</div>
                </div>
              </div>
              <div className="flex items-center gap-3 glass-card rounded-lg p-2 sm:p-3">
                <div className="text-yellow-400 text-lg sm:text-xl">👑</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-400 text-sm sm:text-base">Gold (180-364 days)</div>
                  <div className="text-xs text-gray-400">2x Multiplier</div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-400">...and 3 more legendary tiers!</div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 text-center px-2">
              Lock your tokens and ascend through divine tiers. The longer you lock, the greater your blessings from the vault.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-3 sm:py-6 px-2">
            <div className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">🚀</div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Ready to Board The ARK?
            </h2>
            <div className="space-y-3 sm:space-y-4 max-w-sm mx-auto">
              <div className="glass-card rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-cyan-400 mb-2 text-sm sm:text-base">1. Connect Your Wallet</h3>
                <p className="text-xs sm:text-sm text-gray-300">Use the "Connect Wallet" button in the top navigation</p>
              </div>
              <div className="glass-card rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-cyan-400 mb-2 text-sm sm:text-base">2. Swap PLS for ARK</h3>
                <p className="text-xs sm:text-sm text-gray-300">Use our built-in swap interface below</p>
              </div>
              <div className="glass-card rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-cyan-400 mb-2 text-sm sm:text-base">3. Lock for Rewards</h3>
                <p className="text-xs sm:text-sm text-gray-300">Visit the Locker to start earning multiplied rewards</p>
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
      <DialogContent className="max-w-[95vw] sm:max-w-lg bg-black/95 border border-cyan-500/30 text-white mx-4">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-base sm:text-lg font-bold text-cyan-400">
              ARK Token Onboarding
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white text-xs sm:text-sm"
            >
              Skip
            </Button>
          </div>
        </DialogHeader>

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="min-h-[250px] sm:min-h-[300px] flex items-center">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-cyan-500/20">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4"
          >
            <ArrowLeft size={14} />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-cyan-500 text-black font-bold flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 min-h-[40px]"
          >
            {currentStep === totalSteps ? 'Get Started' : 'Next'}
            <ArrowRight size={14} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
