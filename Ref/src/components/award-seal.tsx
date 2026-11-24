"use client";

import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { useT } from "@/lib/i18n/provider";

/*
 * Award seals: the 1885 seal's grammar (outer ring, dotted ring, inner ring, arched type, side dots)
 * with an engraved motif in the centre instead of a year. Drawn in pine on paper.
 * The arched labels come from common:awards.<key>SealTop / SealBottom.
 */

export type AwardKey = "guinness" | "best3" | "wineSpectator" | "leadingBars" | "forbes";

/* stroke weights in the motif's 64-unit grid: main lines, secondary lines, fine hatching */
const MAIN = 0.5;
const MID = 0.36;
const FINE = 0.26;

const line = (d: string, w: number) => <path d={d} fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
const solid = (d: string) => <path d={d} fill="currentColor" />;
const lozenge = (x: number, y: number, r: number) => `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;

const MOTIFS: Record<AwardKey, ReactNode> = {
  /* a star above a fluted plinth */
  guinness: (
    <>
      {solid("M32 14.3L33.64 18.24L37.9 18.58L34.65 21.36L35.64 25.52L32 23.29L28.36 25.52L29.35 21.36L26.1 18.58L30.36 18.24Z")}
      {line("M22 29.5H42Q43.6 29.5 43.6 31.1Q43.6 32.7 42 32.7H22Q20.4 32.7 20.4 31.1Q20.4 29.5 22 29.5Z", MAIN)}
      {line("M24.5 32.7V43.6M39.5 32.7V43.6", MAIN)}
      {line("M27.5 34.6V42M30.5 34.6V42M33.5 34.6V42M36.5 34.6V42", FINE)}
      {line("M22.6 43.6H41.4", MAIN)}
      {line("M21 46.4H43", MID)}
    </>
  ),
  /* three lozenges over the house's roofline */
  best3: (
    <>
      {line("M20 42L32 32L44 42", MAIN)}
      {line("M23 40V46H41V40", MID)}
      {line("M30 46V41.5H34V46", FINE)}
      {solid(lozenge(23, 24, 2.4) + lozenge(32, 20.5, 2.4) + lozenge(41, 24, 2.4))}
    </>
  ),
  /* a stemmed glass with ruled wine */
  wineSpectator: (
    <>
      {line("M24.5 17Q24 33 32 34.5Q40 33 39.5 17Z", MAIN)}
      {line("M24.6 25H39.4", MID)}
      {line("M25 28H39M26 31H38", FINE)}
      {line("M32 34.5V45M26.5 46.5Q32 44.5 37.5 46.5", MAIN)}
    </>
  ),
  /* a globe on a stand */
  leadingBars: (
    <>
      <circle cx="32" cy="29" r="11" fill="none" stroke="currentColor" strokeWidth={MAIN} />
      <ellipse cx="32" cy="29" rx="5" ry="11" fill="none" stroke="currentColor" strokeWidth={FINE} />
      {line("M21 29H43M22.5 23.5H41.5M22.5 34.5H41.5", FINE)}
      {line("M32 40V44M26.5 45.5H37.5", MAIN)}
    </>
  ),
  /* a serif F over a lozenge rule */
  forbes: (
    <>
      {line("M28.5 17.5V42.5", 0.8)}
      {line("M25 17.5H40.5V22M28.5 29.8H36.2M36.2 27.4V32.2M25 42.5H32.5", 0.42)}
      {line("M24.5 48H29M35 48H39.5", FINE)}
      {solid(lozenge(32, 48, 1.8))}
    </>
  ),
};

/* arched type: starts at this size and steps down until the label clears the side dots */
const TYPE_SIZE = 12.5;
const TYPE_MIN = 7;
const ARC_MAX = 178;

function fit(el: SVGTextElement | null) {
  if (!el) return;
  let size = TYPE_SIZE;
  el.style.fontSize = `${size}px`;
  while (el.getComputedTextLength() > ARC_MAX && size > TYPE_MIN) {
    size -= 0.25;
    el.style.fontSize = `${size}px`;
  }
}

export function AwardSeal({ award, className = "" }: { award: AwardKey; className?: string }) {
  const t = useT();
  const id = `aw${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const top = t("common", `awards.${award}SealTop`);
  const bottom = t("common", `awards.${award}SealBottom`);
  const topRef = useRef<SVGTextElement>(null);
  const bottomRef = useRef<SVGTextElement>(null);

  // re-fit when the labels change (language switch) and once the webfont has arrived
  useLayoutEffect(() => {
    const run = () => {
      fit(topRef.current);
      fit(bottomRef.current);
    };
    run();
    let live = true;
    document.fonts?.ready.then(() => live && run());
    return () => {
      live = false;
    };
  }, [top, bottom]);

  const type = { fontFamily: "var(--font-jost)", fontSize: TYPE_SIZE, fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase" } as const;

  return (
    <div className={`paper relative aspect-square rounded-full ${className}`} style={{ color: "var(--color-pine)" }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
        <defs>
          <path id={`${id}t`} d="M 100,100 m -74,0 a 74,74 0 1,1 148,0" />
          <path id={`${id}b`} d="M 100,100 m -82,0 a 82,82 0 0,0 164,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="91" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3.2" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="22" cy="100" r="1.8" fill="currentColor" />
        <circle cx="178" cy="100" r="1.8" fill="currentColor" />
        <text ref={topRef} fill="currentColor" style={type}>
          <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">
            {top}
          </textPath>
        </text>
        <text ref={bottomRef} fill="currentColor" style={type}>
          <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">
            {bottom}
          </textPath>
        </text>
        <svg x="28" y="29" width="144" height="144" viewBox="0 0 64 64">
          {MOTIFS[award]}
        </svg>
      </svg>
    </div>
  );
}
