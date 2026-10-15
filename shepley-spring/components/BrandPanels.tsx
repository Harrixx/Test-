import Image from "next/image";
import Link from "next/link";

/** Ice Valley and White Rock, side by side, each in its own visual language. */
export function BrandPanels({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Ice Valley: crisp glacial cyan */}
      <Link
        href="/brands/ice-valley"
        className="group on-dark relative isolate flex min-h-[40rem] flex-col overflow-hidden rounded-[4px] bg-[linear-gradient(160deg,#073e63_0%,#0b5f8f_45%,#0a73ad_100%)] p-8 text-white sm:p-10 lg:min-h-[40rem]"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_80%_62%,rgb(0_169_232/0.75)_0%,transparent_70%)] transition-opacity duration-700 group-hover:opacity-80" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-white/20 transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-125" />
        <div aria-hidden="true" className="absolute -right-10 -top-10 -z-10 h-52 w-52 rounded-full border border-white/20 transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110" />
        <p className="eyebrow text-white/80">Still &amp; sparkling spring water</p>
        <H className="mt-6 max-w-xs">
          <span className="sr-only">Ice Valley</span>
          <Image src="/images/brands/ice-valley-logo.svg" alt="" width={498} height={55} className="h-auto w-56 brightness-0 invert sm:w-64" />
        </H>
        <p className="mt-6 max-w-xs text-lg leading-snug text-white/90">Welcome to the Valley of Refreshment. Filtered through Greenmoor rock for a uniquely crisp taste.</p>
        <div className="relative mt-auto flex items-end justify-between gap-4 pt-10">
          <span className="text-sm text-white/85">Exclusively at Tesco and Booker Wholesale</span>
          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#0b5f8f] transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
        </div>
        <Image
          src="/images/brands/ice-valley-range.png"
          alt="An Ice Valley bottle among splashes of ice"
          width={695}
          height={611}
          sizes="(min-width: 768px) 30vw, 70vw"
          className="pointer-events-none absolute bottom-16 right-[-6%] -z-10 w-[72%] max-w-[26rem] drop-shadow-2xl transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-4 group-hover:rotate-[-3deg] md:right-[-10%] lg:bottom-20"
        />
      </Link>

      {/* White Rock: deep indigo and gold */}
      <Link
        href="/brands/white-rock"
        className="group on-dark relative isolate flex min-h-[40rem] flex-col overflow-hidden rounded-[4px] bg-[#202c56] p-8 text-white sm:p-10 lg:min-h-[40rem]"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_80%_100%,rgb(168_210_230/0.28)_0%,transparent_70%)]" />
        <div aria-hidden="true" className="absolute inset-x-8 top-8 -z-10 h-px bg-gradient-to-r from-transparent via-[#c49a4c]/60 to-transparent sm:inset-x-10" />
        <p className="eyebrow pt-4 text-[#e1c27f]">Refreshing still spring water</p>
        <H className="mt-6">
          <span className="sr-only">White Rock</span>
          <span aria-hidden="true" className="block w-40 rounded-[3px] bg-white px-4 py-3 sm:w-44">
            <Image src="/images/brands/white-rock-logo.png" alt="" width={631} height={410} className="h-auto w-full" />
          </span>
        </H>
        <p className="mt-6 max-w-[16rem] text-lg leading-snug text-white/90 xl:max-w-xs">Drawn from an ancient Triassic aquifer: 250 million years in the making, and available nationally.</p>
        <div className="relative mt-auto flex items-end justify-between gap-4 pt-10">
          <span className="text-sm text-white/85">Official water of the Huddersfield Giants</span>
          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c49a4c] text-[#202c56] transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
        </div>
        <Image
          src="/images/brands/white-rock-500.png"
          alt="A 500ml bottle of White Rock still spring water"
          width={237}
          height={560}
          sizes="(min-width: 768px) 14vw, 36vw"
          className="pointer-events-none absolute bottom-24 right-[8%] -z-10 w-[26%] max-w-[11rem] sm:w-[22%] md:bottom-14 md:w-[24%] xl:bottom-20 xl:right-[10%] xl:w-[34%] rotate-[8deg] drop-shadow-[0_40px_40px_rgb(0_0_0/0.45)] transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-5 group-hover:rotate-[2deg]"
        />
      </Link>
    </div>
  );
}
