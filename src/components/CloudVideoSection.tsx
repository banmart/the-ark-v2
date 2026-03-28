import React from 'react';

const CloudVideoSection = () => {
  return (
    <section 
      className="relative w-[100vw] left-1/2 -ml-[50vw] min-h-[70vh] md:min-h-[90vh] overflow-hidden bg-black m-0 p-0"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/assets/videos/clouds-section.mp4" type="video/mp4" />
      </video>
    </section>
  );
};

export default CloudVideoSection;
