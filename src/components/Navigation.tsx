
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Wifi, Bot } from 'lucide-react';
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

  const handleHashNavigation = (hash: string) => {
    if (location.pathname !== '/') {
      // If not on homepage, navigate to homepage first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on homepage, just scroll to the section
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
    <nav className="fixed top-0 w-full z-50 overflow-hidden">
      {/* Quantum Field Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5"></div>
        
        {/* Scanning line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 border-b border-cyan-500/20">
        <div className="flex justify-between items-center">
          {/* Brand with System Status */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-2xl michroma-regular bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent hover:scale-105 transition-transform relative group"
            >
              The Ark
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            
            {/* System Status Indicators */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-green-400">LIVE</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400">PULSE</span>
              </div>
            </div>
          </div>

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

            
            <Link 
              to="/stats" 
              className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm relative group"
            >
              Stats & Data
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </Link>

            <Link 
              to="/onboarding" 
              className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm relative group"
            >
              Get ARK
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </Link>

            <Link 
              to="/locker" 
              className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm relative group"
            >
              Locker
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            
            {/* Enhanced Connect Wallet Button */}
            <button 
              onClick={handleConnectWallet} 
              disabled={isConnecting}
              className="relative bg-gradient-to-r from-cyan-500 to-teal-600 text-black px-6 py-2 rounded-full font-mono font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                {isConnected && <Zap className="w-4 h-4" />}
                <span>
                  {isConnecting ? 'Connecting...' : isConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
                </span>
              </div>
              
              {/* Scan effect for connected state */}
              {isConnected && (
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent animate-scan"></div>
              )}
            </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
