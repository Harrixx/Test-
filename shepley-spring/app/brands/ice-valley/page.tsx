import type { Metadata } from "next";
import Image from "next/image";
import { MaskReveal, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Breadcrumbs, Button, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ice Valley spring water",
  description:
    "Ice Valley: spring water from the Yorkshire Pennines, filtered through Greenmoor rock. Still and sparkling, available exclusively through Tesco and Booker Wholesale.",
  alternates: { canonical: "/brands/ice-valley" },
};

const range = [
  { size: "500ml", kind: "Still" },
  { size: "500ml", kind: "Still · sports cap" },
  { size: "750ml", kind: "Still · sports cap" },
  { size: "2 litre", kind: "Still" },
  { size: "500ml", kind: "Sparkling" },
  { size: "2 litre", kind: "Sparkling" },
];

export default function IceValleyPage() {
  return (
    <div className="[--accent:#00a9e8]">
      <section className="on-dark relative isolate overflow-hidden bg-[radial-gradient(60%_60%_at_80%_60%,#00a9e8_0%,transparent_70%),linear-gradient(165deg,#062d48_0%,#0b5f8f_45%,#0a73ad_100%)] text-white">
        {/* Ice-like facets */}
        <svg aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full opacity-[0.12]" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 70 L30 40 L55 62 L80 30 L100 48 L100 100 L0 100 Z" fill="white" />
          <path d="M0 85 L22 60 L48 80 L70 55 L100 75 L100 100 L0 100 Z" fill="white" />
        </svg>
        <div className="container-x grid min-h-[94svh] gap-10 pb-16 pt-44 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/brands", label: "Our brands" }, { label: "Ice Valley" }]} />
            <h1 className="mt-12">
              <span className="sr-only">Ice Valley</span>
              <Image src="/images/brands/ice-valley-logo.svg" alt="" width={498} height={55} preload className="h-auto w-[min(100%,30rem)] brightness-0 invert" />
            </h1>
            <SplitHeading as="p" immediate className="display text-d1 mt-10" lines={["Welcome to the Valley", "of *Refreshment.*"]} />
            <Reveal immediate delay={0.5}>
              <p className="lede mt-8 max-w-lg text-white/90">
                Unique, cool and crystal clear: spring water for a healthy lifestyle, sourced from the Yorkshire Pennines and filtered through Greenmoor rock for a refreshing taste.
              </p>
              <p className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
                Available exclusively through Tesco and Booker Wholesale
              </p>
            </Reveal>
          </div>
          <div className="relative lg:col-span-6">
            <Reveal immediate y={60} delay={0.3}>
              <Image src="/images/brands/ice-valley-pack.png" alt="A 24-bottle pack of Ice Valley still spring water" width={1200} height={1026} preload sizes="(min-width:1024px) 45vw, 90vw" className="h-auto w-full drop-shadow-[0_50px_50px_rgb(2_20_40/0.45)]" />
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="iv-source" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Eyebrow className="text-[#0b5f8f]">The source</Eyebrow>
            <SplitHeading id="iv-source" as="h2" className="display text-d1 mt-8 text-navy" lines={["Filtered through", "*Greenmoor* rock."]} />
            <Reveal delay={0.1}>
              <p className="prose-body mt-8 max-w-xl text-slate">
                Ice Valley is bottled where it comes out of the ground, from protected underground sources. We go to great lengths to protect the source and the wider environment, including 50 acres of organically farmed land, three lakes, two woods and a communal nature reserve in our home village of Shepley.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <MaskReveal className="relative aspect-square overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_40%,#e8f3f8_0%,#a8d2e6_55%,#0b5f8f_100%)]">
              <Image src="/images/brands/ice-valley-range.png" alt="An Ice Valley bottle surrounded by ice" fill sizes="(min-width:1024px) 34vw, 90vw" className="object-contain p-8" />
            </MaskReveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="iv-range" className="bg-[#e6f6fd] py-28 sm:py-36">
        <div className="container-x">
          <Eyebrow className="text-[#0b5f8f]">The range</Eyebrow>
          <SplitHeading id="iv-range" as="h2" className="display text-d1 mt-8 text-navy" lines={["Still and *sparkling.*"]} />
          <Stagger as="ul" className="mt-16 grid gap-px overflow-hidden rounded-[4px] bg-[#0b5f8f]/15 sm:grid-cols-2 lg:grid-cols-3">
            {range.map((r) => (
              <StaggerItem key={r.size + r.kind} className="group bg-white p-8 transition-colors duration-500 hover:bg-[#0b5f8f] hover:text-white">
                <p className="display text-[3rem] leading-none text-[#0b5f8f] transition-colors duration-500 group-hover:text-white">{r.size}</p>
                <p className="mt-3 text-slate transition-colors duration-500 group-hover:text-white/90">{r.kind}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-sm text-slate">Why not try Ice Valley sparkling water in place of a fizzy drink?</p>
        </div>
      </section>

      <section className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow className="text-[#0b5f8f]">Official water</Eyebrow>
            <p className="display text-d2 mt-8 text-navy">The official water of Huddersfield Town Football Club.</p>
          </Reveal>
          <Reveal className="flex flex-col justify-end gap-4 lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="text-slate">Ice Valley bottles are 100% recyclable, and now come with tethered caps.</p>
            <ArrowLink href="/sustainability/tethered-caps" className="text-navy">Why we use tethered caps</ArrowLink>
            <div className="mt-6">
              <a
                href="https://ice-valley.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#00a9e8] px-6 font-semibold text-[#03243a] transition-colors hover:bg-[#33bdf0]"
              >
                Visit ice-valley.com <span aria-hidden="true">↗</span><span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-navy/10 bg-paper py-16">
        <div className="container-x flex flex-wrap items-center justify-between gap-6">
          <p className="display text-d3 text-navy">Meet our other brand.</p>
          <Button href="/brands/white-rock" variant="dark">White Rock</Button>
        </div>
      </section>
    </div>
  );
}
