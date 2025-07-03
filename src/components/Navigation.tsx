
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Wifi, Bot } from 'lucide-react';
import { useChatContext } from './providers/ChatProvider';
import { useBrowserPopup } from './providers/BrowserPopupProvider';

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
              ARK ❍
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            
            {/* System Status Indicators */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-green-400">BETA</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-400">PULSE</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">

            <button 
              onClick={() => handleExternalLink('https://bridge.mypinata.cloud/ipfs/bafybeif242ld54nzjg2aqxvfse23wpbkqbyqasj3usgslccuajnykonzo4/#/bridge', 'Bridge Assets')}
              className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm relative group"
            >
              Bridge Assets
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </button>
            <button 
              onClick={() => handleExternalLink('https://ipfs.app.pulsex.com/?inputCurrency=0xefD766cCb38EaF1dfd701853BFCe31359239F305&outputCurrency=0xACC15eF8fa2e702d0138c3662A9E7d696f40F021', 'Buy ARK')}
              className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm relative group"
            >
              Buy ARK
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </button>
            <button 
              onClick={() => handleExternalLink('https://pulsex.mypinata.cloud/ipfs/bafybeibzu7nje2o2tufb3ifitjrto3n3xcwon7fghq2igtcupulfubnrim/#/add/v2/0xacc15ef8fa2e702d0138c3662a9e7d696f40f021/0xefD766cCb38EaF1dfd701853BFCe31359239F305', 'Add Liquidity')}
              className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm relative group"
            >
              Add Liquidity
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </button>
            
            <Link 
              to="/locker" 
              className="text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm relative group"
            >
              Lock (Earn)
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
            </Link>

            
            {/* AI Chat Assistant Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative group p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full hover:scale-110 transition-all duration-300 overflow-hidden"
              title="AI Assistant"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Bot className="w-5 h-5 text-purple-400 relative z-10" />
              
              {/* Pulsing dot indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full animate-pulse"></div>
            </button>
            
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
    </nav>
  );
};

export default Navigation;
