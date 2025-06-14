
import React from 'react';
import { WalletProvider } from '../components/providers/WalletProvider';
import { SwapProvider } from '../components/providers/SwapProvider';
import { OnboardingProvider } from '../components/providers/OnboardingProvider';
import PageLayout from '../components/layout/PageLayout';

const Index = () => {
  return (
    <WalletProvider>
      <SwapProvider>
        <OnboardingProvider>
          <PageLayout />
        </OnboardingProvider>
      </SwapProvider>
    </WalletProvider>
  );
};

export default Index;
