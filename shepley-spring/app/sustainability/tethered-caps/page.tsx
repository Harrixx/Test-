import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Breadcrumbs, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Why we use tethered caps",
  description:
    "Our bottles now come with tethered caps that stay attached, so cap and bottle are recycled together. Here's why, and how to use them.",
  alternates: { canonical: "/sustainability/tethered-caps" },
};

/** Simple line diagrams of a bottle neck in each of the three positions. */
function CapDiagram({ step }: { step: "open" | "push" | "close" }) {
  const cap = {
    open: <g transform="rotate(-8 60 34)"><rect x="40" y="16" width="40" height="22" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" /><path d="M44 22h32M44 28h32" stroke="currentColor" strokeOpacity="0.4" /></g>,
    push: <g transform="rotate(-100 42 44)"><rect x="40" y="16" width="40" height="22" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" /></g>,
    close: <rect x="40" y="22" width="40" height="22" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />,
  }[step];
  const arrow = {
    open: <path d="M92 18 a14 14 0 0 0 -14 -12" fill="none" stroke="#1a6ea6" strokeWidth="2" markerEnd={`url(#ah-${step})`} />,
    push: <path d="M86 40 q 14 -10 6 -26" fill="none" stroke="#1a6ea6" strokeWidth="2" markerEnd={`url(#ah-${step})`} />,
    close: <path d="M78 6 a14 14 0 0 1 14 12" fill="none" stroke="#1a6ea6" strokeWidth="2" markerEnd={`url(#ah-${step})`} />,
  }[step];
  return (
    <svg viewBox="0 0 120 130" className="h-40 w-auto text-navy" aria-hidden="true">
      <defs>
        <marker id={`ah-${step}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#1a6ea6" />
        </marker>
      </defs>
      {/* neck and shoulder */}
      <path d="M46 44 v10 c0 10 -26 14 -26 34 v42 M74 44 v10 c0 10 26 14 26 34 v42" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="43" y="44" width="34" height="5" fill="currentColor" fillOpacity="0.35" />
      {/* tether ring */}
      <path d="M44 50 q -6 -3 -2 -6" fill="none" stroke="#1a6ea6" strokeWidth="2" />
      {cap}
      {arrow}
    </svg>
  );
}

const steps = [
  { key: "open" as const, title: "Open", body: "Firmly grip the top of the cap and unscrew anticlockwise. Enjoy your refreshing spring water." },
  { key: "push" as const, title: "Push back", body: "The little tab keeps the cap attached, and doesn’t affect opening or closing the bottle." },
  { key: "close" as const, title: "Close", body: "Push the cap back into place on top of the bottle, then screw it clockwise to seal." },
];

export default function TetheredCapsPage() {
  return (
    <>
      <section className="on-dark grain relative isolate overflow-hidden bg-navy text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_75%_60%,rgb(168_210_230/0.35)_0%,transparent_70%)]" />
        <div className="container-x grid min-h-[90svh] gap-10 pb-16 pt-44 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/sustainability", label: "Sustainability" }, { label: "Tethered caps" }]} />
            <SplitHeading as="h1" immediate className="display text-hero mt-10" lines={["Why the cap", "*stays on.*"]} />
            <Reveal immediate delay={0.5}>
              <p className="lede mt-10 max-w-xl text-glacier-2">
                Have you noticed that our bottles now come with tethered caps, which stay attached after opening? It&rsquo;s a small change that advances our commitment to the circular economy.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal immediate y={50} delay={0.3}>
              <Image src="/images/tethered-cap.png" alt="A White Rock bottle with its tethered cap open and still attached" width={451} height={453} preload sizes="(min-width:1024px) 36vw, 80vw" className="mx-auto h-auto w-full max-w-md drop-shadow-[0_40px_40px_rgb(0_0_0/0.4)]" />
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="why" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow className="text-spring">The simple answer</Eyebrow>
            <SplitHeading id="why" as="h2" className="display text-d2 mt-8 text-navy" lines={["Recycled", "*together.*"]} />
          </div>
          <div className="lg:col-span-7">
            <Stagger as="ul" className="grid gap-10 sm:grid-cols-2">
              <StaggerItem>
                <h3 className="text-lg font-semibold text-navy">Less plastic waste</h3>
                <p className="mt-3 leading-relaxed text-slate">Tethered caps keep cap and bottle attached, so both are recycled together. Bottle and cap are 100% recyclable.</p>
              </StaggerItem>
              <StaggerItem>
                <h3 className="text-lg font-semibold text-navy">Never lost</h3>
                <p className="mt-3 leading-relaxed text-slate">Loose caps are easily lost and can end up as litter outside the recycling system. A tethered cap is always there to reseal the bottle for later.</p>
              </StaggerItem>
              <StaggerItem>
                <h3 className="text-lg font-semibold text-navy">In line with the industry</h3>
                <p className="mt-3 leading-relaxed text-slate">In line with all major UK water bottlers, we have introduced tethered caps across our range.</p>
              </StaggerItem>
              <StaggerItem>
                <h3 className="text-lg font-semibold text-navy">Please keep it on</h3>
                <p className="mt-3 leading-relaxed text-slate">Whenever possible, recycle the whole bottle with the cap still attached.</p>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </section>

      <section aria-labelledby="how" className="bg-glacier-3 py-28 sm:py-36">
        <div className="container-x">
          <Eyebrow className="text-spring">How to use them</Eyebrow>
          <SplitHeading id="how" as="h2" className="display text-d1 mt-8 text-navy" lines={["Still a *screw cap.*"]} />
          <Reveal delay={0.1}><p className="lede mt-6 max-w-xl text-slate">Opening and closing our bottles hasn&rsquo;t changed.</p></Reveal>
          <Stagger as="ol" className="mt-16 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <StaggerItem key={s.key} className="flex flex-col items-start rounded-[4px] bg-paper p-8">
                <CapDiagram step={s.key} />
                <p className="mt-6 tabular-nums text-sm text-spring">Step 0{i + 1}</p>
                <h3 className="display mt-2 text-[2rem] text-navy">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-slate">{s.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section aria-labelledby="whynow" className="bg-paper py-28 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="text-spring">Why now?</Eyebrow>
            <h2 id="whynow" className="sr-only">Why now?</h2>
          </div>
          <Reveal className="lg:col-span-8">
            <p className="display text-d3 text-navy">
              An EU directive announced in 2018 requires water bottles of up to three litres to have caps that stay attached after opening. Since Brexit the rule doesn&rsquo;t apply in the UK, but like other industry leaders we believe tethered caps are in the best interests of our customers and the environment.
            </p>
            <div className="mt-10"><ArrowLink href="/sustainability" className="text-navy">More on sustainability</ArrowLink></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
