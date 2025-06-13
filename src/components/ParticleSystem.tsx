
import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'trail' | 'explosion' | 'ark';
}

interface ParticleSystemProps {
  width: number;
  height: number;
}

const ParticleSystem = ({ width, height }: ParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    const createTrailParticle = (x: number, y: number) => {
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 60,
        maxLife: 60,
        size: Math.random() * 3 + 1,
        color: `hsl(${180 + Math.random() * 40}, 100%, 70%)`,
        type: 'trail' as const
      };
    };

    const createExplosionParticles = (x: number, y: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < 15; i++) {
        const angle = (Math.PI * 2 * i) / 15;
        const speed = Math.random() * 5 + 3;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 80,
          maxLife: 80,
          size: Math.random() * 4 + 2,
          color: `hsl(${180 + Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`,
          type: 'explosion'
        });
      }
      return particles;
    };

    const createArkParticles = (x: number, y: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 50,
          y: y + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 1,
          vy: -Math.random() * 2 - 1,
          life: 120,
          maxLife: 120,
          size: 8 + Math.random() * 4,
          color: `hsl(${180 + Math.random() * 40}, 100%, 80%)`,
          type: 'ark'
        });
      }
      return particles;
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life--;
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Add some physics
        particle.vy += 0.02; // gravity
        particle.vx *= 0.99; // friction
        particle.vy *= 0.99;

        return particle.life > 0;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        
        if (particle.type === 'ark') {
          // Draw ARK symbol
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.font = `${particle.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText('❍', particle.x, particle.y);
        } else {
          // Draw circular particles
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add glow effect
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = particle.size * 2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      if (isActive) {
        // Create trail particles
        const distance = Math.sqrt(
          Math.pow(x - mouseRef.current.prevX, 2) + 
          Math.pow(y - mouseRef.current.prevY, 2)
        );
        
        if (distance > 5) {
          for (let i = 0; i < 3; i++) {
            particlesRef.current.push(createTrailParticle(x, y));
          }
        }
      }
    };

    const handleMouseDown = () => {
      setIsActive(true);
    };

    const handleMouseUp = () => {
      setIsActive(false);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create explosion
      particlesRef.current.push(...createExplosionParticles(x, y));
      
      // Add ARK symbols
      particlesRef.current.push(...createArkParticles(x, y));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [width, height, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto z-30"
      style={{ cursor: 'crosshair' }}
    />
  );
};

export default ParticleSystem;
