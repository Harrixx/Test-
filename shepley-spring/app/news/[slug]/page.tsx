import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { ArrowLink, Breadcrumbs, JsonLd } from "@/components/ui";
import { articles, formatDate, getArticle } from "@/lib/news";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/news/${a.slug}` },
    openGraph: { type: "article", publishedTime: a.date, title: a.title, description: a.excerpt, images: a.image ? [a.image.src] : undefined },
  };
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const i = articles.indexOf(a);
  const next = articles[(i + 1) % articles.length];

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: a.title,
          datePublished: a.date,
          description: a.excerpt,
          image: a.image ? [new URL(a.image.src, site.url).toString()] : undefined,
          publisher: { "@type": "Organization", name: site.legalName },
        }}
      />
      <header className="bg-mist pb-14 pt-40 sm:pt-48">
        <div className="container-x">
          <Breadcrumbs tone="light" items={[{ href: "/", label: "Home" }, { href: "/news", label: "News" }, { label: a.title }]} />
          <div className="mx-auto mt-12 max-w-4xl">
            <p className="flex gap-3 text-sm text-slate">
              <span className="font-semibold uppercase tracking-[0.14em] text-spring">{a.category}</span>
              <time dateTime={a.date}>{formatDate(a.date)}</time>
            </p>
            <h1 className="display text-d1 mt-6 text-navy">{a.title}</h1>
            <p className="lede mt-8 text-slate">{a.excerpt}</p>
          </div>
        </div>
      </header>

      {a.image && (
        <div className="bg-[linear-gradient(180deg,var(--color-mist)_50%,var(--color-paper)_50%)]">
          <div className="container-x">
            <Reveal y={30} className="relative mx-auto aspect-[3/2] max-w-5xl overflow-hidden rounded-[3px]">
              <Image src={a.image.src} alt={a.image.alt} fill preload sizes="(min-width:1100px) 64rem, 100vw" className="object-cover" />
            </Reveal>
          </div>
        </div>
      )}

      <div className="bg-paper py-16 sm:py-24">
        <div className="container-x">
          <div className="prose-body mx-auto max-w-2xl space-y-6 text-[1.125rem] text-ink/85">
            {a.body.map((p, idx) => (
              <p key={idx} className={idx === 0 ? "text-[1.3rem] leading-relaxed text-navy" : ""}>{p}</p>
            ))}
            {a.quote && (
              <figure className="my-12 border-l-2 border-spring py-2 pl-8">
                <blockquote className="display text-[1.9rem] leading-snug text-navy">&ldquo;{a.quote.text}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-slate">{a.quote.by}</figcaption>
              </figure>
            )}
            {a.link && (
              <p className="pt-4">
                <ArrowLink href={a.link.href} external className="text-navy">{a.link.label}</ArrowLink>
              </p>
            )}
          </div>
        </div>
      </div>

      <nav aria-label="More news" className="border-t border-navy/10 bg-paper py-16">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <ArrowLink href="/news" className="text-navy">All news</ArrowLink>
          <Link href={`/news/${next.slug}`} className="group text-right">
            <span className="eyebrow block text-slate">Next story</span>
            <span className="display mt-2 block text-[1.6rem] text-navy"><span className="link-draw">{next.title}</span> <span aria-hidden="true">→</span></span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
