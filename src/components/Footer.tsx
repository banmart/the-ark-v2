
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Wifi, Shield, Activity } from 'lucide-react';
import DisclaimerDialog from './DisclaimerDialog';

const Footer = () => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <>
      <DisclaimerDialog 
        isOpen={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
      />
    <footer className="relative py-8 md:py-16 px-4 sm:px-6 border-t border-cyan-500/20 overflow-hidden">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 z-0">
        {/* Base quantum gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-teal-900/20 via-black to-black"></div>
        
        {/* Animated quantum grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="pulse-grid bg-grid bg-grid-size animate-pulse"></div>
        </div>
        
        {/* Floating quantum orbs */}
        <div className="floating-orb orb1 bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl"></div>
        <div className="floating-orb orb2 bg-gradient-radial from-purple-500/10 to-transparent blur-3xl"></div>
        
        {/* Scanning lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-pulse"></div>
      </div>

      {/* Glass Container */}
      <div className="relative z-10 max-w-7xl mx-auto bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 sm:p-6 lg:p-8">
        {/* System Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 md:mb-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider">SYSTEM_FOOTER</span>
          </div>
          <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
          
          {/* System Status Indicators */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-green-400">ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">NETWORK</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-1">
            <div className="text-xl sm:text-2xl michroma-regular bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              The Ark
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs font-mono text-green-400">PROTOCOL_SECURE</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Salvation from the crypto flood. Join the ARK and be saved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h4 className="font-mono text-cyan-400 text-sm tracking-wider">QUICK_LINKS</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/locker" className="text-gray-400 hover:text-cyan-400 transition-colors font-mono flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-600 group-hover:bg-cyan-400 rounded-full transition-colors"></span>
                  Locker
                </Link>
              </li>
              <li>
                <Link to="/burn" className="text-gray-400 hover:text-cyan-400 transition-colors font-mono flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-600 group-hover:bg-cyan-400 rounded-full transition-colors"></span>
                  Burn
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <h4 className="font-mono text-purple-400 text-sm tracking-wider">COMMUNITY</h4>
            </div>
            <div className="text-gray-500 text-sm font-mono">
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                Coming Soon
              </span>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <h4 className="font-mono text-teal-400 text-sm tracking-wider">RESOURCES</h4>
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://scan.pulsechain.com/address/0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-teal-400 transition-colors font-mono flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 group-hover:bg-teal-400 rounded-full transition-colors"></span>
                  Contract
                </a>
              </li>
              <li>
                <a 
                  href="https://app.pulsex.com/swap?outputCurrency=0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-teal-400 transition-colors font-mono flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 group-hover:bg-teal-400 rounded-full transition-colors"></span>
                  PulseX
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setIsDisclaimerOpen(true)}
                  className="text-gray-400 hover:text-teal-400 transition-colors font-mono flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-600 group-hover:bg-teal-400 rounded-full transition-colors"></span>
                  No Expectations
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="border-t border-cyan-500/20 mt-6 md:mt-8 pt-4 md:pt-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs font-mono text-green-400">STATUS: OPERATIONAL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-cyan-400">UPTIME: 99.9%</span>
              </div>
            </div>
            <div className="text-left lg:text-center text-gray-400 text-xs sm:text-sm font-mono break-all">
              <div className="mb-1 lg:mb-0">&copy; 2025 The Ark</div>
              <div className="text-xs text-gray-500">0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67</div>
            </div>
          </div>
        </div>

        {/* Scanning Effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent animate-scan"></div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
