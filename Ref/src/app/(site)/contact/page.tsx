/**
 * ========================================================================
 * RESERVATION / CONTACT PAGE (Decommissioned / Commented Out)
 * We do not need the reservation page right now.
 * The entire page code is commented out below and will be re-enabled or
 * replaced when the new reservation system is integrated.
 * ========================================================================
 */

import { notFound } from "next/navigation";

export default function ContactPage() {
  notFound();
}

/*
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Frame, Leaders } from "@/components/craft";
import { InquiryForm } from "@/components/inquiry-form";
import { MapFrame } from "@/components/map-frame";
import { T } from "@/lib/i18n/provider";
import { Lines } from "@/components/motion/lines";
import { Reveal } from "@/components/reveal";
import { Engraving } from "@/components/ui";
import { geo, hotel, hours, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reservations & Contact",
  description: "Reserve a room, a table, the spa or an event at Hotel Waldhaus am See, Via Dim Lej 6, St. Moritz.",
};

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

// The letter is dated in St. Moritz time, on the server, so it never shifts at hydration (an ISO day; the form words it).
function letterDateToday() {
  return new Intl.DateTimeFormat("en-CA", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Zurich" }).format(new Date());
}

export async function ContactPageOriginal({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const defaults = {
    type: one(sp.type),
    room: one(sp.room),
    arrival: one(sp.arrival),
    departure: one(sp.departure),
    guests: one(sp.guests),
  };
  const letterDate = letterDateToday();

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-44 text-cream">
        <div className="hero-depth-img absolute inset-0">
          <img src={images.houseDusk} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink" />
        <Frame inset="var(--hero-frame-inset)" corners="none" inner="solid" draw="intro" className="hidden lg:block" />
        <div className="hero-depth-copy relative mx-auto max-w-[1320px] px-6 md:px-10">
          <span className="eyebrow intro-eyebrow inline-block text-gold-light">
            <T m="contact" k="hero.eyebrow" />
          </span>
          <h1 className="display mt-6 text-[clamp(2.6rem,7vw,5.5rem)]">
            <Lines mode="intro">
              <T m="contact" k="hero.titleA" />{" "}
              <span className="foil" data-sheen>
                <T m="contact" k="hero.titleFoil" />
              </span>
            </Lines>
          </h1>
          <p className="editorial intro-lead mt-6 max-w-2xl text-2xl text-cream/80">
            <T m="contact" k="hero.lead" />
          </p>
        </div>
      </section>

      <section className="paper relative py-20 md:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-6 md:px-10 lg:grid-cols-12">
          <Reveal data-reserve-hide className="relative bg-linen p-8 shadow-plate md:p-14 lg:col-span-8">
            <InquiryForm defaults={defaults} letterDate={letterDate} />
            <Frame inset="0.75rem" inner="none" corners="tick" draw="reveal" />
          </Reveal>

          <aside className="space-y-8 lg:col-span-4">
            <Reveal delay={100} className="cloth relative overflow-hidden p-10 text-cream">
              <Engraving name="ibex" detail="emblem" className="absolute -right-8 -top-4 h-48 w-36 opacity-20" />
              <span className="eyebrow text-gold-light">
                <T m="contact" k="findUs.eyebrow" />
              </span>
              <p className="display mt-5 text-2xl tracking-[0.1em]">{hotel.fullName}</p>
              <address className="editorial mt-6 not-italic text-xl leading-relaxed text-cream/85">
                {hotel.address}
                <br />
                {hotel.city}
                <br />
                <T m="common" k="hotel.country" />
              </address>
              <div className="mt-4 flex flex-col items-start">
                <a href={hotel.phoneHref} className="display inline-flex min-h-(--hit) items-center text-xl text-gold-light">
                  {hotel.phone}
                </a>
                <a href={`mailto:${hotel.email}`} className="editorial inline-flex min-h-(--hit) items-center text-lg text-cream/80">
                  <span className="link-underline">{hotel.email}</span>
                </a>
              </div>
              <p className="editorial mt-4 text-base text-cream-muted">
                <T m="contact" k="findUs.note" />
              </p>
            </Reveal>

            <Reveal delay={200} variant="sequence" className="border border-rule-ink bg-linen p-10">
              <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
                <T m="contact" k="hours.eyebrow" />
              </span>
              <ul className="mt-6 space-y-4">
                {hours.map((h, i) => (
                  <Leaders
                    as="li"
                    key={h.label}
                    data-seq="lead"
                    style={{ "--i": i } as CSSProperties}
                    label={<T m="common" k={`hours.${h.key}`} />}
                    value={h.key === "restaurant" ? <T m="common" k="hours.restaurantTime" /> : h.time}
                    labelClassName="text-sm text-ink/70"
                    valueClassName="editorial whitespace-nowrap text-lg"
                  />
                ))}
              </ul>
            </Reveal>

            <Reveal delay={300} as="figure" className="map-plate">
              <div className="photo-mount relative">
                <MapFrame
                  src="https://www.openstreetmap.org/export/embed.html?bbox=9.8285%2C46.4880%2C9.8465%2C46.4960&layer=mapnik&marker=46.4921%2C9.8375"
                  className="map-warm block h-72 w-full"
                  loading="lazy"
                />
                <Frame corners="none" inner="solid" draw="reveal" />
              </div>
              <figcaption className="plate-caption mt-3 text-right">
                <span className="caption leading-[1.9]">
                  <span className="whitespace-nowrap">{hotel.address} ·</span> <span className="whitespace-nowrap">{geo.label}</span>
                </span>
              </figcaption>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
*/
