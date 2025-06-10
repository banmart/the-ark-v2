
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Lock } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const MobileDock = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-nav border-t border-cyan-500/30 mx-4 mb-4 rounded-xl">
        <div className="flex items-center justify-center gap-8 py-4">
          <Link 
            to="/" 
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-200 ${
              isActive('/') 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <Home size={20} />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link 
            to="/locker" 
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-200 ${
              isActive('/locker') 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <Lock size={20} />
            <span className="text-xs font-medium">Locker</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileDock;
