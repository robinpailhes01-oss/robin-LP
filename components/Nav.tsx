"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Arrow, Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useContact } from "@/components/contact/ContactContext";
import { cta, nav } from "@/lib/content";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { openContact } = useContact();
  const pathname = usePathname();
  const isActive = (href: string) => !href.startsWith("/#") && (pathname === href || pathname.startsWith(href + "/"));

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 16));

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[var(--ease-luma)] ${
          scrolled || menu ? "bg-white/85 backdrop-blur-md shadow-[0_1px_0_0_var(--color-line)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-luma px-6 h-[76px] flex items-center justify-between gap-6">
          <Link href="/" aria-label="Luma, accueil" className="text-[26px]">
            <Logo />
          </Link>

          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-8">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`text-[14px] font-medium transition-colors ${isActive(l.href) ? "text-violet" : "text-navy/80 hover:text-navy"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={openContact} className="hidden sm:inline-flex h-11 px-5 text-[14px]">
              {cta.primary}
              <Arrow />
            </Button>
            <button
              type="button"
              className="md:hidden size-11 -mr-2 inline-flex items-center justify-center rounded-full text-navy"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenu((m) => !m)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                {menu ? (
                  <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M3 7h16M3 15h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-20 bg-white pt-28 px-6 md:hidden flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Navigation mobile" className="flex flex-col">
              {nav.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={l.href} onClick={() => setMenu(false)} className="block py-4 text-[28px] font-bold tracking-[-0.03em] border-b border-line">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <Button
              onClick={() => {
                setMenu(false);
                openContact();
              }}
              className="mt-8 w-full"
            >
              {cta.primary}
              <Arrow />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
