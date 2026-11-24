import Link from "next/link";
import { T } from "@/lib/i18n/provider";
import { chapters, hotel } from "@/lib/site";
import { Colossal } from "./craft";
import { Lockup } from "./identity";
import { Engraving } from "./ui";

/** The colophon: an index of the five chapters, contact details. */
export function Footer() {
  return (
    <footer className="cloth gilt-edge relative overflow-clip text-cream">
      <Engraving name="lake" fit="cover" align="bottom" highlight waterline={false} inkOpacity={0.1} highlightOpacity={0.3} drift className="absolute inset-x-0 top-0 h-64 w-full" />

      {/* Colophon grid: logo & 3-column chapter navigation */}
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 pb-[86px] pt-20 md:px-10 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Lockup brand="waldhaus" layout="stacked" className="lg:-ml-2" />
        </div>

        <div className="lg:col-span-3">
          <nav aria-labelledby="footer-index" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {/* names the landmark (aria-labelledby reads hidden text) without adding a heading */}
            <span id="footer-index" hidden>
              <T m="common" k="footer.index" />
            </span>
            {chapters.map((g) => (
              <div key={g.label}>
                <p className="flex items-center gap-3">
                  <span aria-hidden className="caption">
                    {g.numeral}
                  </span>
                  <Link href={g.href} className="eyebrow text-gold-light">
                    <T m="common" k={g.key} />
                  </Link>
                </p>
                <ul className="mt-5 space-y-2.5">
                  {g.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="editorial link-underline text-lg text-cream/75 transition-colors duration-(--dur-quick) hover:text-cream">
                        <T m="common" k={c.key} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Info & contact row: 3 columns aligned under logo, chapter I and chapter II */}
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 pb-14 md:px-10 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="editorial text-lg text-cream/70">
            <T m="common" k="footer.intro" />
          </p>
        </div>
        <div className="lg:col-span-1">
          <address className="not-italic leading-relaxed text-cream/80">
            <span className="block">{hotel.address}</span>
            <span className="block">
              {hotel.city}, <T m="common" k="hotel.country" />
            </span>
          </address>
        </div>
        <div className="lg:col-span-1">
          <a href={hotel.phoneHref} className="link-underline block w-fit text-cream/80 hover:text-gold-light">
            {hotel.phone}
          </a>
          <a href={`mailto:${hotel.email}`} className="link-underline block w-fit text-cream/80 hover:text-gold-light">
            {hotel.email}
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-gold/20" data-reserve-hide>
        <div className="relative -top-4 mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 py-7 text-xs text-cream-muted md:flex-row md:px-10">
          <span>
            <T m="common" k="footer.copyright" vars={{ year: new Date().getFullYear() }} />
          </span>
          <div className="flex items-center gap-6">
            <Link href="/heritage" className="transition-colors duration-(--dur-quick) hover:text-cream">
              <T m="common" k="footer.facts" />
            </Link>
            <Link href="#" className="transition-colors duration-(--dur-quick) hover:text-cream">
              <T m="common" k="footer.contact" />
            </Link>
            <Link href="/admin" className="caption text-cream-muted transition-colors duration-(--dur-quick) hover:text-cream">
              <T m="common" k="footer.staff" />
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
