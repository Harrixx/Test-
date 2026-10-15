import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children, className = "", index }: { children: ReactNode; className?: string; index?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      {index && <span className="tabular-nums">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />}
      <span>{children}</span>
    </p>
  );
}

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

/** Text link with an arrow that slides on hover. */
export function ArrowLink({ href, children, className = "", external }: ArrowLinkProps) {
  const inner = (
    <>
      <span className="link-draw pb-0.5">{children}</span>
      <span aria-hidden="true" className="relative inline-flex h-4 w-4 overflow-hidden">
        <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-full">{external ? "↗" : "→"}</span>
        <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0">{external ? "↗" : "→"}</span>
      </span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  const cls = `group inline-flex items-center gap-2 font-medium ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "light" | "dark" | "outline-light" | "outline-dark";
  className?: string;
};

/** Pill button with a fill that sweeps up on hover. */
export function Button({ href, children, variant = "light", className = "" }: ButtonProps) {
  const styles = {
    light: "bg-white text-navy [--sweep:var(--color-glacier-2)]",
    dark: "bg-navy text-white [--sweep:var(--color-navy-3)]",
    "outline-light": "text-white ring-1 ring-inset ring-white/40 [--sweep:rgb(255_255_255/0.12)]",
    "outline-dark": "text-navy ring-1 ring-inset ring-navy/25 [--sweep:var(--color-glacier-3)]",
  }[variant];
  return (
    <Link
      href={href}
      className={`group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-6 py-3 text-[0.95rem] font-semibold isolate ${styles} ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 translate-y-full rounded-full bg-[var(--sweep)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
      {children}
      <span aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1">→</span>
    </Link>
  );
}

/**
 * A clearly labelled slot for photography the company would need to supply or commission.
 * Never dressed up as a real photograph.
 */
export function ConceptPlaceholder({ label, brief, className = "", tone = "dark" }: { label: string; brief: string; className?: string; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <figure
      className={`relative flex h-full w-full flex-col justify-end overflow-hidden ${dark ? "bg-navy-2 text-glacier-2" : "bg-glacier-3 text-navy"} ${className}`}
      aria-label={`Photography placeholder: ${label}`}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.35]" preserveAspectRatio="none" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="ph-g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${120 + i * 18} C 100 ${100 + i * 18 - (i % 2) * 20}, 220 ${150 + i * 16}, 400 ${110 + i * 19}`}
            fill="none"
            stroke="url(#ph-g)"
            strokeWidth="0.8"
          />
        ))}
      </svg>
      <figcaption className="relative p-5 text-[0.8rem] leading-snug sm:p-6">
        <span className="mb-2 inline-block rounded-[2px] border border-current/40 px-1.5 py-[3px] text-[0.6rem] font-semibold uppercase tracking-[0.14em] opacity-80">
          Concept placeholder
        </span>
        <span className="block font-semibold">{label}</span>
        <span className="mt-1 block max-w-sm opacity-75">{brief}</span>
      </figcaption>
    </figure>
  );
}

export function Breadcrumbs({ items, tone = "dark" }: { items: { href?: string; label: string }[]; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-[0.8rem] ${tone === "dark" ? "text-glacier-2" : "text-slate"}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="opacity-50">/</span>}
            {item.href ? (
              <Link href={item.href} className="link-draw">{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** The subtle wave line drawn from the Shepley Spring logo's own swash. */
export function WaveRule({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 40" preserveAspectRatio="none" className={`h-6 w-full ${className}`}>
      <path d="M0 24 C 200 4, 360 4, 560 22 S 940 40, 1200 14" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
