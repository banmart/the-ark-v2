
import { CanvasOrbParams } from './types';

export const createAtmosphericBackground = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  params: CanvasOrbParams
) => {
  const bgGradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, radius * 0.8
  );
  
  const baseHue = 187; // Cyan-400 hue
  const atmosphereHue = baseHue + params.atmosphereShift * 20;
  
  bgGradient.addColorStop(0, `hsla(${atmosphereHue}, 80%, 70%, 0.1)`);
  bgGradient.addColorStop(0.6, `hsla(${atmosphereHue - 10}, 60%, 50%, 0.05)`);
  bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  return bgGradient;
};

export const drawGlitchedOrb = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  hue: number,
  glitchIntensity: number,
  canvasWidth: number,
  canvasHeight: number
) => {
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
  
  orbGradient.addColorStop(0, `hsla(187, 85%, 85%, 0.9)`);
  orbGradient.addColorStop(0.2, `hsla(187, 85%, 65%, 0.7)`);
  orbGradient.addColorStop(0.5, `hsla(173, 80%, 50%, 0.4)`);
  orbGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = orbGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Bright cyan center circle
  const centerRadius = radius * 0.3;
  ctx.fillStyle = `hsla(187, 85%, 90%, 0.8)`;
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
  ctx.strokeStyle = `hsla(188, 94%, 60%, 0.8)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
};
