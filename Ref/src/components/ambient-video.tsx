"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A silent plate of moving pictures: the same .photo box (and curtain) as <Photo>, holding one
 * or more clips that play one after another and loop as a sequence. Clips are stacked; the
 * next one is preloaded and cross-fades in when the current one ends (no black gap).
 * Decorative (aria-hidden, no controls). Plays only while on screen; still under reduced motion.
 */
export function AmbientVideo({
  src,
  className = "",
  curtain = "up",
}: {
  src: string | string[];
  className?: string;
  curtain?: "up" | "down" | "left" | "right" | "none";
}) {
  const clips = Array.isArray(src) ? src : [src];
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const applyRef = useRef<() => void>(() => {});

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const apply = () => {
      refs.current.forEach((v, i) => {
        if (!v) return;
        if (i !== activeRef.current || mq.matches || !inView || document.hidden) v.pause();
        else void v.play().catch(() => {});
      });
    };
    applyRef.current = apply;
    const box = refs.current[0]?.parentElement;
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      apply();
    });
    if (box) io.observe(box);
    mq.addEventListener("change", apply);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  const next = (i: number) => {
    if (clips.length < 2) return;
    const n = (i + 1) % clips.length;
    const v = refs.current[n];
    if (v) v.currentTime = 0;
    activeRef.current = n;
    setActive(n);
    applyRef.current();
  };

  return (
    <div className={`photo ${className}`} data-curtain={curtain === "none" ? undefined : curtain}>
      {clips.map((clip, i) => (
        <video
          key={clip}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={clip}
          aria-hidden
          muted
          playsInline
          loop={clips.length === 1}
          preload={i === active || i === (active + 1) % clips.length ? "auto" : "metadata"}
          onEnded={() => next(i)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-(--dur-base) ease-(--ease-silk)"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
