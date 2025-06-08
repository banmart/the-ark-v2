
import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  handleConnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  account: string | null;
}

const Navigation = ({ handleConnectWallet, isConnecting, isConnected, account }: NavigationProps) => {
  return (
    <nav className="fixed top-0 w-full glass-nav z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
            ARK ❍
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#swap" className="text-gray-300 hover:text-cyan-400 transition-colors">Swap</a>
            <Link to="/locker" className="text-gray-300 hover:text-cyan-400 transition-colors">Locker</Link>
            <a href="#stats" className="text-gray-300 hover:text-cyan-400 transition-colors">Stats</a>
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
            <a href="#chart" className="text-gray-300 hover:text-cyan-400 transition-colors">Chart</a>
            <button 
              onClick={handleConnectWallet} 
              disabled={isConnecting}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : isConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
