"use client";

import { useEffect, useRef } from "react";

const fmt = new Intl.NumberFormat("en-US");

/** A token-valued custom property, read in ms ("650ms" → 650). Unresolvable values read as 0. */
function msVar(el: Element, name: string) {
  const v = parseFloat(getComputedStyle(el).getPropertyValue(name));
  return Number.isFinite(v) ? v : 0;
}

/**
 * Counts once to its value. SSR renders the final string; the final value is also reserved
 * invisibly in the same grid cell, so nothing shifts while digits change. Writes textContent
 * directly (no React state per frame). Reduced motion / no JS: the final value.
 *
 * trigger="view" (default): starts when half of the numeral is in view.
 * trigger="reveal": starts when the nearest <Reveal> arrives, so every counter in one block
 * starts (and lands) together. Either way it waits a further --count-delay (a token, e.g.
 * [--count-delay:var(--seq-lead)] to match the sequence grammar) and runs for --dur-count.
 */
export function Counter({
  value,
  from = 0,
  className = "",
  sheen = false,
  trigger = "view",
}: {
  value: string;
  from?: number;
  className?: string;
  sheen?: boolean;
  trigger?: "view" | "reveal";
}) {
  const root = useRef<HTMLSpanElement>(null);
  const live = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = live.current;
    const host = root.current;
    const m = value.match(/^(\D*)([\d,.]+)(.*)$/);
    if (!el || !host || !m) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, num, suffix] = m;
    const target = Number(num.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;
    const show = (v: number) => {
      el.textContent = `${prefix}${fmt.format(Math.round(v))}${suffix}`;
    };
    show(from);

    let raf = 0;
    let timer = 0;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const dur = msVar(el, "--dur-count") || 2400;
      timer = window.setTimeout(() => {
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          show(from + (target - from) * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
          else {
            el.textContent = value;
            host.dataset.landed = "true";
          }
        };
        raf = requestAnimationFrame(tick);
      }, msVar(host, "--count-delay"));
    };

    const scope = trigger === "reveal" ? host.closest(".reveal") : null;
    let stop = () => {};
    if (scope?.classList.contains("is-visible")) {
      start();
    } else if (scope) {
      const mo = new MutationObserver(() => {
        if (!scope.classList.contains("is-visible")) return;
        mo.disconnect();
        start();
      });
      mo.observe(scope, { attributes: true, attributeFilter: ["class"] });
      stop = () => mo.disconnect();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          start();
        },
        { threshold: 0.5 },
      );
      io.observe(host);
      stop = () => io.disconnect();
    }
    return () => {
      stop();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value, from, trigger]);

  return (
    <span ref={root} className={`counter counter-stack ${className}`} data-sheen={sheen ? "" : undefined}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="counter-ghost">
        {value}
      </span>
      <span aria-hidden ref={live}>
        {value}
      </span>
    </span>
  );
}
