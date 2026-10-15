import type { Metadata } from "next";
import Image from "next/image";
import { BrandPanels } from "@/components/BrandPanels";
import { Reveal, SplitHeading } from "@/components/motion";
import { ArrowLink, Breadcrumbs, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our brands: Ice Valley and White Rock",
  description: "We design, bottle and manage exclusive distribution of two lifestyle spring water brands, Ice Valley and White Rock.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return (
    <>
      {/* Split hero: each half in its brand's colour */}
      <section className="on-dark relative isolate grid min-h-[100svh] overflow-hidden text-white md:grid-cols-2">
        <div className="relative bg-[radial-gradient(70%_60%_at_50%_80%,#00a9e8_0%,transparent_75%),linear-gradient(170deg,#073e63_0%,#0b5f8f_100%)]">
          <Image src="/images/brands/ice-valley-pack.png" alt="" width={1200} height={1026} preload sizes="50vw" className="absolute bottom-[-4%] left-1/2 h-[36%] w-auto max-w-none -translate-x-1/2 drop-shadow-2xl" />
        </div>
        <div className="relative hidden bg-[#202c56] md:block">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_100%,rgb(168_210_230/0.3)_0%,transparent_70%)]" />
          <Image src="/images/brands/white-rock-500.png" alt="" width={237} height={560} sizes="20vw" className="absolute bottom-[6%] left-1/2 h-[38%] w-auto -translate-x-1/2 rotate-[6deg] drop-shadow-[0_40px_40px_rgb(0_0_0/0.45)]" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_13_28/0.75)_0%,rgb(5_13_28/0.2)_45%,transparent_70%)]" />
        <div className="container-x absolute inset-x-0 top-0 pt-44">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Our brands" }]} />
          <SplitHeading as="h1" immediate className="display text-hero mt-10 max-w-[12ch]" lines={["Two lifestyle", "brands for", "*independents.*"]} />
        </div>
      </section>

      <section aria-labelledby="brands-intro" className="bg-mist py-28 sm:py-36">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow className="text-spring">Bottled exclusively by Shepley Spring</Eyebrow>
              <h2 id="brands-intro" className="display text-d2 mt-8 text-navy">Designed, bottled and distributed in Yorkshire.</h2>
            </div>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
              <p className="lede text-slate">
                We design, bottle and manage exclusive distribution of our lifestyle brands, Ice&nbsp;Valley&reg; and White&nbsp;Rock&reg;. Each has its own personality, its own source story and its own loyal following, and both are made with the same care as everything we bottle.
              </p>
            </Reveal>
          </div>
          <Reveal y={40} className="mt-16">
            <BrandPanels headingLevel="h2" />
          </Reveal>
          <div className="mt-16 grid gap-6 border-t border-navy/10 pt-10 sm:grid-cols-2">
            <ArrowLink href="https://ice-valley.com" external className="text-navy">Visit ice-valley.com</ArrowLink>
            <ArrowLink href="https://whiterockwater.co.uk" external className="text-navy">Visit whiterockwater.co.uk</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
