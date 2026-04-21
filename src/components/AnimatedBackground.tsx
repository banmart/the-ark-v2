import React from 'react';

const AnimatedBackground = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} top-0 left-0 right-0 h-[60vh] md:h-[90vh] z-0 pointer-events-none overflow-hidden`} aria-hidden="true">
      {/* Nebula gradient removed */}
    </div>
  );
};

export default AnimatedBackground;
