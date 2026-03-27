import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Wifi, Terminal, Zap } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  handleConnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  account: string | null;
}

const Navigation = ({ 
  handleConnectWallet, 
  isConnecting, 
  isConnected, 
  account,
}: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Get Started', href: '/onboarding' },
    { label: 'Locker', href: '/locker' },
    { label: 'Burn', href: '/burn' },
    { label: 'DAO', href: '/dao' },
    { label: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 font-sans ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="mx-auto px-6 md:px-[120px] py-[20px] flex justify-between items-center transition-all duration-500">
        
        {/* Left Side: Logo & Status Indicators */}
        <div className="flex items-center gap-[60px]">
          {/* Logo with Minimalist Style */}
          <Link to="/" className="group relative flex items-center">
            <span className="relative text-white text-[24px] font-black tracking-tighter uppercase whitespace-nowrap">THE ARK</span>
          </Link>

          {/* Status Indicators - Desktop Only */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl">
              <div className="relative">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="absolute inset-0 w-1 h-1 bg-white rounded-full animate-ping opacity-40" />
              </div>
              <span className="text-[9px] font-black text-white/40 tracking-[0.3em] font-mono uppercase">PROTOCOL_LIVE</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl">
              <Wifi size={10} className="text-white/40" />
              <span className="text-[9px] font-black text-white/40 tracking-[0.3em] font-mono uppercase">PULSECHAIN</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Menu Links & Wallet */}
        <div className="flex items-center gap-[30px] lg:gap-[60px]">
          {/* Menu Links - Desktop Only */}
          <div className="hidden lg:flex items-center gap-[40px]">
            {menuItems.map((item) => (
              <Link 
                key={item.label}
                to={item.href}
                className="relative text-[14px] font-medium text-white/70 hover:text-white transition-colors group flex items-center gap-2"
              >
                {item.label}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Wallet Toggle Button */}
          <div className="relative group">
            <button 
              onClick={handleConnectWallet}
              className="relative px-8 py-3 bg-white text-black rounded-2xl flex items-center justify-center transition-all hover:bg-neutral-200 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <div className="relative flex items-center gap-3">
                {isConnected ? (
                  <>
                    <span className="text-[11px] font-black font-mono tracking-widest uppercase italic">
                      {account?.slice(0, 6)}...{account?.slice(-4)}
                    </span>
                    <div className="w-1 h-1 bg-black rounded-full" />
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] font-mono">
                      {isConnecting ? 'DETECTING...' : 'AWAKEN SOUL'}
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Layer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-white/10 p-8 flex flex-col gap-8 animate-fade-in shadow-2xl">
          {menuItems.map((item) => (
            <Link 
              key={item.label}
              to={item.href}
              className="text-white/80 text-[18px] font-medium hover:text-white flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
              <ChevronDown size={14} className="-rotate-90 opacity-20" />
            </Link>
          ))}
          <div className="h-px w-full bg-white/10" />
          <button 
            onClick={() => { handleConnectWallet(); setMobileMenuOpen(false); }}
            className="w-full py-4 text-center text-black bg-white rounded-xl font-bold uppercase tracking-widest text-sm"
          >
            {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
