import Link from "next/link";
import type { CSSProperties } from "react";
import { brands, chapters, hotel, hours, type BrandId } from "@/lib/site";
import { Colossal, Distinctions, Leaders } from "./craft";
import { Lockup } from "./identity";
import { NewsletterForm } from "./newsletter-form";
import { Reveal } from "./reveal";
import { Engraving, Ornament } from "./ui";

const FAMILY: BrandId[] = ["waldhaus", "devils", "cave", "stubli"];

/** The colophon: the house family, an index of the five chapters, hours, distinctions. */
export function Footer() {
  return (
    <footer className="cloth gilt-edge relative overflow-clip text-cream">
      <Engraving name="lake" fit="cover" align="bottom" highlight inkOpacity={0.1} highlightOpacity={0.3} drift className="absolute inset-x-0 top-0 h-64 w-full" />

      {/* The house family */}
      <div className="relative border-b border-gold/20">
        <ul className="mx-auto grid max-w-[1440px] grid-cols-1 gap-y-6 px-6 pb-12 pt-16 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
          {FAMILY.map((b, i) => (
            <li key={b} className={`flex justify-center lg:justify-start ${i > 0 ? "lg:border-l lg:border-gold/20 lg:pl-10" : ""}`}>
              <Lockup brand={b} layout="horizontal" href={brands[b].href} />
            </li>
          ))}
        </ul>
      </div>

      {/* Colophon grid */}
      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-6 py-20 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Lockup brand="waldhaus" layout="stacked" className="lg:-ml-2" />
          <p className="editorial mt-8 text-lg text-cream/70">The only hotel directly on Lake St. Moritz. Family-run, open every day of the year.</p>
          <address className="mt-8 not-italic leading-loose text-cream/80">
            <span className="block">{hotel.address}</span>
            <span className="block">
              {hotel.city}, {hotel.country}
            </span>
            <a href={hotel.phoneHref} className="link-underline block w-fit text-gold-light">
              {hotel.phone}
            </a>
            <a href={`mailto:${hotel.email}`} className="link-underline block w-fit text-gold-light">
              {hotel.email}
            </a>
          </address>
        </div>

        <nav aria-label="Index" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
          {chapters.map((g) => (
            <div key={g.label}>
              <p className="flex items-center gap-3">
                <span aria-hidden className="caption">
                  {g.numeral}
                </span>
                <Link href={g.href} className="eyebrow text-gold-light">
                  {g.label}
                </Link>
              </p>
              <ul className="mt-5 space-y-2.5">
                {g.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="editorial link-underline text-lg text-cream/75 transition-colors duration-(--dur-quick) hover:text-cream">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-3">
            <p className="eyebrow text-gold-light">Letters from the lake</p>
            <p className="editorial mt-3 text-lg text-cream/70">Seasonal dinners, rare bottlings and quiet weeks on the lake — a few times a year.</p>
            <div className="mt-4 max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </nav>

        <div className="lg:col-span-3">
          <p className="eyebrow text-gold-light">Open 365 days</p>
          <Reveal as="ul" variant="sequence" className="mt-5 space-y-3">
            {hours.map((h, i) => (
              <Leaders
                key={h.label}
                as="li"
                data-seq="lead"
                label={h.label}
                value={h.time}
                className="pb-1"
                labelClassName="text-sm text-cream/75"
                valueClassName="editorial whitespace-nowrap text-lg text-cream"
                style={{ "--i": i } as CSSProperties}
              />
            ))}
          </Reveal>
          <p className="editorial mt-3 text-sm text-cream-muted">* Terrace weather dependent</p>
        </div>
      </div>

      {/* Distinctions */}
      <div className="relative border-t border-gold/20">
        <Distinctions variant="band" className="mx-auto max-w-[1440px] px-6 py-12 md:px-10" />
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-gold/20" data-reserve-hide>
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 py-7 text-xs text-cream-muted md:flex-row md:px-10">
          <span>© {new Date().getFullYear()} Hotel Waldhaus am See · Bernasconi family</span>
          <Ornament className="hidden md:block" draw={false} />
          <div className="flex items-center gap-6">
            <Link href="/heritage" className="transition-colors duration-(--dur-quick) hover:text-cream">
              Facts & History
            </Link>
            <Link href="/contact" className="transition-colors duration-(--dur-quick) hover:text-cream">
              Contact
            </Link>
            <Link href="/admin" className="caption text-cream-muted transition-colors duration-(--dur-quick) hover:text-cream">
              Staff
            </Link>
          </div>
        </div>
        <div aria-hidden className="relative h-[clamp(3rem,8vw,7.5rem)]">
          <Colossal text="Waldhaus" tone="deboss" bleed="bottom" className="text-[clamp(5rem,17vw,16rem)]" />
        </div>
      </div>
    </footer>
  );
}
