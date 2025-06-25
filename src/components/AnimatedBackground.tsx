
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed w-full h-full top-0 left-0 z-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-black to-black"></div>
      
      {/* Animated Grid Pattern */}
      <div className="pulse-grid"></div>
      
      {/* Floating Orbs */}
      <div className="floating-orb orb1"></div>
      <div className="floating-orb orb2"></div>
      <div className="floating-orb orb3"></div>

      {/* Breathing Gradient Bursts - Below Hero Section */}
      <div className="gradient-burst burst1"></div>
      <div className="gradient-burst burst2"></div>
      <div className="gradient-burst burst3"></div>
      <div className="gradient-burst burst4"></div>
      <div className="gradient-burst burst5"></div>
      <div className="gradient-burst burst6"></div>
    </div>
  );
};

export default AnimatedBackground;
