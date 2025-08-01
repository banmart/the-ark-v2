import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Shield, Database, Cpu, CheckCircle } from "lucide-react";
interface ContractAddressSectionProps {
  contractAddress: string;
  copyToClipboard: (text: string) => void;
}
const ContractAddressSection = ({
  contractAddress,
  copyToClipboard
}: ContractAddressSectionProps) => {
  const [scanPhase, setScanPhase] = useState(0);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  useEffect(() => {
    // Security scan sequence
    const phases = [{
      delay: 300,
      phase: 1
    },
    // Initializing scan
    {
      delay: 1200,
      phase: 2
    },
    // Analyzing contract
    {
      delay: 2000,
      phase: 3
    } // Verification complete
    ];
    phases.forEach(({
      delay,
      phase
    }) => {
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
  return <section className="relative z-10 py-16 px-6 bg-gradient-to-r from-black/20 via-cyan-500/5 to-black/20">
      {/* Security Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        
      </div>

      
    </section>;
};
export default ContractAddressSection;