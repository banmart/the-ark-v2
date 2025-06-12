
export interface CanvasOrbParams {
  rotation: number;
  atmosphereShift: number;
  glitchIntensity: number;
}

export interface CanvasRefs {
  container: React.RefObject<HTMLDivElement>;
  canvas: React.RefObject<HTMLCanvasElement>;
  grainCanvas: React.RefObject<HTMLCanvasElement>;
  frame: React.MutableRefObject<number>;
  time: React.MutableRefObject<number>;
}
