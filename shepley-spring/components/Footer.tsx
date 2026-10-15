import Link from "next/link";
import { Logo } from "./Logo";
import { Reveal, SplitHeading } from "./motion";
import { Button } from "./ui";
import { legalLinks, locations, nav, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark grain relative overflow-hidden bg-abyss text-white">
      {/* Closing call to action */}
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_85%_0%,rgb(27_67_115/0.75)_0%,transparent_60%)]" />
        <div className="container-x relative grid gap-12 pb-20 pt-28 md:pt-36 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-8 text-glacier">Talk to Shepley Spring</p>
            <SplitHeading as="h2" className="display text-d1" lines={["Let’s talk about", "*your* water."]} />
          </div>
          <Reveal className="lg:col-span-4" delay={0.2}>
            <p className="lede text-glacier-2">
              Own label programmes, our brands, supplying us, or a question about your bottle. One conversation with a family business that has done this for thirty years.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="/contact">Start a conversation</Button>
              <a href={site.phoneHref} className="link-draw text-lg font-medium">{site.phone}</a>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-x relative">
        <div className="rule text-white" />

        {/* Sites */}
        <ul className="grid gap-y-10 py-14 sm:grid-cols-3">
          {locations.map((l, i) => (
            <li key={l.key} className="pr-8">
              <p className="eyebrow text-glacier">
                <span className="tabular-nums opacity-60">0{i + 1}</span>&nbsp;&nbsp;{l.name}
              </p>
              <p className="mt-1 text-sm text-silver">{l.role}</p>
              <address className="mt-4 not-italic leading-relaxed text-glacier-2">
                {l.street}<br />
                {l.locality !== l.town && <>{l.locality}<br /></>}
                {l.town} {l.postcode}
              </address>
            </li>
          ))}
        </ul>

        <div className="rule text-white" />

        {/* Navigation */}
        <div className="grid gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" aria-label="Shepley Spring home" className="inline-block">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-silver">
              Family-owned since 1996. Bottling own label and branded spring water in Yorkshire for the UK grocery and FMCG sector.
            </p>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-glacier-2 hover:text-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.44 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.49V22H7.66V8z" /></svg>
              Shepley Spring on LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-8">
            {nav.map((group) => (
              <div key={group.label}>
                <p className="eyebrow mb-4 text-silver">{group.label}</p>
                <ul className="space-y-2.5 text-[0.95rem] text-glacier-2">
                  {(group.items.length ? group.items : [{ href: group.href, label: group.label }]).map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="link-draw hover:text-white">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="eyebrow mb-4 text-silver">Get in touch</p>
              <ul className="space-y-2.5 text-[0.95rem] text-glacier-2">
                <li><Link href="/contact" className="link-draw hover:text-white">Contact us</Link></li>
                <li><Link href="/contact#faq" className="link-draw hover:text-white">Questions about our water</Link></li>
                <li><a href={site.phoneHref} className="link-draw hover:text-white">{site.phone}</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="rule text-white" />

        <div className="flex flex-col gap-6 py-8 text-[0.8rem] text-silver md:flex-row md:items-center md:justify-between">
          <p>
            Content and brand assets &copy; {site.legalName}. Design concept {year}.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="link-draw hover:text-white">{l.label}</Link></li>
            ))}
            <li><Link href="/concept" className="link-draw hover:text-white">About this concept</Link></li>
          </ul>
        </div>
        <p className="border-t border-white/10 py-6 text-[0.75rem] leading-relaxed text-silver-2">
          This is an independently developed, unofficial redesign concept prepared for presentation to Shepley Spring Ltd. It is not affiliated with or endorsed by the company. The official website is{" "}
          <a href={site.officialUrl} className="underline underline-offset-2 hover:text-white">shepleyspring.co.uk</a>.
        </p>
      </div>

      {/* Oversized wordmark watermark */}
      <div aria-hidden="true" className="pointer-events-none relative -mb-[3vw] select-none overflow-hidden">
        <Logo className="mx-auto w-[108%] max-w-none -translate-x-[4%] text-white/[0.035]" title="" />
      </div>
    </footer>
  );
}
