"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";

const topics = [
  { value: "sales", label: "Sales enquiry (own label or our brands)" },
  { value: "product", label: "A question about our water or bottles" },
  { value: "supplier", label: "Becoming a supplier" },
  { value: "sponsorship", label: "Sponsorship and donations" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Something else" },
];

type Errors = Partial<Record<"name" | "email" | "topic" | "message" | "consent", string>>;

export function ContactForm() {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const topicRef = useRef<HTMLSelectElement>(null);

  // Preselect the topic from links such as /contact?topic=sales
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("topic");
    if (t && topicRef.current && topics.some((x) => x.value === t)) topicRef.current.value = t;
  }, [sent]);

  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Enter your name";
    const email = String(data.get("email") ?? "").trim();
    if (!email) next.email = "Enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter an email address in the correct format, like name@example.com";
    if (!data.get("topic")) next.topic = "Choose what your enquiry is about";
    if (String(data.get("message") ?? "").trim().length < 10) next.message = "Tell us a little more (at least 10 characters)";
    if (!data.get("consent")) next.consent = "Confirm you have read the privacy policy";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSent(true);
  };

  const field = "mt-2 block w-full rounded-[3px] border-0 bg-paper px-4 py-3.5 text-ink ring-1 ring-inset ring-navy/20 transition-shadow placeholder:text-silver-2 focus:outline-none focus:ring-2 focus:ring-spring aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#b42318]";
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-2 text-sm font-medium text-[#b42318]">
        <span className="sr-only">Error: </span>{errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof Errors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="done"
          ref={doneRef}
          tabIndex={-1}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[4px] bg-navy p-8 text-white outline-none sm:p-12"
          role="status"
        >
          <p className="eyebrow text-glacier">Thank you</p>
          <p className="display mt-6 text-d3">Your message is ready to send.</p>
          <p className="mt-6 max-w-lg text-glacier-2">
            This is a design concept, so the form isn&rsquo;t connected and nothing has been sent. On the live site, enquiries would be routed straight to the right team. In the meantime, please call {site.phone}.
          </p>
          <button type="button" onClick={() => setSent(false)} className="link-draw mt-8 font-semibold">Back to the form</button>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-[3px] border-l-4 border-[#b42318] bg-[#fef3f2] p-5 outline-none">
              <p className="font-semibold text-[#7a1a10]">There is a problem</p>
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(errors).map(([k, v]) => (
                  <li key={k}><a href={`#${id}-${k}`} className="text-[#b42318] underline underline-offset-2">{v}</a></li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-name`} className="text-sm font-semibold text-navy">Your name</label>
              <input id={`${id}-name`} name="name" autoComplete="name" className={field} {...a11y("name")} />
              {err("name")}
            </div>
            <div>
              <label htmlFor={`${id}-company`} className="text-sm font-semibold text-navy">Company <span className="font-normal text-slate">(optional)</span></label>
              <input id={`${id}-company`} name="company" autoComplete="organization" className={field} />
            </div>
            <div>
              <label htmlFor={`${id}-email`} className="text-sm font-semibold text-navy">Email address</label>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" className={field} {...a11y("email")} />
              {err("email")}
            </div>
            <div>
              <label htmlFor={`${id}-phone`} className="text-sm font-semibold text-navy">Phone <span className="font-normal text-slate">(optional)</span></label>
              <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className={field} />
            </div>
          </div>

          <div>
            <label htmlFor={`${id}-topic`} className="text-sm font-semibold text-navy">What is it about?</label>
            <select id={`${id}-topic`} name="topic" ref={topicRef} defaultValue="" className={field} {...a11y("topic")}>
              <option value="" disabled>Choose a topic</option>
              {topics.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {err("topic")}
          </div>

          <div>
            <label htmlFor={`${id}-message`} className="text-sm font-semibold text-navy">Your message</label>
            <textarea id={`${id}-message`} name="message" rows={6} className={field} {...a11y("message")} />
            {err("message")}
          </div>

          <div>
            <div className="flex items-start gap-3">
              <input id={`${id}-consent`} name="consent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-navy" {...a11y("consent")} />
              <label htmlFor={`${id}-consent`} className="text-sm leading-relaxed text-slate">
                I understand Shepley Spring will use my details only to respond to this enquiry, as set out in the <Link href="/privacy-policy" className="text-navy underline underline-offset-2">privacy policy</Link>. We never share your information with third parties for advertising.
              </label>
            </div>
            {err("consent")}
          </div>

          <button type="submit" className="group relative isolate inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full bg-navy px-7 py-3 font-semibold text-white">
            <span aria-hidden="true" className="absolute inset-0 -z-10 translate-y-full rounded-full bg-navy-3 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
            Send message <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
