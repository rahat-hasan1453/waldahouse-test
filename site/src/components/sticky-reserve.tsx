"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { hotel } from "@/lib/site";

/**
 * Mobile-only reserve bar (below sm). It slides up once every [data-reserve-sentinel] has left
 * the viewport (or the hero has scrolled away), and hides while any [data-reserve-hide] is in
 * view and on /contact. Observers write data attributes, never React state.
 */
export function StickyReserve() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const set = (show: boolean) => {
      el.dataset.show = String(show);
      el.toggleAttribute("inert", !show);
    };
    if (pathname?.startsWith("/contact")) {
      set(false);
      return;
    }
    const sentinels = new Set<Element>();
    const hiders = new Set<Element>();
    const update = () => {
      const past = window.scrollY > window.innerHeight * 0.6;
      set(past && sentinels.size === 0 && hiders.size === 0);
    };
    const watch = (sel: string, bucket: Set<Element>) => {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) bucket.add(e.target);
          else bucket.delete(e.target);
        }
        update();
      });
      document.querySelectorAll(sel).forEach((n) => io.observe(n));
      return io;
    };
    const a = watch("[data-reserve-sentinel]", sentinels);
    const b = watch("[data-reserve-hide]", hiders);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      a.disconnect();
      b.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [pathname]);

  return (
    <div
      ref={bar}
      data-show="false"
      inert
      className="sticky-reserve surface-ink gilt-edge fixed inset-x-0 bottom-0 z-(--z-sticky-bar) grid grid-cols-[1fr_auto] gap-px bg-ink sm:hidden"
    >
      <Link href="/contact?type=room" className="eyebrow btn btn-foil foil-bg justify-center px-5 py-4 text-[0.66rem]">
        Reserve your stay
      </Link>
      <a href={hotel.phoneHref} className="eyebrow btn btn-outline-light justify-center border-0 px-6 py-4 text-[0.66rem]">
        Call
      </a>
    </div>
  );
}
