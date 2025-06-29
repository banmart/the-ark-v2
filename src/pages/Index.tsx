
import React from 'react';
import { WalletProvider } from '../components/providers/WalletProvider';
import { SwapProvider } from '../components/providers/SwapProvider';
import { OnboardingProvider } from '../components/providers/OnboardingProvider';
import { BrowserPopupProvider } from '../components/providers/BrowserPopupProvider';
import PageLayout from '../components/layout/PageLayout';
import MobileBrowserPopup from '../components/MobileBrowserPopup';
import { useBrowserPopup } from '../components/providers/BrowserPopupProvider';

const IndexContent = () => {
  const { isOpen, url, title, closePopup } = useBrowserPopup();
  
  return (
    <>
      <PageLayout />
      <MobileBrowserPopup 
        isOpen={isOpen}
        onClose={closePopup}
        url={url}
        title={title}
      />
    </>
  );
};

const Index = () => {
  return (
    <WalletProvider>
      <SwapProvider>
        <OnboardingProvider>
          <BrowserPopupProvider>
            <IndexContent />
          </BrowserPopupProvider>
        </OnboardingProvider>
      </SwapProvider>
    </WalletProvider>
  );
};

export default Index;
