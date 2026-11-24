import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type EngravingName = "ibex" | "lake" | "thistle" | "pine" | "grapes";

/** Engraved artwork tinted via CSS luminance mask — gold on dark, green on light. */
export function Engraving({
  name,
  className = "",
  color = "var(--color-gold)",
  style,
}: {
  name: EngravingName;
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  const url = `url(/engravings/${name}.jpg)`;
  return (
    <div
      aria-hidden
      className={`engraving pointer-events-none select-none ${className}`}
      style={{ WebkitMaskImage: url, maskImage: url, backgroundColor: color, ...style }}
    />
  );
}

export function Ornament({ className = "", tone = "gold" }: { className?: string; tone?: "gold" | "ink" }) {
  const c = tone === "gold" ? "#c49a5a" : "#0a1c17";
  return (
    <svg aria-hidden viewBox="0 0 220 14" className={`h-3.5 w-[220px] max-w-full ${className}`}>
      <line x1="0" y1="7" x2="92" y2="7" stroke={c} strokeWidth="0.75" />
      <line x1="128" y1="7" x2="220" y2="7" stroke={c} strokeWidth="0.75" />
      <path d="M110 1 L116 7 L110 13 L104 7 Z" fill="none" stroke={c} strokeWidth="0.9" />
      <circle cx="110" cy="7" r="1.6" fill={c} />
      <circle cx="98" cy="7" r="1" fill={c} />
      <circle cx="122" cy="7" r="1" fill={c} />
    </svg>
  );
}

/** Circular seal with text on a path — echoing spirits labels and wax seals. */
export function Seal({
  top,
  bottom,
  center,
  sub,
  className = "",
  tone = "gold",
  spin = false,
}: {
  top: string;
  bottom: string;
  center: string;
  sub?: string;
  className?: string;
  tone?: "gold" | "ink";
  spin?: boolean;
}) {
  const c = tone === "gold" ? "#d4b079" : "#16423a";
  const id = `seal-${top.replace(/\W/g, "")}-${center.replace(/\W/g, "")}`;
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full ${spin ? "spin-slow" : ""}`} aria-hidden>
        <defs>
          <path id={`${id}-t`} d="M 100,100 m -74,0 a 74,74 0 1,1 148,0" />
          <path id={`${id}-b`} d="M 100,100 m -80,0 a 80,80 0 0,0 160,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke={c} strokeWidth="0.8" />
        <circle cx="100" cy="100" r="91" fill="none" stroke={c} strokeWidth="0.5" strokeDasharray="1 3.2" />
        <circle cx="100" cy="100" r="58" fill="none" stroke={c} strokeWidth="0.6" />
        <text fill={c} style={{ fontFamily: "var(--font-jost)", fontSize: 10.5, letterSpacing: "0.32em" }}>
          <textPath href={`#${id}-t`} startOffset="50%" textAnchor="middle">
            {top.toUpperCase()}
          </textPath>
        </text>
        <text fill={c} style={{ fontFamily: "var(--font-jost)", fontSize: 10.5, letterSpacing: "0.32em" }}>
          <textPath href={`#${id}-b`} startOffset="50%" textAnchor="middle">
            {bottom.toUpperCase()}
          </textPath>
        </text>
        <circle cx="26" cy="100" r="1.8" fill={c} />
        <circle cx="174" cy="100" r="1.8" fill={c} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="display text-[clamp(1.4rem,3.2vw,2.2rem)] leading-none" style={{ color: c }}>
          {center}
        </span>
        {sub && (
          <span className="eyebrow mt-1.5 text-[0.55rem]" style={{ color: c }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "gold",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "gold" | "outline-light" | "outline-dark" | "dark";
  className?: string;
}) {
  const styles = {
    gold: "foil-bg text-ink hover:brightness-110",
    "outline-light": "border border-cream/40 text-cream hover:border-gold-light hover:text-gold-light",
    "outline-dark": "border border-ink/30 text-ink hover:border-gold-deep hover:text-gold-deep",
    dark: "bg-forest text-cream hover:bg-pine",
  }[variant];
  return (
    <Link
      href={href}
      className={`eyebrow inline-flex items-center gap-3 px-7 py-4 text-[0.68rem] transition-all duration-500 ${styles} ${className}`}
    >
      {children}
      <span aria-hidden className="text-base leading-none">→</span>
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "center",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  align?: "center" | "left";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={`${align === "center" ? "mx-auto text-center items-center" : "items-start"} flex max-w-3xl flex-col ${className}`}>
      <span className={`eyebrow ${light ? "text-gold-light" : "text-gold-deep"}`}>{eyebrow}</span>
      <h2 className={`display mt-5 text-[clamp(2rem,4.6vw,3.6rem)] ${light ? "text-cream" : "text-ink"}`}>{title}</h2>
      <Ornament className="mt-6" />
      {lead && (
        <p className={`editorial mt-6 text-[clamp(1.2rem,1.8vw,1.45rem)] leading-relaxed ${light ? "text-cream/80" : "text-ink/75"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** Page hero used for inner pages */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  engraving,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  image: string;
  engraving?: EngravingName;
}) {
  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-ink text-cream">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="animate-slow-zoom absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      {engraving && (
        <Engraving name={engraving} className="absolute -right-10 bottom-0 hidden h-[80%] w-[40%] opacity-25 lg:block" />
      )}
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 md:px-10">
        <span className="eyebrow text-gold-light">{eyebrow}</span>
        <h1 className="display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6rem)]">{title}</h1>
        {lead && <p className="editorial mt-6 max-w-2xl text-[clamp(1.25rem,2vw,1.6rem)] leading-relaxed text-cream/85">{lead}</p>}
      </div>
    </section>
  );
}

export function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`img-zoom overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}
