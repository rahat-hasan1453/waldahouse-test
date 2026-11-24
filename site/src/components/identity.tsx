import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
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
      {/* DP ligature: the P shares the D's stem and drops below the line */}
      <path d="M23 22V45M23 22H28.5C36 22 40.5 26.8 40.5 33.5C40.5 40.2 36 45 28.5 45H23" {...line} strokeWidth="1.5" />
      <path d="M31 27V51M31 27H36.5C40.2 27 42.6 29.3 42.6 32.4C42.6 35.5 40.2 37.8 36.5 37.8H31" {...line} strokeWidth="1.1" />
    </>
  );
}

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
  descriptor?: string;
  href?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const b = brands[brand];
  const desc = descriptor ?? (brand === "waldhaus" && layout === "horizontal" && b.est ? `${b.descriptor} · Est. ${b.est}` : b.descriptor);
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
        {brand === "waldhaus" && b.est && <span className={`caption mt-2 ${descC}`}>Est. {b.est}</span>}
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
