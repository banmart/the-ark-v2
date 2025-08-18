
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const AnimatedBackground = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="fixed w-full h-full top-0 left-0 z-0 overflow-hidden">
      {/* Base gradient background with video colors */}
      <div className="absolute inset-0 bg-gradient-radial from-video-blue/20 via-black to-black"></div>
      
      {/* Animated Grid Pattern */}
      <div className="pulse-grid"></div>
      
      {/* Floating Orbs with video color cycle */}
      <div className="floating-orb orb1 video-blue-orb"></div>
      <div className="floating-orb orb2 video-cyan-orb"></div>
      <div className="floating-orb orb3 video-gold-orb"></div>
      <div className="floating-orb orb4 video-brown-orb"></div>

      {/* Breathing Gradient Bursts with video color palette - Desktop only */}
      {!isMobile && (
        <>
          <div className="gradient-burst burst1 video-blue-burst"></div>
          <div className="gradient-burst burst2 video-cyan-burst"></div>
          <div className="gradient-burst burst3 video-gold-burst"></div>
          <div className="gradient-burst burst4 video-brown-burst"></div>
          <div className="gradient-burst burst5 video-blue-burst"></div>
          <div className="gradient-burst burst6 video-cyan-burst"></div>
        </>
      )}
    </div>
  );
};

export default AnimatedBackground;
