import React from 'react';
import NebulaBackground from '../NebulaBackground';

const PremiumBackground = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} top-0 left-0 right-0 h-[70vh] md:h-[100vh] z-0 pointer-events-none overflow-hidden`} aria-hidden="true">
      <NebulaBackground />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      
      {/* Bottom fade out removed to allow transparent hero masking */}
    </div>
  );
};

export default PremiumBackground;
