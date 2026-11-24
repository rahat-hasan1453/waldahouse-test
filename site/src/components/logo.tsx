import Link from "next/link";
import { Emblem } from "./identity";

/** The Waldhaus emblem (square double rule, W-peaks over the lake line). Kept for existing imports. */
export function Monogram({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return <Emblem brand="waldhaus" className={className} style={color === "currentColor" ? undefined : { color }} />;
}

/**
 * The house logo = the horizontal Waldhaus lockup, with identical classes and sizes.
 * The "St. Moritz · Est. 1885" line sits in a collapsible row (it folds away when the header condenses).
 */
export function Logo({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3.5" aria-label="Hotel Waldhaus am See — Home">
      <Monogram className={`h-11 w-11 transition-colors duration-500 ${light ? "text-gold-light" : "text-gold-deep"}`} />
      <span className="flex flex-col leading-none">
        <span className={`display text-[1.05rem] tracking-[0.16em] ${light ? "text-cream" : "text-ink"}`}>Waldhaus am See</span>
        <span className="logo-sub">
          <span>
            <span className={`eyebrow mt-1.5 block text-[0.52rem] ${light ? "text-gold-light/90" : "text-gold-deep"}`}>St. Moritz · Est. 1885</span>
          </span>
        </span>
      </span>
    </Link>
  );
}
