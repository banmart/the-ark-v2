
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
          <div className="text-center py-6">
            <div className="text-8xl mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              ❍
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Welcome Aboard The ARK
            </h2>
            <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
              While others drown in market chaos, THE ARK saves those who board early. 
              You're about to discover revolutionary tokenomics that reward the faithful.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="py-6">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              The Four Pillars of Salvation
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🔥</div>
                <h3 className="font-semibold text-cyan-400 mb-1">Scarcity</h3>
                <p className="text-xs text-gray-300">Burns on every transaction</p>
              </div>
              <div className="glass-card rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold text-cyan-400 mb-1">Rewards</h3>
                <p className="text-xs text-gray-300">Reflections for holders</p>
              </div>
              <div className="glass-card rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🫂</div>
                <h3 className="font-semibold text-cyan-400 mb-1">Community</h3>
                <p className="text-xs text-gray-300">Strong, united believers</p>
              </div>
              <div className="glass-card rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <h3 className="font-semibold text-cyan-400 mb-1">Security</h3>
                <p className="text-xs text-gray-300">Audited & transparent</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 text-center mt-4">
              Each transaction strengthens the ecosystem through burns, rewards, and community growth.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="py-6">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              The Sacred Locker System
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 glass-card rounded-lg p-3">
                <div className="text-yellow-600">⛵</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-600">Bronze (30-89 days)</div>
                  <div className="text-xs text-gray-400">1x Multiplier</div>
                </div>
              </div>
              <div className="flex items-center gap-3 glass-card rounded-lg p-3">
                <div className="text-gray-400">🛡️</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-400">Silver (90-179 days)</div>
                  <div className="text-xs text-gray-400">1.5x Multiplier</div>
                </div>
              </div>
              <div className="flex items-center gap-3 glass-card rounded-lg p-3">
                <div className="text-yellow-400">👑</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-400">Gold (180-364 days)</div>
                  <div className="text-xs text-gray-400">2x Multiplier</div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-400">...and 3 more legendary tiers!</div>
            </div>
            <p className="text-sm text-gray-300 text-center">
              Lock your tokens and ascend through divine tiers. The longer you lock, the greater your blessings from the vault.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Ready to Board The ARK?
            </h2>
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-semibold text-cyan-400 mb-2">1. Connect Your Wallet</h3>
                <p className="text-sm text-gray-300">Use the "Connect Wallet" button in the top navigation</p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-semibold text-cyan-400 mb-2">2. Swap PLS for ARK</h3>
                <p className="text-sm text-gray-300">Use our built-in swap interface below</p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-semibold text-cyan-400 mb-2">3. Lock for Rewards</h3>
                <p className="text-sm text-gray-300">Visit the Locker to start earning multiplied rewards</p>
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
      <DialogContent className="max-w-lg bg-black/95 border border-cyan-500/30 text-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-bold text-cyan-400">
              ARK Token Onboarding
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white"
            >
              Skip
            </Button>
          </div>
        </DialogHeader>

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="min-h-[300px] flex items-center">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-cyan-500/20">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black font-bold flex items-center gap-2"
          >
            {currentStep === totalSteps ? 'Get Started' : 'Next'}
            <ArrowRight size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
