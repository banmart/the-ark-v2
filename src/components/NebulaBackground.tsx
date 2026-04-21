import React, { useEffect, useRef } from 'react';

const NebulaBackground = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Subtle monochrome dot-grid pattern with gentle animated breathing
    const fragmentShaderSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float t = u_time * 0.08;

        // Grid parameters
        float gridScale = 28.0;
        vec2 grid = fract(uv * gridScale) - 0.5;

        // Dot radius — vary slightly per cell using noise
        vec2 cell = floor(uv * gridScale);
        float n = smoothNoise(cell * 0.18 + t * 0.4);
        float radius = 0.08 + n * 0.06;

        // Soft circular dot
        float dist = length(grid);
        float dotShape = 1.0 - smoothstep(radius - 0.02, radius + 0.02, dist);

        // Global breathing fade
        float breathe = 0.5 + 0.5 * sin(t * 1.2 + smoothNoise(cell * 0.05) * 6.28);

        // Vignette: fade toward edges
        float vignette = 1.0 - smoothstep(0.3, 0.85, length(uv - 0.5) * 1.4);

        float alpha = dotShape * breathe * vignette * 0.13;

        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Enable alpha blending so dots sit lightly on top of the black background
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionAttributeAddress = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeAddress);
    gl.vertexAttribPointer(positionAttributeAddress, 2, gl.FLOAT, false, 0, 0);

    const timeUniformAddress = gl.getUniformLocation(program, 'u_time');
    const resolutionUniformAddress = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId: number;

    const render = (time: number) => {
      time *= 0.001;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(timeUniformAddress, time);
      gl.uniform2f(resolutionUniformAddress, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? 'fixed inset-0 w-full h-full -z-10 pointer-events-none'}
    />
  );
};

export default NebulaBackground;
