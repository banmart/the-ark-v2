
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Zap, ExternalLink, Wifi, Terminal, Sparkles, ChevronRight } from 'lucide-react';
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

  // Generate floating particles for mobile menu
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${15 + (i * 15)}%`,
    delay: `${i * 0.5}s`,
    duration: `${5 + (i % 3)}s`,
    size: i % 2 === 0 ? 'w-1 h-1' : 'w-0.5 h-0.5',
    color: i % 3 === 0 ? 'bg-cyan-400/30' : i % 3 === 1 ? 'bg-teal-400/20' : 'bg-white/15'
  }));

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* ========== PREMIUM HAMBURGER BUTTON ========== */}
      <SheetTrigger asChild>
        <button className="md:hidden relative group p-2">
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Glass Container */}
          <div className="relative p-2 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-lg group-hover:border-cyan-500/30 transition-all duration-300">
            <Menu size={20} className="text-white/80 group-hover:text-cyan-400 transition-colors duration-300" />
          </div>
        </button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-80 p-0 border-l border-white/[0.08] overflow-hidden"
        style={{ background: 'transparent' }}
      >
        {/* ========== PREMIUM MULTI-LAYER BACKGROUND ========== */}
        <div className="absolute inset-0">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/95 to-black"></div>
          
          {/* Animated Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-10 -left-10 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl"
              style={{ animation: 'mobileFloat 8s ease-in-out infinite' }}
            ></div>
            <div 
              className="absolute top-1/3 -right-10 w-28 h-28 bg-teal-500/10 rounded-full blur-3xl"
              style={{ animation: 'mobileFloat 10s ease-in-out infinite 2s' }}
            ></div>
            <div 
              className="absolute bottom-20 -left-5 w-24 h-24 bg-purple-500/8 rounded-full blur-3xl"
              style={{ animation: 'mobileFloat 12s ease-in-out infinite 4s' }}
            ></div>
          </div>
          
          {/* Film Grain */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          ></div>
          
          {/* Floating Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute ${particle.size} ${particle.color} rounded-full`}
              style={{
                left: particle.left,
                animation: `mobileFloat ${particle.duration} ease-in-out infinite`,
                animationDelay: particle.delay,
                top: `${20 + (particle.id * 15)}%`,
              }}
            ></div>
          ))}
          
          {/* Edge Glow */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-teal-500/20 to-cyan-500/30"></div>
        </div>

        <SheetHeader className="sr-only">
          <SheetTitle>ARK Navigation Menu</SheetTitle>
          <SheetDescription>Access all ARK features and external links</SheetDescription>
        </SheetHeader>
        
        <div className="relative flex flex-col h-full z-10">
          {/* ========== PREMIUM HEADER ========== */}
          <div className="relative p-6 border-b border-white/[0.08]">
            {/* Header Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent"></div>
            
            <div className="relative flex items-center justify-between">
              {/* Brand with Glassmorphism */}
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl blur-lg opacity-60"></div>
                <div className="relative px-3 py-1.5 bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] rounded-lg">
                  <span className="text-xl michroma-regular bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                    ARK
                  </span>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center gap-2">
                {/* LIVE */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-green-500/20 rounded blur-sm"></div>
                  <div className="relative flex items-center gap-1 px-2 py-1 bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded">
                    <div className="relative">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.6)]"></div>
                      <div className="absolute inset-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-40"></div>
                    </div>
                    <span className="text-[10px] font-mono text-green-400 tracking-widest font-bold">LIVE</span>
                  </div>
                </div>
                
                {/* PULSE */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-cyan-500/15 rounded blur-sm"></div>
                  <div className="relative flex items-center gap-1 px-2 py-1 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded">
                    <Wifi className="w-2.5 h-2.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest font-bold">PULSE</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Border Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          </div>

          {/* ========== PREMIUM NAVIGATION LINKS ========== */}
          <div className="flex-1 px-6 py-6 space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400/60" />
              <span className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">Navigation</span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
            </div>
            
            <div className="space-y-3">
              {/* Get ARK Link Card */}
              <button 
                onClick={() => handleInternalLink('/onboarding')}
                className={`relative w-full group overflow-hidden rounded-xl transition-all duration-300 ${
                  isActive('/onboarding') ? 'scale-[1.02]' : ''
                }`}
              >
                {/* Card Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-teal-500/20 rounded-xl blur-md transition-opacity duration-300 ${
                  isActive('/onboarding') ? 'opacity-80' : 'opacity-0 group-hover:opacity-60'
                }`}></div>
                
                {/* Card Content */}
                <div className={`relative flex items-center justify-between p-4 backdrop-blur-sm border rounded-xl transition-all duration-300 ${
                  isActive('/onboarding') 
                    ? 'bg-cyan-500/15 border-cyan-500/40' 
                    : 'bg-white/[0.02] border-white/[0.06] group-hover:bg-white/[0.04] group-hover:border-cyan-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    {/* Indicator Dot */}
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive('/onboarding') 
                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' 
                        : 'bg-white/30 group-hover:bg-cyan-400/60'
                    }`}></div>
                    <span className={`font-mono text-sm font-medium transition-colors duration-300 ${
                      isActive('/onboarding') ? 'text-cyan-400' : 'text-white/80 group-hover:text-white'
                    }`}>
                      Get ARK
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                    isActive('/onboarding') ? 'text-cyan-400' : 'text-white/30 group-hover:text-white/60 group-hover:translate-x-1'
                  }`} />
                </div>
              </button>
              
              {/* Locker Link Card */}
              <button 
                onClick={() => handleInternalLink('/locker')}
                className={`relative w-full group overflow-hidden rounded-xl transition-all duration-300 ${
                  isActive('/locker') ? 'scale-[1.02]' : ''
                }`}
              >
                {/* Card Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-teal-500/20 rounded-xl blur-md transition-opacity duration-300 ${
                  isActive('/locker') ? 'opacity-80' : 'opacity-0 group-hover:opacity-60'
                }`}></div>
                
                {/* Card Content */}
                <div className={`relative flex items-center justify-between p-4 backdrop-blur-sm border rounded-xl transition-all duration-300 ${
                  isActive('/locker') 
                    ? 'bg-cyan-500/15 border-cyan-500/40' 
                    : 'bg-white/[0.02] border-white/[0.06] group-hover:bg-white/[0.04] group-hover:border-cyan-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    {/* Indicator Dot */}
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive('/locker') 
                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' 
                        : 'bg-white/30 group-hover:bg-cyan-400/60'
                    }`}></div>
                    <span className={`font-mono text-sm font-medium transition-colors duration-300 ${
                      isActive('/locker') ? 'text-cyan-400' : 'text-white/80 group-hover:text-white'
                    }`}>
                      Locker
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                    isActive('/locker') ? 'text-cyan-400' : 'text-white/30 group-hover:text-white/60 group-hover:translate-x-1'
                  }`} />
                </div>
              </button>
            </div>
          </div>

          {/* ========== PREMIUM WALLET SECTION ========== */}
          <div className="relative p-6 border-t border-white/[0.08]">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            
            {/* Section Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"></div>
            
            <div className="relative group">
              {/* Button Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-cyan-500/30 rounded-xl blur-md transition-all duration-500 ${
                isConnected ? 'opacity-80' : 'opacity-50 group-hover:opacity-80'
              }`}></div>
              
              <button 
                onClick={() => {
                  handleConnectWallet();
                  setIsOpen(false);
                }}
                disabled={isConnecting}
                className="relative w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 bg-[length:200%_100%] text-black px-6 py-3.5 rounded-xl font-mono font-bold transition-all duration-500 disabled:opacity-50 overflow-hidden group-hover:bg-[position:100%_0]"
              >
                {/* Inner Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl"></div>
                
                {/* Content */}
                <div className="relative flex items-center justify-center gap-2">
                  {isConnected ? (
                    <>
                      <div className="relative">
                        <Zap className="w-4 h-4" />
                        <div className="absolute inset-0 animate-pulse">
                          <Zap className="w-4 h-4 text-white/50" />
                        </div>
                      </div>
                      <span className="font-bold">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.6)]"></div>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                    </>
                  )}
                </div>
                
                {/* Scan Effect */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl pointer-events-none">
                  <div 
                    className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    style={{ animation: 'mobileScan 2s linear infinite' }}
                  ></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* ========== KEYFRAME ANIMATIONS ========== */}
        <style>{`
          @keyframes mobileFloat {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
            50% { transform: translateY(-15px) translateX(8px); opacity: 1; }
          }
          @keyframes mobileScan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
