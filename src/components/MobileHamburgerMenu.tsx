
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap, ExternalLink } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { useBrowserPopup } from './providers/BrowserPopupProvider';

interface MobileHamburgerMenuProps {
  handleConnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  account: string | null;
}

const MobileHamburgerMenu = ({ 
  handleConnectWallet, 
  isConnecting, 
  isConnected, 
  account 
}: MobileHamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openPopup } = useBrowserPopup();

  const handleExternalLink = (url: string, title: string) => {
    openPopup(url, title);
    setIsOpen(false);
  };

  const handleInternalLink = () => {
    setIsOpen(false);
  };

  const handleWalletConnect = () => {
    handleConnectWallet();
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="bg-black/95 backdrop-blur-xl border-cyan-500/30 text-white">
          <DrawerHeader className="border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent michroma-regular">
                Navigation
              </DrawerTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-300 hover:text-cyan-400 transition-colors tech-close-hover"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </DrawerHeader>

          <div className="p-6 space-y-4">
            {/* Internal Navigation Links */}
            <div className="space-y-3">
              <Link
                to="/"
                onClick={handleInternalLink}
                className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200"
              >
                Home
              </Link>

              <Link
                to="/locker"
                onClick={handleInternalLink}
                className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200"
              >
                Lock (Earn)
              </Link>

              <Link
                to="/leaderboard"
                onClick={handleInternalLink}
                className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200"
              >
                Leaderboard
              </Link>
            </div>

            {/* External Links Section */}
            <div className="border-t border-cyan-500/20 pt-4 space-y-3">
              <p className="text-sm font-mono text-cyan-400 uppercase tracking-wider">External Links</p>
              
              <button
                onClick={() => handleExternalLink('https://bridge.mypinata.cloud/ipfs/bafybeif242ld54nzjg2aqxvfse23wpbkqbyqasj3usgslccuajnykonzo4/#/bridge', 'Bridge Assets')}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200"
              >
                Bridge Assets
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleExternalLink('https://ipfs.app.pulsex.com/?inputCurrency=0xefD766cCb38EaF1dfd701853BFCe31359239F305&outputCurrency=0xACC15eF8fa2e702d0138c3662A9E7d696f40F021', 'Buy ARK')}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200"
              >
                Buy ARK
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleExternalLink('https://pulsex.mypinata.cloud/ipfs/bafybeibzu7nje2o2tufb3ifitjrto3n3xcwon7fghq2igtcupulfubnrim/#/add/v2/0xacc15ef8fa2e702d0138c3662a9e7d696f40f021/0xefD766cCb38EaF1dfd701853BFCe31359239F305', 'Add Liquidity')}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-all duration-200"
              >
                Add Liquidity
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet Connection Section */}
            <div className="border-t border-cyan-500/20 pt-4">
              <button
                onClick={handleWalletConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-black px-6 py-3 rounded-lg font-mono font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 relative overflow-hidden"
              >
                <div className="flex items-center justify-center gap-2">
                  {isConnected && <Zap className="w-4 h-4" />}
                  <span>
                    {isConnecting ? 'Connecting...' : isConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
                  </span>
                </div>
              </button>
            </div>

            {/* System Status */}
            <div className="border-t border-cyan-500/20 pt-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono text-green-400">BETA</span>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileHamburgerMenu;
