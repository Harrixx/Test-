"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

/**
 * Topographic contour lines, drawn on scroll: a quiet nod to the Pennine landscape the
 * water filters through. Generated deterministically so server and client match.
 */
export function Contours({ className = "", rings = 14, seed = 1 }: { className?: string; rings?: number; seed?: number }) {
  const reduce = useReducedMotion();
  const paths = useMemo(() => {
    const out: string[] = [];
    const rand = (n: number) => {
      const x = Math.sin(n * 12.9898 + seed * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const harmonics = [1, 2, 3, 5].map((k, i) => ({ k, a: 0.04 + rand(i + 1) * 0.08, p: rand(i + 7) * Math.PI * 2 }));
    for (let r = 0; r < rings; r++) {
      const base = 28 + r * 24;
      const pts: [number, number][] = [];
      const N = 72;
      for (let i = 0; i <= N; i++) {
        const t = (i / N) * Math.PI * 2;
        let m = 1;
        harmonics.forEach((h) => {
          m += h.a * Math.sin(h.k * t + h.p + r * 0.18);
        });
        const rad = base * m;
        pts.push([400 + Math.cos(t) * rad * 1.35, 300 + Math.sin(t) * rad]);
      }
      const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z";
      out.push(d);
    }
    return out;
  }, [rings, seed]);

  return (
    <svg aria-hidden="true" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className={className}>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={i % 4 === 0 ? 1.1 : 0.6}
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 2.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  );
}
