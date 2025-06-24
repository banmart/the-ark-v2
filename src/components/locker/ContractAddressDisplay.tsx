
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
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
    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-cyan-400 mb-1">Locker Contract Address</div>
          <div className="text-xs text-gray-300 font-mono break-all">
            {LOCKER_VAULT_ADDRESS}
          </div>
        </div>
        <button
          onClick={copyContractAddress}
          className="ml-4 bg-cyan-500/20 text-cyan-400 px-3 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ContractAddressDisplay;
