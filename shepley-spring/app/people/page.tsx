import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Breadcrumbs, Button, Eyebrow } from "@/components/ui";
import { team } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our people",
  description: "Still led by the founding family, Shepley Spring is a team of professionals committed to the values our success has been built on.",
  alternates: { canonical: "/people" },
};

export default function PeoplePage() {
  const leaders = team.filter((t) => t.leadership);
  const others = team.filter((t) => !t.leadership);
  return (
    <>
      <section className="on-dark grain relative isolate overflow-hidden bg-abyss text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_0%_100%,#1b4373_0%,transparent_65%)]" />
        <div className="container-x pb-20 pt-44 sm:pb-28">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Our people" }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <SplitHeading as="h1" immediate className="display text-hero lg:col-span-8" lines={["The people", "behind the *water.*"]} />
            <Reveal immediate className="lg:col-span-4" delay={0.4}>
              <p className="lede text-glacier-2">Still under the leadership of the founding family, Shepley Spring is a team of professionals committed to the values on which our success has been built.</p>
            </Reveal>
          </div>
          {/* Strip of the team's faces */}
          <Reveal immediate delay={0.6} className="mt-16">
            <ul aria-hidden="true" className="flex -space-x-3">
              {team.map((t) => (
                <li key={t.slug} className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-abyss sm:h-14 sm:w-14">
                  <Image src={t.image} alt="" fill sizes="56px" className="object-cover grayscale" />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="leadership" className="bg-paper py-28 sm:py-36">
        <div className="container-x">
          <Eyebrow index="01" className="text-spring">Leadership</Eyebrow>
          <h2 id="leadership" className="display text-d2 mt-6 text-navy">Leadership team</h2>
          <Stagger as="ul" className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
            {leaders.map((p) => (
              <StaggerItem key={p.slug} as="li" className="group">
                <article className="grid gap-6 sm:grid-cols-5">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-glacier-3 sm:col-span-2">
                    <Image src={p.image} alt={`Portrait of ${p.name}`} fill sizes="(min-width:768px) 18vw, 90vw" className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  </div>
                  <div className="sm:col-span-3 sm:pt-2">
                    <p className="eyebrow text-spring">{p.role}</p>
                    <h3 className="display mt-4 text-[2.2rem] leading-none text-navy">{p.name}</h3>
                    <p className="mt-5 leading-relaxed text-slate">{p.bio}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section aria-labelledby="team" className="bg-mist py-28 sm:py-36">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow index="02" className="text-spring">Heads of department</Eyebrow>
              <SplitHeading id="team" as="h2" className="display text-d1 mt-8 text-navy" lines={["Experts in every", "*drop.*"]} />
            </div>
          </div>
          <Stagger as="ul" className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((p) => (
              <StaggerItem key={p.slug} as="li" className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-glacier-3">
                  <Image src={p.image} alt={`Portrait of ${p.name}`} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw" className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy">{p.name}</h3>
                <p className="text-sm text-spring">{p.role}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-slate">{p.bio}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="on-dark bg-navy py-24 text-white">
        <div className="container-x flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <p className="display text-d2 max-w-2xl">Want to join them?</p>
          <div className="flex flex-wrap items-center gap-6">
            <Button href="/careers/vacancies">See current vacancies</Button>
            <ArrowLink href="/careers" className="text-white">Life at Shepley Spring</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
