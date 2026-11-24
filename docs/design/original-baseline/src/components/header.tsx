"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { hotel, nav } from "@/lib/site";
import { Logo } from "./logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "DE">("EN");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled ? "bg-ink/92 py-3 shadow-[0_1px_0_rgba(196,154,90,0.25)] backdrop-blur-md" : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 md:px-10">
          <Logo />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
            {nav.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={`eyebrow block px-4 py-3 text-[0.66rem] transition-colors ${
                      active ? "text-gold-light" : "text-cream/85 hover:text-gold-light"
                    }`}
                  >
                    {item.label}
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-60 -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-400 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="border border-gold/25 bg-ink/97 p-2 backdrop-blur">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="editorial block px-4 py-2.5 text-lg text-cream/80 transition-colors hover:bg-pine/60 hover:text-gold-light"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-2 text-cream/70 md:flex">
              {(["EN", "DE"] as const).map((l, i) => (
                <span key={l} className="flex items-center gap-2">
                  {i > 0 && <span className="h-3 w-px bg-cream/30" />}
                  <button
                    onClick={() => setLang(l)}
                    className={`eyebrow text-[0.6rem] transition-colors ${lang === l ? "text-gold-light" : "hover:text-cream"}`}
                  >
                    {l}
                  </button>
                </span>
              ))}
            </div>
            <a href={hotel.phoneHref} className="eyebrow hidden text-[0.62rem] text-cream/80 hover:text-gold-light 2xl:block">
              {hotel.phone}
            </a>
            <Link
              href="/contact?type=room"
              className="foil-bg eyebrow hidden px-6 py-3.5 text-[0.62rem] text-ink transition hover:brightness-110 sm:block"
            >
              Reserve
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[7px] xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={`h-px w-7 bg-cream transition-all duration-500 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`h-px w-7 bg-cream transition-all duration-500 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <div
        className={`cloth fixed inset-0 z-40 overflow-y-auto transition-all duration-700 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mx-auto flex min-h-full max-w-xl flex-col px-8 pb-12 pt-32">
          {nav.map((item, i) => (
            <div
              key={item.label}
              className="border-b border-gold/20 py-5 transition-all duration-700"
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms", transform: open ? "none" : "translateY(16px)", opacity: open ? 1 : 0 }}
            >
              <Link href={item.href} className="display text-3xl text-cream">
                {item.label}
              </Link>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                {item.children.map((c) => (
                  <Link key={c.href} href={c.href} className="editorial text-lg text-gold-light/85">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-10 flex flex-col gap-4">
            <Link href="/contact?type=room" className="foil-bg eyebrow px-6 py-4 text-center text-[0.68rem] text-ink">
              Reserve your stay
            </Link>
            <a href={hotel.phoneHref} className="eyebrow text-center text-[0.68rem] text-cream/80">
              {hotel.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
