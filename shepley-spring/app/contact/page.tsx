import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Reveal, SplitHeading } from "@/components/motion";
import { Breadcrumbs, Eyebrow, JsonLd } from "@/components/ui";
import { faqs } from "@/lib/content";
import { locations, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with Shepley Spring about own label bottling, our brands, supplying us, sponsorship or careers. Call 01484 609330.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <section className="bg-mist pb-20 pt-40 sm:pt-48">
        <div className="container-x">
          <Breadcrumbs tone="light" items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <SplitHeading as="h1" immediate className="display text-hero text-navy lg:col-span-8" lines={["Let’s talk", "*water.*"]} />
            <Reveal immediate className="lg:col-span-4" delay={0.3}>
              <p className="lede text-slate">Speak to a member of our team on</p>
              <a href={site.phoneHref} className="display mt-2 block text-[clamp(2rem,3.4vw,3rem)] leading-tight text-navy hover:text-spring">{site.phone}</a>
              <p className="mt-2 text-sm text-slate">Or send us a message and the right person will get back to you.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="form-title" className="bg-paper py-20 sm:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="form-title" className="display text-d3 text-navy">Send us a message</h2>
            <p className="mt-3 text-slate">All fields are required unless marked optional.</p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
          <aside aria-labelledby="sites-heading" className="lg:col-span-4 lg:col-start-9">
            <h2 id="sites-heading" className="eyebrow text-slate">Our sites</h2>
            <ul className="mt-6 space-y-8">
              {locations.map((l) => (
                <li key={l.key} className="border-t border-navy/10 pt-6">
                  <p className="display text-[1.6rem] text-navy">{l.name}</p>
                  <p className="text-sm text-spring">{l.role}</p>
                  <address className="mt-3 not-italic leading-relaxed text-slate">
                    {l.street}<br />
                    {l.locality !== l.town && <>{l.locality}<br /></>}
                    {l.town} {l.postcode}
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.street}, ${l.town} ${l.postcode}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-draw mt-3 inline-block text-sm font-semibold text-navy"
                  >
                    Get directions ↗<span className="sr-only"> to {l.name} (opens Google Maps in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-[4px] bg-glacier-3 p-6">
              <p className="font-semibold text-navy">Looking for a job?</p>
              <p className="mt-1 text-sm text-slate">See our current vacancies across all three sites.</p>
              <Link href="/careers/vacancies" className="link-draw mt-3 inline-block text-sm font-semibold text-navy">View vacancies →</Link>
            </div>
          </aside>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 bg-glacier-3 py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="text-spring">FAQ</Eyebrow>
            <h2 id="faq-title" className="display text-d2 mt-6 text-navy">Questions about our water</h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="border-t border-navy/15">
              {faqs.map((f) => (
                <li key={f.q} className="border-b border-navy/15">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left text-lg font-semibold text-navy marker:hidden [&::-webkit-details-marker]:hidden">
                      <span>{f.q}</span>
                      <span aria-hidden="true" className="relative mt-1.5 h-4 w-4 shrink-0">
                        <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                      </span>
                    </summary>
                    <div className="pb-8 pr-10 leading-relaxed text-slate">
                      <p>{f.a}</p>
                      {f.href && <Link href={f.href} className="link-draw mt-3 inline-block font-semibold text-navy">Read more →</Link>}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
