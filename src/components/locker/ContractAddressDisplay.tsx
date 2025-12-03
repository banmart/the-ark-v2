import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Shield } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { LOCKER_VAULT_ADDRESS } from '../../utils/constants';

const ContractAddressDisplay = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(LOCKER_VAULT_ADDRESS);
      setIsCopied(true);
      
      toast({
        title: "Copied!",
        description: "Contract address copied to clipboard",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Failed to copy contract address"
      });
    }
  };

  return (
    <div className="relative group">
      {/* Outer glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
      
      {/* Card */}
      <div className="relative bg-black/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-6 mx-2 sm:mx-0 overflow-hidden">
        {/* Inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-sm font-semibold text-cyan-400">Locker Contract Address</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-mono text-green-400 tracking-wider">VERIFIED</span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-300 font-mono break-all bg-black/40 px-3 py-2 rounded-lg border border-white/[0.05]">
              {LOCKER_VAULT_ADDRESS}
            </div>
          </div>
          
          <div className="flex gap-2">
            {/* Copy Button */}
            <button
              onClick={copyContractAddress}
              className={`relative group/btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                isCopied 
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                  : 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/60'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
            
            {/* View on Explorer Button */}
            <a
              href={`https://scan.pulsechain.com/address/${LOCKER_VAULT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-white/[0.05] border border-white/[0.1] text-gray-300 hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Explorer</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractAddressDisplay;
