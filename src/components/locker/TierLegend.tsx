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
  return <div ref={containerRef} className="relative max-w-6xl mx-auto px-6 mb-8">
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
      
    </div>;
};
export default TierLegend;