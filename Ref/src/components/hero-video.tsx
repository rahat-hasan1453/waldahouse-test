"use client";

import { useEffect, useRef } from "react";

export type HeroVideoSources = {
  /** VP9 WebM, preferred where supported (smallest at equal quality) */
  webm?: string;
  /** H.264 MP4, the universal fallback */
  mp4: string;
  /** a lighter H.264 MP4 for phones and data-saver connections */
  mobile?: string;
};

/**
 * Full-bleed background film for a hero. The poster (a still from the same clip) paints at
 * once; the file is chosen in the browser (phone → light MP4, else WebM if playable, else MP4),
 * so a phone never downloads the desktop cut. The silent loop plays only while the hero is on
 * screen and the tab is visible, and never under reduced motion (the poster stays).
 */
export function HeroVideo({ sources, poster, className = "" }: { sources: HeroVideoSources; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const small = window.matchMedia("(max-width: 767px)").matches || !!conn?.saveData;
    const src =
      small && sources.mobile
        ? sources.mobile
        : sources.webm && v.canPlayType('video/webm; codecs="vp9"')
          ? sources.webm
          : sources.mp4;
    if (v.getAttribute("src") !== src) v.src = src;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true;
    const apply = () => {
      if (mq.matches || !inView || document.hidden) v.pause();
      else void v.play().catch(() => {});
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      apply();
    });
    io.observe(v);
    apply();
    mq.addEventListener("change", apply);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", apply);
    };
  }, [sources.mobile, sources.mp4, sources.webm]);

  return (
    <video
      ref={ref}
      poster={poster}
      aria-hidden
      muted
      loop
      playsInline
      preload="metadata"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
