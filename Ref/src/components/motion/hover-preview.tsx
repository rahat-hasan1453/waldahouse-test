"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Hover state for list rows. A row that carries data-preview is marked data-active while the mouse is
 * over it; the row styles that itself (it grows and shows its own image, see PreviewImage). The mark is
 * set from pointer movement only, so the layout shift of a growing row can never flip the hover back
 * and forth. Mouse only: touch and pen never trigger it.
 */
export function HoverPreview({ children, className = "" }: { children: ReactNode; className?: string }) {
  const current = useRef<HTMLElement | null>(null);

  function activate(row: HTMLElement | null) {
    if (current.current === row) return;
    current.current?.removeAttribute("data-active");
    current.current = row;
    row?.setAttribute("data-active", "");
  }

  function move(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    activate((e.target as HTMLElement).closest<HTMLElement>("[data-preview]"));
  }

  return (
    <div className={className} onPointerMove={move} onPointerLeave={() => activate(null)}>
      {children}
    </div>
  );
}

/**
 * The tilted preview square. Render it as the flexible middle child of a row: it sits in the free space
 * between the row's title and description, centred on the row, and moves with the row as it grows, so
 * nothing needs measuring. Shown while the row is data-active. Decorative: aria-hidden.
 */
export function PreviewImage({ src }: { src: string }) {
  return (
    <span aria-hidden className="pointer-events-none relative h-0 min-w-0 flex-1 self-center motion-reduce:hidden">
      <span
        className="preview-mark absolute left-1/2 top-1/2 z-10 -ml-12 -mt-12 block h-24 w-24 rotate-[-6deg] bg-cover bg-center shadow-[0_18px_40px_-12px_rgb(10_28_23/0.45)] ring-1 ring-gold/40"
        style={{ backgroundImage: `url(${src})` }}
      />
    </span>
  );
}
