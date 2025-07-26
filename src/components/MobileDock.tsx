
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Home, Lock, Wallet, Link, Bot } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { useChatContext } from './providers/ChatProvider';

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
  const { setIsOpen } = useChatContext();

  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  const handleOpenAI = () => {
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-nav border-t border-cyan-500/30 mx-4 mb-4 rounded-xl">
        <div className="flex items-center justify-center gap-2 py-4">
          <RouterLink 
            to="/" 
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
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/locker') 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <Lock size={18} />
            <span className="text-xs font-medium">Locker</span>
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default MobileDock;
