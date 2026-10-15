import type { Metadata } from "next";
import Image from "next/image";
import { BottleLineup } from "@/components/BottleLineup";
import { MaskReveal, Parallax, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Breadcrumbs, Button, Eyebrow } from "@/components/ui";
import { sectors } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Own label water bottling",
  description:
    "Thirty years of own label spring water bottling for UK retailers, wholesalers, convenience, forecourts and sport, with vertically integrated production and our own fleet.",
  alternates: { canonical: "/own-label" },
};

const pillars = [
  {
    title: "Vertically integrated",
    body: "From plastic pellet to preform to finished, labelled bottle. Keeping production in-house gives our customers control over quality, consistency and lead times.",
  },
  {
    title: "Packaging design",
    body: "Our design department creates labels and wraps for compelling offers and promotions, helping customers to increase sales.",
  },
  {
    title: "Logistical excellence",
    body: "We run our own fleet in striking liveries. Our central location near the motorway network gives trouble-free delivery to customer hubs across the UK.",
  },
  {
    title: "Investment in capacity",
    body: "Plants capable of filling 1.2 million bottles a day, with our first multi-format line added at Brookfield in 2024 and a third site opened in Harrogate.",
  },
];

export default function OwnLabelPage() {
  return (
    <>
      {/* Hero */}
      <section className="on-dark grain relative isolate overflow-hidden bg-navy text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_100%_0%,#1b4373_0%,transparent_60%)]" />
        <div className="container-x grid min-h-[92svh] gap-12 pb-16 pt-44 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Own label" }]} />
            <p className="eyebrow mt-10 text-glacier">Own label bottling</p>
            <SplitHeading as="h1" immediate className="display text-hero mt-6" lines={["Your brand.", "*Our* water."]} />
            <Reveal immediate delay={0.5}>
              <p className="lede mt-10 max-w-xl text-glacier-2">
                Over thirty years we have built a reputation for exceptional reliability, efficiency and flexibility. It has led to long-term relationships with the best-known names in the UK grocery and FMCG sector.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/contact?topic=sales">Discuss a programme</Button>
                <a href={site.phoneHref} className="inline-flex min-h-12 items-center rounded-full px-6 font-semibold ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10">
                  Call {site.phone}
                </a>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <MaskReveal className="relative aspect-[4/5] overflow-hidden rounded-[3px]" from="right">
              <Image src="/images/production-line.jpg" alt="Ice Valley bottles moving along a conveyor" fill preload sizes="(min-width:1024px) 38vw, 90vw" className="object-cover" />
            </MaskReveal>
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section aria-labelledby="sectors-title" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index="01" className="text-spring">Who we work with</Eyebrow>
            <SplitHeading id="sectors-title" as="h2" className="display text-d2 mt-8 text-navy" lines={["Private and branded", "labels for every", "*channel.*"]} />
            <Reveal delay={0.1}>
              <p className="prose-body mt-8 text-slate">
                We work closely with major multiples, independents and wholesalers to develop private and branded labels. Our dedication to customer service, modern production facilities and packaging design flair has led to long-term partnerships supplying own label water for Morrisons, Lidl, Booker, Tesco and Iceland.
              </p>
            </Reveal>
          </div>
          <Stagger as="ol" className="lg:col-span-6 lg:col-start-7">
            {sectors.map((s, i) => (
              <StaggerItem key={s} className="group flex items-baseline gap-6 border-b border-navy/10 py-6 first:border-t">
                <span className="tabular-nums text-sm text-spring">0{i + 1}</span>
                <span className="display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight text-navy transition-transform duration-500 group-hover:translate-x-2">{s}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Formats */}
      <section aria-labelledby="formats-title" className="bg-glacier-3 py-28 text-navy sm:py-36">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="02" className="text-spring">Formats</Eyebrow>
              <SplitHeading id="formats-title" as="h2" className="display text-d1 mt-8" lines={["Every popular", "*size.*"]} />
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <p className="lede text-slate">Our bottling lines handle all the popular sizes, from a 330ml sports cap for lunchboxes and leisure to the 2 litre for the weekly shop.</p>
            </Reveal>
          </div>
          <div className="mt-16 overflow-x-auto pb-4" tabIndex={0} role="region" aria-label="Bottle formats (scrolls sideways on small screens)">
            <div className="mx-auto min-w-[560px] max-w-4xl text-navy">
              <BottleLineup />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section aria-labelledby="pillars-title" className="on-dark grain relative bg-abyss py-28 text-white sm:py-36">
        <div className="container-x">
          <div className="max-w-3xl">
            <Eyebrow index="03" className="text-glacier">Capabilities</Eyebrow>
            <SplitHeading id="pillars-title" as="h2" className="display text-d1 mt-8" lines={["Flexibility, detail", "and *logistical*", "excellence."]} />
          </div>
          <Stagger as="ul" className="mt-20 grid gap-px overflow-hidden rounded-[4px] bg-white/10 md:grid-cols-2">
            {pillars.map((p, i) => (
              <StaggerItem key={p.title} className="group relative flex min-h-72 flex-col bg-abyss p-8 transition-colors duration-500 hover:bg-navy sm:p-12">
                <span className="tabular-nums text-sm text-glacier">0{i + 1}</span>
                <h3 className="display mt-auto pt-16 text-[2rem] leading-tight">{p.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-glacier-2">{p.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Fleet */}
      <section aria-labelledby="fleet-title" className="relative overflow-hidden bg-[linear-gradient(180deg,#e8f3f8_0%,#cfe6f1_100%)] py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <Eyebrow index="04" className="text-spring">Our fleet</Eyebrow>
            <SplitHeading id="fleet-title" as="h2" className="display text-d2 mt-8 text-navy" lines={["Delivered by", "*our own* people."]} />
            <Reveal delay={0.1}>
              <p className="prose-body mt-8 text-slate">
                Running our own fleet keeps us in control of the last mile, and our liveries put our brands on the road. Our location at the heart of the country minimises the environmental impact of distribution.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Parallax amount={30}>
              <Reveal y={60}>
                <Image src="/images/fleet.png" alt="Two Shepley Spring articulated lorries in White Rock and Ice Valley livery" width={728} height={275} sizes="(min-width:1024px) 60vw, 100vw" className="h-auto w-full drop-shadow-[0_30px_30px_rgb(10_29_58/0.25)]" />
              </Reveal>
            </Parallax>
          </div>
        </div>
      </section>

      {/* Sustainability tie-in + CTA */}
      <section className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow className="text-spring">Reassurance for your customers</Eyebrow>
            <Reveal>
              <p className="display text-d3 mt-8 text-navy">
                Efficient, innovative processes help make us one of the UK&rsquo;s more environmentally conscious water bottlers, with lighter bottles, smaller labels, recycled PET and tethered caps across the range.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <ArrowLink href="/sustainability" className="text-navy">Our sustainability commitments</ArrowLink>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.15}>
            <div className="rounded-[4px] bg-navy p-8 text-white sm:p-10">
              <p className="eyebrow text-glacier">Sales enquiries</p>
              <p className="display mt-6 text-[2rem] leading-tight">Talk to our commercial team.</p>
              <p className="mt-4 text-glacier-2">Tell us about your range, volumes and channels and we&rsquo;ll come back to you.</p>
              <div className="mt-8 flex flex-col gap-4">
                <Button href="/contact?topic=sales">Send an enquiry</Button>
                <a href={site.phoneHref} className="link-draw self-start text-lg font-medium">{site.phone}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
