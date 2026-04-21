import React from 'react';
import NebulaBackground from '../NebulaBackground';

const PremiumBackground = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <>
      {/* Subtle full-screen dot-grid WebGL pattern */}
      <NebulaBackground />
    </>
  );
};

export default PremiumBackground;
