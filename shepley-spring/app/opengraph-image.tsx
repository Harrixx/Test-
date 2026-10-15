import { ImageResponse } from "next/og";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo-paths";

export const alt = "Shepley Spring: spring water, 300 million years in the making";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "white",
          background: "radial-gradient(120% 90% at 80% 0%, #1b4373 0%, #0a1d3a 45%, #050d1c 100%)",
        }}
      >
        <svg width="360" height="70" viewBox={LOGO_VIEWBOX} fill="white">
          {LOGO_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>Spring water, 300 million years in the making.</div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#cfe6f1" }}>Own label and branded spring water, bottled in Yorkshire since 1996.</div>
        </div>
      </div>
    ),
    size,
  );
}
