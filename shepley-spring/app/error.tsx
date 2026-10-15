"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-mist">
      <div className="container-x flex min-h-[80svh] flex-col justify-end pb-24 pt-44">
        <p className="eyebrow text-spring">Something went wrong</p>
        <h1 className="display text-d1 mt-8 max-w-[16ch] text-navy">Sorry, this page didn&rsquo;t load properly.</h1>
        <p className="lede mt-6 max-w-xl text-slate">Please try again. If the problem continues, call us on 01484 609330.</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center rounded-full bg-navy px-6 font-semibold text-white hover:bg-navy-3">
            Try again
          </button>
          <Link href="/" className="link-draw font-semibold text-navy">Go to the homepage</Link>
        </div>
      </div>
    </section>
  );
}
