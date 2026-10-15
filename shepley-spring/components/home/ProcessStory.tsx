"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ConceptPlaceholder } from "../ui";

type Step = {
  key: string;
  title: string;
  body: string;
  detail: string;
  image?: { src: string; alt: string; contain?: boolean };
  placeholder?: { label: string; brief: string };
};

const steps: Step[] = [
  {
    key: "source",
    title: "Source",
    body: "Our water is drawn from groundwater beneath Shepley, close to the Peak District. It has filtered slowly through mineral-rich Greenmoor rock, which gives it its clean, refreshing taste.",
    detail: "Groundwater source · Shepley, West Yorkshire",
    placeholder: {
      label: "The Shepley source",
      brief: "Commission: borehole head and the Knowle estate at first light, plus a slow-motion film loop for the hero.",
    },
  },
  {
    key: "preform",
    title: "Preform",
    body: "Production is vertically integrated, from plastic pellet to preform to finished bottle. Moulding our own preforms gives us control of quality, weight and lead times.",
    detail: "Pellet → preform → bottle, in-house",
    placeholder: {
      label: "Injection moulding",
      brief: "Commission: preforms leaving the press; macro detail of resin pellets.",
    },
  },
  {
    key: "fill",
    title: "Fill & cap",
    body: "Our modern bottling plants can fill 1.2 million bottles a day. In 2024 we added our first multi-format line at Brookfield, broadening our range and increasing capacity.",
    detail: "330ml – 2 litre · screw and sports caps",
    image: { src: "/images/production-line.jpg", alt: "Ice Valley bottles travelling along the bottling line" },
  },
  {
    key: "quality",
    title: "Quality",
    body: "A dedicated technical team holds every line to the strictest food safety and quality standards, supported by engineers who keep equipment running at its best.",
    detail: "Technical, engineering and hygiene teams",
    image: { src: "/images/people/control-panel.jpg", alt: "An operator adjusting settings on a bottling line control panel" },
  },
  {
    key: "deliver",
    title: "Deliver",
    body: "We run our own fleet. Our central location, close to the motorway network, keeps distribution efficient and reduces environmental impact on every delivery to customer hubs.",
    detail: "Own fleet · central UK location",
    image: { src: "/images/fleet.png", alt: "Two Shepley Spring lorries in White Rock and Ice Valley livery", contain: true },
  },
];

export function ProcessStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = steps[active];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Sticky visual (desktop) */}
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-28 aspect-[4/5] max-h-[calc(100svh-9rem)] w-full overflow-hidden rounded-[3px] bg-navy-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={step.key}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            >
              <StepVisual step={step} sizes="(min-width: 1024px) 45vw, 100vw" />
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6 text-[0.78rem] text-white">
            <span className="rounded-full bg-abyss/60 px-3 py-1.5 backdrop-blur">{step.detail}</span>
            <span className="tabular-nums text-glacier-2">
              0{active + 1} / 0{steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol className="lg:col-span-6">
        {steps.map((s, i) => (
          <li
            key={s.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className="flex min-h-[auto] flex-col justify-center border-t border-white/10 py-12 lg:min-h-[64svh] lg:py-0"
          >
            <div className={`transition-opacity duration-700 ${active === i ? "lg:opacity-100" : "lg:opacity-35"}`}>
              <p className="eyebrow mb-6 flex items-center gap-3 text-glacier">
                <span className="tabular-nums">0{i + 1}</span>
                <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
                Stage
              </p>
              <h3 className="display text-d2">{s.title}</h3>
              <p className="lede mt-6 max-w-lg text-glacier-2">{s.body}</p>
              <p className="mt-6 text-sm text-silver">{s.detail}</p>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[3px] bg-navy-2 lg:hidden">
                <StepVisual step={s} sizes="100vw" />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepVisual({ step, sizes }: { step: Step; sizes: string }) {
  if (step.image) {
    return step.image.contain ? (
      <div className="relative h-full w-full bg-[radial-gradient(120%_80%_at_50%_100%,#cfe6f1_0%,#a8d2e6_35%,#1b4373_100%)]">
        <Image src={step.image.src} alt={step.image.alt} fill sizes={sizes} className="object-contain p-8" />
      </div>
    ) : (
      <div className="duotone relative h-full w-full">
        <Image src={step.image.src} alt={step.image.alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }
  return <ConceptPlaceholder label={step.placeholder!.label} brief={step.placeholder!.brief} />;
}
