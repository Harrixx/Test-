import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Contours } from "@/components/Contours";
import { MaskReveal, Reveal, SplitHeading } from "@/components/motion";
import { ArrowLink, Breadcrumbs, Button, Eyebrow } from "@/components/ui";
import { partners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Community",
  description: "Working together to give something back: the charities, partners, sports clubs and industry bodies Shepley Spring supports.",
  alternates: { canonical: "/community" },
};

export default function CommunityPage() {
  return (
    <>
      <section className="on-dark grain relative isolate overflow-hidden bg-navy text-white">
        <Contours className="absolute inset-0 -z-10 h-full w-full text-glacier/15" rings={16} seed={7} />
        <div className="container-x flex min-h-[86svh] flex-col justify-end pb-20 pt-44">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Community" }]} />
          <SplitHeading as="h1" immediate className="display text-hero mt-10 max-w-[14ch]" lines={["Working together", "to give something", "*back.*"]} />
          <Reveal immediate delay={0.5}>
            <p className="lede mt-10 max-w-2xl text-glacier-2">
              Our commitment to community initiatives and charities lets us make a positive difference to the people around us, while providing commercially and sustainably balanced solutions for our customers.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="donations" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="text-spring">Every year</Eyebrow>
            <h2 id="donations" className="mt-8">
              <span className="display block text-[clamp(4.5rem,13vw,12rem)] leading-[0.85] text-navy">200,000+</span>
              <span className="display mt-4 block text-d3 text-slate">bottles donated to charities and events.</span>
            </h2>
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="prose-body text-slate">
              We have designated charities and events that we support each year. If you&rsquo;d like us to consider your cause, tell us about it.
            </p>
            <div className="mt-8">
              <Button href="/contact?topic=sponsorship" variant="dark">Request support</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="partners" className="bg-mist py-28 sm:py-36">
        <div className="container-x">
          <Eyebrow className="text-spring">Partners and causes</Eyebrow>
          <SplitHeading id="partners" as="h2" className="display text-d1 mt-8 text-navy" lines={["Together we can", "make a *difference.*"]} />
          <ol className="mt-16 border-t border-navy/15">
            {partners.map((p, i) => {
              const external = p.url.startsWith("http");
              return (
                <Reveal as="li" key={p.name} className="border-b border-navy/15">
                  <div className="group grid gap-4 py-10 md:grid-cols-12 md:gap-8">
                    <span className="tabular-nums text-sm text-spring md:col-span-1 md:pt-3">{String(i + 1).padStart(2, "0")}</span>
                    <div className="md:col-span-5">
                      <h3 className="display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight text-navy transition-transform duration-500 group-hover:translate-x-1">{p.name}</h3>
                      <p className="mt-2 text-sm font-medium text-slate">{p.kind}</p>
                    </div>
                    <div className="md:col-span-6">
                      <p className="leading-relaxed text-slate">{p.body}</p>
                      <div className="mt-4">
                        {external ? (
                          <ArrowLink href={p.url} external className="text-sm text-navy">Visit website</ArrowLink>
                        ) : (
                          <ArrowLink href={p.url} className="text-sm text-navy">Read more</ArrowLink>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <section aria-labelledby="award" className="on-dark bg-abyss py-28 text-white sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <MaskReveal className="relative aspect-[3/2] overflow-hidden rounded-[3px] bg-white">
              <Image src="/images/news/groceryaid.jpg" alt="GroceryAid Awards Silver Award artwork with Ice Valley and White Rock bottles" fill sizes="(min-width:1024px) 45vw, 90vw" className="object-cover" />
            </MaskReveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Eyebrow className="text-glacier">Recognition</Eyebrow>
            <SplitHeading id="award" as="h2" className="display text-d2 mt-8" lines={["GroceryAid", "*Silver Award* 2026."]} />
            <Reveal delay={0.1}>
              <p className="prose-body mt-8 text-glacier-2">
                Since 2024 we have partnered with GroceryAid, the charity supporting people who work in the grocery industry. The Silver Award recognises our team&rsquo;s commitment to its vital work.
              </p>
              <div className="mt-8">
                <Link href="/news/groceryaid-silver-award" className="link-draw font-semibold">Read the announcement →</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
