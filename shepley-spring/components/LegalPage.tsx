import Link from "next/link";
import type { LegalSection } from "@/lib/legal";
import { Breadcrumbs } from "./ui";
import { legalLinks } from "@/lib/site";

type Props = { title: string; intro: string; sections: LegalSection[]; path: string };

export function LegalPage({ title, intro, sections, path }: Props) {
  const toc = sections.filter((s) => s.heading);
  return (
    <>
      <section className="bg-mist pb-16 pt-40 sm:pt-48">
        <div className="container-x">
          <Breadcrumbs tone="light" items={[{ href: "/", label: "Home" }, { label: title }]} />
          <h1 className="display text-d1 mt-8 max-w-4xl text-navy">{title}</h1>
          <p className="lede mt-8 max-w-2xl text-slate">{intro}</p>
          <p className="mt-8 inline-flex max-w-2xl gap-3 rounded-[3px] border border-spring/25 bg-paper px-4 py-3 text-sm text-slate">
            <span aria-hidden="true" className="mt-[3px] h-2 w-2 shrink-0 rounded-full bg-spring" />
            Transcribed from the current website for completeness. To be reviewed by Shepley Spring&rsquo;s advisers before launch.
          </p>
        </div>
      </section>
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <nav aria-label="On this page" className="lg:sticky lg:top-32">
              <p className="eyebrow text-slate">On this page</p>
              <ol className="mt-5 space-y-2 border-l border-navy/10 text-[0.95rem]">
                {toc.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-slate transition-colors hover:border-spring hover:text-navy">
                      {s.number && <span className="mr-2 tabular-nums text-silver-2">{s.number}</span>}
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="eyebrow mt-12 text-slate">Other policies</p>
              <ul className="mt-4 space-y-2 text-[0.95rem]">
                {legalLinks.filter((l) => l.href !== path).map((l) => (
                  <li key={l.href}><Link href={l.href} className="link-draw text-navy">{l.label}</Link></li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="max-w-3xl lg:col-span-8">
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={s.heading ? `${s.id}-h` : undefined} className="border-t border-navy/10 py-10 first:border-t-0 first:pt-0">
                {s.heading && (
                  <h2 id={`${s.id}-h`} className="display text-d3 text-navy">
                    {s.number && <span className="mr-4 tabular-nums text-spring">{s.number}</span>}
                    {s.heading}
                  </h2>
                )}
                <div className="prose-body mt-6 space-y-4 text-slate">
                  {s.blocks.map((b, i) =>
                    b.type === "sub" ? (
                      <h3 key={i} className="pt-4 font-semibold text-navy">{b.text}</h3>
                    ) : (
                      <p key={i}>{b.text}</p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
