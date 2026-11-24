"use client";

import type { CSSProperties } from "react";
import { useT } from "@/lib/i18n/provider";
import type { Msg } from "@/lib/i18n/msg";
import { EngravedArrow } from "./craft";

/* a shorter arrow for the 44px circle */
const compact = { "--arrow-length": "14px", "--arrow-reach": "6px" } as CSSProperties;

/**
 * Two hairline-circle buttons that step a horizontal rail by one card.
 * Shown from md up; the rail stays swipeable/scrollable everywhere.
 */
export function RailControls({ targetId, label, className = "" }: { targetId: string; label: Msg; className?: string }) {
  const t = useT();
  function step(dir: 1 | -1) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const width = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // a pinned gallery travels with the page's own scroll (1px down = 1px sideways)
    if (el.closest("[data-pinned]")) window.scrollBy({ top: dir * width, behavior: reduce ? "auto" : "smooth" });
    else el.scrollBy({ left: dir * width, behavior: reduce ? "auto" : "smooth" });
  }
  const btn =
    "group inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--rule-strong)] text-[var(--on-surface)] transition-[border-color,color] duration-(--dur-hover) hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]";
  return (
    <div role="group" aria-label={typeof label === "string" ? label : t(label.m, label.k, label.vars)} className={`hidden items-center gap-3 md:flex ${className}`}>
      <button type="button" className={btn} style={compact} aria-label={t("common", "rail.previous")} aria-controls={targetId} onClick={() => step(-1)}>
        <EngravedArrow direction="left" />
      </button>
      <button type="button" className={btn} style={compact} aria-label={t("common", "rail.next")} aria-controls={targetId} onClick={() => step(1)}>
        <EngravedArrow />
      </button>
    </div>
  );
}
