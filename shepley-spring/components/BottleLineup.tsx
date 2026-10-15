"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formats } from "@/lib/content";

// Bottle heights roughly in proportion to real PET bottles of each size (mm).
const dims: Record<string, { h: number; w: number }> = {
  "330ml": { h: 175, w: 58 },
  "500ml": { h: 205, w: 64 },
  "750ml": { h: 245, w: 72 },
  "2 litre": { h: 330, w: 104 },
};

function bottlePath(w: number, h: number) {
  const neckW = w * 0.34;
  const shoulder = h * 0.22;
  const x0 = -w / 2;
  const n0 = -neckW / 2;
  const r = w * 0.12;
  // Starts at the neck top-left and runs clockwise.
  return [
    `M ${n0} 0`,
    `L ${n0} ${h * 0.05}`,
    `C ${n0} ${shoulder * 0.7}, ${x0} ${shoulder * 0.6}, ${x0} ${shoulder + h * 0.05}`,
    `L ${x0} ${h * 0.45}`,
    `C ${x0 + w * 0.06} ${h * 0.5}, ${x0 + w * 0.06} ${h * 0.55}, ${x0} ${h * 0.6}`,
    `L ${x0} ${h - r}`,
    `Q ${x0} ${h}, ${x0 + r} ${h}`,
    `L ${-x0 - r} ${h}`,
    `Q ${-x0} ${h}, ${-x0} ${h - r}`,
    `L ${-x0} ${h * 0.6}`,
    `C ${-x0 - w * 0.06} ${h * 0.55}, ${-x0 - w * 0.06} ${h * 0.5}, ${-x0} ${h * 0.45}`,
    `L ${-x0} ${shoulder + h * 0.05}`,
    `C ${-x0} ${shoulder * 0.6}, ${-n0} ${shoulder * 0.7}, ${-n0} ${h * 0.05}`,
    `L ${-n0} 0 Z`,
  ].join(" ");
}

const base = 380;
const { items, width } = (() => {
  let x = 40;
  const items = formats.map((f) => {
    const d = dims[f.size];
    const sports = f.closure === "Sports cap";
    const capH = sports ? 34 : 20;
    const cx = x + d.w / 2;
    x += d.w + 46;
    return { ...f, ...d, cx, capH, sports };
  });
  return { items, width: x - 6 };
})();

export function BottleLineup() {
  const reduce = useReducedMotion();

  return (
    <figure>
      <svg viewBox={`0 0 ${width} ${base + 70}`} className="h-auto w-full" role="img" aria-label="Our five bottle formats drawn to scale: 330ml sports cap, 500ml screw cap, 500ml sports cap, 750ml sports cap and 2 litre screw cap.">
        <line x1="0" x2={width} y1={base} y2={base} stroke="currentColor" strokeOpacity="0.25" />
        {items.map((b, i) => {
          const top = base - b.h - b.capH;
          return (
            <motion.g
              key={`${b.size}-${b.closure}`}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <g transform={`translate(${b.cx} ${top + b.capH})`}>
                <path d={bottlePath(b.w, b.h)} fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.2" />
                {/* label band */}
                <rect x={-b.w / 2} y={b.h * 0.62} width={b.w} height={b.h * 0.16} fill="currentColor" fillOpacity="0.14" />
              </g>
              {b.sports ? (
                <g transform={`translate(${b.cx} ${top})`}>
                  <rect x={-b.w * 0.2} y={10} width={b.w * 0.4} height={b.capH - 10} rx="2" fill="currentColor" fillOpacity="0.5" />
                  <rect x={-b.w * 0.1} y={0} width={b.w * 0.2} height={12} rx="2" fill="currentColor" fillOpacity="0.8" />
                </g>
              ) : (
                <rect x={b.cx - b.w * 0.21} y={top} width={b.w * 0.42} height={b.capH} rx="2.5" fill="currentColor" fillOpacity="0.75" />
              )}
              <text x={b.cx} y={base + 30} textAnchor="middle" fontSize="15" fontWeight="600" fill="currentColor">{b.size}</text>
              <text x={b.cx} y={base + 50} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity="0.65">{b.closure}</text>
            </motion.g>
          );
        })}
      </svg>
    </figure>
  );
}
