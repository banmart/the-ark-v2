import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Shield, Database, Cpu, CheckCircle } from "lucide-react";

interface ContractAddressSectionProps {
  contractAddress: string;
  copyToClipboard: (text: string) => void;
}

const ContractAddressSection = ({ contractAddress, copyToClipboard }: ContractAddressSectionProps) => {
  const [scanPhase, setScanPhase] = useState(0);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Security scan sequence
    const phases = [
      { delay: 300, phase: 1 },   // Initializing scan
      { delay: 1200, phase: 2 },  // Analyzing contract
      { delay: 2000, phase: 3 },  // Verification complete
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setScanPhase(phase), delay);
    });

    // Auto-verify sequence
    setTimeout(() => {
      setVerifying(true);
      setTimeout(() => setVerifying(false), 2000);
    }, 2500);
  }, []);

  const handleCopy = () => {
    copyToClipboard(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-10 py-16 px-6 bg-gradient-to-r from-black/20 via-cyan-500/5 to-black/20">
      {/* Security Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(20, 184, 166, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Security Header */}
        <div className={`mb-8 transition-all duration-1000 ${scanPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-2 text-cyan-400/60 font-mono text-xs mb-3">
            <Shield className="w-3 h-3 animate-pulse" />
            <span>[SECURITY_PROTOCOL_ACTIVE]</span>
            <Shield className="w-3 h-3 animate-pulse" />
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
            <span className="animate-[glitch_4s_ease-in-out_infinite]">QUANTUM</span>{' '}
            <span className="animate-[glitch_4s_ease-in-out_0.7s_infinite]">CONTRACT</span>
          </h3>
          
          <p className="text-gray-400 font-mono text-sm">
            <span className="text-cyan-400">[IMMUTABLE_ADDRESS]</span> Verified smart contract deployed on PulseChain mainnet
          </p>
        </div>

        {/* Main Contract Display */}
        <div className={`relative transition-all duration-1000 delay-300 ${scanPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Outer Security Frame */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-1 shadow-2xl shadow-cyan-500/20">
            {/* Animated Security Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent via-teal-500/20 via-transparent to-cyan-500/20 rounded-2xl animate-[pulse_3s_ease-in-out_infinite]"></div>
            
            <div className="relative bg-black/60 rounded-xl p-6 md:p-8">
              {/* Security Status Bar */}
              <div className="flex items-center justify-between mb-6 text-xs font-mono">
                <div className="flex items-center gap-2 text-green-400">
                  <Database className="w-3 h-3 animate-pulse" />
                  <span>CONTRACT_VERIFIED</span>
                </div>
                <div className="text-cyan-400">
                  CHAIN: PULSECHAIN | BLOCK: #{Math.floor(Math.random() * 1000000)}
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Cpu className="w-3 h-3" />
                  <span>IMMUTABLE</span>
                </div>
              </div>

              {/* Contract Address Display */}
              <div className="relative">
                {/* Terminal Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-cyan-400/60 font-mono text-xs">
                    [CONTRACT_TERMINAL]
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {verifying ? (
                      <span className="text-yellow-400 animate-pulse">VERIFYING...</span>
                    ) : (
                      <span className="text-green-400">✓ VERIFIED</span>
                    )}
                  </div>
                </div>

                {/* Address Container */}
                <div className="bg-black/50 border border-cyan-500/40 rounded-xl p-4 md:p-6 hover:border-cyan-500/60 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Contract Address */}
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-mono mb-2">
                        0x CONTRACT ADDRESS:
                      </div>
                      <code className="text-sm md:text-base text-cyan-300 font-mono break-all block bg-black/30 p-3 rounded border border-gray-600/30">
                        {contractAddress}
                      </code>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center md:justify-end flex-shrink-0">
                      <button 
                        onClick={handleCopy}
                        className="relative p-3 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/50 hover:border-cyan-400 rounded-lg transition-all hover:scale-110 group overflow-hidden"
                      >
                        {copied ? (
                          <CheckCircle size={18} className="text-green-400" />
                        ) : (
                          <Copy size={18} className="text-cyan-400" />
                        )}
                        
                        {/* Button Energy Effect */}
                        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        {/* Copy Success Animation */}
                        {copied && (
                          <div className="absolute inset-0 bg-green-400/20 animate-[ping_0.5s_ease-out]"></div>
                        )}
                      </button>

                      <button className="relative p-3 bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-500/50 hover:border-teal-400 rounded-lg transition-all hover:scale-110 group overflow-hidden">
                        <ExternalLink size={18} className="text-teal-400" />
                        
                        {/* Button Energy Effect */}
                        <div className="absolute inset-0 bg-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Indicators */}
                <div className={`mt-4 transition-all duration-1000 delay-600 ${scanPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <div className="text-green-400 mb-1">✓ OWNERSHIP</div>
                      <div className="text-gray-400">RENOUNCED</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                      <div className="text-blue-400 mb-1">✓ LIQUIDITY</div>
                      <div className="text-gray-400">LOCKED</div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
                      <div className="text-cyan-400 mb-1">✓ AUDIT</div>
                      <div className="text-gray-400">VERIFIED</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Notice */}
        <div className={`mt-8 transition-all duration-1000 delay-900 ${scanPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-xs font-mono text-gray-500 max-w-2xl mx-auto">
            <span className="text-cyan-400">[SECURITY_NOTICE]</span> This contract has been deployed with maximum security protocols. 
            Ownership renounced • Liquidity locked • Code verified • Immutable forever
          </div>
        </div>

        {/* Floating Security Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-green-500/20 border border-green-500/40 rounded-full p-2 animate-pulse">
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div className="bg-blue-500/20 border border-blue-500/40 rounded-full p-2 animate-pulse delay-500">
            <Database className="w-4 h-4 text-blue-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractAddressSection;