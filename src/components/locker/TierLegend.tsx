
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';
import TierCard from './tier-legend/TierCard';
import TierExpandedDetails from './tier-legend/TierExpandedDetails';
import { tiers } from './tier-legend/tierData';

const TierLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div ref={containerRef} className="relative max-w-6xl mx-auto px-6 mb-8">
      {/* Quantum Field Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Container */}
      <div className="relative bg-black/30 backdrop-blur-xl border border-cyan-500/30 rounded-xl overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyan-500/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-cyan-400 text-sm tracking-wider">
              [TIER_LEGEND_SYSTEM]
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-400">
              {isExpanded ? 'COLLAPSE' : 'EXPAND'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            )}
          </div>
        </div>

        {/* Compact Tier Display - Responsive Grid */}
        <div className="px-4 pb-4">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}`}>
            {tiers.map((tier, index) => (
              <TierCard key={tier.name} tier={tier} index={index} isMobile={isMobile} />
            ))}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && <TierExpandedDetails tiers={tiers} />}

        {/* Scan Effect */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default TierLegend;
