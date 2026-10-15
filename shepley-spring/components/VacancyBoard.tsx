"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Vacancy } from "@/lib/content";

const SITES = ["All sites", "Shepley", "Kirkburton", "Harrogate"] as const;

export function VacancyBoard({ vacancies }: { vacancies: Vacancy[] }) {
  const [site, setSite] = useState<(typeof SITES)[number]>("All sites");
  const [dept, setDept] = useState("All departments");
  const departments = useMemo(() => ["All departments", ...Array.from(new Set(vacancies.map((v) => v.department))).sort()], [vacancies]);

  const shown = vacancies.filter(
    (v) => (site === "All sites" || v.sites.includes(site as Vacancy["sites"][number])) && (dept === "All departments" || v.department === dept),
  );

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-navy/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <fieldset>
          <legend className="eyebrow mb-3 text-slate">Location</legend>
          <div className="flex flex-wrap gap-2">
            {SITES.map((s) => (
              <label key={s} className="cursor-pointer">
                <input type="radio" name="site" value={s} checked={site === s} onChange={() => setSite(s)} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-full px-5 text-[0.95rem] font-medium text-navy ring-1 ring-inset ring-navy/20 transition-colors hover:bg-glacier-3 peer-checked:bg-navy peer-checked:text-white peer-checked:ring-navy peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-spring">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="dept" className="eyebrow mb-3 block text-slate">Department</label>
          <select
            id="dept"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="min-h-11 w-full min-w-60 appearance-none rounded-full bg-paper bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 10 6%22><path d=%22M1 1l4 4 4-4%22 fill=%22none%22 stroke=%22%230a1d3a%22 stroke-width=%221.4%22/></svg>')] bg-[length:10px] bg-[right_1.25rem_center] bg-no-repeat px-5 pr-12 text-[0.95rem] font-medium text-navy ring-1 ring-inset ring-navy/20"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-8 text-sm text-slate" role="status" aria-live="polite">
        {shown.length} {shown.length === 1 ? "role" : "roles"}
        {site !== "All sites" ? ` in ${site}` : ""}
        {dept !== "All departments" ? ` · ${dept}` : ""}
      </p>

      <ul className="mt-4">
        <AnimatePresence initial={false}>
          {shown.map((v) => (
            <motion.li
              key={v.slug}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-navy/10"
            >
              <a
                href={v.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-3 py-8 transition-colors md:grid-cols-12 md:items-center md:gap-6"
              >
                <div className="md:col-span-5">
                  <h3 className="display text-[1.75rem] leading-tight text-navy transition-transform duration-500 group-hover:translate-x-1">
                    {v.title}
                    {v.shift && <span className="ml-3 align-middle font-sans text-sm font-medium text-spring">{v.shift}</span>}
                  </h3>
                  <p className="mt-1 text-sm text-slate">{v.department}</p>
                </div>
                <p className="leading-relaxed text-slate md:col-span-5">{v.summary}</p>
                <div className="flex items-center justify-between gap-4 md:col-span-2 md:flex-col md:items-end">
                  <span className="text-sm font-medium text-navy">{v.sites.join(", ")}</span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-spring">
                    Full details <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">↗</span>
                    <span className="sr-only">(opens the vacancy on shepleyspring.co.uk in a new tab)</span>
                  </span>
                </div>
              </a>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {shown.length === 0 && (
        <p className="py-16 text-center text-slate">No roles match those filters right now. Try another location or department.</p>
      )}
    </div>
  );
}
