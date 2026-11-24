"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";

/* One IntersectionObserver per options key, shared by every Reveal on the page. */
const observers = new Map<string, IntersectionObserver>();

function observe(el: Element, threshold: number, rootMargin: string) {
  const key = `${threshold}|${rootMargin}`;
  let io = observers.get(key);
  if (!io) {
    io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold, rootMargin },
    );
    observers.set(key, io);
  }
  io.observe(el);
  return io;
}

type RevealProps = Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "style"> & {
  children: ReactNode;
  /** ms, written as --reveal-delay (every child grammar adds to it) */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** fade: the original 28px block rise. sequence: no block motion; children tagged data-seq arrive in order. */
  variant?: "fade" | "sequence";
  threshold?: number;
  style?: CSSProperties;
};

/**
 * Adds .is-visible once, when the block enters the viewport (or at once if it is already in
 * view). Hidden states only exist under html.js, so content is visible without JavaScript.
 */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div", variant = "fade", threshold = 0.12, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.classList.contains("is-visible")) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh - 40 && r.bottom > 0) {
      el.classList.add("is-visible");
      return;
    }
    const io = observe(el, threshold, "0px 0px -40px 0px");
    return () => io.unobserve(el);
  }, [threshold]);

  const vars = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Tag
      ref={ref}
      className={`reveal ${variant === "sequence" ? "reveal-seq" : ""} ${className}`}
      style={vars || style ? { ...vars, ...style } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
