import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="on-dark grain relative isolate flex min-h-[90svh] items-end overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_20%,#1b4373_0%,transparent_70%)]" />
      <div className="container-x pb-24 pt-44">
        <p className="eyebrow text-glacier">Error 404</p>
        <h1 className="display text-hero mt-8 max-w-[14ch]">This page has <em>run dry.</em></h1>
        <p className="lede mt-8 max-w-xl text-glacier-2">The page you were looking for has moved or no longer exists. Try one of these instead.</p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/">Back to the homepage</Button>
          <Button href="/contact" variant="outline-light">Contact us</Button>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-glacier-2">
          {[["/own-label", "Own label"], ["/brands", "Our brands"], ["/sustainability", "Sustainability"], ["/careers/vacancies", "Vacancies"], ["/news", "News"]].map(([href, label]) => (
            <li key={href}><Link href={href} className="link-draw">{label}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
