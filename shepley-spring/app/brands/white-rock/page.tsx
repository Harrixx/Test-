import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Breadcrumbs, Button, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "White Rock spring water",
  description:
    "White Rock: refreshing natural spring water drawn from an ancient Triassic aquifer. Over 110 million litres enjoyed a year and available nationally.",
  alternates: { canonical: "/brands/white-rock" },
};

const story = [
  { k: "250m", t: "years ago", b: "The sands that became the aquifer were laid down when Yorkshire was a desert bordering a vast river system, during the Triassic period." },
  { k: "Layer", t: "upon layer", b: "Rivers deposited clean red sand from distant mountains. Over tens of millions of years it was compressed into solid, porous rock." },
  { k: "Ice", t: "age clay", b: "In the last ice age, glaciers carved the Vale of York and left a glacial lake whose thick clay now protects the aquifer beneath." },
  { k: "50–100", t: "years", b: "The time it takes every drop of rain that becomes White Rock to filter down through the earth." },
];

const range = [
  { src: "/images/brands/white-rock-330.png", w: 210, h: 447, label: "330ml still" },
  { src: "/images/brands/white-rock-500.png", w: 237, h: 560, label: "500ml still" },
  { src: "/images/brands/white-rock-sparkling.png", w: 227, h: 575, label: "500ml sparkling" },
  { src: "/images/brands/white-rock-750-sports.png", w: 257, h: 677, label: "750ml sports cap" },
];

export default function WhiteRockPage() {
  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-[#141c3a] text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_78%_70%,rgb(168_210_230/0.35)_0%,transparent_65%),linear-gradient(180deg,#141c3a_0%,#202c56_100%)]" />
          {/* Strata lines, a nod to the sandstone aquifer */}
          <svg className="absolute inset-x-0 bottom-0 h-[45%] w-full text-[#c49a4c]" preserveAspectRatio="none" viewBox="0 0 100 40">
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M0 ${8 + i * 4} C 25 ${5 + i * 4}, 55 ${12 + i * 4}, 100 ${6 + i * 4}`} fill="none" stroke="currentColor" strokeOpacity={0.08 + i * 0.025} strokeWidth="0.15" />
            ))}
          </svg>
          <Image src="/images/brands/white-rock-750-sports.png" alt="" width={257} height={677} preload sizes="22vw" className="absolute bottom-[8%] right-[8%] hidden h-[70%] w-auto rotate-[7deg] drop-shadow-[0_50px_50px_rgb(0_0_0/0.5)] md:block" />
        </div>
        <div className="container-x flex min-h-[94svh] flex-col justify-end pb-20 pt-44">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/brands", label: "Our brands" }, { label: "White Rock" }]} />
          <h1 className="mt-12">
            <span className="sr-only">White Rock</span>
            <span aria-hidden="true" className="inline-block rounded-[4px] bg-white px-5 py-4">
              <Image src="/images/brands/white-rock-logo.png" alt="" width={631} height={410} preload className="h-auto w-36 sm:w-44" />
            </span>
          </h1>
          <SplitHeading as="p" immediate className="display text-d1 mt-10 max-w-[16ch]" lines={["250 million years", "in the *making.*"]} />
          <Reveal immediate delay={0.5}>
            <p className="lede mt-8 max-w-xl text-white/90">
              Refreshing natural spring water, drawn responsibly from an ancient source beneath Yorkshire. Its style and taste keep growing its popularity and market share.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Market performance, with source */}
      <section aria-labelledby="wr-figures" className="bg-[#202c56] py-24 text-white sm:py-28">
        <div className="container-x">
          <h2 id="wr-figures" className="sr-only">White Rock in numbers</h2>
          <Stagger as="ul" className="grid gap-12 md:grid-cols-3">
            {[
              { k: "110m+", t: "litres consumed every year" },
              { k: "2×", t: "the size it was three years ago" },
              { k: "UK", t: "available to buy nationally" },
            ].map((s) => (
              <StaggerItem key={s.t} className="border-t border-[#c49a4c]/50 pt-8">
                <p className="display text-[clamp(3.5rem,7vw,6rem)] leading-none text-[#e1c27f]">{s.k}</p>
                <p className="mt-4 text-lg text-white/85">{s.t}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-10 text-sm text-white/60">Source: Circana MAT 06.07.2025, volume (1L), as published on whiterockwater.co.uk.</p>
        </div>
      </section>

      {/* Aquifer story */}
      <section aria-labelledby="wr-story" className="bg-paper py-28 sm:py-36">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="text-[#202c56]">The source</Eyebrow>
              <SplitHeading id="wr-story" as="h2" className="display text-d1 mt-8 text-[#202c56]" lines={["From desert sands", "to *spring water.*"]} />
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <p className="lede text-slate">The porous, permeable rock beneath us stores and transmits groundwater efficiently, forming some of the UK&rsquo;s most important aquifers.</p>
            </Reveal>
          </div>
          <Stagger as="ol" className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {story.map((s, i) => (
              <StaggerItem key={s.k} className="relative pt-10">
                <span aria-hidden="true" className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[#c49a4c] to-transparent" />
                <span className="tabular-nums text-sm text-[#7d5a1c]">0{i + 1}</span>
                <p className="display mt-4 text-[2.6rem] leading-none text-[#202c56]">{s.k}</p>
                <p className="mt-1 font-semibold text-[#202c56]">{s.t}</p>
                <p className="mt-4 leading-relaxed text-slate">{s.b}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Range */}
      <section aria-labelledby="wr-range" className="relative overflow-hidden bg-[linear-gradient(180deg,#eef1f8_0%,#dfe5f2_100%)] py-28 sm:py-36">
        <div className="container-x">
          <Eyebrow className="text-[#202c56]">The range</Eyebrow>
          <SplitHeading id="wr-range" as="h2" className="display text-d1 mt-8 text-[#202c56]" lines={["Still, sparkling", "and *on the go.*"]} />
          <Stagger as="ul" className="mt-16 grid grid-cols-2 items-end gap-x-6 gap-y-12 md:grid-cols-4">
            {range.map((r) => (
              <StaggerItem key={r.label} className="group flex flex-col items-center">
                <div className="flex h-72 items-end sm:h-96">
                  <Image src={r.src} alt={`White Rock ${r.label}`} width={r.w} height={r.h} sizes="(min-width:768px) 14vw, 36vw" className="h-auto max-h-full w-auto drop-shadow-[0_30px_25px_rgb(32_44_86/0.3)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-3" style={{ height: `${(r.h / 677) * 100}%` }} />
                </div>
                <p className="mt-6 font-semibold text-[#202c56]">{r.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow className="text-[#202c56]">Official water</Eyebrow>
            <p className="display text-d2 mt-8 text-[#202c56]">The official water of the Huddersfield Giants.</p>
          </Reveal>
          <Reveal className="flex flex-col justify-end gap-4 lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="text-slate">White Rock bottles are recyclable, use recycled PET, and now come with tethered caps.</p>
            <ArrowLink href="/sustainability" className="text-[#202c56]">Our sustainability commitments</ArrowLink>
            <div className="mt-6">
              <a href="https://whiterockwater.co.uk" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#202c56] px-6 font-semibold text-white transition-colors hover:bg-[#2c3b72]">
                Visit whiterockwater.co.uk <span aria-hidden="true">↗</span><span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-navy/10 bg-paper py-16">
        <div className="container-x flex flex-wrap items-center justify-between gap-6">
          <p className="display text-d3 text-navy">Meet our other brand.</p>
          <Button href="/brands/ice-valley" variant="dark">Ice Valley</Button>
        </div>
      </section>
    </>
  );
}
