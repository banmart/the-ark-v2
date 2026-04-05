import React from 'react';
import NebulaBackground from './NebulaBackground';

const AnimatedBackground = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} top-0 left-0 right-0 h-[60vh] md:h-[90vh] z-0 pointer-events-none overflow-hidden`} aria-hidden="true">
      <NebulaBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-transparent" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      {/* Bottom fade out removed to allow for transparent masking in parent components */}
    </div>
  );
};

export default AnimatedBackground;
