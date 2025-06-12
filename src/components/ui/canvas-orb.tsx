
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CanvasOrbParams, CanvasRefs } from './canvas-orb/types';
import { createRenderer } from './canvas-orb/renderer';

export const CanvasOrb = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const grainCanvas = grainCanvasRef.current;
    if (!canvas || !grainCanvas) return;

    const ctx = canvas.getContext('2d');
    const grainCtx = grainCanvas.getContext('2d');
    if (!ctx || !grainCtx) return;
    
    const params: CanvasOrbParams = {
      rotation: 0,
      atmosphereShift: 0,
      glitchIntensity: 0,
    };

    const refs: CanvasRefs = {
      container: containerRef,
      canvas: canvasRef,
      grainCanvas: grainCanvasRef,
      frame: frameRef,
      time: timeRef,
    };

    // Animation timelines
    gsap.to(params, {
      rotation: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    
    gsap.to(params, {
      atmosphereShift: 1,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(params, {
      glitchIntensity: 1,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      repeatDelay: Math.random() * 3 + 1
    });

    const render = createRenderer(refs, params);
    render();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-96 h-96 relative">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      <canvas
        ref={grainCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20"
        style={{ mixBlendMode: 'overlay' }}
      />
    </div>
  );
};
