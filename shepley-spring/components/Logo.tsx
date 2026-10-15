// The Shepley Spring wordmark, traced exactly from the official SVG
// (shepleyspring.co.uk/wp-content/uploads/2026/07/shepley-spring-logo.svg).
// Only the fill changes, so it can sit on light or dark surfaces.
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo-paths";

type Props = { className?: string; title?: string };

export function Logo({ className, title = "Shepley Spring" }: Props) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} fill="currentColor">
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
