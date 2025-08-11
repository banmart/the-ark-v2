import React from 'react';
import { WalletProvider } from '../components/providers/WalletProvider';
import { SwapProvider } from '../components/providers/SwapProvider';
import { OnboardingProvider } from '../components/providers/OnboardingProvider';
import { BrowserPopupProvider } from '../components/providers/BrowserPopupProvider';
import StatsPageLayout from '../components/layout/StatsPageLayout';
import MobileBrowserPopup from '../components/MobileBrowserPopup';
import { useBrowserPopup } from '../components/providers/BrowserPopupProvider';

const StatsContent = () => {
  const { isOpen, url, title, closePopup } = useBrowserPopup();
  
  return (
    <>
      <StatsPageLayout />
      <MobileBrowserPopup 
        isOpen={isOpen}
        onClose={closePopup}
        url={url}
        title={title}
      />
    </>
  );
};

const Stats = () => {
  return <StatsContent />;
};

export default Stats;