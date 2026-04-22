
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
      <footer className="relative py-12 md:py-20 px-4 sm:px-6 border-t border-white/5 overflow-hidden">
        {/* Transparent background by default, showing page background */}


        {/* Main Glass Container - Keeping the inner card for structure but making it fully transparent to let the footer glass show through */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl">
            {/* Top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Premium System Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
              {/* Glassmorphism badge */}
              <div className="relative group">
                <div className="relative flex items-center gap-4 px-6 py-3 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl">
                  <div className="relative">
                    <Terminal className="w-5 h-5 text-white/40" />
                  </div>
                  <span className="text-[10px] font-black font-mono text-white tracking-[0.4em] uppercase">SYSTEM_L0CK_FOOTER</span>
                </div>
              </div>
              
              {/* Animated line */}
              <div className="hidden sm:block flex-1 h-px bg-white/5"></div>
              
              {/* Premium Status Indicators */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-[9px] font-black font-mono text-white/40 tracking-[0.3em] uppercase">STATION_ONLINE</span>
                </div>
                <div className="relative flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
                  <Wifi size={12} className="text-white/20" />
                  <span className="text-[9px] font-black font-mono text-white/40 tracking-[0.3em] uppercase">PROTO_MAINNET</span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {/* Premium Brand Section */}
              <div className="space-y-6 lg:col-span-1">
                <div className="flex items-center gap-4 text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                  <img 
                    src="/assets/images/ark-logo-final.webp" 
                    alt="The ARK Logo" 
                    className="w-10 h-10 object-contain opacity-80"
                  />
                  The ARK
                </div>
                
                <div className="relative inline-flex">
                  <div className="relative flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <Shield className="w-4 h-4 text-white/60" />
                    <span className="text-[9px] font-black font-mono text-white/40 tracking-[0.3em] uppercase">PROTOCOL_SECURED</span>
                  </div>
                </div>
                
                <p className="text-white/60 text-sm font-mono leading-relaxed uppercase tracking-tighter">
                  Decentralized Yield Protocol. Protocol Interface ACTIVE.
                </p>
              </div>

              {/* Quick Links Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h4 className="font-black font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase">
                    PROTOCOL_NAV
                  </h4>
                </div>
                <ul className="space-y-4 text-sm font-mono uppercase tracking-[0.2em]">
                  <li>
                    <Link 
                      to="/locker" 
                      className="text-white/40 hover:text-white transition-all duration-300 flex items-center gap-3 group"
                    >
                      <span className="w-1 h-1 bg-white/20 group-hover:bg-white rounded-full transition-all"></span>
                      Locker
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/burn" 
                      className="text-white/40 hover:text-white transition-all duration-300 flex items-center gap-3 group"
                    >
                      <span className="w-1 h-1 bg-white/20 group-hover:bg-white rounded-full transition-all"></span>
                      Burn
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Community Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h4 className="font-black font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase">
                    COMMUNITY
                  </h4>
                </div>
                <div className="relative inline-flex font-mono">
                  <div className="relative flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl uppercase tracking-widest text-[10px]">
                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                    <span className="text-white/20">Awaiting Signal</span>
                  </div>
                </div>
              </div>

              {/* Resources Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h4 className="font-black font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase">
                    PROTOCOL_CODE
                  </h4>
                </div>
                <ul className="space-y-4 text-sm font-mono uppercase tracking-[0.2em]">
                  <li>
                    <a 
                      href="https://scan.pulsechain.com/address/0xF4a370e64DD4673BAA250C5435100FA98661Db4C" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white transition-all duration-300 flex items-center gap-3 group"
                    >
                      <span className="w-1 h-1 bg-white/10 group-hover:bg-white rounded-full transition-all"></span>
                      Source
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://app.pulsex.com/swap?outputCurrency=0xF4a370e64DD4673BAA250C5435100FA98661Db4C" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white transition-all duration-300 flex items-center gap-3 group"
                    >
                      <span className="w-1 h-1 bg-white/10 group-hover:bg-white rounded-full transition-all"></span>
                      PulseX
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Status Bar */}
            <div className="relative mt-20 pt-10 border-t border-white/5">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                {/* Status Cards */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* Operational Status */}
                  <div className="relative group">
                    <div className="relative flex items-center gap-3 px-5 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl">
                      <Activity className="w-4 h-4 text-white/60" />
                      <span className="text-[9px] font-black font-mono text-white/40 tracking-[0.3em] uppercase">STATUS_OPERATIONAL</span>
                    </div>
                  </div>
                  
                  {/* Uptime Status */}
                  <div className="relative group">
                    <div className="relative flex items-center gap-3 px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black font-mono text-white/40 tracking-[0.3em] uppercase">UPTIME_MAXIMA</span>
                    </div>
                  </div>
                </div>
                
                {/* Copyright & Contract */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <span className="text-white/40 text-[10px] font-black font-mono tracking-widest uppercase mb-1">
                    &copy; 2026 The ARK
                  </span>
                  
                  <div className="relative px-5 py-2.5 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[10px] font-mono text-white/40 break-all select-all tracking-widest">
                      0xF4a370e64DD4673BAA250C5435100FA98661Db4C
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
