import type { Metadata } from "next";
import Image from "next/image";
import { Contours } from "@/components/Contours";
import { MaskReveal, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Breadcrumbs, ConceptPlaceholder, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Responsible withdrawals, renewable energy, lighter bottles with recycled PET, tethered caps and a founder signatory to the UK Plastics Pact: how Shepley Spring keeps a light touch on the planet.",
  alternates: { canonical: "/sustainability" },
};

const commitments = [
  {
    id: "aquifer",
    eyebrow: "Water",
    title: "Protecting the aquifer",
    body: "We drive aquifer preservation through sustainable withdrawals. Our brands are bottled where the water comes out of the ground, from protected underground sources, and we go to great lengths to protect them from the impacts of bottling and distribution.",
  },
  {
    id: "energy",
    eyebrow: "Energy",
    title: "Renewable generation, less waste",
    body: "We are committed to energy efficiency through renewable energy generation and waste reduction, and to continuous innovation that reduces our carbon footprint. All of our production waste is recycled.",
  },
  {
    id: "packaging",
    eyebrow: "Packaging",
    title: "Lighter bottles, smaller labels",
    body: "Our bottles are made with 30% recycled PET, remarkably rigid without being flimsy. We have successfully trialled a lightweight bottle made from 100% recycled plastic, which went to market with no negative customer feedback.",
  },
  {
    id: "logistics",
    eyebrow: "Distribution",
    title: "A central location",
    body: "Sitting at the heart of the country, close to the motorway network, our own fleet travels shorter distances to reach customer hubs across the UK.",
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#e8f3f8_0%,#cfe6f1_100%)] text-navy">
        <Contours className="absolute inset-0 -z-10 h-full w-full text-spring/25" rings={18} seed={3} />
        <div className="container-x flex min-h-[92svh] flex-col justify-end pb-20 pt-44">
          <Breadcrumbs tone="light" items={[{ href: "/", label: "Home" }, { label: "Sustainability" }]} />
          <SplitHeading as="h1" immediate className="display text-hero mt-10 max-w-[13ch]" lines={["A light touch", "on the *planet.*"]} />
          <Reveal immediate delay={0.5}>
            <p className="lede mt-10 max-w-2xl text-slate">
              We are committed to responsible resource use and to building sustainability into every part of our business, so that Shepley Spring can be the best water supplier, community partner and employer it can be.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section aria-labelledby="mission" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="01" className="text-spring">Mission statement</Eyebrow>
            <h2 id="mission" className="sr-only">Mission statement</h2>
          </div>
          <Reveal className="lg:col-span-8">
            <p className="display text-d3 text-navy">
              We have a responsibility to drive aquifer preservation through sustainable withdrawals, energy efficiency through renewable energy generation and waste reduction, and to continuously innovate to reduce our carbon footprint.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Commitments, sticky index */}
      <section aria-labelledby="commitments" className="on-dark grain relative bg-navy py-28 text-white sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow index="02" className="text-glacier">Commitments</Eyebrow>
              <SplitHeading id="commitments" as="h2" className="display text-d2 mt-8" lines={["Four ways we", "tread *lightly.*"]} />
              <ul className="mt-10 hidden space-y-3 text-glacier-2 lg:block">
                {commitments.map((c, i) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`} className="group flex items-center gap-4">
                      <span className="tabular-nums text-sm text-glacier">0{i + 1}</span>
                      <span className="link-draw">{c.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {commitments.map((c, i) => (
              <Reveal as="li" key={c.id} className="border-t border-white/10 py-14 first:border-t-0 first:pt-0">
                <article id={c.id} className="scroll-mt-32">
                  <p className="eyebrow text-glacier">
                    <span className="tabular-nums opacity-60">0{i + 1}</span>&nbsp;&nbsp;{c.eyebrow}
                  </p>
                  <h3 className="display mt-6 text-d3">{c.title}</h3>
                  <p className="lede mt-6 text-glacier-2">{c.body}</p>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Estate */}
      <section aria-labelledby="estate" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <Eyebrow index="03" className="text-spring">Land and nature</Eyebrow>
            <SplitHeading id="estate" as="h2" className="display text-d1 mt-8 text-navy" lines={["Caring for", "the land *above*", "the source."]} />
          </div>
          <div className="lg:col-span-7">
            <Stagger as="ul" className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] bg-navy/10 sm:grid-cols-4">
              {[
                { k: "50", t: "acres of organically farmed land" },
                { k: "3", t: "lakes" },
                { k: "2", t: "woods" },
                { k: "1", t: "communal nature reserve" },
              ].map((s) => (
                <StaggerItem key={s.t} className="bg-glacier-3 p-6">
                  <p className="display text-[3rem] leading-none text-spring">{s.k}</p>
                  <p className="mt-3 text-sm text-slate">{s.t}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.1}>
              <p className="prose-body mt-8 text-slate">All in our home village of Shepley, maintained to protect our source and the wider environment.</p>
            </Reveal>
            <MaskReveal className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[4px]">
              <ConceptPlaceholder
                label="The Shepley estate"
                brief="Commission: aerial photography of the lakes, woodland and nature reserve around the source, in early morning light."
              />
            </MaskReveal>
          </div>
        </div>
      </section>

      {/* Circular economy */}
      <section aria-labelledby="circular" className="bg-glacier-3 py-28 sm:py-36">
        <div className="container-x">
          <div className="max-w-3xl">
            <Eyebrow index="04" className="text-spring">Circular economy</Eyebrow>
            <SplitHeading id="circular" as="h2" className="display text-d1 mt-8 text-navy" lines={["Bottles that", "come *back.*"]} />
          </div>
          <Stagger as="ul" className="mt-16 grid gap-6 md:grid-cols-3">
            <StaggerItem className="flex flex-col rounded-[4px] bg-paper p-8">
              <p className="eyebrow text-spring">UK Plastics Pact</p>
              <h3 className="display mt-6 text-[1.8rem] leading-tight text-navy">Founder signatory</h3>
              <p className="mt-4 leading-relaxed text-slate">The WRAP-led pact brings businesses across the plastics value chain together with UK governments and NGOs to build a circular economy for plastics.</p>
              <div className="mt-auto pt-8"><ArrowLink href="https://www.wrap.ngo/taking-action/plastic-packaging/initiatives/the-uk-plastics-pact" external className="text-navy">About the pact</ArrowLink></div>
            </StaggerItem>
            <StaggerItem className="flex flex-col rounded-[4px] bg-paper p-8">
              <p className="eyebrow text-spring">Deposit Return Scheme</p>
              <h3 className="display mt-6 text-[1.8rem] leading-tight text-navy">A seat on the UK DMO board</h3>
              <p className="mt-4 leading-relaxed text-slate">Our Managing Director, James Smith, was appointed in 2025 to the board of the UK Deposit Management Organisation, the not-for-profit administrator of the UK&rsquo;s Deposit Return Scheme.</p>
              <div className="mt-auto pt-8"><ArrowLink href="/news/james-smith-uk-dmo-board" className="text-navy">Read the announcement</ArrowLink></div>
            </StaggerItem>
            <StaggerItem className="flex flex-col rounded-[4px] bg-paper p-8">
              <p className="eyebrow text-spring">Surplus stock</p>
              <h3 className="display mt-6 text-[1.8rem] leading-tight text-navy">Nothing wasted</h3>
              <p className="mt-4 leading-relaxed text-slate">We work with Company Shop so that surplus stock reaches their members, including key workers, armed forces and NHS staff, at a discount instead of going to waste.</p>
              <div className="mt-auto pt-8"><ArrowLink href="/community" className="text-navy">Our community partners</ArrowLink></div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Tethered caps teaser */}
      <section aria-labelledby="caps" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Eyebrow index="05" className="text-spring">Tethered caps</Eyebrow>
            <SplitHeading id="caps" as="h2" className="display text-d1 mt-8 text-navy" lines={["The cap", "*stays on.*"]} />
            <Reveal delay={0.1}>
              <p className="lede mt-8 max-w-xl text-slate">
                Our bottles now come with tethered caps, so cap and bottle stay together and are recycled together. Please recycle the whole bottle with the cap on.
              </p>
              <div className="mt-10"><ArrowLink href="/sustainability/tethered-caps" className="text-navy">Why we use tethered caps</ArrowLink></div>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <MaskReveal className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#cfe6f1_60%,#a8d2e6_100%)]">
              <Image src="/images/tethered-cap.png" alt="A White Rock bottle with its tethered cap open and still attached" fill sizes="(min-width:1024px) 28rem, 80vw" className="object-contain p-6" />
            </MaskReveal>
          </div>
        </div>
      </section>
    </>
  );
}
