import Link from "next/link";
import { awards, hotel, hours, nav } from "@/lib/site";
import { Monogram } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { Engraving, Ornament } from "./ui";

export function Footer() {
  return (
    <footer className="cloth relative overflow-hidden text-cream">
      <Engraving name="lake" className="absolute inset-x-0 top-0 h-64 w-full opacity-[0.08]" style={{ maskSize: "cover", WebkitMaskSize: "cover" }} />

      {/* Awards band */}
      <div className="relative border-b border-gold/20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-8 px-6 py-12 md:grid-cols-5 md:px-10">
          {awards.map((a) => (
            <div key={a.title} className="flex flex-col items-center px-3 text-center">
              <span className="display foil text-[0.95rem] tracking-[0.14em]">{a.title}</span>
              <span className="editorial mt-2 text-[0.95rem] text-cream/60">{a.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-6 py-20 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Monogram className="h-16 w-16 text-gold-light" />
          <p className="display mt-6 text-2xl tracking-[0.14em]">Waldhaus am See</p>
          <p className="editorial mt-3 text-lg text-cream/70">
            The only hotel directly on Lake St. Moritz. Family-run, open every day of the year.
          </p>
          <address className="mt-8 not-italic leading-loose text-cream/80">
            <span className="block">{hotel.address}</span>
            <span className="block">{hotel.city}, {hotel.country}</span>
            <a href={hotel.phoneHref} className="link-underline block text-gold-light">{hotel.phone}</a>
            <a href={`mailto:${hotel.email}`} className="link-underline block text-gold-light">{hotel.email}</a>
          </address>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
          {nav.slice(0, 3).map((g) => (
            <div key={g.label}>
              <p className="eyebrow text-gold-light">{g.label}</p>
              <ul className="mt-5 space-y-2.5">
                {g.children.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="editorial link-underline text-lg text-cream/75 hover:text-cream">
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
        </div>

        <div className="lg:col-span-3">
          <p className="eyebrow text-gold-light">Open 365 days</p>
          <ul className="mt-5 space-y-3">
            {hours.map((h) => (
              <li key={h.label} className="flex items-baseline justify-between gap-4 border-b border-cream/10 pb-2.5">
                <span className="text-sm text-cream/75">{h.label}</span>
                <span className="editorial whitespace-nowrap text-lg text-cream">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="editorial mt-3 text-sm text-cream/50">* Terrace weather dependent</p>
        </div>
      </div>

      <div className="relative border-t border-gold/20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 py-7 text-xs text-cream/50 md:flex-row md:px-10">
          <span>© {new Date().getFullYear()} Hotel Waldhaus am See · Bernasconi family</span>
          <Ornament className="hidden md:block" />
          <div className="flex gap-6">
            <Link href="/heritage" className="hover:text-cream">Facts & History</Link>
            <Link href="/contact" className="hover:text-cream">Contact</Link>
            <Link href="/admin" className="hover:text-cream">Staff</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
