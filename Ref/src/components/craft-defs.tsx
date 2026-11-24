"use client";

/* Client on purpose: rendered once into the HTML, not repeated in the RSC payload (see engravings/index.tsx). */
import { ROSETTE_A, ROSETTE_B, rosettePath } from "./guilloche";

/* Computed once per server process. */
const rosetteA = rosettePath(ROSETTE_A.R, ROSETTE_A.r, ROSETTE_A.d, 2.5);
const rosetteB = rosettePath(ROSETTE_B.R, ROSETTE_B.r, ROSETTE_B.d, 2.5);

/* 115deg (the house light angle) in objectBoundingBox terms */
const foilAxis = { x1: "0.05", y1: "0.29", x2: "0.95", y2: "0.71" } as const;

/**
 * Shared SVG definitions, rendered once at the top of <body>. Hidden without display:none
 * (Firefox drops cross-SVG references to display:none trees). Ids are prefixed wh-.
 * Gradient stops read colour tokens, so there are no hex values here.
 */
export function CraftDefs() {
  return (
    <svg aria-hidden focusable="false" width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
      <defs>
        <linearGradient id="wh-foil" {...foilAxis}>
          <stop offset="0" style={{ stopColor: "var(--color-gold-deep)" }} />
          <stop offset="0.22" style={{ stopColor: "var(--color-gold-light)" }} />
          <stop offset="0.4" style={{ stopColor: "var(--color-gold)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--color-foil-highlight)" }} />
          <stop offset="0.75" style={{ stopColor: "var(--color-copper)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-gold-light)" }} />
        </linearGradient>
        <linearGradient id="wh-foil-light" {...foilAxis}>
          <stop offset="0" style={{ stopColor: "var(--color-foil-shadow)" }} />
          <stop offset="0.28" style={{ stopColor: "var(--color-gold-deep)" }} />
          <stop offset="0.46" style={{ stopColor: "var(--color-gold)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--color-gold-light)" }} />
          <stop offset="0.64" style={{ stopColor: "var(--color-gold)" }} />
          <stop offset="0.82" style={{ stopColor: "var(--color-gold-deep)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-foil-shadow)" }} />
        </linearGradient>
        <radialGradient id="wh-wax" cx="0.5" cy="0.5" r="0.55" fx="0.36" fy="0.32">
          <stop offset="0" style={{ stopColor: "var(--color-claret)" }} />
          <stop offset="0.7" style={{ stopColor: "var(--color-wine)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-burgundy)" }} />
        </radialGradient>
        {/* corner flourish: a tie block where the rules meet, a lozenge and one curl */}
        <symbol id="wh-fleuron" viewBox="0 0 24 24" overflow="visible">
          <g fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
            <path d="M1.5 1.5h5v5h-5z" />
            <path d="M6.5 15V6.5H15" strokeWidth="0.6" />
            <path d="M11.5 8.5l3 3l-3 3l-3-3z" />
            <path d="M14.8 14.8c2.6 2.8 6.6 3.2 7.8 0.6c0.7-1.7-0.9-2.9-2.2-2" />
          </g>
          <circle cx="11.5" cy="11.5" r="0.9" fill="currentColor" />
        </symbol>
        <symbol id="wh-lozenge" viewBox="0 0 10 10">
          <path d="M5 0.5L9.5 5L5 9.5L0.5 5Z" />
        </symbol>
        <symbol id="wh-rosette-a" viewBox="-100 -100 200 200" overflow="visible">
          <path d={rosetteA} />
        </symbol>
        <symbol id="wh-rosette-b" viewBox="-100 -100 200 200" overflow="visible">
          <path d={rosetteB} />
        </symbol>
      </defs>
    </svg>
  );
}
