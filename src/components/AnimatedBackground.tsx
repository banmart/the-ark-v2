import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute top-0 left-0 right-0 h-[60vh] md:h-[90vh] z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-w-[100.1%] min-h-[100.1%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
      >
        <source src="/assets/videos/clouds-section.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
      <div className="absolute inset-0 backdrop-blur-[1.5px]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-black via-black/90 to-transparent z-[5]" />
    </div>
  );
};

export default AnimatedBackground;
