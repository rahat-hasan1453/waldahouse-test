"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useT } from "@/lib/i18n/provider";
import type { Msg } from "@/lib/i18n/msg";
import { brands, type BrandId } from "@/lib/site";

export type { BrandId };

/* One emblem family (ref 8): the same line weights and scale, told apart by the frame. */
const line = { fill: "none", stroke: "currentColor", vectorEffect: "non-scaling-stroke" } as const;

function WaldhausGlyph() {
  return (
    <>
      <rect x="2" y="2" width="60" height="60" {...line} strokeWidth="0.8" />
      <rect x="5.5" y="5.5" width="53" height="53" {...line} strokeWidth="0.5" strokeDasharray="0.8 2.4" />
      <path d="M14 20 L22 44 L32 24 L42 44 L50 20" {...line} strokeWidth="1.6" strokeLinejoin="miter" />
      <path d="M12 50 Q22 47 32 50 T52 50" {...line} strokeWidth="0.9" />
      <circle cx="32" cy="14" r="1.4" fill="currentColor" />
    </>
  );
}

function DevilsGlyph() {
  return (
    <>
      {/* the roundel; at the top the ring breaks into two tiny horns (the second-look detail) */}
      <path d="M22.3 6.9A27 27 0 1 0 41.7 6.9" {...line} strokeWidth="0.9" />
      <path d="M26.6 5.6A27 27 0 0 1 37.4 5.6" {...line} strokeWidth="0.9" />
      <path d="M22.3 6.9Q19.6 4.3 19.8 0.9Q22.4 3.3 26.6 5.6M41.7 6.9Q44.4 4.3 44.2 0.9Q41.6 3.3 37.4 5.6" {...line} strokeWidth="0.9" strokeLinejoin="round" />
      <circle cx="32" cy="33" r="23.5" {...line} strokeWidth="0.6" strokeDasharray="0.1 2.6" strokeLinecap="round" />
      {/* the grape cluster with its leaf and tendril (owner's artwork, 32×32), centred in the ring */}
      <path d={GRAPES} fill="currentColor" transform="translate(32 33.5) scale(1.15) translate(-15.5 -16)" />
    </>
  );
}
const GRAPES =
  "M26 14c0-2.2-1.8-4-4-4-1.2 0-2.2.5-3 1.3-.5-.6-1.3-1-2.1-1.2 0-.3-.1-.5-.2-.8.5.1 1 .2 1.6.2.7 0 1.4-.1 2-.4 2-.8 3.5-2.7 3.6-4.9 0-.3-.1-.6-.3-.8-1.6-1.5-3.9-2-5.9-1.2-1.4.5-2.5 1.6-3.1 2.9C13 3.5 10.5 2.4 7.1 2c-.5-.1-1 .3-1.1.9-.1.5.3 1 .9 1.1 4.7.5 7.3 2.6 8 6.3-.8.2-1.4.7-1.9 1.2-.7-.9-1.8-1.4-3.1-1.4-2.2 0-4 1.8-4 4 0 2.1 1.6 3.7 3.6 3.9-.4.6-.7 1.4-.7 2.2 0 2.1 1.6 3.7 3.6 3.9-.4.6-.6 1.3-.6 2 0 2.2 1.8 4 4 4s4-1.8 4-4c0-.7-.2-1.4-.6-2 2-.2 3.6-1.9 3.6-3.9 0-.8-.2-1.6-.7-2.2 2.3-.2 3.9-1.9 3.9-4m-7.5-9.8c1.2-.4 2.5-.2 3.5.5-.3 1.2-1.1 2.2-2.3 2.7-1.2.4-2.5.3-3.5-.5.3-1.2 1.1-2.2 2.3-2.7m-2.4 7.9c1 0 1.8.7 2 1.7v.6c-.1 1-1 1.7-2 1.7-1.1 0-2-.9-2-2 0-1.2.9-2 2-2M8 14c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2m2.9 6.1c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2M16 28c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-5.9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2M22 16c-1 0-1.8-.7-2-1.7v-.6c.1-1 1-1.7 2-1.7 1.1 0 2 .9 2 2s-.9 2-2 2";

const CAVE_BERRIES: [number, number][] = [
  [32, 24.5],
  [25.6, 30.5],
  [32, 30.5],
  [38.4, 30.5],
  [28.8, 36.5],
  [35.2, 36.5],
  [32, 42.5],
];
function CaveGlyph() {
  return (
    <>
      <path d="M8 60V31A24 24 0 0 1 56 31V60Z" {...line} strokeWidth="0.8" />
      <path d="M12 56.5V31A20 20 0 0 1 52 31V56.5Z" {...line} strokeWidth="0.5" strokeDasharray="0.8 2.4" />
      <path d="M32 21.3V15.5Q34 13 37.5 13.6M37.5 13.6Q41 14.4 40.4 17.2Q39.6 19.4 37.6 18.3" {...line} strokeWidth="0.8" strokeLinecap="round" />
      {CAVE_BERRIES.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="3.1" {...line} strokeWidth="0.9" />
          <path d={`M${x + 0.4} ${y + 2.3}A2.4 2.4 0 0 0 ${x + 2.4} ${y + 0.4}M${x - 0.8} ${y + 1.6}A1.8 1.8 0 0 0 ${x + 1.6} ${y - 0.8}`} {...line} strokeWidth="0.6" />
        </g>
      ))}
      <path d="M22 50H42" {...line} strokeWidth="0.6" />
    </>
  );
}

function StubliGlyph() {
  const needles = (x: number, y: number, a0: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const a = ((a0 + (i - 2) * 16) * Math.PI) / 180;
      return `M${x} ${y}l${(Math.cos(a) * 11).toFixed(1)} ${(Math.sin(a) * 11).toFixed(1)}`;
    }).join("");
  return (
    <>
      <path d="M8 60V28L32 7L56 28V60Z" {...line} strokeWidth="0.8" strokeLinejoin="miter" />
      <path d="M12 56.5V30L32 12.4L52 30V56.5Z" {...line} strokeWidth="0.5" strokeDasharray="0.8 2.4" />
      <path d="M21 50Q28 43 34 34Q37 30 41 27" {...line} strokeWidth="1.3" strokeLinecap="round" />
      <path d={needles(41, 27, -60) + needles(33, 36, -120) + needles(27, 43, 30)} {...line} strokeWidth="0.7" strokeLinecap="round" />
      <ellipse cx="38.5" cy="39.5" rx="3.2" ry="4.6" transform="rotate(-18 38.5 39.5)" {...line} strokeWidth="0.9" />
      <path d="M35.6 38.3l5.6 -1.6M35.9 41.2l5.4 -1.7" {...line} strokeWidth="0.6" />
    </>
  );
}

const GLYPHS: Record<BrandId, () => ReactNode> = {
  waldhaus: WaldhausGlyph,
  devils: DevilsGlyph,
  cave: CaveGlyph,
  stubli: StubliGlyph,
};

/** The engraved emblem of a house brand (64×64, currentColor). Decorative: aria-hidden. */
export function Emblem({ brand, className = "", highlight = false, style }: { brand: BrandId; className?: string; highlight?: boolean; style?: CSSProperties }) {
  const Glyph = GLYPHS[brand];
  return (
    <svg viewBox="0 0 64 64" aria-hidden focusable="false" className={className} style={style}>
      <g stroke={highlight ? "url(#wh-foil)" : undefined}>
        <Glyph />
      </g>
    </svg>
  );
}

function split(name: string): [string, string] {
  const i = name.indexOf(" ");
  return i < 0 ? [name, ""] : [name.slice(0, i), name.slice(i + 1)];
}

/**
 * A brand lockup (ref 8): horizontal, stacked or compact around the one emblem.
 * tone="light" is for dark grounds (cream name), tone="dark" for light grounds (ink name).
 */
export function Lockup({
  brand,
  layout = "horizontal",
  descriptor,
  href,
  tone = "light",
  className = "",
}: {
  brand: BrandId;
  layout?: "horizontal" | "stacked" | "compact";
  descriptor?: Msg;
  href?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const t = useT();
  const b = brands[brand];
  const own = t("common", `brands.${brand}Descriptor`);
  const est = b.est ? t("common", "brands.est", { year: b.est }) : "";
  const desc =
    descriptor !== undefined
      ? typeof descriptor === "string"
        ? descriptor
        : t(descriptor.m, descriptor.k, descriptor.vars)
      : brand === "waldhaus" && layout === "horizontal" && est
        ? `${own} · ${est}`
        : own;
  const claret = brand === "cave" && tone === "dark";
  const emblemC = claret ? "text-claret" : tone === "light" ? "text-gold-light" : "text-gold-deep";
  const nameC = tone === "light" ? "text-cream" : "text-ink";
  const descC = claret ? "text-claret" : tone === "light" ? "text-gold-light/90" : "text-gold-deep";
  const label = `${b.name}, ${desc}`;
  const [n1, n2] = split(b.name);
  const initials = b.name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("");

  let inner: ReactNode;
  if (layout === "stacked") {
    inner = (
      <span aria-hidden className="flex flex-col items-center text-center">
        <Emblem brand={brand} className={`h-14 w-14 ${emblemC}`} />
        <span className={`display mt-5 text-2xl ${nameC}`}>
          {n1}
          {n2 && <br />}
          {n2}
        </span>
        <span className="rule-accent mt-4 h-px w-10" />
        <span className={`eyebrow mt-4 text-[0.52rem] ${descC}`}>{desc}</span>
        {brand === "waldhaus" && est && <span className={`caption mt-2 ${descC}`}>{est}</span>}
      </span>
    );
  } else if (layout === "compact") {
    inner = (
      <span aria-hidden className="flex flex-col items-center text-center">
        <span className={`display text-lg ${nameC}`}>{initials}</span>
        <Emblem brand={brand} className={`mt-2 h-10 w-10 ${emblemC}`} />
        <span className={`eyebrow mt-2 text-[0.52rem] ${descC}`}>{desc}</span>
      </span>
    );
  } else {
    inner = (
      <span aria-hidden className="flex items-center gap-3.5">
        <Emblem brand={brand} className={`h-11 w-11 shrink-0 ${emblemC}`} />
        <span className="flex flex-col leading-none">
          <span className={`display text-[1.05rem] ${nameC}`}>{b.name}</span>
          <span className={`eyebrow mt-1.5 text-[0.52rem] ${descC}`}>{desc}</span>
        </span>
      </span>
    );
  }

  if (href) {
    return (
      <Link href={href} aria-label={label} className={`group inline-flex ${className}`}>
        {inner}
      </Link>
    );
  }
  return (
    <span role="img" aria-label={label} className={`inline-flex ${className}`}>
      {inner}
    </span>
  );
}
