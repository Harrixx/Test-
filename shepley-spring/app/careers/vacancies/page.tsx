import type { Metadata } from "next";
import { VacancyBoard } from "@/components/VacancyBoard";
import { Reveal, SplitHeading } from "@/components/motion";
import { Breadcrumbs } from "@/components/ui";
import { vacancies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Current vacancies",
  description: "Current vacancies at Shepley Spring across our Shepley, Kirkburton and Harrogate sites.",
  alternates: { canonical: "/careers/vacancies" },
};

export default function VacanciesPage() {
  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-navy text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_100%_100%,#1b4373_0%,transparent_65%)]" />
        <div className="container-x pb-20 pt-44">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/careers", label: "Careers" }, { label: "Vacancies" }]} />
          <SplitHeading as="h1" immediate className="display text-hero mt-10" lines={["Current", "*vacancies.*"]} />
          <Reveal immediate delay={0.4}>
            <p className="lede mt-8 max-w-2xl text-glacier-2">
              We&rsquo;re looking for talented people to join our expanding workforce. Through our commitment to training, we aim to give every employee the foundations to build a career in water bottling.
            </p>
          </Reveal>
        </div>
      </section>
      <section aria-label="Vacancies" className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          <VacancyBoard vacancies={vacancies} />
          <p className="mt-12 max-w-2xl text-sm text-slate">
            Vacancies as listed on shepleyspring.co.uk on 15 October 2026. In production this list would be fed live from the company&rsquo;s applicant tracking system, with full job descriptions and an application form on each role.
          </p>
        </div>
      </section>
    </>
  );
}
