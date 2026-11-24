import Link from "next/link";
import { useId, type CSSProperties, type ReactNode } from "react";
import type { BrandId } from "@/lib/site";
import { Chapter, Colossal, EngravedArrow, Frame } from "./craft";
import { Engraving, type EngravingName } from "./engravings";
import { Emblem } from "./identity";
import { Lines } from "./motion/lines";
import { Reveal } from "./reveal";

export { Engraving };
export type { EngravingName };

/* ——— Ornament: a lozenge between two rules that draw outward ——— */

export function Ornament({
  className = "",
  tone = "gold",
  variant = "full",
  draw = true,
}: {
  className?: string;
  tone?: "gold" | "ink";
  /** full: centred 220×14 · short: 120×14, lozenge first, for left-aligned headings */
  variant?: "full" | "short";
  /** draw inside a revealed ancestor (renders drawn without JS and under reduced motion) */
  draw?: boolean;
}) {
  const color = tone === "gold" ? "var(--color-gold)" : "var(--color-ink)";
  if (variant === "short") {
    return (
      <svg aria-hidden focusable="false" viewBox="0 0 120 14" className={`ornament h-3.5 w-[120px] max-w-full ${className}`} style={{ color }} data-draw={draw ? "" : undefined}>
        <g className="orn-mark">
          <path d="M7 1 L13 7 L7 13 L1 7 Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
          <circle cx="7" cy="7" r="1.6" fill="currentColor" />
        </g>
        <line className="orn-rule" pathLength={1} x1="16" y1="7" x2="112" y2="7" stroke="currentColor" strokeWidth="0.75" />
        <circle className="orn-mark" cx="116" cy="7" r="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 220 14" className={`ornament h-3.5 w-[220px] max-w-full ${className}`} style={{ color }} data-draw={draw ? "" : undefined}>
      <line className="orn-rule" pathLength={1} x1="92" y1="7" x2="0" y2="7" stroke="currentColor" strokeWidth="0.75" />
      <line className="orn-rule" pathLength={1} x1="128" y1="7" x2="220" y2="7" stroke="currentColor" strokeWidth="0.75" />
      <g className="orn-mark">
        <path d="M110 1 L116 7 L110 13 L104 7 Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="110" cy="7" r="1.6" fill="currentColor" />
      </g>
      <circle className="orn-mark" cx="98" cy="7" r="1" fill="currentColor" />
      <circle className="orn-mark" cx="122" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

/* ——— Seal: text on a circle, as on spirits labels. Static: light moves, the seal does not. ——— */

export function Seal({
  top,
  bottom,
  center,
  sub,
  className = "",
  tone = "gold",
  variant = "line",
  emblem,
}: {
  top: string;
  bottom: string;
  center: string;
  sub?: string;
  className?: string;
  tone?: "gold" | "ink";
  /** line: gold (or pine) hairlines · emboss: a blind notary emboss pressed into its ground; the centre stays foil */
  variant?: "line" | "emboss";
  /** replaces the centre text with a brand emblem (sub stays) */
  emblem?: BrandId;
  /** @deprecated ignored: seals no longer spin */
  spin?: boolean;
}) {
  const id = `wh${useId().replace(/[^a-zA-Z0-9]/g, "")}s`;
  const color = tone === "gold" ? "var(--color-gold-seal)" : "var(--color-pine)";
  const emboss = variant === "emboss";
  const rings = (draw: boolean) => (
    <>
      <circle className={draw ? "draw-ring" : undefined} pathLength={draw ? 1 : undefined} cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="91" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3.2" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <text fill="currentColor" style={{ fontFamily: "var(--font-jost)", fontSize: 10.5, letterSpacing: "0.32em" }}>
        <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">
          {top.toUpperCase()}
        </textPath>
      </text>
      <text fill="currentColor" style={{ fontFamily: "var(--font-jost)", fontSize: 10.5, letterSpacing: "0.32em" }}>
        <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">
          {bottom.toUpperCase()}
        </textPath>
      </text>
      <circle cx="26" cy="100" r="1.8" fill="currentColor" />
      <circle cx="174" cy="100" r="1.8" fill="currentColor" />
    </>
  );
  return (
    <div className={`stamp-in relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
        <defs>
          <path id={`${id}t`} d="M 100,100 m -74,0 a 74,74 0 1,1 148,0" />
          <path id={`${id}b`} d="M 100,100 m -80,0 a 80,80 0 0,0 160,0" />
        </defs>
        {emboss ? (
          <>
            <g style={{ color: "var(--deboss-lo)" }} transform="translate(-0.6 -0.6)">
              {rings(false)}
            </g>
            <g style={{ color: "var(--deboss-hi)" }} transform="translate(0.6 0.6)">
              {rings(false)}
            </g>
            <g style={{ color: "var(--surface)" }}>{rings(false)}</g>
          </>
        ) : (
          <g style={{ color }}>{rings(true)}</g>
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {emblem ? (
          <Emblem brand={emblem} className="h-[30%] w-[30%]" style={emboss ? undefined : { color }} />
        ) : (
          <span className={`display text-[clamp(1.4rem,3.2vw,2.2rem)] leading-none ${emboss ? "foil" : ""}`} style={emboss ? undefined : { color }}>
            {center}
          </span>
        )}
        {sub && (
          <span className={`eyebrow mt-1.5 text-[0.55rem] ${emboss ? "deboss" : ""}`} style={emboss ? undefined : { color }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

/* ——— Buttons ——— */

export type ButtonVariant = "gold" | "outline-light" | "outline-dark" | "dark" | "quiet-light" | "quiet-dark";

const BTN: Record<ButtonVariant, string> = {
  gold: "foil-bg btn-foil",
  "outline-light": "btn-outline-light",
  "outline-dark": "btn-outline-dark",
  dark: "btn-dark",
  "quiet-light": "btn-quiet btn-quiet-light",
  "quiet-dark": "btn-quiet btn-quiet-dark",
};

/** The shared button classes, for <button>s in forms (same behaviour as <Button>). */
export const buttonClasses = (variant: ButtonVariant = "gold") => `eyebrow btn ${BTN[variant]}`;

export function Button({
  href,
  children,
  variant = "gold",
  className = "",
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  /** the engraved arrow (default on) */
  arrow?: boolean;
}) {
  const quiet = variant === "quiet-light" || variant === "quiet-dark";
  return (
    <Link href={href} className={`${buttonClasses(variant)} text-[0.68rem] ${className}`}>
      {quiet ? <span className="link-underline pb-0.5">{children}</span> : children}
      {arrow && <EngravedArrow />}
    </Link>
  );
}

/* ——— Section heading: eyebrow wipe → title lines → ornament draw → lead ——— */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "center",
  className = "",
  index,
  ornament = "auto",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  align?: "center" | "left";
  className?: string;
  /** lowercase roman sub-chapter ("ii"), set before the eyebrow */
  index?: string;
  /** auto: full when centred, short when left-aligned */
  ornament?: "auto" | "full" | "short" | "none";
}) {
  const light = tone === "light";
  const orn = ornament === "auto" ? (align === "center" ? "full" : "short") : ornament;
  const eyebrowColor = light ? "text-gold-light" : "text-gold-deep";
  return (
    <Reveal variant="sequence" className={`${align === "center" ? "mx-auto items-center text-center" : "items-start"} flex max-w-3xl flex-col ${className}`}>
      {index ? (
        <span data-seq="eyebrow" className="inline-flex">
          <Chapter numeral={index} label={eyebrow} labelClassName={eyebrowColor} />
        </span>
      ) : (
        <span data-seq="eyebrow" className={`eyebrow ${eyebrowColor}`}>
          {eyebrow}
        </span>
      )}
      <h2 data-seq="title" className={`display mt-5 text-[clamp(2rem,4.6vw,3.6rem)] ${light ? "text-cream" : "text-ink"}`}>
        <Lines>{title}</Lines>
      </h2>
      {orn !== "none" && <Ornament variant={orn} className="mt-6" />}
      {lead && (
        <p data-seq="lead" className={`editorial mt-6 text-[clamp(1.2rem,1.8vw,1.45rem)] leading-relaxed ${light ? "text-cream/80" : "text-ink/75"}`}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}

/* ——— Page hero (inner pages): a framed plate that sinks as the copy lifts ——— */

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  engraving,
  chapter,
  caption,
  plate,
  variant = "plate",
  colossal,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  image: string;
  engraving?: EngravingName;
  /** "I"–"V": the eyebrow becomes a chapter marker */
  chapter?: string;
  /** bottom-right plate caption (plate) or the mounted photo's caption (type) */
  caption?: string;
  /** optional plate numeral: the caption then reads "Pl. {plate} — {caption}" */
  plate?: string;
  /** plate (default): full-bleed photo · type (Heritage): colossal foil type with a mounted photo */
  variant?: "plate" | "type";
  /** type variant: the colossal word or year */
  colossal?: string;
}) {
  const eyebrowEl = chapter ? (
    <span className="intro-eyebrow inline-flex">
      <Chapter numeral={chapter} label={eyebrow} labelClassName="text-gold-light" />
    </span>
  ) : (
    <span className="eyebrow intro-eyebrow inline-block text-gold-light">{eyebrow}</span>
  );
  const copy = (padBottom: string) => (
    <div className={`hero-depth-copy relative mx-auto w-full max-w-7xl px-6 pt-40 md:px-10 ${padBottom}`}>
      {eyebrowEl}
      <h1 className="display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6rem)]">
        <Lines mode="intro">{title}</Lines>
      </h1>
      {lead && <p className="editorial intro-lead mt-6 max-w-2xl text-[clamp(1.25rem,2vw,1.6rem)] leading-relaxed text-cream/85">{lead}</p>}
    </div>
  );
  const frame = <Frame inset="var(--hero-frame-inset)" corners="fleuron" inner="solid" draw="intro" className="hidden lg:block" />;

  if (variant === "type") {
    /*
     * A title page: the copy sits above the colossal, never on it (cream on foil is illegible), so its
     * bottom padding is the colossal's visible height (about 0.6em above the edge) plus a little air.
     * The mounted plate appears from xl, where it clears the h1, its foot overlapping the numerals' tops.
     */
    return (
      <section className="relative flex min-h-[78vh] items-end overflow-clip bg-ink text-cream">
        {colossal && <Colossal text={colossal} tone="foil" bleed="right-bottom" drift />}
        {frame}
        <div className="absolute bottom-[calc(var(--text-colossal)*0.5)] right-[8%] z-[1] hidden w-[min(22vw,320px)] xl:block">
          <Photo src={image} alt="" mount curtain="none" caption={caption ?? false} plate={plate} className="aspect-[4/5]" />
        </div>
        <div className="relative z-[2] w-full">{copy(colossal ? "pb-[calc(var(--text-colossal)*0.75)]" : "pb-20")}</div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-ink text-cream">
      <div className="hero-depth-img absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="animate-slow-zoom absolute inset-0 h-full w-full object-cover opacity-70" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      {engraving && <Engraving name={engraving} highlight inkOpacity={0.22} className="absolute -right-10 bottom-0 hidden h-[80%] w-[40%] lg:block" />}
      {frame}
      {copy("pb-20")}
      {caption && (
        <p className="caption absolute bottom-6 right-6 hidden text-gold-light md:block lg:bottom-[calc(var(--frame-inset)+1rem)] lg:right-[calc(var(--frame-inset)+1.5rem)]">
          {plate ? `Pl. ${plate} — ` : ""}
          {caption}
        </p>
      )}
    </section>
  );
}

/* ——— Photo: plates, captions and curtains ——— */

export function Photo({
  src,
  alt,
  className = "",
  plate,
  caption,
  curtain = "up",
  mount = false,
  delay,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  /** plate numeral ("I", "II" …): renders a <figure> with "Pl. {plate} — {caption ?? alt}" */
  plate?: string;
  /** caption text (defaults to the alt); false for none */
  caption?: string | false;
  /** the curtain lifts (in the section's own colour) when an ancestor Reveal becomes visible */
  curtain?: "up" | "down" | "left" | "right" | "none";
  /** a cream mount with a pressed inner line and a mount shadow */
  mount?: boolean;
  /** extra ms before this photo's curtain (collage order) */
  delay?: number;
  style?: CSSProperties;
}) {
  const figure = plate !== undefined || (caption !== undefined && caption !== false);
  const vars = delay ? ({ "--photo-delay": `${delay}ms`, ...style } as CSSProperties) : style;
  const wrapped = figure || mount;
  const box = (
    <div className={`photo ${wrapped ? "h-full w-full" : className}`} data-curtain={curtain === "none" ? undefined : curtain} style={wrapped ? undefined : vars}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
  const inner = mount ? <div className="photo-mount h-full w-full">{box}</div> : box;
  if (!figure) {
    return mount ? (
      <div className={className} style={vars}>
        {inner}
      </div>
    ) : (
      box
    );
  }
  const text = caption === undefined || caption === false ? alt : caption;
  return (
    <figure className={`relative ${className}`} style={vars}>
      {inner}
      {caption !== false && text && (
        <figcaption className="plate-caption absolute right-0 top-full mt-3 w-full">
          <span className="caption">
            {plate ? `Pl. ${plate} — ` : ""}
            {text}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
