import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
    
    const density = ' .:-=+*#%@';
    
    const params = {
      rotation: 0,
      atmosphereShift: 0,
      glitchIntensity: 0,
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

    // Film grain generation (reduced intensity)
    const generateFilmGrain = (width: number, height: number, intensity = 0.05) => {
      const imageData = grainCtx.createImageData(width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * intensity * 255;
        data[i] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 1] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 2] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 3] = Math.abs(grain) * 2;
      }
      
      return imageData;
    };

    // Glitch effect functions
    const drawGlitchedOrb = (centerX: number, centerY: number, radius: number, hue: number, glitchIntensity: number) => {
      ctx.save();
      
      const shouldGlitch = Math.random() < 0.1 && glitchIntensity > 0.5;
      const glitchOffset = shouldGlitch ? (Math.random() - 0.5) * 20 * glitchIntensity : 0;
      const glitchScale = shouldGlitch ? 1 + (Math.random() - 0.5) * 0.3 * glitchIntensity : 1;
      
      if (shouldGlitch) {
        ctx.translate(glitchOffset, glitchOffset * 0.8);
        ctx.scale(glitchScale, 1 / glitchScale);
      }
      
      // Main orb gradient with cyan/teal colors
      const orbGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 1.5
      );
      
      // Using cyan-400 to teal-500 gradient
      orbGradient.addColorStop(0, `hsla(187, 85%, 85%, 0.9)`); // Bright cyan core
      orbGradient.addColorStop(0.2, `hsla(187, 85%, 65%, 0.7)`); // Cyan-400
      orbGradient.addColorStop(0.5, `hsla(173, 80%, 50%, 0.4)`); // Teal-500
      orbGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = orbGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Bright cyan center circle
      const centerRadius = radius * 0.3;
      ctx.fillStyle = `hsla(187, 85%, 90%, 0.8)`; // Bright cyan center
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Cyan/magenta glitch effects
      if (shouldGlitch) {
        ctx.globalCompositeOperation = 'screen';
        
        // Cyan glitch
        ctx.fillStyle = `hsla(187, 100%, 60%, ${0.6 * glitchIntensity})`;
        ctx.beginPath();
        ctx.arc(centerX + glitchOffset * 0.5, centerY, centerRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Magenta glitch for contrast
        ctx.fillStyle = `hsla(300, 100%, 60%, ${0.5 * glitchIntensity})`;
        ctx.beginPath();
        ctx.arc(centerX - glitchOffset * 0.5, centerY, centerRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
      }
      
      // Outer ring with cyan color
      ctx.strokeStyle = `hsla(188, 94%, 60%, 0.8)`; // Cyan-500
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    };

    function render() {
      timeRef.current += 0.016;
      
      const width = canvas.width = grainCanvas.width = 384;
      const height = canvas.height = grainCanvas.height = 384;
      
      // Clear canvas to make it transparent
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35; // Increased from 0.25 to 0.35
      
      // Cyan atmospheric background
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 0.8
      );
      
      // Base cyan/teal hue instead of variable hue
      const baseHue = 187; // Cyan-400 hue
      const atmosphereHue = baseHue + params.atmosphereShift * 20; // Subtle shift within cyan range
      
      bgGradient.addColorStop(0, `hsla(${atmosphereHue}, 80%, 70%, 0.1)`);
      bgGradient.addColorStop(0.6, `hsla(${atmosphereHue - 10}, 60%, 50%, 0.05)`);
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw glitched orb
      drawGlitchedOrb(centerX, centerY, radius, atmosphereHue, params.glitchIntensity);
      
      // ASCII sphere particles (optimized)
      ctx.font = '10px monospace'; // Increased font size
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const spacing = 12; // Increased spacing
      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);
      
      for (let i = 0; i < cols && i < 40; i++) { // Reduced particle count
        for (let j = 0; j < rows && j < 40; j++) {
          const x = (i - cols / 2) * spacing + centerX;
          const y = (j - rows / 2) * spacing + centerY;
          
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < radius && Math.random() > 0.3) { // Reduced particle density
            const z = Math.sqrt(Math.max(0, radius * radius - dx * dx - dy * dy));
            const angle = params.rotation;
            const rotZ = dx * Math.sin(angle) + z * Math.cos(angle);
            const brightness = (rotZ + radius) / (radius * 2);
            
            if (rotZ > -radius * 0.3) {
              const charIndex = Math.floor(brightness * (density.length - 1));
              let char = density[charIndex];
              
              if (dist < radius * 0.8 && params.glitchIntensity > 0.8 && Math.random() < 0.3) {
                const glitchChars = ['█', '▓', '▒', '░', '▄', '▀', '■', '□'];
                char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
              }
              
              const alpha = Math.max(0.3, brightness);
              // Cyan-colored particles instead of white
              ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`; // Cyan-400 RGB
              ctx.fillText(char, x, y);
            }
          }
        }
      }
      
      // Generate and render subtle film grain (reduced)
      grainCtx.clearRect(0, 0, width, height);
      const grainIntensity = 0.05 + Math.sin(timeRef.current * 10) * 0.01;
      const grainImageData = generateFilmGrain(width, height, grainIntensity);
      grainCtx.putImageData(grainImageData, 0, 0);
      
      frameRef.current = requestAnimationFrame(render);
    }

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
