import type { Metadata } from "next";
import Image from "next/image";
import { MaskReveal, Parallax, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { Timeline } from "@/components/Timeline";
import { SiteMap } from "@/components/SiteMap";
import { ArrowLink, Breadcrumbs, Eyebrow } from "@/components/ui";
import { timeline } from "@/lib/content";
import { locations, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Shepley Spring",
  description:
    "From a Shepley textile mill to one of the UK's own label water bottlers: the story of the Smith family business, founded in 1996.",
  alternates: { canonical: "/about" },
};

const valueNotes: Record<string, string> = {
  Sustainability: "A light touch on the aquifer, the land and the climate.",
  Transparency: "Straight answers for customers, colleagues and consumers.",
  Excellence: "A good product at a good price, every time.",
  Teamwork: "One tight team across three sites.",
  Safety: "Food safety and personal safety, without compromise.",
  Equality: "An inclusive place to work and to grow.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero: the mill by night */}
      <section className="on-dark grain relative isolate overflow-hidden bg-abyss text-white">
        <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[48%]">
          <Parallax amount={50} className="h-full">
            <div className="relative h-[115%] w-full -translate-y-[7%]">
              <Image
                src="/images/heritage/knowle-night.jpg"
                alt="The SELWYN sign and Shepley Spring logo lit up on the head office at night"
                fill
                preload
                sizes="(min-width: 768px) 48vw, 100vw"
                className="object-cover object-[50%_30%] opacity-45 md:opacity-90"
              />
            </div>
          </Parallax>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/60 to-transparent md:via-abyss/10" />
        </div>
        <div className="container-x flex min-h-[88svh] flex-col justify-end pb-20 pt-44">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
          <SplitHeading as="h1" immediate className="display text-hero mt-10 max-w-[12ch]" lines={["Born in a mill.", "Built on a *spring.*"]} />
          <Reveal immediate delay={0.5}>
            <p className="lede mt-10 max-w-xl text-glacier-2">
              Shepley Spring is a family-owned Yorkshire business that has bottled own label and branded spring water for thirty years. Few businesses can trace their story back three hundred million years.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <MaskReveal className="relative aspect-[5/7] overflow-hidden rounded-[3px]">
              <Image src="/images/heritage/selwyn-borehole.jpg" alt="Selwyn Smith beside the borehole pipework at Shepley" fill sizes="(min-width:1024px) 36vw, 90vw" className="object-cover" />
            </MaskReveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Eyebrow className="text-spring">Our founder</Eyebrow>
            <SplitHeading id="founder" as="h2" className="display text-d2 mt-8 text-navy" lines={["“Get more right", "than we get wrong,", "and we’ll be *okay.*”"]} />
            <Reveal delay={0.1} className="prose-body mt-10 space-y-5 text-slate">
              <p>
                Selwyn Smith was born in Shepley in 1942 and lived there all his life. An engineer, a perfectionist and an entrepreneur, he bought a former textile mill on the Knowle and built Shepley Textiles, supplying reconditioned machinery around the world.
              </p>
              <p>
                When the drought of 1995 revealed that the mill&rsquo;s borehole gave water of extremely high quality, Selwyn led the move from textiles to bottled water, taking many of his staff with him. He believed in &ldquo;a good product at a good price&rdquo;, a principle that still guides the business.
              </p>
              <p>
                Selwyn died in May 2023. In August 2024 our head office was renamed Shepley Spring Selwyn, and his name now stands on the building where he worked until his last day.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <ArrowLink href="/news/celebrating-selwyn-smith" className="text-navy">Celebrating the legacy of Selwyn Smith</ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline-title" className="on-dark grain relative bg-navy py-28 text-white sm:py-36">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="justify-center text-glacier">Our story</Eyebrow>
            <SplitHeading id="timeline-title" as="h2" className="display text-d1 mt-8" lines={["From deep time", "to *today.*"]} />
          </div>
          <div className="mx-auto mt-20 max-w-5xl">
            <Timeline items={timeline} />
          </div>
        </div>
      </section>

      {/* Leadership statement */}
      <section className="bg-glacier-3 py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow className="text-spring">Still family-led</Eyebrow>
          </Reveal>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="display text-d3 text-navy">
                Still under the leadership of the founding family, Shepley Spring is a team of professionals committed to the values on which our success has been built. Selwyn&rsquo;s son James, a former RAF officer, has been Managing Director since 2007.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <ArrowLink href="/people" className="text-navy">Meet the team</ArrowLink>
              <ArrowLink href="/careers" className="text-navy">Careers at Shepley Spring</ArrowLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="bg-paper py-28 sm:py-36">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <Eyebrow className="text-spring">Our values</Eyebrow>
              <SplitHeading id="values-title" as="h2" className="display text-d1 mt-8 text-navy" lines={["Six values,", "*one* way of working."]} />
            </div>
          </div>
          <Stagger as="ol" className="mt-16 grid border-t border-navy/10 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <StaggerItem key={v} className="group border-b border-navy/10 py-10 sm:pr-10 lg:[&:nth-child(3n+2)]:px-10 lg:[&:nth-child(3n)]:pl-10">
                <p className="tabular-nums text-sm text-spring">0{i + 1}</p>
                <h3 className="display mt-4 text-[2.25rem] leading-none text-navy transition-transform duration-500 group-hover:translate-x-1">{v}</h3>
                <p className="mt-4 text-slate">{valueNotes[v]}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Sites */}
      <section aria-labelledby="sites-title" className="on-dark relative overflow-hidden bg-abyss py-28 text-white sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <Eyebrow className="text-glacier">Where we are</Eyebrow>
            <SplitHeading id="sites-title" as="h2" className="display text-d2 mt-8" lines={["Three sites,", "at the *heart*", "of the country."]} />
            <Reveal delay={0.1}>
              <p className="lede mt-8 text-glacier-2">
                Our central location, close to the motorway network, means efficient distribution across the UK and lower environmental impact on every delivery.
              </p>
            </Reveal>
            <ul className="mt-12 space-y-8">
              {locations.map((l) => (
                <Reveal as="li" key={l.key} className="border-t border-white/10 pt-6">
                  <p className="font-semibold">{l.name} <span className="font-normal text-silver">&middot; {l.role}</span></p>
                  <address className="mt-2 not-italic text-glacier-2">{l.street}, {l.locality}{l.locality !== l.town ? `, ${l.town}` : ""} {l.postcode}</address>
                  {l.note && <p className="mt-1 text-sm text-silver">{l.note}</p>}
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.15}>
            <div className="relative overflow-hidden rounded-[4px] bg-navy p-4 text-glacier-2 sm:p-8">
              <SiteMap className="h-auto w-full" />
            </div>
            <figure className="mt-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[4px]">
                <Image src="/images/heritage/knowle-building.jpg" alt="The stone-built head office on the Knowle, with the SELWYN sign and Shepley Spring logo" fill sizes="(min-width:1024px) 45vw, 90vw" className="object-cover object-[50%_40%]" />
              </div>
              <figcaption className="mt-3 text-sm text-silver">Shepley Spring Selwyn, our head office on the Knowle.</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    </>
  );
}
