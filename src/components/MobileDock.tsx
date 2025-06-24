
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Home, Lock, Wallet, Link } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface MobileDockProps {
  handleConnectWallet?: () => void;
  isConnecting?: boolean;
  isConnected?: boolean;
  account?: string | null;
}

const MobileDock = ({ 
  handleConnectWallet, 
  isConnecting = false, 
  isConnected = false, 
  account 
}: MobileDockProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-nav border-t border-cyan-500/30 mx-4 mb-4 rounded-xl">
        <div className="flex items-center justify-center gap-2 py-4">
          <RouterLink 
            to="/" 
            onClick={() => window.scrollTo(0, 0)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/') 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <Home size={18} />
            <span className="text-xs font-medium">Home</span>
          </RouterLink>
          
          <RouterLink 
            to="/locker" 
            onClick={() => window.scrollTo(0, 0)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/locker') 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <Lock size={18} />
            <span className="text-xs font-medium">Locker</span>
          </RouterLink>

          <a 
            href="https://pulse-bridge-onboard.lovable.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
          >
            <Link size={18} />
            <span className="text-xs font-medium">Bridge</span>
          </a>

          {handleConnectWallet && (
            <button 
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isConnected 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              } disabled:opacity-50`}
            >
              <Wallet size={18} />
              <span className="text-xs font-medium">
                {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Wallet'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileDock;
