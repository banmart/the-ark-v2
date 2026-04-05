import React from 'react';
import NebulaBackground from './NebulaBackground';

const AnimatedBackground = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} top-0 left-0 right-0 h-[60vh] md:h-[90vh] z-0 pointer-events-none overflow-hidden`} aria-hidden="true">
      <NebulaBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/80" />
      <div className="absolute inset-0 backdrop-blur-[4px]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-black via-black/90 to-transparent z-[5]" />
    </div>
  );
};

export default AnimatedBackground;
