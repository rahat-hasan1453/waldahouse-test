import { useId, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { awards, toRoman } from "@/lib/site";
import { mulberry32, smooth, type Pt } from "./engravings/kit";
import { Guilloche, wavePath } from "./guilloche";

/* ——— Lozenge: the shared mark ——— */

export function Lozenge({ size = "sm", fill = "outline", className = "" }: { size?: "xs" | "sm" | "md"; fill?: "outline" | "solid" | "foil"; className?: string }) {
  return <span aria-hidden className={`lozenge lozenge-${size} lozenge-${fill} ${className}`} />;
}

/* ——— Engraved arrow: shaft, open head (±35°), lozenge tail ——— */

export function EngravedArrow({ className = "", direction = "right" }: { className?: string; direction?: "right" | "left" }) {
  return (
    <span aria-hidden className={`arrow ${direction === "left" ? "arrow-back" : ""} ${className}`}>
      <span className="arrow-tail" />
      <span className="arrow-shaft" />
      <svg className="arrow-head" viewBox="0 0 7 10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0.6 0.8L6.4 5L0.6 9.2" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

/* ——— Frame: an overlay of hairlines with corner fleurons (its parent must be relative) ——— */

const EDGES = ["t", "r", "b", "l"] as const;
const CORNERS = ["tl", "tr", "br", "bl"] as const;

export function Frame({
  className = "",
  inset,
  outer = "solid",
  inner = "solid",
  corners = "fleuron",
  draw = "none",
  style,
}: {
  className?: string;
  /** CSS length, e.g. "var(--frame-inset)" or "0.75rem" (default 0) */
  inset?: string;
  /** none: only the inner rule (and corners) are drawn, e.g. a third, innermost rule inside another Frame */
  outer?: "solid" | "none";
  inner?: "solid" | "dotted" | "none";
  corners?: "fleuron" | "tick" | "none";
  /** reveal: when an ancestor Reveal becomes visible · intro: on load · hover: by the nearest link or .group */
  draw?: "none" | "reveal" | "intro" | "hover";
  style?: CSSProperties;
}) {
  return (
    <div aria-hidden className={`frame ${className}`} data-draw={draw === "none" ? undefined : draw} style={inset ? { inset, ...style } : style}>
      {outer === "solid" && EDGES.map((e) => <span key={e} className="frame-edge" data-e={e} />)}
      {inner !== "none" && (
        <div className="frame-inner" data-style={inner}>
          {EDGES.map((e) => (
            <span key={e} className="frame-edge" data-e={e} />
          ))}
        </div>
      )}
      {corners !== "none" &&
        CORNERS.map((c) =>
          corners === "fleuron" ? (
            <svg key={c} className="frame-corner" data-c={c} viewBox="0 0 24 24" focusable="false">
              <use href="#wh-fleuron" />
            </svg>
          ) : (
            <svg key={c} className="frame-corner" data-c={c} data-kind="tick" viewBox="0 0 14 14" focusable="false">
              <path d="M0.5 14V0.5H14" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
          ),
        )}
    </div>
  );
}

/* ——— Leaders: label · · · · · value ——— */

export function Leaders({
  label,
  value,
  as: Tag = "div",
  className = "",
  labelClassName = "",
  valueClassName = "",
  ...rest
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  label: ReactNode;
  value: ReactNode;
  /** "dl": a <div> row of <dt>label · · ·</dt><dd>value</dd>, for use inside a <dl> (the leader sits in the dt) */
  as?: "div" | "li" | "dl";
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}) {
  if (Tag === "dl") {
    return (
      <div className={`leaders ${className}`} {...rest}>
        <dt className="flex flex-1 items-baseline gap-3">
          <span className={labelClassName}>{label}</span>
          <span aria-hidden className="leaders-fill" />
        </dt>
        <dd className={valueClassName}>{value}</dd>
      </div>
    );
  }
  return (
    <Tag className={`leaders ${className}`} {...rest}>
      <span className={labelClassName}>{label}</span>
      <span aria-hidden className="leaders-fill" />
      <span className={valueClassName}>{value}</span>
    </Tag>
  );
}

/* ——— Label plate (ref 3): scooped corners and a double rule; or a cigar band ——— */

/* corner arcs drawn for --notch 10px and --frame-gap 6px (they scale with the corner box) */
const PLATE_CORNER = "M22 6H14.83A16 16 0 0 1 6 14.83V22";
const PLATE_CORNER_DOTS = "M22 12H18.44A22 22 0 0 1 12 18.44V22";

export function LabelPlate({
  children,
  shape = "plate",
  className = "",
  field = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  shape?: "plate" | "band";
  className?: string;
  /** a wave-guilloche field at 6% behind the content */
  field?: boolean;
  as?: ElementType;
}) {
  if (shape === "band") {
    return <span className={`label-band ${className}`}>{children}</span>;
  }
  const off = "calc(var(--notch) + var(--frame-gap) * 2)";
  return (
    <Tag className={`label-plate ${className}`}>
      {field && <Guilloche variant="wave" className="absolute inset-0 h-full w-full text-[var(--accent-ink)] opacity-[0.06]" />}
      <span aria-hidden className="pointer-events-none absolute inset-0">
        <span className="rule-accent absolute" style={{ top: "var(--frame-gap)", left: off, right: off, height: "var(--hairline)" }} />
        <span className="rule-accent absolute" style={{ bottom: "var(--frame-gap)", left: off, right: off, height: "var(--hairline)" }} />
        <span className="rule-accent absolute" style={{ left: "var(--frame-gap)", top: off, bottom: off, width: "var(--hairline)" }} />
        <span className="rule-accent absolute" style={{ right: "var(--frame-gap)", top: off, bottom: off, width: "var(--hairline)" }} />
        <span className="perforation-x absolute" style={{ top: "calc(var(--frame-gap) * 2 - 1px)", left: off, right: off }} />
        <span className="perforation-x absolute" style={{ bottom: "calc(var(--frame-gap) * 2 - 1px)", left: off, right: off }} />
        <span className="perforation-y absolute" style={{ left: "calc(var(--frame-gap) * 2 - 1px)", top: off, bottom: off }} />
        <span className="perforation-y absolute" style={{ right: "calc(var(--frame-gap) * 2 - 1px)", top: off, bottom: off }} />
        {(
          [
            ["top-0 left-0", 0],
            ["top-0 right-0", 90],
            ["bottom-0 right-0", 180],
            ["bottom-0 left-0", 270],
          ] as const
        ).map(([pos, rot]) => (
          <svg key={rot} className={`label-plate-corner ${pos}`} viewBox="0 0 22 22" style={{ rotate: `${rot}deg` }} focusable="false">
            <path d={PLATE_CORNER} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d={PLATE_CORNER_DOTS} fill="none" style={{ stroke: "var(--rule-strong)" }} strokeWidth="1.4" strokeDasharray="0 3.4" strokeLinecap="round" />
          </svg>
        ))}
      </span>
      <div className="relative">{children}</div>
    </Tag>
  );
}

/* ——— Fact badge (ref 3): foil ring, fine ring, true dots, a wave field ——— */

export function FactBadge({
  value,
  unit,
  size = "md",
  accent = "gold",
  className = "",
  style,
}: {
  /** keeps its own classes, e.g. <span className="display text-3xl text-gold-deep">1,000</span> */
  value: ReactNode;
  unit: string;
  size?: "sm" | "md" | "lg";
  accent?: "gold" | "claret";
  className?: string;
  /** e.g. { "--reveal-delay": … } to stamp badges one after another, or a custom --badge-size */
  style?: CSSProperties;
}) {
  const clip = `wh${useId().replace(/[^a-zA-Z0-9]/g, "")}f`;
  const ring = accent === "claret" ? "var(--color-claret)" : "url(#wh-foil)";
  return (
    <div className={`badge badge-${size} stamp-in ${className}`} style={style}>
      <svg aria-hidden focusable="false" viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id={clip}>
            <circle cx="100" cy="100" r="80" />
          </clipPath>
        </defs>
        <circle cx="100" cy="100" r="84" style={{ fill: "var(--surface-raised)" }} />
        <g clipPath={`url(#${clip})`} style={{ color: "var(--accent-ink)" }} opacity="0.1">
          <path d={wavePath(160, 160, 11, 3, 30, 0.23)} transform="translate(20 20)" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </g>
        <circle className="draw-ring" pathLength={1} cx="100" cy="100" r="96" fill="none" style={{ stroke: ring }} strokeWidth="1.4" />
        <circle className="draw-ring" pathLength={1} cx="100" cy="100" r="92" fill="none" style={{ stroke: "var(--accent-ink)" }} strokeWidth="0.6" />
        <circle cx="100" cy="100" r="86" fill="none" style={{ stroke: "var(--accent-ink)" }} strokeWidth="1.5" strokeDasharray="0 5.2" strokeLinecap="round" />
      </svg>
      <div className="relative flex flex-col items-center px-[18%]">
        {value}
        <span className="caption mt-1.5 leading-[1.5]">{unit}</span>
      </div>
    </div>
  );
}

export function FactBadgeGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`badge-group ${className}`}>{children}</div>;
}

/* ——— Colossal type (max one per page) ——— */

export function Colossal({
  text,
  tone = "deboss",
  bleed = "none",
  drift = false,
  className = "",
}: {
  text: string;
  tone?: "deboss" | "foil" | "outline";
  bleed?: "none" | "left" | "right" | "bottom" | "right-bottom";
  drift?: boolean;
  className?: string;
}) {
  const toneClass = tone === "foil" ? "foil" : tone === "outline" ? "colossal-outline" : "deboss";
  const pos = bleed === "none" ? "relative block" : `absolute colossal-bleed-${bleed}`;
  return (
    <span aria-hidden className={`colossal ${toneClass} ${pos} ${drift ? "drift" : ""} ${className}`}>
      {text}
    </span>
  );
}

/* ——— Chapter marker: numeral, hairline, eyebrow ——— */

export function Chapter({ numeral, label, className = "", labelClassName = "" }: { numeral: string; label: ReactNode; className?: string; labelClassName?: string }) {
  return (
    <span className={`inline-flex items-center gap-4 ${className}`}>
      <span className="chapter-numeral">{numeral}</span>
      <span aria-hidden className="rule-accent h-px w-12 shrink-0" />
      <span className={`eyebrow ${labelClassName}`}>{label}</span>
    </span>
  );
}

/* ——— Distinctions: the awards, typeset (never a marquee) ——— */

export function Distinctions({ variant = "band", className = "" }: { variant?: "band" | "roll"; className?: string }) {
  if (variant === "band") {
    return (
      <ul className={`grid grid-cols-2 gap-y-8 md:grid-cols-5 ${className}`}>
        {awards.map((a, i) => (
          <li key={a.title} className="relative flex flex-col items-center px-3 text-center">
            {i > 0 && <Lozenge size="xs" fill="solid" className="absolute left-0 top-1.5 hidden -translate-x-1/2 text-gold/60 md:block" />}
            <span className="display metal text-[0.95rem]">{a.title}</span>
            <span className="editorial mt-2 text-[0.95rem] text-cream-muted">{a.sub}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ol className={`border-t border-[var(--rule)] ${className}`}>
      {awards.map((a, i) => (
        <li key={a.title} className="grid items-baseline gap-x-8 gap-y-2 border-b border-[var(--rule)] py-6 md:grid-cols-[3rem_1fr_1.3fr]">
          <span className="caption">{toRoman(i + 1)}</span>
          {/* the award title keeps its original size (display text-sm) */}
          <span className="display text-sm">{a.title}</span>
          <span className="editorial muted text-lg">{a.sub}</span>
        </li>
      ))}
    </ol>
  );
}

/* ——— Wax seal: a seeded blob, the W debossed into it ——— */

const waxBlob = (() => {
  const rand = mulberry32(1885);
  const pts: Pt[] = [];
  const n = 26;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 44 + (rand() - 0.5) * 4 + (i % 7 === 3 ? 2.5 : 0);
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
  }
  return smooth(pts, true, 1);
})();
const W_MARK = "M33 37L41 61L50 43L59 61L67 37M32 67Q41 64 50 67T68 67";

export function WaxSeal({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 100 100" className={`stamp-on-mount ${className}`}>
      <path d={waxBlob} fill="url(#wh-wax)" />
      <circle cx="50" cy="50" r="32" fill="none" strokeWidth="1.4" style={{ stroke: "var(--wax-lo)" }} transform="translate(-0.7 -0.7)" />
      <circle cx="50" cy="50" r="32" fill="none" strokeWidth="1.4" style={{ stroke: "var(--wax-hi)" }} transform="translate(0.7 0.7)" />
      <g fill="none" strokeWidth="2.4" strokeLinejoin="miter" strokeLinecap="round">
        <path d={W_MARK} style={{ stroke: "var(--wax-lo)" }} transform="translate(-0.8 -0.8)" />
        <path d={W_MARK} style={{ stroke: "var(--wax-hi)" }} transform="translate(0.8 0.8)" />
        <path d={W_MARK} style={{ stroke: "var(--color-wine)" }} />
      </g>
    </svg>
  );
}

/* ——— Rail progress thread (pair with .rail-scope on a common ancestor and .rail on the scroller) ——— */

export function RailThread({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`rail-thread ${className}`} />;
}
