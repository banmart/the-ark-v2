
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BrowserPopupContextType {
  isOpen: boolean;
  url: string;
  title: string;
  openPopup: (url: string, title: string) => void;
  closePopup: () => void;
}

const BrowserPopupContext = createContext<BrowserPopupContextType | undefined>(undefined);

interface BrowserPopupProviderProps {
  children: ReactNode;
}

export const BrowserPopupProvider = ({ children }: BrowserPopupProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const openPopup = (newUrl: string, newTitle: string) => {
    setUrl(newUrl);
    setTitle(newTitle);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    // Clear URL after animation completes
    setTimeout(() => {
      setUrl('');
      setTitle('');
    }, 300);
  };

  return (
    <BrowserPopupContext.Provider value={{
      isOpen,
      url,
      title,
      openPopup,
      closePopup
    }}>
      {children}
    </BrowserPopupContext.Provider>
  );
};

export const useBrowserPopup = () => {
  const context = useContext(BrowserPopupContext);
  if (context === undefined) {
    throw new Error('useBrowserPopup must be used within a BrowserPopupProvider');
  }
  return context;
};
