import type { Metadata } from "next";
import Image from "next/image";
import { MaskReveal, Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { Breadcrumbs, Button, Eyebrow } from "@/components/ui";
import { staffVoices, team, vacancies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers in water bottling",
  description: "Join a growing, family-owned business with real opportunities to develop and progress in FMCG and food and beverage manufacturing.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  const danielle = team.find((t) => t.slug === "danielle-nixon")!;
  return (
    <>
      <section className="on-dark grain relative isolate overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/people/line-team.jpg" alt="" fill preload sizes="100vw" className="object-cover opacity-25 grayscale" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_29_58/0.7)_0%,rgb(10_29_58/0.85)_60%,#0a1d3a_100%)]" />
        </div>
        <div className="container-x flex min-h-[88svh] flex-col justify-end pb-20 pt-44">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Careers" }]} />
          <SplitHeading as="h1" immediate className="display text-hero mt-10 max-w-[12ch]" lines={["Grow with a", "business on", "the *move.*"]} />
          <Reveal immediate delay={0.5} className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <p className="lede max-w-xl text-glacier-2 lg:col-span-7">
              Shepley Spring is a growing, transformational business with ambitious plans. We value collaboration, ambition and attitude as much as experience, because culture fit goes a long way here.
            </p>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Button href="/careers/vacancies">{`View ${vacancies.length} vacancies`}</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="culture" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <MaskReveal className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[3px]">
              <Image src={danielle.image} alt={`Portrait of ${danielle.name}`} fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
            </MaskReveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Eyebrow className="text-spring">A word from our people team</Eyebrow>
            <h2 id="culture" className="sr-only">Our culture</h2>
            <Reveal>
              <blockquote className="display text-d3 mt-8 text-navy">
                &ldquo;If you&rsquo;re looking for a business where people genuinely matter, culture is lived every day, and growth opportunities are real and ongoing, we&rsquo;d love to hear from you.&rdquo;
              </blockquote>
              <p className="mt-6 font-semibold text-navy">{danielle.name}</p>
              <p className="text-sm text-slate">{danielle.role}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="prose-body mt-10 text-slate">
                We offer consistent opportunities for development and progression, particularly for people looking to advance their careers in FMCG and food and beverage manufacturing. Our commitment to training gives every employee the foundations to build a career in water bottling, from apprenticeships to management.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="voices" className="on-dark relative bg-abyss py-28 text-white sm:py-36">
        <div className="container-x">
          <Eyebrow className="text-glacier">In their words</Eyebrow>
          <SplitHeading id="voices" as="h2" className="display text-d1 mt-8" lines={["What our people", "*say.*"]} />
          <Stagger as="ul" className="mt-16 grid gap-px overflow-hidden rounded-[4px] bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {staffVoices.map((v) => (
              <StaggerItem key={v.role} className="flex flex-col bg-abyss p-8 sm:p-10">
                {v.image && (
                  <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-[2px]">
                    <Image src={v.image} alt="" fill sizes="(min-width:1024px) 28vw, 90vw" className="object-cover opacity-80 grayscale" />
                  </div>
                )}
                <blockquote className="display text-[1.45rem] leading-snug">&ldquo;{v.quote}&rdquo;</blockquote>
                <p className="mt-6 text-glacier-2">{v.growth}</p>
                <p className="mt-auto pt-8 text-sm font-semibold text-glacier">{v.role}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-glacier-3 py-24">
        <div className="container-x flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow text-spring">Now hiring across three sites</p>
            <p className="display text-d2 mt-4 max-w-2xl text-navy">Production, engineering, warehouse and more.</p>
          </div>
          <Button href="/careers/vacancies" variant="dark">See all vacancies</Button>
        </div>
      </section>
    </>
  );
}
