import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Zap, ExternalLink, Wifi } from 'lucide-react';
import { useBrowserPopup } from './providers/BrowserPopupProvider';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  handleConnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  account: string | null;
}

const MobileMenu = ({ handleConnectWallet, isConnecting, isConnected, account }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openPopup } = useBrowserPopup();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const handleNewTabLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleExternalLink = (url: string, title: string) => {
    openPopup(url, title);
    setIsOpen(false);
  };

  const handleInternalLink = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-80 bg-gradient-to-b from-black via-gray-900 to-black border-l-2 border-cyan-500/30 p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>ARK Navigation Menu</SheetTitle>
          <SheetDescription>Access all ARK features and external links</SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
            <div className="text-xl michroma-regular bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              ARK
            </div>
            <div className="flex items-center gap-3">
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

          {/* Navigation Links */}
          <div className="flex-1 px-6 py-4 space-y-6">
            {/* External Links Section */}

            {/* Internal Links Section */}
            <div>
              <h3 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">Navigation</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => handleInternalLink('/onboarding')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 font-mono text-sm ${
                    isActive('/onboarding') 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                  }`}
                >
                  Onboarding
                </button>
                
                <button 
                  onClick={() => handleInternalLink('/locker')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 font-mono text-sm ${
                    isActive('/locker') 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                  }`}
                >
                  Vault
                </button>
                
                <button 
                  onClick={() => handleInternalLink('/leaderboard')}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 font-mono text-sm ${
                    isActive('/leaderboard') 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                  }`}
                >
                  Leaderboard
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="p-6 border-t border-cyan-500/20">
            <button 
              onClick={() => {
                handleConnectWallet();
                setIsOpen(false);
              }}
              disabled={isConnecting}
              className="w-full relative bg-gradient-to-r from-cyan-500 to-teal-600 text-black px-6 py-3 rounded-lg font-mono font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;