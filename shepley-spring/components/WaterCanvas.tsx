"use client";

import { useEffect, useRef } from "react";

/**
 * Generative water: light caustics drifting through deep water, drawn with a single
 * WebGL fragment shader. It's a code-native stand-in for commissioned film of the
 * Shepley source and is never presented as photography.
 *
 * Performance: renders at a reduced internal resolution, caps device pixel ratio,
 * pauses when off-screen or when the tab is hidden, and draws a single still frame
 * for visitors who prefer reduced motion. A CSS gradient sits underneath as a fallback.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  p += (u_pointer - 0.5) * 0.06;
  float t = u_time * 0.035;

  // Domain-warped flow field
  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 3.1));
  vec2 r = vec2(fbm(p * 2.0 + q * 1.7 + vec2(1.7, 9.2) + t * 1.3),
                fbm(p * 2.0 + q * 1.7 + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.8 + r * 2.2);

  // Caustic filaments: thin bright ridges where the warped field folds
  float c1 = pow(1.0 - abs(sin((f + r.x) * 8.0)), 9.0);
  float c2 = pow(1.0 - abs(sin((f * 1.3 - r.y) * 11.0 + 1.3)), 12.0);
  float caustic = c1 * 0.8 + c2 * 0.5;

  float depth = smoothstep(-0.15, 1.05, uv.y);     // brighter towards the surface (top)

  // Shafts of light falling from the surface
  float rays = pow(max(0.0, sin(p.x * 2.6 - p.y * 0.9 + sin(t * 3.0) * 0.6)), 14.0)
             + pow(max(0.0, sin(p.x * 4.1 + p.y * 0.5 - t * 2.0 + 1.7)), 22.0) * 0.6;
  rays *= depth * depth * 0.22;

  vec3 abyss   = vec3(0.012, 0.035, 0.085);
  vec3 navy    = vec3(0.039, 0.114, 0.227);
  vec3 deep    = vec3(0.07, 0.19, 0.35);
  vec3 glacier = vec3(0.66, 0.82, 0.90);

  vec3 col = mix(abyss, navy, smoothstep(0.0, 0.85, uv.y * 0.85 + f * 0.35));
  col = mix(col, deep, pow(depth, 2.2) * 0.55);
  col += glacier * caustic * (0.035 + 0.22 * depth * depth);
  col += glacier * rays;
  col += vec3(0.10, 0.22, 0.34) * pow(f, 3.0) * depth * 0.6;

  // Vignette and a gentle fade to near-black at the base, for legible type
  col *= 1.0 - 0.45 * pow(length((uv - vec2(0.5, 0.62)) * vec2(0.9, 1.1)), 1.6);
  col = mix(col, abyss, smoothstep(0.35, 0.0, uv.y) * 0.55);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function WaterCanvas({ className, scale = 0.6 }: { className?: string; scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl) return; // CSS fallback remains visible

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uPointer = gl.getUniformLocation(prog, "u_pointer");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let raf = 0;
    let visible = true;
    const start = performance.now() - 40_000; // start mid-flow, never on a blank frame

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };

    const draw = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.03;
      pointer.y += (pointer.ty - pointer.y) * 0.03;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(raf);
      if (reduce) {
        draw(performance.now());
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    canvas.dataset.ready = "true";
    play();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) play();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);

    const onVis = () => {
      if (!document.hidden && visible) play();
    };
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = 1 - e.clientY / window.innerHeight;
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      // Free GPU resources but keep the context: the canvas may be re-initialised
      // (React re-runs effects in development), and a lost context can't be reused.
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [scale]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #1b4373 0%, #0a1d3a 45%, #050d1c 100%)" }}
    />
  );
}
