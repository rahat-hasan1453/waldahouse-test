"use client";

/*
 * A client component on purpose: server-component markup is serialized twice (HTML + RSC
 * payload), and these plates are large. As a client component the SVG is server-rendered once
 * and the payload carries only props; the deterministic (seeded) geometry hydrates identically.
 */
import { useId, type CSSProperties, type ReactNode } from "react";
import { GentianPlate, GENTIAN_H, GENTIAN_W } from "./gentian";
import { GrapesPlate, GRAPES_H, GRAPES_W } from "./grapes";
import { IbexPlate, IBEX_H, IBEX_W } from "./ibex";
import type { PlateProps } from "./kit";
import { LakePlate, LAKE_H, LAKE_W } from "./lake";
import { PinePlate, PINE_H, PINE_W } from "./pine";
import { PomegranatePlate, POMEGRANATE_H, POMEGRANATE_W } from "./pomegranate";
import { ThistlePlate, THISTLE_H, THISTLE_W } from "./thistle";

export type EngravingName = "ibex" | "lake" | "thistle" | "pine" | "grapes" | "gentian" | "pomegranate";

const plates: Record<EngravingName, { w: number; h: number; Plate: (p: PlateProps) => ReactNode }> = {
  lake: { w: LAKE_W, h: LAKE_H, Plate: LakePlate },
  pine: { w: PINE_W, h: PINE_H, Plate: PinePlate },
  ibex: { w: IBEX_W, h: IBEX_H, Plate: IbexPlate },
  thistle: { w: THISTLE_W, h: THISTLE_H, Plate: ThistlePlate },
  grapes: { w: GRAPES_W, h: GRAPES_H, Plate: GrapesPlate },
  gentian: { w: GENTIAN_W, h: GENTIAN_H, Plate: GentianPlate },
  pomegranate: { w: POMEGRANATE_W, h: POMEGRANATE_H, Plate: PomegranatePlate },
};

export type EngravingProps = {
  name: EngravingName;
  className?: string;
  /** Ink colour; becomes the SVG's currentColor. Default: the house gold. */
  color?: string;
  /** Legacy mask* keys are stripped (maskSize "cover" / maskPosition "bottom" still map to fit / align). */
  style?: CSSProperties;
  /** Duo mode (ref 2): selected strokes in foil over the ink. */
  highlight?: boolean;
  /** Base-layer opacity in duo mode (default 1). Use this, not a wrapper opacity class. */
  inkOpacity?: number;
  /** Foil-stroke opacity in duo mode (default 0.9); lower it where the plate is a quiet band. */
  highlightOpacity?: number;
  fit?: "contain" | "cover";
  align?: "center" | "bottom" | "top";
  /** "emblem" drops the cross-hatch levels, for renders of 160px or less. */
  detail?: "full" | "emblem";
  /** Scroll-linked ±3% drift (ornaments of 400px or more only). */
  drift?: boolean;
  /** lake only: draw the waterline highlight (default true) */
  waterline?: boolean;
};

function legacy(style?: CSSProperties) {
  if (!style) return { clean: undefined, fit: undefined, align: undefined } as const;
  const clean: Record<string, unknown> = {};
  let fit: "cover" | "contain" | undefined;
  let align: "center" | "bottom" | "top" | undefined;
  for (const [k, v] of Object.entries(style)) {
    if (/^(Webkit)?[mM]ask/.test(k)) {
      const val = String(v);
      if (/Size$/.test(k) && val.includes("cover")) fit = "cover";
      if (/Position$/.test(k)) align = val.includes("bottom") ? "bottom" : val.includes("top") ? "top" : align;
      continue;
    }
    clean[k] = v;
  }
  return { clean: clean as CSSProperties, fit, align };
}

/**
 * Line engraving (steel-engraving style) drawn as inline SVG in currentColor.
 * The outer box is the same as before (sizing and positioning classes keep working);
 * the artwork scales inside it. Decorative: aria-hidden.
 */
export function Engraving({
  name,
  className = "",
  color = "var(--color-gold)",
  style,
  highlight = false,
  inkOpacity = 1,
  highlightOpacity = 0.9,
  fit,
  align,
  detail = "full",
  drift = false,
  waterline,
}: EngravingProps) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (k: string) => `wh${raw}${k}`;
  const l = legacy(style);
  const f = fit ?? l.fit ?? "contain";
  const a = align ?? l.align ?? "center";
  const par = `xMidY${a === "bottom" ? "Max" : a === "top" ? "Min" : "Mid"} ${f === "cover" ? "slice" : "meet"}`;
  const { w, h, Plate } = plates[name] ?? plates.pine;
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className}`} style={{ color, ...l.clean }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio={par}
        focusable="false"
        className={`block h-full w-full ${drift ? "drift" : ""}`}
      >
        <Plate id={id} highlight={highlight} inkOpacity={inkOpacity} hiOpacity={highlightOpacity} detail={detail} waterline={waterline} />
      </svg>
    </div>
  );
}
