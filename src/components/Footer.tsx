
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Wifi, Shield, Activity, Sparkles, ExternalLink } from 'lucide-react';
import DisclaimerDialog from './DisclaimerDialog';

const Footer = () => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <>
      <DisclaimerDialog 
        isOpen={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
      />
      <footer className="relative py-12 md:py-20 px-4 sm:px-6 border-t border-cyan-500/20 overflow-hidden">
        {/* Premium Multi-Layer Background */}
        <div className="absolute inset-0 z-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black to-black"></div>
          
          {/* Deep vignette overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.8)_100%)]"></div>
          
          {/* Animated gradient orbs */}
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
              animation: 'footerFloat 20s ease-in-out infinite'
            }}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
              animation: 'footerFloat 25s ease-in-out infinite reverse'
            }}
          ></div>
          <div 
            className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
              animation: 'footerFloat 22s ease-in-out infinite 3s'
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
              animation: 'footerFloat 28s ease-in-out infinite 5s'
            }}
          ></div>
          
          {/* Film grain texture */}
          <div 
            className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          ></div>
          
          {/* Tech grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          ></div>
          
          {/* Floating particles */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: ['#22d3ee', '#a855f7', '#14b8a6', '#10b981'][i % 4],
                opacity: 0.4 + Math.random() * 0.3,
                animation: `footerFloat ${15 + Math.random() * 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`
              }}
            ></div>
          ))}
          
          {/* Corner glow accents */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-purple-500/8 to-transparent blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-gradient-radial from-teal-500/10 to-transparent blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-radial from-emerald-500/8 to-transparent blur-3xl"></div>
          
          {/* Top scan line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
        </div>

        {/* Main Glass Container with Outer Glow */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Outer glow ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-teal-500/20 rounded-2xl blur-xl opacity-50"></div>
          
          <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">
            {/* Top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {/* Inner radial highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-cyan-500/5 to-transparent blur-2xl"></div>

            {/* Premium System Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 md:mb-10">
              {/* Glassmorphism badge */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative flex items-center gap-3 px-4 py-2 bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] rounded-xl">
                  <div className="relative">
                    <Terminal className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  </div>
                  <span className="text-sm font-mono text-white tracking-wider">SYSTEM FOOTER</span>
                  <Sparkles className="w-4 h-4 text-cyan-400/60" />
                </div>
              </div>
              
              {/* Animated gradient line */}
              <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-cyan-500/50 via-purple-500/30 to-transparent"></div>
              
              {/* Premium Status Indicators */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-lg group">
                  <div className="relative">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 tracking-wider">ONLINE</span>
                </div>
                <div className="relative flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-lg">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]" />
                  <span className="text-xs font-mono text-cyan-400 tracking-wider">NETWORK</span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {/* Premium Brand Section */}
              <div className="space-y-5 lg:col-span-1">
                <div className="text-2xl sm:text-3xl michroma-regular bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  The Ark
                </div>
                
                {/* Glassmorphism security badge */}
                <div className="relative inline-flex group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur opacity-50"></div>
                  <div className="relative flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-lg">
                    <Shield className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-mono text-emerald-400 tracking-wider">PROTOCOL SECURE</span>
                  </div>
                </div>
                
                <p className="text-white/60 text-sm leading-relaxed">
                  Salvation from the crypto flood. Join the ARK and be saved.
                </p>
                
                {/* Animated accent line */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
              </div>

              {/* Quick Links Column */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <h4 className="font-mono text-sm tracking-wider bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    QUICK LINKS
                  </h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link 
                      to="/locker" 
                      className="text-white/50 hover:text-cyan-400 transition-all duration-300 font-mono flex items-center gap-3 group hover:translate-x-1"
                    >
                      <span className="w-1.5 h-1.5 bg-white/20 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(6,182,212,0.6)] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                      Locker
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/burn" 
                      className="text-white/50 hover:text-cyan-400 transition-all duration-300 font-mono flex items-center gap-3 group hover:translate-x-1"
                    >
                      <span className="w-1.5 h-1.5 bg-white/20 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(6,182,212,0.6)] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                      Burn
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Community Column */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-purple-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <h4 className="font-mono text-sm tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    COMMUNITY
                  </h4>
                </div>
                <div className="relative inline-flex">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg blur opacity-50"></div>
                  <div className="relative flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-lg">
                    <span className="w-1.5 h-1.5 bg-purple-400/50 rounded-full"></span>
                    <span className="text-white/40 text-sm font-mono">Coming Soon</span>
                  </div>
                </div>
              </div>

              {/* Resources Column */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-teal-400 rounded-full"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <h4 className="font-mono text-sm tracking-wider bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    RESOURCES
                  </h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a 
                      href="https://scan.pulsechain.com/address/0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-teal-400 transition-all duration-300 font-mono flex items-center gap-3 group hover:translate-x-1"
                    >
                      <span className="w-1.5 h-1.5 bg-white/20 group-hover:bg-teal-400 group-hover:shadow-[0_0_8px_rgba(20,184,166,0.6)] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                      Contract
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://app.pulsex.com/swap?outputCurrency=0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-teal-400 transition-all duration-300 font-mono flex items-center gap-3 group hover:translate-x-1"
                    >
                      <span className="w-1.5 h-1.5 bg-white/20 group-hover:bg-teal-400 group-hover:shadow-[0_0_8px_rgba(20,184,166,0.6)] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                      PulseX
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={() => setIsDisclaimerOpen(true)}
                      className="text-white/50 hover:text-teal-400 transition-all duration-300 font-mono flex items-center gap-3 group hover:translate-x-1"
                    >
                      <span className="w-1.5 h-1.5 bg-white/20 group-hover:bg-teal-400 group-hover:shadow-[0_0_8px_rgba(20,184,166,0.6)] rounded-full transition-all duration-300 group-hover:scale-125"></span>
                      No Expectations
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Status Bar */}
            <div className="relative mt-10 pt-8">
              {/* Separator with gradient */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Status Cards */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Operational Status */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative flex items-center gap-2 px-3 py-2 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-lg">
                      <Activity className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                      <span className="text-xs font-mono text-emerald-400 tracking-wider">STATUS: OPERATIONAL</span>
                    </div>
                  </div>
                  
                  {/* Uptime Status */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative flex items-center gap-2 px-3 py-2 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-lg">
                      <div className="relative">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-40"></div>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 tracking-wider">UPTIME: 99.9%</span>
                    </div>
                  </div>
                </div>
                
                {/* Copyright & Contract */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="text-white/40 text-xs sm:text-sm font-mono">
                    &copy; 2025 The Ark
                  </span>
                  
                  {/* Contract address pill */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg blur opacity-30"></div>
                    <div className="relative px-3 py-1.5 bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-lg">
                      <span className="text-xs font-mono text-white/30 break-all">
                        0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom scan line effect */}
            <div 
              className="absolute bottom-0 left-0 w-full h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.6), transparent)',
                animation: 'footerScan 4s ease-in-out infinite'
              }}
            ></div>
          </div>
        </div>

        {/* Keyframes */}
        <style>{`
          @keyframes footerFloat {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-15px) translateX(10px); }
            50% { transform: translateY(-5px) translateX(-5px); }
            75% { transform: translateY(-20px) translateX(-10px); }
          }
          @keyframes footerScan {
            0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
            50% { opacity: 0.8; transform: scaleX(1); }
          }
        `}</style>
      </footer>
    </>
  );
};

export default Footer;
