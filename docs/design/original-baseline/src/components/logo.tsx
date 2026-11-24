import Link from "next/link";

export function Monogram({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="2" y="2" width="60" height="60" fill="none" stroke={color} strokeWidth="0.8" />
      <rect x="5.5" y="5.5" width="53" height="53" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="0.8 2.4" />
      {/* Stylised W with mountain peaks + lake line */}
      <path d="M14 20 L22 44 L32 24 L42 44 L50 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <path d="M12 50 Q22 47 32 50 T52 50" fill="none" stroke={color} strokeWidth="0.9" />
      <circle cx="32" cy="14" r="1.4" fill={color} />
    </svg>
  );
}

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3.5" aria-label="Hotel Waldhaus am See — Home">
      <Monogram className={`h-11 w-11 transition-colors duration-500 ${light ? "text-gold-light" : "text-gold-deep"}`} />
      <span className="flex flex-col leading-none">
        <span className={`display text-[1.05rem] tracking-[0.16em] ${light ? "text-cream" : "text-ink"}`}>Waldhaus am See</span>
        <span className={`eyebrow mt-1.5 text-[0.52rem] ${light ? "text-gold-light/90" : "text-gold-deep"}`}>St. Moritz · Est. 1885</span>
      </span>
    </Link>
  );
}
