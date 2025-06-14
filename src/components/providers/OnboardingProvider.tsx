
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface OnboardingContextType {
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('ark-onboarding-seen');
    
    if (!hasSeenOnboarding) {
      // Set timer to show onboarding after 10 seconds
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 10000);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  const value = {
    showOnboarding,
    setShowOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
