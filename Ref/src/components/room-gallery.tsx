"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useT } from "@/lib/i18n/provider";

export type GalleryRoom = { slug: string; name: string; short: string; from: number; size: string; image: string };

const pad = (n: number) => String(n).padStart(2, "0");
/* the first card starts on the text column's left edge, like the heading above */
const gutter = "px-6 md:px-10 xl:px-[max(2.5rem,calc((100vw_-_var(--container-wide))/2_+_2.5rem))]";
const MAX_TILT = 24; // degrees, at one viewport-width from centre
const SIDE_SCALE = 0.07;

/**
 * Rooms & Suites as a curved gallery (desktop, fine pointer, motion allowed): the section pins
 * and vertical scroll moves the row sideways; cards tilt in perspective as if set on a curve
 * and turn flat at the centre. The centre (or hovered) card reveals its description. A ring
 * cursor follows the pointer. Elsewhere: a plain swipe row with descriptions always shown.
 */
export function RoomGallery({ rooms, id }: { rooms: GalleryRoom[]; id: string }) {
  const t = useT();
  const [cinematic, setCinematic] = useState(false);
  const [active, setActive] = useState(-1);
  const [hover, setHover] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  // cinematic only where it helps: wide screens, a mouse, motion allowed
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const on = () => setCinematic(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // scroll → sideways travel, per-card tilt, active card, progress thread
  useEffect(() => {
    const w = wrap.current;
    const t = track.current;
    if (!w || !t) return;
    const cards = Array.from(t.children) as HTMLElement[];
    let raf = 0;
    let travel = 0;

    const measure = () => {
      if (!cinematic) {
        w.style.height = "";
        return;
      }
      travel = Math.max(0, t.scrollWidth - window.innerWidth);
      w.style.height = `${window.innerHeight + travel}px`;
    };

    const frame = () => {
      raf = 0;
      const vw = window.innerWidth;
      let p: number;
      if (cinematic) {
        const r = w.getBoundingClientRect();
        const span = r.height - window.innerHeight;
        p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        t.style.transform = `translate3d(${-p * travel}px,0,0)`;
      } else {
        t.style.transform = "";
        const max = t.scrollWidth - t.clientWidth;
        p = max > 0 ? t.scrollLeft / max : 0;
      }
      if (thread.current) thread.current.style.setProperty("--p", String(p));
      let best = -1;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = (r.left + r.width / 2 - vw / 2) / vw; // −0.5 … 0.5 across the screen
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = i;
        }
        const inner = c.firstElementChild as HTMLElement | null;
        if (!inner) return;
        if (cinematic) {
          const k = Math.max(-1, Math.min(1, d * 1.6));
          inner.style.transform = `rotateY(${(-k * MAX_TILT).toFixed(2)}deg) scale(${(1 - Math.abs(k) * SIDE_SCALE).toFixed(3)})`;
        } else inner.style.transform = "";
      });
      setActive(best);
    };
    const tick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const resize = () => {
      measure();
      tick();
    };

    measure();
    frame();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", resize);
    t.addEventListener("scroll", tick, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", resize);
      t.removeEventListener("scroll", tick);
      w.style.height = "";
      t.style.transform = "";
    };
  }, [cinematic]);

  // the ring cursor (desktop only)
  const move = (e: React.PointerEvent) => {
    const r = ring.current;
    if (r) r.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
  };

  const shown = hover >= 0 ? hover : active;

  return (
    <div
      ref={wrap}
      className={`relative ${cinematic ? "mt-10" : "mt-16"}`}
      data-pinned={cinematic ? "" : undefined}
      onPointerMove={cinematic ? move : undefined}
      onPointerEnter={cinematic ? () => ring.current?.setAttribute("data-on", "") : undefined}
      onPointerLeave={cinematic ? () => ring.current?.removeAttribute("data-on") : undefined}
    >
      <div
        className={
          cinematic
            ? "sticky top-0 flex h-[100svh] cursor-none flex-col justify-center overflow-hidden"
            : "relative"
        }
      >
        <div
          id={id}
          ref={track}
          className={
            cinematic
              ? `flex w-max items-center gap-[4vw] will-change-transform ${gutter} !pr-[calc(50vw_-_min(31vw,450px)/2)]`
              : `flex snap-x snap-mandatory scroll-pl-6 gap-6 overflow-x-auto [scrollbar-width:none] md:scroll-pl-10 [&::-webkit-scrollbar]:hidden ${gutter}`
          }
        >
          {rooms.map((r, i) => {
            const open = !cinematic || i === shown;
            return (
              <div
                key={r.slug}
                className={`shrink-0 snap-start ${cinematic ? "w-[min(31vw,450px)] [perspective:1400px]" : "w-[80vw] sm:w-[380px]"}`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(-1)}
              >
                <div className="transition-transform duration-(--dur-quick) ease-(--ease-silk) will-change-transform">
                  <Link
                    href={`/stay/${r.slug}`}
                    className={`group relative block aspect-[4/5] overflow-hidden bg-ink text-cream ${cinematic ? "cursor-none" : ""}`}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(-1)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image}
                      alt={t("common", `rooms.${r.slug}.name`)}
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-cover transition-[scale] duration-(--dur-zoom) ease-(--ease-silk) ${open ? "scale-[1.04]" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/10" />
                    <span aria-hidden className="display pointer-events-none absolute -bottom-[0.12em] right-4 text-[clamp(6rem,9vw,9rem)] leading-none text-cream/[0.07]">
                      {pad(i + 1)}
                    </span>
                    <span className="caption absolute left-6 top-6 text-cream/80">
                      {pad(i + 1)} / {pad(rooms.length)}
                    </span>
                    <div className="absolute inset-x-6 bottom-7">
                      <h3 className="display text-[clamp(1.35rem,1.9vw,1.9rem)] tracking-[0.06em]">{t("common", `rooms.${r.slug}.name`)}</h3>
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-(--dur-base) ease-(--ease-silk) ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="editorial mt-3 text-lg leading-snug text-cream/85">{t("common", `rooms.${r.slug}.short`)}</p>
                          <p className="caption mt-3 text-gold-light">
                            {t("common", "gallery.from", { price: r.from, size: t("common", `rooms.${r.slug}.size`) })}
                          </p>
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className={`mt-4 block h-px bg-gold-light/80 transition-[width] duration-(--dur-base) ease-(--ease-silk) ${open ? "w-20" : "w-10"}`}
                      />
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {/* progress thread */}
        <div ref={thread} aria-hidden className={`mt-10 ${gutter}`} style={{ "--p": 0 } as CSSProperties}>
          <div className="relative h-px bg-[var(--rule)]">
            <div className="absolute inset-y-0 left-0 w-full origin-left bg-gold-deep" style={{ transform: "scaleX(var(--p))" }} />
          </div>
        </div>
      </div>
      {cinematic && (
        <div
          ref={ring}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-50 opacity-0 transition-opacity duration-(--dur-quick) data-[on]:opacity-100"
        >
          <span className="absolute -left-6 -top-6 h-12 w-12 rounded-full border border-cream/80 mix-blend-difference" />
          <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-cream mix-blend-difference" />
        </div>
      )}
    </div>
  );
}
