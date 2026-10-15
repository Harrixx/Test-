import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { ProcessStory } from "@/components/home/ProcessStory";
import { BrandPanels } from "@/components/BrandPanels";
import { Contours } from "@/components/Contours";
import { MaskReveal, Parallax, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Button, Eyebrow } from "@/components/ui";
import { articles, formatDate } from "@/lib/news";
import { staffVoices, vacancies } from "@/lib/content";

export default function Home() {
  const latest = articles.slice(0, 3);
  const voice = staffVoices[1];

  return (
    <>
      <HomeHero />

      {/* ── Introduction ─────────────────────────────────────────── */}
      <section id="story" aria-labelledby="intro-title" className="relative overflow-hidden bg-paper py-28 sm:py-36 lg:py-44">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow index="01" className="text-spring">Our story</Eyebrow>
            <SplitHeading
              as="h2"
              className="display text-d1 mt-8 text-navy"
              id="intro-title"
              lines={["A drought, a mill,", "and a *remarkable*", "source."]}
            />
            <Reveal className="mt-12 grid gap-8 text-slate sm:grid-cols-2" delay={0.1}>
              <p className="prose-body">
                In the drought of 1995, the borehole beneath a former textile mill on the Knowle in Shepley was found to give water of exceptional quality. A year later, founder Selwyn Smith turned the business from textiles to bottled water, and took many of the mill&rsquo;s staff with him.
              </p>
              <p className="prose-body">
                Thirty years on, Shepley Spring is still led by the founding family. Our reputation for reliability, efficiency and flexibility has built long-term relationships with the best-known names in UK grocery and FMCG.
              </p>
            </Reveal>
            <Reveal className="mt-10" delay={0.2}>
              <ArrowLink href="/about" className="text-navy">Read our story</ArrowLink>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <MaskReveal className="relative mx-auto aspect-[5/7] w-full max-w-md overflow-hidden rounded-[3px] lg:mr-0 lg:max-w-[26rem]">
              <Image
                src="/images/heritage/selwyn-borehole.jpg"
                alt="Founder Selwyn Smith smiling beside the blue pipework of the borehole at Shepley"
                fill
                sizes="(min-width: 1024px) 26rem, 90vw"
                className="object-cover"
              />
            </MaskReveal>
            <Reveal delay={0.3} className="mx-auto mt-4 flex max-w-md items-baseline justify-between gap-4 text-sm text-slate lg:mr-0 lg:max-w-[26rem]">
              <span>Selwyn Smith (1942&ndash;2023), founder</span>
              <span className="tabular-nums">Shepley</span>
            </Reveal>
          </div>
        </div>

        {/* Key facts */}
        <div className="container-x mt-24 lg:mt-32">
          <Stagger as="ul" className="grid grid-cols-2 gap-y-12 border-t border-navy/10 pt-12 lg:grid-cols-4">
            {[
              { k: "1996", v: "Founded in Shepley" },
              { k: "30", v: "Years of bottling" },
              { k: "3", v: "Yorkshire production sites" },
              { k: "1.2m", v: "Bottles a day capacity" },
            ].map((f) => (
              <StaggerItem key={f.v} className="pr-6">
                <p className="display text-[clamp(3rem,6vw,5.5rem)] leading-none text-navy">{f.k}</p>
                <p className="mt-3 text-sm text-slate">{f.v}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Manufacturing excellence ───────────────────────────── */}
      <section aria-labelledby="make-title" className="on-dark grain relative bg-navy py-28 text-white sm:py-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_100%_0%,rgb(27_67_115/0.7)_0%,transparent_70%)]" />
        <div className="container-x relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="02" className="text-glacier">Manufacturing</Eyebrow>
                            <SplitHeading as="h2" id="make-title" className="display text-d1 mt-8" lines={["From the ground", "to the *shelf,*", "under one roof."]} />
            </div>
            <Reveal className="lg:col-span-5" delay={0.15}>
              <p className="lede text-glacier-2">
                Own label bottling for retail multiples, convenience, forecourts, wholesalers and sport. We source, mould, fill, label and deliver, so our customers deal with one accountable partner.
              </p>
              <div className="mt-8">
                <Button href="/own-label">Explore our capabilities</Button>
              </div>
            </Reveal>
          </div>

          <div className="mt-20 lg:mt-28">
            <ProcessStory />
          </div>
        </div>
      </section>

      {/* ── Our brands ─────────────────────────────────────────── */}
      <section aria-labelledby="brands-title" className="bg-mist py-28 sm:py-36">
        <div className="container-x">
          <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="03" className="text-spring">Our brands</Eyebrow>
              <SplitHeading as="h2" className="display text-d1 mt-8 text-navy" id="brands-title"
              lines={["Two brands,", "*one* family."]} />
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <p className="lede text-slate">
                We design, bottle and manage exclusive distribution of two lifestyle brands, Ice&nbsp;Valley&reg; and White&nbsp;Rock&reg;, each with its own personality.
              </p>
            </Reveal>
          </div>
          <Reveal y={40}>
            <BrandPanels />
          </Reveal>
        </div>
      </section>

      {/* ── Sustainability ─────────────────────────────────────── */}
      <section aria-labelledby="planet-title" className="relative overflow-hidden bg-glacier-3 py-28 sm:py-36 lg:py-44">
        <Contours className="pointer-events-none absolute -right-[20%] top-0 h-full w-[90%] text-spring/25 lg:-right-[8%] lg:w-[65%]" />
        <div className="container-x relative">
          <div className="max-w-3xl">
            <Eyebrow index="04" className="text-spring">Sustainability</Eyebrow>
            <SplitHeading as="h2" className="display text-d1 mt-8 text-navy" id="planet-title"
              lines={["A light touch", "on the *planet.*"]} />
            <Reveal delay={0.1}>
              <p className="lede mt-10 max-w-2xl text-slate">
                Responsible withdrawals that protect the aquifer, lighter packaging, renewable energy and less waste. We are working to reduce our footprint in every part of the business.
              </p>
            </Reveal>
          </div>

          <Stagger as="ul" className="mt-20 grid gap-px overflow-hidden rounded-[4px] bg-navy/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "30%", t: "Recycled PET", b: "in our bottles today, with a successful trial of a 100% rPET bottle." },
              { k: "50", t: "Acres of organic farmland", b: "alongside 3 lakes, 2 woods and a communal nature reserve in Shepley." },
              { k: "Founder", t: "UK Plastics Pact signatory", b: "Working with WRAP and the whole plastics value chain towards a circular economy." },
              { k: "DRS", t: "Deposit Return Scheme", b: "Our Managing Director sits on the board of the UK Deposit Management Organisation." },
            ].map((s) => (
              <StaggerItem key={s.t} className="flex min-h-64 flex-col bg-paper p-8">
                <p className="display text-[3.25rem] leading-none text-spring">{s.k}</p>
                <p className="mt-auto pt-10 font-semibold text-navy">{s.t}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-slate">{s.b}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            <ArrowLink href="/sustainability" className="text-navy">Our sustainability commitments</ArrowLink>
            <ArrowLink href="/sustainability/tethered-caps" className="text-navy">Why we use tethered caps</ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* ── People ─────────────────────────────────────────────── */}
      <section aria-labelledby="people-title" className="overflow-hidden bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index="05" className="text-spring">Company &amp; people</Eyebrow>
            <SplitHeading as="h2" className="display text-d1 mt-8 text-navy" id="people-title"
              lines={["Family values,", "*growing* team."]} />
            <Reveal delay={0.1}>
              <p className="lede mt-10 text-slate">
                From engineering apprentices to the founder&rsquo;s son, our people are why customers stay with us. We invest in training, promote from within and give back to the communities around our sites.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <figure className="mt-12 border-l border-spring/40 pl-6">
                <blockquote className="display text-[1.6rem] leading-snug text-navy">&ldquo;{voice.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-slate">{voice.role}, Shepley Spring</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.25} className="mt-12 flex flex-col gap-4">
              <ArrowLink href="/people" className="text-navy">Meet the team</ArrowLink>
              <ArrowLink href="/careers/vacancies" className="text-navy">{`${vacancies.length} current vacancies`}</ArrowLink>
              <ArrowLink href="/community" className="text-navy">Our community partners</ArrowLink>
            </Reveal>
          </div>

          <div className="grid grid-cols-6 gap-3 sm:gap-4 lg:col-span-7">
            <Parallax amount={40} className="col-span-4">
              <MaskReveal className="relative aspect-[16/11] overflow-hidden rounded-[3px]">
                <Image src="/images/people/line-team.jpg" alt="Two Shepley Spring operatives in hi-vis vests working on a bottling line" fill sizes="(min-width:1024px) 38vw, 66vw" className="object-cover" />
              </MaskReveal>
            </Parallax>
            <Parallax amount={90} className="col-span-2 mt-16">
              <MaskReveal className="relative aspect-[3/4] overflow-hidden rounded-[3px]" delay={0.1}>
                <Image src="/images/heritage/knowle-night.jpg" alt="The illuminated SELWYN sign on the head office at night" fill sizes="(min-width:1024px) 19vw, 33vw" className="object-cover" />
              </MaskReveal>
            </Parallax>
            <Parallax amount={60} className="col-span-3 col-start-2">
              <MaskReveal className="relative aspect-[4/3] overflow-hidden rounded-[3px]" delay={0.15}>
                <Image src="/images/people/production.jpg" alt="An operative in a hair net checking machinery on the production line" fill sizes="(min-width:1024px) 28vw, 50vw" className="object-cover" />
              </MaskReveal>
            </Parallax>
            <Parallax amount={20} className="col-span-2">
              <MaskReveal className="relative aspect-square overflow-hidden rounded-[3px] bg-navy" delay={0.2}>
                <Link href="/careers" className="group on-dark flex h-full flex-col justify-between p-5 text-white sm:p-6">
                  <span className="eyebrow text-glacier">Careers</span>
                  <span className="display text-[clamp(1.25rem,2vw,1.9rem)] leading-tight">
                    Grow with us <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </MaskReveal>
            </Parallax>
          </div>
        </div>
      </section>

      {/* ── News ───────────────────────────────────────────────── */}
      <section aria-labelledby="news-title" className="border-t border-navy/10 bg-paper pb-28 pt-20 sm:pb-36">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="06" className="text-spring">News</Eyebrow>
              <h2 id="news-title" className="display text-d2 mt-6 text-navy">Latest from Shepley</h2>
            </div>
            <ArrowLink href="/news" className="text-navy">All news</ArrowLink>
          </div>
          <Stagger as="ul" className="mt-14 grid gap-10 md:grid-cols-3">
            {latest.map((a) => (
              <StaggerItem key={a.slug}>
                <Link href={`/news/${a.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[3px] bg-glacier-3">
                    {a.image && (
                      <Image src={a.image.src} alt="" fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]" />
                    )}
                  </div>
                  <p className="mt-5 flex gap-3 text-[0.8rem] text-slate">
                    <span className="font-semibold uppercase tracking-[0.12em] text-spring">{a.category}</span>
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                  </p>
                  <h3 className="display mt-3 text-[1.6rem] leading-tight text-navy">
                    <span className="link-draw">{a.title}</span>
                  </h3>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
