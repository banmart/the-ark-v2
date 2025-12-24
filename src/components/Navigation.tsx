import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Sparkles } from 'lucide-react';
import { useChatContext } from './providers/ChatProvider';
import { useBrowserPopup } from './providers/BrowserPopupProvider';
import MobileMenu from './MobileMenu';

interface NavigationProps {
  handleConnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  account: string | null;
}

const Navigation = ({ handleConnectWallet, isConnecting, isConnected, account }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsOpen } = useChatContext();
  const { openPopup } = useBrowserPopup();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHashNavigation = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleExternalLink = (url: string, title: string) => {
    openPopup(url, title);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      {/* Background Layer */}
      <div className={`absolute inset-0 backdrop-blur-md transition-all duration-500 ${
        isScrolled ? 'bg-ark-obsidian/95' : 'bg-ark-obsidian/80'
      }`} />
      
      {/* Bottom Border - Gold Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ark-gold/40 to-transparent" />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          
          {/* ========== BRAND SECTION ========== */}
          <div className="flex items-center gap-6">
            {/* Brand Logo */}
            <Link to="/" className="relative group">
              {/* Logo Text - Bebas Neue */}
              <span className="font-display text-2xl md:text-3xl tracking-display text-ark-ivory group-hover:text-ark-gold transition-colors duration-300">
                THE ARK
              </span>
              
              {/* Gold Underline */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ark-gold group-hover:w-full transition-all duration-300" />
            </Link>
            
            {/* Status Indicators - Desktop Only */}
            <div className="hidden lg:flex items-center gap-4">
              {/* LIVE Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 border border-green-500/30 bg-green-500/5">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-40" />
                </div>
                <span className="text-brutal-label text-green-400">LIVE</span>
              </div>
              
              {/* PULSE Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 border border-ark-pulse/30 bg-ark-pulse/5">
                <div className="w-2 h-2 bg-ark-pulse rounded-full" />
                <span className="text-brutal-label text-ark-pulse">PULSE</span>
              </div>
            </div>
          </div>

          {/* ========== NAVIGATION SECTION ========== */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <MobileMenu 
              handleConnectWallet={handleConnectWallet}
              isConnecting={isConnecting}
              isConnected={isConnected}
              account={account}
            />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {/* Nav Links */}
              <Link 
                to="/onboarding" 
                className="relative group py-2"
              >
                <span className="font-display text-sm tracking-widest text-ark-ivory/80 group-hover:text-ark-gold transition-colors duration-300">
                  GET ARK
                </span>
                <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-ark-gold group-hover:w-full transition-all duration-300" />
              </Link>

              <Link 
                to="/locker" 
                className="relative group py-2"
              >
                <span className="font-display text-sm tracking-widest text-ark-ivory/80 group-hover:text-ark-gold transition-colors duration-300">
                  LOCKER
                </span>
                <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-ark-gold group-hover:w-full transition-all duration-300" />
              </Link>
              
              {/* Connect Wallet Button - Brutalist Style */}
              <button 
                onClick={handleConnectWallet} 
                disabled={isConnecting}
                className="relative group bg-ark-gold text-ark-obsidian px-6 py-2.5 font-display text-sm tracking-widest
                  transition-all duration-300 disabled:opacity-50
                  shadow-brutal-sm hover:shadow-brutal-gold hover:translate-x-0.5 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{isConnecting ? 'CONNECTING...' : 'CONNECT'}</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
