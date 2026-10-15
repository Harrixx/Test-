import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Breadcrumbs, Button, Eyebrow } from "@/components/ui";
import { claims, omittedClaims, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About this concept",
  description: "An unofficial redesign concept for Shepley Spring: what has changed, what needs approval, and what it would take to go live.",
  alternates: { canonical: "/concept" },
};

const findings = [
  { title: "The first impression is empty", body: "On desktop, the current homepage opens on a plain blue panel until its slider loads. The most valuable screen on the site says nothing about the business." },
  { title: "Illustration over evidence", body: "Cartoon shops, trolleys and lorries stand in for the real factories, people and products, which are the company’s strongest proof of quality and scale." },
  { title: "Contact is hard to find", body: "There is no contact page; “Contact” jumps to a form at the bottom of the own label page, and email isn’t offered at all." },
  { title: "Inconsistent facts", body: "The homepage says 30 years while its search description says 20. Recycled content is 30% on one site and 30–51% on another. One job title differs between pages." },
  { title: "Accessibility gaps", body: "Lime green headings on white and white text on mid blue fall below WCAG contrast guidance, and several images carry no meaningful alternative text." },
  { title: "Claims without evidence", body: "Superlatives such as “UK’s leading” and “lightest on the market” appear without a source, which exposes the business under advertising rules." },
];

const improvements = [
  { title: "A confident first screen", body: "A cinematic, code-rendered water hero that loads instantly and states who Shepley Spring is, with clear routes to capabilities and brands." },
  { title: "Real company, real people", body: "Existing photography of the founder, the line, the fleet and the team, treated consistently and given room, with clearly labelled slots for commissioned shoots." },
  { title: "Built for buyers", body: "A dedicated own label page structured around what a category buyer needs: channels, formats, capabilities, logistics and a direct route to sales." },
  { title: "Two brands, two personalities", body: "Ice Valley and White Rock each get their own colour, texture and story, held together by the parent site’s typography and grid." },
  { title: "Evidence-led sustainability", body: "Only commitments the company has published, organised so the strongest (the Plastics Pact, the DRS board seat, the Shepley estate) lead." },
  { title: "Accessible and fast", body: "Semantic HTML, keyboard navigation, visible focus, reduced-motion support, AA contrast, responsive images and static generation for every page." },
];

const requirements = [
  { area: "Content management", detail: "Connect news, vacancies, team and partners to a headless CMS (for example Sanity or Payload) so the marketing team can edit without a developer." },
  { area: "Vacancies", detail: "Feed roles live from the applicant tracking system, with full descriptions, JobPosting structured data and an application route per role." },
  { area: "Enquiries", detail: "Connect the contact form to a mail or CRM service with spam protection, and agree who receives each topic (sales, product, supplier, sponsorship, careers)." },
  { area: "Photography and film", detail: "Commission a one-day shoot across the three sites: the source and estate, injection moulding, the lines, the lab, the fleet, and team portraits. Optional slow-motion film loop for the hero." },
  { area: "Brand assets", detail: "Supply master vector files for the Shepley Spring, Ice Valley and White Rock logos, and high-resolution product renders." },
  { area: "Cookies and analytics", detail: "Add a consent banner compliant with UK GDPR and PECR before any analytics are enabled, and update the cookies policy to list what is used." },
  { area: "Legal review", detail: "Have advisers review the privacy policy (it currently cites EU law and the CCPA rather than UK GDPR and the ICO) and the modern slavery statement." },
  { area: "Launch and SEO", detail: "Point shepleyspring.co.uk at the new build, apply the redirect map below, submit the sitemap, and remove the concept banner and noindex settings." },
];

const redirects = [
  ["/experts-in-own-label-water-bottling/", "/own-label"],
  ["/two-lifestyle-brands-for-independents/", "/brands"],
  ["/sustainable-water-bottling/", "/sustainability"],
  ["/why-we-use-tethered-caps/", "/sustainability/tethered-caps"],
  ["/pure-water-business/", "/about"],
  ["/meet-the-team/", "/people"],
  ["/careers-in-water-bottling/", "/careers"],
  ["/current-vacancies-at-shepley-spring/", "/careers/vacancies"],
  ["/latest-water-bottling-news/", "/news"],
  ["/making-a-difference-within-our-communities/", "/community"],
  ["/modern-slavery-and-human-trafficking-statement/", "/modern-slavery-statement"],
  ["/cookie-policy/ and /cookies-policy/", "/cookies-policy"],
  ["/celebrating-selwyn-day-29th-august-2024/", "/news/celebrating-selwyn-smith"],
  ["/shepley-spring-awarded-groceryaid-silver-award/", "/news/groceryaid-silver-award"],
  ["/james-smith-appointed-to-uk-dmo-board-of-directors/", "/news/james-smith-uk-dmo-board"],
  ["/new-production-line-increases-capacity/", "/news/new-production-line-increases-capacity"],
  ["/100-recycled-plastic-bottle-trials/", "/news/100-recycled-plastic-bottle-trials"],
  ["/sport-sponsorship/", "/news/sport-sponsorship"],
  ["/air-ambulance-sponsorship/", "/news/air-ambulance-sponsorship"],
  ["/slider-from-scratch/", "/"],
];

const approvals = [
  "Every factual claim in the register below, especially those marked “confirm”.",
  "Use of retailer names (Morrisons, Lidl, Booker, Tesco, Iceland) on the own label page; logos are not used.",
  "Use of the existing photography, team portraits and staff quotes, and permission from each person shown.",
  "The headline line “Spring water, 300 million years in the making”, based on the c. 304 million year age of the Greenmoor rock given on the current site.",
  "Supporting lines written for the six company values on the About page, and the condensed, more formal team biographies.",
  "Danielle Nixon’s job title (Senior People Manager on the careers page, People Operations Manager on the team page).",
  "The Brookfield postcode, shown on the current site as “HD8 OPE” and corrected here to HD8 0PE.",
];

export default function ConceptPage() {
  return (
    <>
      <section className="bg-mist pb-20 pt-40 sm:pt-48">
        <div className="container-x">
          <Breadcrumbs tone="light" items={[{ href: "/", label: "Home" }, { label: "About this concept" }]} />
          <p className="mt-10 inline-flex items-center gap-3 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-glacier" /> Unofficial design concept
          </p>
          <SplitHeading as="h1" immediate className="display text-hero mt-8 max-w-[15ch] text-navy" lines={["A digital presence", "worthy of *thirty years.*"]} />
          <Reveal immediate delay={0.4} className="mt-10 grid gap-8 lg:grid-cols-12">
            <p className="lede text-slate lg:col-span-7">
              This is an independently developed, speculative redesign of shepleyspring.co.uk, prepared for presentation to Shepley Spring&rsquo;s senior management. It is not affiliated with or endorsed by the company, and it is not the official website.
            </p>
            <p className="text-slate lg:col-span-4 lg:col-start-9">
              Every fact on these pages comes from Shepley Spring&rsquo;s own websites, crawled on 15 October 2026. Nothing has been invented; claims that need confirming are listed below. The build is kept out of search engines.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Before */}
      <section aria-labelledby="before" className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <Eyebrow index="01" className="text-spring">Where we started</Eyebrow>
          <h2 id="before" className="display text-d2 mt-6 max-w-3xl text-navy">The current website undersells the business.</h2>
          <div className="mt-14 grid gap-4 md:grid-cols-12">
            <figure className="md:col-span-5">
              <div className="overflow-hidden rounded-[4px] ring-1 ring-navy/10">
                <Image src="/concept/before-home.jpg" alt="Screenshot of the current shepleyspring.co.uk homepage on desktop: an empty blue panel with the logo and a menu icon" width={1440} height={900} sizes="(min-width:768px) 40vw, 100vw" className="h-auto w-full" />
              </div>
              <figcaption className="mt-3 text-sm text-slate">Current homepage on desktop, as it first loads.</figcaption>
            </figure>
            <figure className="md:col-span-5">
              <div className="overflow-hidden rounded-[4px] ring-1 ring-navy/10">
                <Image src="/concept/before-own-label.jpg" alt="Screenshot of the current own label page: illustrated shops, a trolley of retailer logos and cartoon lorries" width={1440} height={900} sizes="(min-width:768px) 40vw, 100vw" className="h-auto w-full" />
              </div>
              <figcaption className="mt-3 text-sm text-slate">Current own label page.</figcaption>
            </figure>
            <figure className="md:col-span-2">
              <div className="mx-auto max-w-[12rem] overflow-hidden rounded-[10px] ring-1 ring-navy/10">
                <Image src="/concept/before-home-mobile.jpg" alt="Screenshot of the current homepage on a phone: a 30 years celebration graphic with bottles and balloons" width={390} height={844} sizes="12rem" className="h-auto w-full" />
              </div>
              <figcaption className="mt-3 text-center text-sm text-slate">On mobile.</figcaption>
            </figure>
          </div>
          <Stagger as="ul" className="mt-16 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {findings.map((f) => (
              <StaggerItem key={f.title} className="border-t border-navy/10 pt-6">
                <h3 className="font-semibold text-navy">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-slate">{f.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Improvements */}
      <section aria-labelledby="after" className="on-dark grain relative bg-navy py-24 text-white sm:py-32">
        <div className="container-x">
          <Eyebrow index="02" className="text-glacier">What changes</Eyebrow>
          <h2 id="after" className="display text-d2 mt-6 max-w-3xl">Six design improvements.</h2>
          <Stagger as="ol" className="mt-14 grid gap-px overflow-hidden rounded-[4px] bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {improvements.map((f, i) => (
              <StaggerItem key={f.title} className="bg-navy p-8">
                <p className="tabular-nums text-sm text-glacier">0{i + 1}</p>
                <h3 className="display mt-8 text-[1.75rem] leading-tight">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-glacier-2">{f.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/">View the homepage</Button>
            <Button href="/own-label" variant="outline-light">View own label</Button>
          </div>
        </div>
      </section>

      {/* Claims register */}
      <section aria-labelledby="claims" className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <Eyebrow index="03" className="text-spring">Claims register</Eyebrow>
          <h2 id="claims" className="display text-d2 mt-6 max-w-3xl text-navy">Every fact, and where it came from.</h2>
          <div className="mt-12 overflow-x-auto rounded-[4px] ring-1 ring-navy/10" tabIndex={0} role="region" aria-label="Claims register">
            <table className="w-full min-w-[720px] text-left text-[0.95rem]">
              <caption className="sr-only">Factual claims used in the concept, their source and approval status</caption>
              <thead className="bg-mist text-sm text-navy">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">Claim</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Source</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {claims.map((c) => (
                  <tr key={c.claim} className="align-top">
                    <td className="px-5 py-4 text-ink">{c.claim}</td>
                    <td className="px-5 py-4 text-slate">
                      <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-navy/30 underline-offset-2 hover:decoration-navy">{c.source}</a>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${c.status === "sourced" ? "bg-glacier-3 text-navy" : "bg-[#fff4e5] text-[#8a4b00]"}`}>
                        {c.status === "sourced" ? "Sourced" : "Confirm"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="display text-d3 text-navy">Deliberately left out</h3>
              <p className="mt-3 text-slate">These appear on the current websites but have no published evidence. They can be reinstated once substantiated.</p>
              <ul className="mt-6 space-y-3">
                {omittedClaims.map((c) => (
                  <li key={c} className="flex gap-3 text-slate"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-silver-2" />{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="display text-d3 text-navy">Needs company approval</h3>
              <ul className="mt-6 space-y-3">
                {approvals.map((c) => (
                  <li key={c} className="flex gap-3 text-slate"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-spring" />{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Production */}
      <section aria-labelledby="production" className="bg-glacier-3 py-24 sm:py-32">
        <div className="container-x">
          <Eyebrow index="04" className="text-spring">Moving into production</Eyebrow>
          <h2 id="production" className="display text-d2 mt-6 max-w-3xl text-navy">What it would take to go live.</h2>
          <Stagger as="ol" className="mt-12 grid gap-px overflow-hidden rounded-[4px] bg-navy/10 md:grid-cols-2">
            {requirements.map((r, i) => (
              <StaggerItem key={r.area} className="bg-paper p-8">
                <p className="tabular-nums text-sm text-spring">0{i + 1}</p>
                <h3 className="mt-4 text-lg font-semibold text-navy">{r.area}</h3>
                <p className="mt-2 leading-relaxed text-slate">{r.detail}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <h3 className="display text-d3 mt-20 text-navy">Redirect map</h3>
          <p className="mt-3 max-w-2xl text-slate">Every page and post on the current site, mapped to its new home, so search rankings and shared links carry over.</p>
          <div className="mt-8 overflow-x-auto rounded-[4px] bg-paper ring-1 ring-navy/10" tabIndex={0} role="region" aria-label="Redirect map">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Old URLs and the new URLs they redirect to</caption>
              <thead className="bg-mist text-navy">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Current URL</th>
                  <th scope="col" className="px-5 py-3 font-semibold">New URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10 font-mono text-[0.8rem]">
                {redirects.map(([from, to]) => (
                  <tr key={from}>
                    <td className="px-5 py-3 text-slate">{from}</td>
                    <td className="px-5 py-3 text-navy">{to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-slate">
            Built with Next.js, TypeScript, Tailwind CSS and Framer Motion, statically generated for speed and ready to deploy on Vercel. The official website remains{" "}
            <a href={site.officialUrl} className="text-navy underline underline-offset-2">shepleyspring.co.uk</a>.
          </p>
          <ArrowLink href="/" className="text-navy">Back to the homepage</ArrowLink>
        </div>
      </section>
    </>
  );
}
