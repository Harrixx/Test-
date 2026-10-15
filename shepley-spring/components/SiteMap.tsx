// A minimal, geographically proportioned map of our three sites and nearby cities.
// Positions are real latitude/longitude projected onto the SVG.

const project = (lat: number, lon: number) => ({
  x: (lon + 2.55) * 400 * Math.cos((54 * Math.PI) / 180),
  y: (54.25 - lat) * 400,
});

const sites = [
  { name: "Shepley", sub: "Head office & source", lat: 53.587, lon: -1.707, dx: -12, dy: 26, anchor: "end" as const },
  { name: "Brookfield", sub: "Kirkburton", lat: 53.61, lon: -1.703, dx: 14, dy: 4, anchor: "start" as const },
  { name: "Harrogate", sub: "Flaxby", lat: 54.013, lon: -1.4, dx: 14, dy: 4, anchor: "start" as const },
];

const cities = [
  { name: "Leeds", lat: 53.8, lon: -1.549 },
  { name: "York", lat: 53.96, lon: -1.082 },
  { name: "Manchester", lat: 53.481, lon: -2.242 },
  { name: "Sheffield", lat: 53.383, lon: -1.465 },
];

export function SiteMap({ className = "" }: { className?: string }) {
  const s = sites.map((p) => ({ ...p, ...project(p.lat, p.lon) }));
  const c = cities.map((p) => ({ ...p, ...project(p.lat, p.lon) }));
  return (
    <svg viewBox="20 40 380 330" className={className} role="img" aria-labelledby="sitemap-title sitemap-desc">
      <title id="sitemap-title">Map of Shepley Spring&rsquo;s three Yorkshire sites</title>
      <desc id="sitemap-desc">Shepley and Brookfield near Huddersfield, and Harrogate to the north east, between Leeds and York.</desc>
      <defs>
        <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="currentColor" opacity="0.18" />
        </pattern>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#a8d2e6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#a8d2e6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="20" y="40" width="380" height="330" fill="url(#dots)" />
      {/* Route between sites */}
      <path
        d={`M${s[0].x} ${s[0].y} L${s[1].x} ${s[1].y} Q ${s[1].x + 40} ${(s[1].y + s[2].y) / 2} ${s[2].x} ${s[2].y}`}
        fill="none"
        stroke="#a8d2e6"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {c.map((p) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r="2.2" fill="currentColor" opacity="0.45" />
          <text x={p.x + 7} y={p.y + 3.5} fontSize="9" fill="currentColor" opacity="0.6">{p.name}</text>
        </g>
      ))}
      {s.map((p) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r="16" fill="url(#glow)" />
          <circle cx={p.x} cy={p.y} r="4" fill="#fff" />
          <text x={p.x + p.dx} y={p.y + p.dy} fontSize="11" fontWeight="600" fill="#fff" textAnchor={p.anchor}>{p.name}</text>
          <text x={p.x + p.dx} y={p.y + p.dy + 12} fontSize="8.5" fill="#cfe6f1" textAnchor={p.anchor}>{p.sub}</text>
        </g>
      ))}
    </svg>
  );
}
