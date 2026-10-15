"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Logo } from "./Logo";
import { nav, site } from "@/lib/site";

/** Routes whose hero is light, so the header starts with dark ink. */
const LIGHT_HERO = ["/sustainability", "/privacy-policy", "/cookies-policy", "/modern-slavery-statement", "/concept", "/news/", "/contact"];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const lastY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const menuId = useId();

  const lightHero = LIGHT_HERO.some((r) => (r.endsWith("/") ? pathname.startsWith(r) : pathname === r));
  const solid = (scrolled || lightHero) && !menu;
  const inkOnLight = (scrolled || lightHero) && !menu;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 320) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when the route changes
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(false);
    setOpen(null);
  }

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menu]);

  const close = useCallback(() => {
    setOpen(null);
    setMenu(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [close]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !menu && !open ? "-100%" : "0%" }}
        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
      >
        {/* Presentation disclaimer, always visible */}
        <div className="on-dark bg-abyss text-[0.72rem] leading-none text-glacier-2">
          <div className="container-x flex h-8 items-center justify-between gap-4">
            <p className="truncate">
              <span className="mr-2 inline-block rounded-[2px] border border-glacier/40 px-1.5 py-[3px] font-semibold uppercase tracking-[0.14em] text-[0.6rem] text-glacier">Concept</span>
              An unofficial redesign proposal. Not the official Shepley Spring website.
            </p>
            <Link href="/concept" className="link-draw hidden shrink-0 text-white sm:inline">About this concept</Link>
          </div>
        </div>

        <div
          className={[
            "transition-[background-color,box-shadow,color,backdrop-filter] duration-500",
            solid ? "bg-paper/85 shadow-[0_1px_0_rgb(10_29_58/0.08)] backdrop-blur-xl" : "bg-transparent",
            inkOnLight ? "text-navy" : "on-dark text-white",
          ].join(" ")}
        >
          <div className="container-x flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
            <Link href="/" aria-label="Shepley Spring home" className="relative z-10 -my-2 block py-2">
              <Logo className="h-8 w-auto lg:h-9" />
            </Link>

            {/* Desktop navigation */}
            <nav ref={navRef} aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.map((group) => {
                  const hasMenu = group.items.length > 0;
                  const expanded = open === group.label;
                  return (
                    <li
                      key={group.label}
                      className="relative"
                      onMouseEnter={() => hasMenu && setOpen(group.label)}
                      onMouseLeave={() => hasMenu && setOpen(null)}
                    >
                      {hasMenu ? (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`${menuId}-${group.label}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpen(expanded ? null : group.label);
                          }}
                          className={[
                            "group flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.94rem] font-medium transition-colors",
                            isActive(group.href) ? "opacity-100" : "opacity-80 hover:opacity-100",
                          ].join(" ")}
                        >
                          {group.label}
                          <svg aria-hidden="true" viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
                            <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          href={group.href}
                          aria-current={isActive(group.href) ? "page" : undefined}
                          className={`block rounded-full px-4 py-2 text-[0.94rem] font-medium transition-opacity ${isActive(group.href) ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                        >
                          {group.label}
                        </Link>
                      )}

                      <AnimatePresence>
                        {hasMenu && expanded && (
                          <motion.div
                            id={`${menuId}-${group.label}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3"
                          >
                            <ul className="overflow-hidden rounded-[6px] bg-paper p-2 text-ink shadow-[0_30px_60px_-20px_rgb(5_13_28/0.35),0_0_0_1px_rgb(10_29_58/0.06)]">
                              {group.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    aria-current={pathname === item.href ? "page" : undefined}
                                    className="group/item flex items-start justify-between gap-4 rounded-[4px] px-4 py-3 transition-colors hover:bg-glacier-3 focus-visible:bg-glacier-3"
                                  >
                                    <span>
                                      <span className="block font-medium text-navy">{item.label}</span>
                                      {item.description && <span className="mt-0.5 block text-sm text-slate">{item.description}</span>}
                                    </span>
                                    <span aria-hidden="true" className="mt-1 -translate-x-1 text-spring opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100">→</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className={[
                  "hidden rounded-full px-5 py-2.5 text-[0.9rem] font-semibold transition-colors duration-300 lg:inline-flex",
                  inkOnLight ? "bg-navy text-white hover:bg-navy-3" : "bg-white text-navy hover:bg-glacier-2",
                ].join(" ")}
              >
                Contact us
              </Link>

              <button
                type="button"
                className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
                aria-expanded={menu}
                aria-controls={`${menuId}-mobile`}
                onClick={() => setMenu((m) => !m)}
              >
                <span className="sr-only">{menu ? "Close menu" : "Open menu"}</span>
                <span aria-hidden="true" className="relative block h-3 w-6">
                  <span className={`absolute left-0 h-[1.5px] w-6 bg-current transition-all duration-500 ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 h-[1.5px] bg-current transition-all duration-500 ${menu ? "top-1.5 w-6 -rotate-45" : "top-3 w-4"}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {menu && (
          <motion.div
            id={`${menuId}-mobile`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="on-dark fixed inset-0 z-40 overflow-y-auto bg-navy text-white lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 2.5rem) 4.5rem)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 2.5rem) 4.5rem)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 2.5rem) 4.5rem)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_80%_0%,#1b4373_0%,transparent_70%)]" />
            <nav aria-label="Mobile" className="container-x relative pb-12 pt-32">
              <ul className="space-y-1">
                {[{ label: "Home", href: "/", items: [] as { href: string; label: string }[] }, ...nav, { label: "Contact", href: "/contact", items: [] }].map((group, i) => (
                  <motion.li
                    key={group.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.05, ease: EASE }}
                    className="border-b border-white/10 py-3"
                  >
                    <Link href={group.href} className="display block text-[2.1rem] leading-tight" aria-current={pathname === group.href ? "page" : undefined}>
                      {group.label === "Company" ? "About" : group.label}
                    </Link>
                    {group.items.length > 1 && (
                      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem] text-glacier-2">
                        {group.items.slice(1).map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} className="inline-block py-1.5">{item.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-10 space-y-2 text-sm text-glacier-2"
              >
                <a href={site.phoneHref} className="block text-lg text-white">{site.phone}</a>
                <Link href="/concept" className="block underline underline-offset-4">About this concept</Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
