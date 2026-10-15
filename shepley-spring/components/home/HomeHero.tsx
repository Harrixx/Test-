"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WaterCanvas } from "../WaterCanvas";
import { SplitHeading } from "../motion";
import { Button } from "../ui";

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // Entrance animations here are CSS (animate-rise), so hero content paints before
  // JavaScript loads; scroll-linked effects below are progressive enhancement.
  return (
    <section ref={ref} className="on-dark grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-abyss text-white">
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { scale: canvasScale }}>
        <WaterCanvas className="h-full w-full" />
      </motion.div>
      {/* Legibility veil */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(5_13_28/0.35)_0%,transparent_30%,transparent_55%,rgb(5_13_28/0.75)_100%)]" />

      <motion.div
        className="container-x flex flex-1 flex-col justify-end pb-10 pt-40 sm:pb-14 lg:pb-16"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <p style={{ animationDelay: "0.15s" }} className="animate-rise eyebrow mb-8 flex items-center gap-3 text-glacier sm:mb-10">
          <span aria-hidden="true" className="h-px w-10 bg-glacier/60" />
          Shepley, Yorkshire &middot; Since 1996
        </p>

        <SplitHeading
          as="h1"
          immediate
          delay={0.03}
          className="display text-hero max-w-[14ch]"
          lines={["Spring water,", "300 million years", "in the *making.*"]}
        />

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-12 lg:items-end">
          <p style={{ animationDelay: "0.7s" }} className="animate-rise lede max-w-xl text-glacier-2 lg:col-span-6">
            For thirty years, the Smith family has bottled own label and branded spring water for the best-known names in UK grocery, from three Yorkshire sites.
          </p>
          <div style={{ animationDelay: "0.85s" }} className="animate-rise flex flex-wrap gap-3 lg:col-span-6 lg:justify-end">
            <Button href="/own-label">Explore our capabilities</Button>
            <Button href="/brands" variant="outline-light">Discover our brands</Button>
          </div>
        </div>
      </motion.div>

      {/* Base rail */}
      <div style={{ animationDelay: "1.1s" }} className="animate-rise container-x relative pb-6">
        <div className="rule text-white" />
        <div className="flex items-center justify-between gap-6 pt-5 text-[0.78rem] text-glacier-2">
          <ul className="flex flex-wrap gap-x-8 gap-y-1">
            <li>Family-owned</li>
            <li className="hidden sm:block">Three Yorkshire sites</li>
            <li className="hidden md:block">Own label &amp; branded</li>
          </ul>
          <a href="#story" className="group flex items-center gap-3">
            <span>Scroll</span>
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-white/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_cubic-bezier(.76,0,.24,1)_infinite] bg-white" />
            </span>
          </a>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
