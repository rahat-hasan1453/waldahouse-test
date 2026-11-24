"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Leans toward the cursor: the side the mouse is on presses gently away (max ±`max` degrees),
 * and it settles back flat on leave. Mouse only; does nothing under reduced motion.
 */
export function Tilt({ children, className = "", max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const el = useRef<HTMLDivElement>(null);

  function move(e: PointerEvent<HTMLDivElement>) {
    const node = el.current;
    if (e.pointerType !== "mouse" || !node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = node.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    node.style.transform = `perspective(700px) rotateX(${(-py * max * 2).toFixed(2)}deg) rotateY(${(px * max * 2).toFixed(2)}deg)`;
  }

  function leave() {
    if (el.current) el.current.style.transform = "";
  }

  return (
    <div ref={el} onPointerMove={move} onPointerLeave={leave} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
}
