"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLanguage } from "@/lib/i18n/provider";
import { chapters, hotel } from "@/lib/site";
import { Frame } from "./craft";
import { Emblem } from "./identity";
import { Logo } from "./logo";
import { Lines } from "./motion/lines";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
const isShown = (el: HTMLElement) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const [lastPath, setLastPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // close the menu when the route changes (compared during render, not in an effect)
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // over a page hero marked #hero (the home frontispiece) the hero carries the name, so the logo waits
  const [overHero, setOverHero] = useState(pathname === "/");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const hero = document.getElementById("hero");
      const h = headerRef.current?.offsetHeight ?? 80;
      setOverHero(!!hero && hero.getBoundingClientRect().bottom > h + window.innerHeight * 0.35);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // the menu is a modal dialog: lock scroll, make the page inert, move focus in and back out
  useEffect(() => {
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    document.body.style.overflow = open ? "hidden" : "";
    main?.toggleAttribute("inert", open);
    footer?.toggleAttribute("inert", open);
    if (open) {
      wasOpen.current = true;
      menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          return;
        }
        if (e.key !== "Tab") return;
        // Tab cycles within the header bar (it stays above the menu, with the close button) and the menu
        const items = [headerRef.current, menuRef.current]
          .flatMap((root) => (root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : []))
          .filter(isShown);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const inside = !!active && items.includes(active);
        if (e.shiftKey && (!inside || active === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (!inside || active === last)) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  const logoHidden = overHero && !open;

  if (pathname?.startsWith("/admin")) return null;

  // the whisky & wine page is burgundy: its dropdown cards follow it (every other page keeps the forest card)
  const onWinePage = !!pathname?.startsWith("/whisky-wine");

  return (
    <>
      <header ref={headerRef} data-scrolled={scrolled ? "true" : "false"} className="surface-ink intro-header fixed inset-x-0 top-0 z-(--z-header)">
        <div aria-hidden className="header-bg absolute inset-0 bg-ink/92" />
        <div className={`header-bar relative mx-auto flex max-w-[1440px] items-center gap-6 px-6 md:px-10 ${scrolled ? "py-3" : "py-6"}`}>
          {/* while the hero carries the name, the logo folds away entirely, so the chapters sit on the page's left edge */}
          <div
            className={`shrink-0 overflow-hidden transition-[max-width,margin,opacity,visibility] duration-(--dur-base) ease-(--ease-silk) ${
              logoHidden ? "invisible -mr-6 max-w-0 opacity-0" : "visible mr-0 max-w-[20rem] opacity-100"
            }`}
          >
            <Logo />
          </div>

          {/* left-aligned: the first label's text lines up with the page gutter (its link pads 1rem) */}
          <nav className={`hidden items-center gap-1 transition-[margin] duration-(--dur-base) ease-(--ease-silk) xl:flex ${logoHidden ? "-ml-4" : "ml-2"}`} aria-label={t("common", "header.mainNav")}>
            {chapters.map((item) => {
              const active = !!pathname?.startsWith(item.href);
              return (
                <div key={item.label} className="nav-item relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`eyebrow relative block px-4 py-3 text-[0.66rem] transition-colors duration-(--dur-quick) ${
                      active ? "text-gold-light" : "text-cream/85 hover:text-gold-light"
                    }`}
                  >
                    {t("common", item.key)}
                    <span aria-hidden className="nav-mark" data-active={active ? "true" : undefined} />
                  </Link>
                  <div className="menu-card absolute left-1/2 top-full w-64 -translate-x-1/2 pt-2">
                    <div className={`relative p-2 pt-4 ${onWinePage ? "bg-burgundy" : "bg-ink"}`}>
                      <Frame corners="tick" inner="none" />
                      <p aria-hidden className="caption flex items-center gap-3 px-4 pb-2">
                        <span className="chapter-numeral">{item.numeral}</span>
                        <span className="rule-accent h-px w-6" />
                        {t("common", item.key)}
                      </p>
                      {item.children.map((c, j) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`menu-card-item editorial relative block px-4 py-2.5 text-lg text-cream/80 hover:text-gold-light ${onWinePage ? "hover:bg-wine/70" : "hover:bg-pine/60"}`}
                          style={{ "--i": j } as CSSProperties}
                        >
                          {t("common", c.key)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* right-aligned: EN | DE (and, off the home page, the phone and Reserve) on the page's right edge */}
          <div className="ml-auto flex items-center gap-5">
            <div role="group" aria-label={t("common", "header.language")} className="hidden items-center gap-2 text-cream/70 md:flex">
              {(["EN", "DE"] as const).map((l, i) => (
                <span key={l} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="h-3 w-px bg-cream/30" />}
                  <button
                    type="button"
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`eyebrow text-[0.6rem] transition-colors duration-(--dur-quick) ${lang === l ? "text-gold-light" : "hover:text-cream"}`}
                  >
                    {l}
                  </button>
                </span>
              ))}
            </div>
            {/* the home hero carries its own booking ticket, so the bar stays quiet there */}
            {pathname !== "/" && (
              <>
                <a href={hotel.phoneHref} className="eyebrow hidden text-[0.62rem] text-cream/80 transition-colors duration-(--dur-quick) hover:text-gold-light 2xl:block">
                  {hotel.phone}
                </a>
                <Link href="#" className="eyebrow btn btn-foil foil-bg hidden px-6 py-3.5 text-[0.62rem] sm:inline-flex">
                  {t("common", "header.reserve")}
                </Link>
              </>
            )}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={t("common", open ? "header.closeMenu" : "header.openMenu")}
              className="relative z-(--z-toggle) flex h-11 w-11 flex-col items-center justify-center gap-[7px] xl:hidden"
            >
              <span className="burger-line" />
              <span className="burger-line" />
            </button>
          </div>
        </div>
        <span aria-hidden className="header-progress" />
      </header>

      {/* Mobile / tablet menu: a curtain drop */}
      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("common", "header.menu")}
        data-open={open ? "true" : "false"}
        className="site-menu cloth fixed inset-0 z-(--z-overlay) overflow-y-auto xl:hidden"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
          <Emblem brand="waldhaus" className="deboss-svg h-40 w-40" />
          <span className="display deboss mt-8 text-center text-[clamp(3.5rem,16vw,7rem)]">
            Waldhaus
            <br />
            am See
          </span>
        </div>
        <div className="relative mx-auto flex min-h-full max-w-xl flex-col px-8 pb-12 pt-32">
          {chapters.map((item, i) => (
            <div key={item.label} className="pt-5" style={{ "--i": i } as CSSProperties}>
              <div className="flex items-baseline gap-4">
                <span aria-hidden className="caption menu-fade w-8 shrink-0">
                  {item.numeral}
                </span>
                <Link href={item.href} onClick={() => setOpen(false)} className="display text-3xl text-cream">
                  <Lines>{t("common", item.key)}</Lines>
                </Link>
              </div>
              <div className="menu-fade mt-3 flex flex-wrap gap-x-5 gap-y-1 pl-12">
                {item.children.map((c) => (
                  <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="editorial text-lg text-gold-light/85">
                    {t("common", c.key)}
                  </Link>
                ))}
              </div>
              <div aria-hidden className="menu-rule mt-5" />
            </div>
          ))}
          <div className="menu-fade mt-10 flex flex-col gap-4" style={{ "--i": chapters.length } as CSSProperties}>
            <Link href="#" onClick={() => setOpen(false)} className="eyebrow btn btn-foil foil-bg justify-center px-6 py-4 text-center text-[0.68rem]">
              {t("common", "header.reserveStay")}
            </Link>
            <a href={hotel.phoneHref} className="eyebrow py-3 text-center text-[0.68rem] text-cream/80">
              {hotel.phone}
            </a>
            <div role="group" aria-label={t("common", "header.language")} className="flex items-center justify-center gap-3 text-cream/70">
              {(["EN", "DE"] as const).map((l, i) => (
                <span key={l} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="h-3 w-px bg-cream/30" />}
                  <button
                    type="button"
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`eyebrow px-2 py-3 text-[0.68rem] transition-colors duration-(--dur-quick) ${lang === l ? "text-gold-light" : "hover:text-cream"}`}
                  >
                    {l}
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
