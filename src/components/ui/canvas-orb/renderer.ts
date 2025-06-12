
import { CanvasOrbParams, CanvasRefs } from './types';
import { DENSITY, GLITCH_CHARS, generateFilmGrain } from './utils';
import { createAtmosphericBackground, drawGlitchedOrb } from './effects';

export const createRenderer = (
  refs: CanvasRefs,
  params: CanvasOrbParams
) => {
  const render = () => {
    const canvas = refs.canvas.current;
    const grainCanvas = refs.grainCanvas.current;
    if (!canvas || !grainCanvas) return;

    const ctx = canvas.getContext('2d');
    const grainCtx = grainCanvas.getContext('2d');
    if (!ctx || !grainCtx) return;

    refs.time.current += 0.016;
    
    const width = canvas.width = grainCanvas.width = 384;
    const height = canvas.height = grainCanvas.height = 384;
    
    // Clear canvas to make it transparent
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // Create atmospheric background
    const bgGradient = createAtmosphericBackground(ctx, centerX, centerY, radius, params);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Calculate atmosphere hue
    const baseHue = 188; // Cyan-500 hue
    const atmosphereHue = baseHue + params.atmosphereShift * 20;
    
    // Draw glitched orb
    drawGlitchedOrb(ctx, centerX, centerY, radius, atmosphereHue, params.glitchIntensity, width, height);
    
    // ASCII sphere particles
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const spacing = 12;
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);
    
    for (let i = 0; i < cols && i < 40; i++) {
      for (let j = 0; j < rows && j < 40; j++) {
        const x = (i - cols / 2) * spacing + centerX;
        const y = (j - rows / 2) * spacing + centerY;
        
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < radius && Math.random() > 0.3) {
          const z = Math.sqrt(Math.max(0, radius * radius - dx * dx - dy * dy));
          const angle = params.rotation;
          const rotZ = dx * Math.sin(angle) + z * Math.cos(angle);
          const brightness = (rotZ + radius) / (radius * 2);
          
          if (rotZ > -radius * 0.3) {
            const charIndex = Math.floor(brightness * (DENSITY.length - 1));
            let char = DENSITY[charIndex];
            
            if (dist < radius * 0.8 && params.glitchIntensity > 0.8 && Math.random() < 0.3) {
              char = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            }
            
            const alpha = Math.max(0.3, brightness);
            ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`; // cyan-500 RGB equivalent
            ctx.fillText(char, x, y);
          }
        }
      }
    }
    
    // Generate and render film grain
    grainCtx.clearRect(0, 0, width, height);
    const grainIntensity = 0.05 + Math.sin(refs.time.current * 10) * 0.01;
    const grainImageData = generateFilmGrain(grainCtx, width, height, grainIntensity);
    grainCtx.putImageData(grainImageData, 0, 0);
    
    refs.frame.current = requestAnimationFrame(render);
  };

  return render;
};
