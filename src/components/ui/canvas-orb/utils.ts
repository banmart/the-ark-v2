
export const DENSITY = ' .:-=+*#%@';
export const GLITCH_CHARS = ['█', '▓', '▒', '░', '▄', '▀', '■', '□'];

export const generateFilmGrain = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity = 0.05
) => {
  const imageData = ctx.createImageData(width, height);
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
