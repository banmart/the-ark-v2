
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Wifi, Terminal, Sparkles } from 'lucide-react';
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

  // Generate floating particles
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + (i * 12)}%`,
    delay: `${i * 0.4}s`,
    duration: `${6 + (i % 3)}s`,
    size: i % 2 === 0 ? 'w-1 h-1' : 'w-0.5 h-0.5',
    color: i % 3 === 0 ? 'bg-cyan-400/40' : i % 3 === 1 ? 'bg-teal-400/30' : 'bg-white/20'
  }));

  return (
    <nav className="fixed top-0 w-full z-50 overflow-hidden">
      {/* ========== PREMIUM MULTI-LAYER BACKGROUND ========== */}
      
      {/* Layer 1: Deep Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none"></div>
      
      {/* Layer 2: Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
          style={{ animation: 'navFloat 8s ease-in-out infinite' }}
        ></div>
        <div 
          className="absolute -top-5 right-1/4 w-32 h-32 bg-teal-500/8 rounded-full blur-3xl"
          style={{ animation: 'navFloat 10s ease-in-out infinite 2s' }}
        ></div>
        <div 
          className="absolute top-0 -right-10 w-36 h-36 bg-purple-500/6 rounded-full blur-3xl"
          style={{ animation: 'navFloat 12s ease-in-out infinite 4s' }}
        ></div>
      </div>
      
      {/* Layer 3: Film Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      ></div>
      
      {/* Layer 4: Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute ${particle.size} ${particle.color} rounded-full`}
            style={{
              left: particle.left,
              animation: `navFloat ${particle.duration} ease-in-out infinite`,
              animationDelay: particle.delay,
              top: '50%',
            }}
          ></div>
        ))}
      </div>
      
      {/* Layer 5: Edge Glow Accents */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-teal-500/5 to-transparent pointer-events-none"></div>
      
      {/* Layer 6: Main Glass Background */}
      <div className={`absolute inset-0 backdrop-blur-2xl transition-all duration-500 ${isScrolled ? 'bg-black/40' : 'bg-black/60'}`}></div>
      
      {/* Layer 7: Inner Radial Highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.03)_0%,_transparent_70%)] pointer-events-none"></div>

      {/* ========== MAIN CONTAINER WITH PREMIUM BORDER ========== */}
      <div className="relative z-10">
        {/* Outer Glow Ring */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 via-teal-500/10 to-cyan-500/20 rounded-none opacity-60 blur-sm pointer-events-none"></div>
        
        {/* Top Edge Highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Main Content Area */}
        <div className="relative max-w-7xl mx-auto px-6 py-4 border-b border-white/[0.08]">
          
          {/* Bottom Border Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
          
          {/* Animated Scan Line */}
          <div 
            className="absolute bottom-0 left-0 w-full h-px overflow-hidden"
            style={{ animation: 'navScan 4s linear infinite' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>
          </div>

          <div className="flex justify-between items-center">
            {/* ========== PREMIUM BRAND SECTION ========== */}
            <div className="flex items-center gap-4">
              {/* Brand Logo with Glassmorphism */}
              <Link 
                to="/" 
                className="relative group"
              >
                {/* Glow Background */}
                <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Glass Container */}
                <div className="relative px-4 py-2 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-xl group-hover:border-cyan-500/20 transition-all duration-300">
                  {/* Logo Text with Multi-Gradient */}
                  <span className="text-2xl michroma-regular bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-teal-300 group-hover:to-amber-300 transition-all duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                    The ARK
                  </span>
                  
                  {/* Animated Underline */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 group-hover:w-3/4 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
                </div>
              </Link>
              
              {/* ========== PREMIUM STATUS INDICATORS ========== */}
              <div className="hidden md:flex items-center gap-3">
                {/* LIVE Status */}
                <div className="relative group">
                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-1 bg-green-500/20 rounded-lg blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg group-hover:border-green-400/50 transition-all duration-300">
                    {/* Pulsing Indicator with Ring */}
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-40"></div>
                    </div>
                    <span className="text-xs font-mono text-green-400 tracking-widest font-bold">LIVE</span>
                  </div>
                </div>
                
                {/* PULSE Status */}
                <div className="relative group">
                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-1 bg-cyan-500/15 rounded-lg blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg group-hover:border-cyan-400/50 transition-all duration-300">
                    <Wifi className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                    <span className="text-xs font-mono text-cyan-400 tracking-widest font-bold">PULSE</span>
                  </div>
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
              
              {/* ========== PREMIUM DESKTOP NAVIGATION ========== */}
              <div className="hidden md:flex items-center gap-6">
                {/* Get ARK Link */}
                <Link 
                  to="/onboarding" 
                  className="relative group px-4 py-2"
                >
                  {/* Hover Glass Background */}
                  <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm border border-transparent rounded-lg opacity-0 group-hover:opacity-100 group-hover:border-cyan-500/20 transition-all duration-300"></div>
                  
                  {/* Bullet Point */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_6px_rgba(34,211,238,0.6)]"></div>
                  
                  <span className="relative text-white/80 group-hover:text-cyan-400 transition-colors duration-300 font-mono text-sm font-medium">
                    Get ARK
                  </span>
                  
                  {/* Gradient Underline */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.4)]"></div>
                </Link>

                {/* Locker Link */}
                <Link 
                  to="/locker" 
                  className="relative group px-4 py-2"
                >
                  {/* Hover Glass Background */}
                  <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm border border-transparent rounded-lg opacity-0 group-hover:opacity-100 group-hover:border-cyan-500/20 transition-all duration-300"></div>
                  
                  {/* Bullet Point */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_6px_rgba(34,211,238,0.6)]"></div>
                  
                  <span className="relative text-white/80 group-hover:text-cyan-400 transition-colors duration-300 font-mono text-sm font-medium">
                    Locker
                  </span>
                  
                  {/* Gradient Underline */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.4)]"></div>
                </Link>
                
                {/* ========== LUXURY CONNECT WALLET BUTTON ========== */}
                <div className="relative group">
                  {/* Outer Glow Ring */}
                  <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-cyan-500/30 rounded-full blur-md transition-all duration-500 ${isConnected ? 'opacity-80' : 'opacity-50 group-hover:opacity-80'}`}></div>
                  
                  <button 
                    onClick={handleConnectWallet} 
                    disabled={isConnecting}
                    className="relative bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 bg-[length:200%_100%] text-black px-6 py-2.5 rounded-full font-mono font-bold transition-all duration-500 disabled:opacity-50 overflow-hidden group-hover:bg-[position:100%_0] hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  >
                    {/* Inner Glass Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center gap-2">
                      {isConnected ? (
                        <>
                          <div className="relative">
                            <Zap className="w-4 h-4 drop-shadow-[0_0_4px_rgba(0,0,0,0.3)]" />
                            <div className="absolute inset-0 animate-pulse">
                              <Zap className="w-4 h-4 text-white/50" />
                            </div>
                          </div>
                          <span className="font-bold">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                          {/* Connected Status Dot */}
                          <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.6)]"></div>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Scan Line Effect */}
                    <div 
                      className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-full pointer-events-none"
                    >
                      <div 
                        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                        style={{ animation: 'navScan 2s linear infinite' }}
                      ></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ========== KEYFRAME ANIMATIONS ========== */}
      <style>{`
        @keyframes navFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(5px); opacity: 1; }
        }
        @keyframes navScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
