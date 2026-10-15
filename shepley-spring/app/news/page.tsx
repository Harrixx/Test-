import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { Breadcrumbs } from "@/components/ui";
import { articles, formatDate } from "@/lib/news";

export const metadata: Metadata = {
  title: "News",
  description: "The latest news from Shepley Spring: investment, awards, sustainability and our community.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  const [featured, ...rest] = articles;
  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-abyss text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_90%_10%,#1b4373_0%,transparent_65%)]" />
        <div className="container-x pb-16 pt-44">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "News" }]} />
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <SplitHeading as="h1" immediate className="display text-hero lg:col-span-8" lines={["Making *waves.*"]} />
            <Reveal immediate className="lg:col-span-4" delay={0.3}>
              <p className="lede text-glacier-2">The latest from Shepley Spring: investment in our sites, awards, sustainability and the causes we support.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-label="Featured story" className="bg-abyss pb-24 text-white">
        <div className="container-x">
          <Link href={`/news/${featured.slug}`} className="group on-dark grid gap-8 border-t border-white/10 pt-12 lg:grid-cols-12 lg:items-center">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[3px] lg:col-span-7">
              {featured.image && (
                <Image src={featured.image.src} alt={featured.image.alt} fill preload sizes="(min-width:1024px) 55vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" />
              )}
            </div>
            <div className="lg:col-span-5">
              <p className="flex gap-3 text-sm">
                <span className="font-semibold uppercase tracking-[0.14em] text-glacier">{featured.category}</span>
                <time dateTime={featured.date} className="text-silver">{formatDate(featured.date)}</time>
              </p>
              <h2 className="display text-d2 mt-6"><span className="link-draw">{featured.title}</span></h2>
              <p className="lede mt-6 text-glacier-2">{featured.excerpt}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold">Read the story <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span></span>
            </div>
          </Link>
        </div>
      </section>

      <section aria-label="More news" className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <Stagger as="ul" className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <StaggerItem key={a.slug}>
                <Link href={`/news/${a.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[3px] bg-[linear-gradient(150deg,#0a1d3a_0%,#1b4373_100%)]">
                    {a.image ? (
                      <Image src={a.image.src} alt="" fill sizes="(min-width:1024px) 30vw, (min-width:768px) 45vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]" />
                    ) : (
                      <span aria-hidden="true" className="absolute inset-0">
                        <svg className="absolute inset-0 h-full w-full text-glacier/30 transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" preserveAspectRatio="none" viewBox="0 0 300 200">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <path key={i} d={`M0 ${70 + i * 14} C 80 ${50 + i * 14}, 170 ${100 + i * 12}, 300 ${60 + i * 15}`} fill="none" stroke="currentColor" strokeWidth="0.7" />
                          ))}
                        </svg>
                        <span className="display absolute inset-0 flex items-end p-6 text-[2.4rem] leading-none text-white/90">{a.category}</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-5 flex gap-3 text-[0.8rem] text-slate">
                    <span className="font-semibold uppercase tracking-[0.12em] text-spring">{a.category}</span>
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                  </p>
                  <h2 className="display mt-3 text-[1.7rem] leading-tight text-navy"><span className="link-draw">{a.title}</span></h2>
                  <p className="mt-3 leading-relaxed text-slate">{a.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
