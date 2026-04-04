import React from 'react';

const PremiumBackground = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} top-0 left-0 right-0 h-[70vh] md:h-[100vh] z-0 pointer-events-none overflow-hidden`} aria-hidden="true">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-w-full min-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
      >
        <source src="/assets/videos/clouds-section.mp4" type="video/mp4" />
      </video>
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      
      {/* Bottom fade out to page content */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-[5]" />
    </div>
  );
};

export default PremiumBackground;
