
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

  // Disabled automatic onboarding - now handled by AI chat assistant
  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('ark-onboarding-seen');
    
    // Onboarding modal is now disabled in favor of AI chat assistant
    // Users can still manually trigger it if needed
    if (!hasSeenOnboarding) {
      // No longer auto-show onboarding after 10 seconds
      console.log('Onboarding available via AI chat assistant');
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
