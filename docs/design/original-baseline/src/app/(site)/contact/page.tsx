import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { Reveal } from "@/components/reveal";
import { Engraving, Ornament } from "@/components/ui";
import { hotel, hours, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reservations & Contact",
  description: "Reserve a room, a table, the spa or an event at Hotel Waldhaus am See, Via Dim Lej 6, St. Moritz.",
};

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const defaults = {
    type: one(sp.type),
    room: one(sp.room),
    arrival: one(sp.arrival),
    departure: one(sp.departure),
    guests: one(sp.guests),
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-44 text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.night} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink" />
        <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
          <span className="eyebrow text-gold-light">Reservations & Contact</span>
          <h1 className="display mt-6 text-[clamp(2.6rem,7vw,5.5rem)]">
            We&rsquo;d love <span className="foil">to host you</span>
          </h1>
          <p className="editorial mt-6 max-w-2xl text-2xl text-cream/80">
            One form for everything — a room, a table, the spa, a celebration or a visit to the whisky shop.
          </p>
        </div>
      </section>

      <section className="paper relative py-20 md:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-6 md:px-10 lg:grid-cols-12">
          <Reveal className="bg-linen p-8 shadow-[0_30px_80px_-40px_rgba(10,28,23,0.4)] md:p-14 lg:col-span-8">
            <InquiryForm defaults={defaults} />
          </Reveal>

          <aside className="space-y-8 lg:col-span-4">
            <Reveal delay={100} className="cloth relative overflow-hidden p-10 text-cream">
              <Engraving name="ibex" className="absolute -right-8 -top-4 h-48 w-36 opacity-15" />
              <span className="eyebrow text-gold-light">Find us</span>
              <p className="display mt-5 text-2xl tracking-[0.1em]">{hotel.fullName}</p>
              <Ornament className="mt-5" />
              <address className="editorial mt-6 not-italic text-xl leading-relaxed text-cream/85">
                {hotel.address}
                <br />
                {hotel.city}
                <br />
                {hotel.country}
              </address>
              <div className="mt-6 space-y-2">
                <a href={hotel.phoneHref} className="display block text-xl text-gold-light">{hotel.phone}</a>
                <a href={`mailto:${hotel.email}`} className="editorial link-underline block text-lg text-cream/80">{hotel.email}</a>
              </div>
              <p className="editorial mt-6 text-base text-cream/60">
                5 minutes on foot from St. Moritz station — or let us collect you with our free shuttle.
              </p>
            </Reveal>

            <Reveal delay={200} className="border border-ink/15 bg-linen p-10">
              <span className="eyebrow text-gold-deep">Open 365 days</span>
              <ul className="mt-6 space-y-3">
                {hours.map((h) => (
                  <li key={h.label} className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3">
                    <span className="text-sm text-ink/70">{h.label}</span>
                    <span className="editorial whitespace-nowrap text-lg">{h.time}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={300} className="overflow-hidden border border-ink/15">
              <iframe
                title="Map — Hotel Waldhaus am See"
                src="https://www.openstreetmap.org/export/embed.html?bbox=9.8285%2C46.4880%2C9.8465%2C46.4960&layer=mapnik&marker=46.4921%2C9.8375"
                className="h-72 w-full grayscale-[0.6] sepia-[0.25]"
                loading="lazy"
              />
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
