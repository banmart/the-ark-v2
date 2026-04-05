import React from 'react';
import NebulaBackground from '../NebulaBackground';

const PremiumBackground = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} top-0 left-0 right-0 h-[70vh] md:h-[100vh] z-0 pointer-events-none overflow-hidden`} aria-hidden="true">
      <NebulaBackground />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />
      <div className="absolute inset-0 backdrop-blur-[4px]" />
      
      {/* Bottom fade out to page content */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-[5]" />
    </div>
  );
};

export default PremiumBackground;
