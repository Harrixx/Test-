"use client";

import { MotionConfig, motion, useInView, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, type ReactNode, Fragment } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Honour the visitor's reduced-motion setting everywhere. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>{children}</MotionConfig>;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "figure" | "p" | "span";
  /** Animate on first paint with CSS (for content in the hero). */
  immediate?: boolean;
};

/** Fades and lifts content in once, as it enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div", immediate = false }: RevealProps) {
  const reduce = useReducedMotion();
  if (immediate) {
    // Above-the-fold content animates with CSS so it paints before JavaScript loads.
    const Tag = as;
    return (
      <Tag className={`animate-rise ${className ?? ""}`} style={{ animationDelay: `${delay}s` }}>
        {children}
      </Tag>
    );
  }
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

const lineVariants: Variants = {
  hidden: { y: "108%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.25, delay: i * 0.09, ease: EASE } }),
};

/** Turns *word* into italic emphasis. */
function emphasise(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
  );
}

type SplitHeadingProps = {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  /** Animate on mount rather than when scrolled into view (for heroes). */
  immediate?: boolean;
  id?: string;
};

/**
 * Headline whose lines rise out of a mask. Screen readers get the whole sentence once;
 * the animated spans are hidden from them.
 */
export function SplitHeading({ lines, className, as = "h2", delay = 0, immediate = false, id }: SplitHeadingProps) {
  const reduce = useReducedMotion();
  const Tag = as;
  const label = lines.join(" ").replace(/\*/g, "");
  if (immediate) {
    // Hero headlines animate with CSS so they start at first paint, before JavaScript
    // loads. This keeps Largest Contentful Paint fast.
    return (
      <Tag className={className} id={id}>
        <span className="sr-only">{label}</span>
        <span className="block" aria-hidden="true">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span className="line-rise block" style={{ animationDelay: `${0.1 + (i + delay * 10) * 0.09}s` }}>
                {emphasise(line)}
              </span>
            </span>
          ))}
        </span>
      </Tag>
    );
  }
  const trigger = { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <Tag className={className} id={id}>
      <span className="sr-only">{label}</span>
      <motion.span className="block" initial={reduce ? false : "hidden"} {...trigger} aria-hidden="true">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span className="block will-change-transform" variants={lineVariants} custom={i + delay * 10}>
              {emphasise(line)}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Image (or any block) revealed by an expanding clip mask, with a slow settle in scale. */
export function MaskReveal({ children, className, from = "bottom", delay = 0 }: { children: ReactNode; className?: string; from?: "bottom" | "left" | "right"; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const start = { bottom: "inset(100% 0% 0% 0%)", left: "inset(0% 100% 0% 0%)", right: "inset(0% 0% 0% 100%)" }[from];
  return (
    // Observe the unclipped wrapper: Chrome can miss a jump-scroll into view when the
    // observed element is itself fully clipped.
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { clipPath: start }}
        animate={inView || reduce ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.4, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div
          className="relative h-full w-full"
          initial={reduce ? false : { scale: 1.18 }}
          animate={inView || reduce ? { scale: 1 } : undefined}
          transition={{ duration: 2, delay, ease: EASE }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Gentle vertical parallax. `amount` is the travel in pixels across the viewport. */
export function Parallax({ children, className, amount = 60 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <div ref={ref} className={className}>
      <motion.div className="relative h-full w-full" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}

/** Staggered list: children fade up one after another. */
export function Stagger({ children, className, as = "ul" }: { children: ReactNode; className?: string; as?: "ul" | "ol" | "div" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      {children}
    </M>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export function StaggerItem({ children, className, as = "li" }: { children: ReactNode; className?: string; as?: "li" | "div" | "article" }) {
  const M = motion[as];
  return (
    <M className={className} variants={staggerItem}>
      {children}
    </M>
  );
}
