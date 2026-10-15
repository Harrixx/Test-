import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/motion";
import { JsonLd } from "@/components/ui";
import { locations, site } from "@/lib/site";

const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin-opsz-normal.woff2", style: "normal", weight: "200 800" },
    { path: "./fonts/newsreader-latin-opsz-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  preload: true,
});

const inter = localFont({
  src: [{ path: "./fonts/inter-tight-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Shepley Spring | Own label and branded spring water, bottled in Yorkshire",
    template: "%s | Shepley Spring",
  },
  description: site.description,
  applicationName: "Shepley Spring (concept)",
  // A speculative concept must never compete with the official site in search.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Shepley Spring",
    title: "Shepley Spring | Thirty years of Yorkshire spring water",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a1d3a",
  width: "device-width",
  initialScale: 1,
};

const organisation = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.officialUrl,
  foundingDate: site.founded,
  description: site.description,
  telephone: "+44 1484 609330",
  sameAs: [site.linkedin],
  brand: [
    { "@type": "Brand", name: "Ice Valley", url: "https://ice-valley.com" },
    { "@type": "Brand", name: "White Rock", url: "https://whiterockwater.co.uk" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: locations[0].street,
    addressLocality: locations[0].town,
    postalCode: locations[0].postcode,
    addressCountry: "GB",
  },
  location: locations.map((l) => ({
    "@type": "Place",
    name: `Shepley Spring ${l.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: l.street,
      addressLocality: l.town,
      postalCode: l.postcode,
      addressCountry: "GB",
    },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        {/* Without JavaScript, show everything that would otherwise animate in. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}[style*="clip-path"]{clip-path:none!important}[style*="translateY(108%)"]{transform:none!important}`}</style>
        </noscript>
        <MotionProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <JsonLd data={organisation} />
      </body>
    </html>
  );
}
