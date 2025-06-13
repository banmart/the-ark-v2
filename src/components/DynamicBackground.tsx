
import React from 'react';

const DynamicBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Parallax layers */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed animate-[heroBackgroundFadeIn_2.5s_ease-out]"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://crypto-genesis-beacon.lovable.app/lovable-uploads/00beb11a-64d8-4ae5-8c77-2846b0ef503c.jpg')`,
          transform: 'translateZ(0)',
        }}
      />

      {/* Electric connections */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="electric" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated electric paths */}
        <path
          d="M 100 300 Q 300 100 500 300 T 900 300"
          fill="none"
          stroke="url(#electric)"
          strokeWidth="2"
          filter="url(#glow)"
          className="animate-pulse"
        />
        <path
          d="M 200 500 Q 400 300 600 500 T 1000 500"
          fill="none"
          stroke="url(#electric)"
          strokeWidth="1.5"
          filter="url(#glow)"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <path
          d="M 0 200 Q 200 400 400 200 T 800 200"
          fill="none"
          stroke="url(#electric)"
          strokeWidth="1"
          filter="url(#glow)"
          className="animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </svg>

      {/* Floating geometric elements */}
      <div className="absolute top-20 left-20 w-4 h-4 border border-cyan-400/40 rotate-45 animate-[float_6s_ease-in-out_infinite]"></div>
      <div className="absolute top-40 right-32 w-6 h-6 border border-cyan-400/30 animate-[float_8s_ease-in-out_infinite_2s]"></div>
      <div className="absolute bottom-32 left-40 w-3 h-3 bg-cyan-400/20 rounded-full animate-[float_7s_ease-in-out_infinite_1s]"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 border border-cyan-400/25 rounded-full animate-[float_9s_ease-in-out_infinite_3s]"></div>

      {/* Grid overlay with depth */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-move 25s linear infinite'
          }}
        />
      </div>
    </div>
  );
};

export default DynamicBackground;
