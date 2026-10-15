"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./motion";

type Item = { year: string; title: string; body: string };

/** Vertical timeline with a progress line that fills as you scroll. */
export function Timeline({ items }: { items: Item[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className="absolute bottom-0 left-[0.4rem] top-0 w-px bg-white/15 md:left-1/2" />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-0 left-[0.4rem] top-0 w-px origin-top bg-glacier md:left-1/2"
        style={reduce ? undefined : { scaleY }}
      />
      {items.map((item, i) => {
        const right = i % 2 === 1;
        return (
          <li key={item.year} className="relative grid gap-4 py-10 pl-10 md:grid-cols-2 md:gap-16 md:pl-0 md:py-14">
            <span aria-hidden="true" className="absolute left-0 top-12 h-[0.85rem] w-[0.85rem] rounded-full border border-glacier bg-navy md:left-1/2 md:top-16 md:-translate-x-1/2" />
            <Reveal className={right ? "md:col-start-2 md:pl-4" : "md:pr-4 md:text-right"}>
              <p className="display text-[clamp(2.4rem,5vw,4.5rem)] leading-none text-glacier">{item.year}</p>
            </Reveal>
            <Reveal delay={0.1} className={right ? "md:col-start-1 md:row-start-1 md:pr-4 md:text-right" : "md:pl-4"}>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className={`mt-3 max-w-md leading-relaxed text-glacier-2 ${right ? "md:ml-auto" : ""}`}>{item.body}</p>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
