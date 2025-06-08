
import React from 'react';
import { Copy, ExternalLink } from "lucide-react";

interface ContractAddressSectionProps {
  contractAddress: string;
  copyToClipboard: (text: string) => void;
}

const ContractAddressSection = ({ contractAddress, copyToClipboard }: ContractAddressSectionProps) => {
  return (
    <section className="relative z-10 py-12 px-6 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4 text-cyan-400">Smart Contract Address</h3>
        <div className="glass-strong rounded-xl p-6 flex items-center justify-between shadow-2xl">
          <code className="text-sm md:text-base text-gray-300 font-mono">{contractAddress}</code>
          <div className="flex gap-2">
            <button onClick={() => copyToClipboard(contractAddress)} className="p-2 glass-card hover:glass-strong rounded-lg transition-all">
              <Copy size={18} />
            </button>
            <button className="p-2 glass-card hover:glass-strong rounded-lg transition-all">
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractAddressSection;
