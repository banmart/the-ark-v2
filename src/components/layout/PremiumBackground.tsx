import React, { useMemo } from 'react';

interface PremiumBackgroundProps {
  variant?: 'default' | 'locker' | 'burn' | 'onboarding';
  particleCount?: number;
}

const PremiumBackground = ({ variant = 'default', particleCount = 16 }: PremiumBackgroundProps) => {
  // Generate particles with memoization for performance
  const particles = useMemo(() => {
    const colors = ['#22d3ee', '#2dd4bf', '#a855f7', '#fbbf24'];
    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      width: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 15,
    }));
  }, [particleCount]);

  // Get orb colors based on variant
  const getOrbColors = () => {
    switch (variant) {
      case 'locker':
        return {
          orb1: 'from-cyan-500/15 via-cyan-500/5',
          orb2: 'from-teal-500/12 via-teal-500/4',
          orb3: 'from-purple-500/8 via-purple-500/2',
          orb4: 'from-amber-500/6 via-amber-500/2',
          gridColor: 'rgba(34, 211, 238, 0.3)',
          scanColor1: 'cyan-500/40',
          scanColor2: 'teal-500/40',
        };
      case 'burn':
        return {
          orb1: 'from-cyan-500/15 via-cyan-500/5',
          orb2: 'from-teal-500/12 via-teal-500/4',
          orb3: 'from-orange-500/10 via-orange-500/3',
          orb4: 'from-amber-500/10 via-amber-500/3',
          gridColor: 'rgba(34, 211, 238, 0.1)',
          scanColor1: 'cyan-500/60',
          scanColor2: 'orange-500/60',
        };
      case 'onboarding':
        return {
          orb1: 'from-cyan-500/8',
          orb2: 'from-teal-500/6',
          orb3: 'from-purple-500/5',
          orb4: 'from-amber-500/4',
          gridColor: 'rgba(34, 211, 238, 0.02)',
          scanColor1: 'cyan-400/40',
          scanColor2: 'teal-400/30',
        };
      default:
        return {
          orb1: 'from-cyan-500/15 via-cyan-500/5',
          orb2: 'from-teal-500/12 via-teal-500/4',
          orb3: 'from-purple-500/8 via-purple-500/2',
          orb4: 'from-amber-500/6 via-amber-500/2',
          gridColor: 'rgba(34, 211, 238, 0.3)',
          scanColor1: 'cyan-500/40',
          scanColor2: 'teal-500/40',
        };
    }
  };

  const orbColors = getOrbColors();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      
      {/* Deep vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Animated gradient orbs */}
      <div 
        className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial ${orbColors.orb1} to-transparent rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite]`}
      />
      <div 
        className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial ${orbColors.orb2} to-transparent rounded-full blur-3xl animate-[float_25s_ease-in-out_infinite_reverse]`}
      />
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial ${orbColors.orb3} to-transparent rounded-full blur-3xl animate-[float_30s_ease-in-out_infinite]`}
      />
      <div 
        className={`absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-radial ${orbColors.orb4} to-transparent rounded-full blur-3xl animate-[float_22s_ease-in-out_infinite_reverse]`}
      />
      
      {/* Film grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Premium tech grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${orbColors.gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${orbColors.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-[particleFloat_20s_ease-in-out_infinite]"
          style={{
            width: `${particle.width}px`,
            height: `${particle.width}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: `radial-gradient(circle, ${particle.color}80 0%, transparent 70%)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      
      {/* Corner glow accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-teal-500/8 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-purple-500/6 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-amber-500/5 to-transparent blur-3xl" />
      
      {/* Animated scan lines */}
      <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-${orbColors.scanColor1} to-transparent animate-[scanline_8s_ease-in-out_infinite]`} />
      <div 
        className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-${orbColors.scanColor2} to-transparent animate-[scanline_8s_ease-in-out_infinite_reverse]`} 
        style={{ animationDelay: '4s' }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px) scale(1.2); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(-20px) scale(0.8); opacity: 0.4; }
          75% { transform: translateY(-45px) translateX(10px) scale(1.1); opacity: 0.5; }
        }
        @keyframes scanline {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PremiumBackground;
