import React, { useEffect, useRef } from 'react';

const NebulaBackground = () => {
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

    const fragmentShaderSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      // Noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float total = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          total += smoothNoise(p) * amplitude;
          p *= 2.0;
          amplitude *= 0.5;
        }
        return total;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float t = u_time * 0.1;
        
        // Animated coordinate system
        vec2 p = uv * 3.0;
        p += fbm(p + t) * 0.5;
        
        float n = fbm(p);
        
        // Colors from reference image
        vec3 cyan = vec3(0.0, 0.65, 0.9);   // #0EA5E9
        vec3 purple = vec3(0.6, 0.4, 0.9);   // #9b87f5
        vec3 magenta = vec3(0.85, 0.2, 0.9); // #D946EF
        
        // Create color layers based on noise
        vec3 color = mix(cyan, purple, n);
        color = mix(color, magenta, fbm(p + vec2(t * 0.5, t)));
        
        // Darken and fade with distance from center
        float dist = length(uv - 0.5);
        float mask = smoothstep(0.0, 1.0, 1.0 - dist * 1.5);
        
        // Enhance contrast and apply noise density
        color *= n * n * 1.5;
        color *= mask * 0.4; // Faded as requested
        
        gl_FragColor = vec4(color, 1.0);
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
      time *= 0.001; // Convert to seconds
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);

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
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-50 transition-opacity duration-1000"
      style={{ filter: 'blur(30px) brightness(1.2)' }}
    />
  );
};

export default NebulaBackground;
