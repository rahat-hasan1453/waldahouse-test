import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, PageHero, Photo, SectionHeading } from "@/components/ui";
import { images, rooms, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: "Single rooms, lake-view doubles and 3.5-room suites on the shore of Lake St. Moritz. Transparent prices from CHF 100.",
};

export default function StayPage() {
  return (
    <>
      <PageHero
        eyebrow="Stay · Rooms & Suites"
        title={<>Every room, <span className="foil">its own character</span></>}
        lead="Around fifty rooms in warm Swiss stone pine — renovated with care, priced transparently, and never quite the same twice."
        image={images.roomView}
        engraving="pine"
      />

      <section className="paper py-28 md:py-36">
        <div className="mx-auto max-w-[1320px] space-y-28 px-6 md:space-y-36 md:px-10">
          {rooms.map((r, i) => (
            <article key={r.slug} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className={`lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                <Link href={`/stay/${r.slug}`} className="relative block">
                  <Photo src={r.image} alt={r.name} className="aspect-[16/11]" />
                  <span className="display foil absolute -top-8 left-6 text-7xl md:text-8xl">0{i + 1}</span>
                </Link>
              </Reveal>
              <Reveal delay={150} className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : ""}`}>
                <span className="eyebrow text-gold-deep">{r.view}</span>
                <h2 className="display mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)]">{r.name}</h2>
                <Ornament className="mt-6" />
                <p className="editorial mt-6 text-[1.3rem] leading-relaxed text-ink/80">{r.description[0]}</p>
                <dl className="mt-8 grid grid-cols-3 border-y border-ink/15">
                  {[
                    ["Size", r.size],
                    ["Guests", r.guests],
                    ["From", `CHF ${r.from}`],
                  ].map(([k, v], j) => (
                    <div key={k} className={`py-5 ${j ? "border-l border-ink/15 pl-5" : ""}`}>
                      <dt className="eyebrow text-[0.55rem] text-ink/50">{k}</dt>
                      <dd className={`mt-2 ${k === "From" ? "display text-xl text-gold-deep" : "editorial text-lg"}`}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href={`/contact?type=room&room=${r.slug}`} variant="dark">Request this room</Button>
                  <Button href={`/stay/${r.slug}`} variant="outline-dark">Details</Button>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      {/* Package */}
      <section id="package" className="cloth relative scroll-mt-20 overflow-hidden py-28 text-cream md:py-36">
        <Engraving name="ibex" className="absolute -right-10 top-10 h-[560px] w-[380px] opacity-[0.1]" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow text-gold-light">The Weekly Package · Saturday to Saturday</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.8rem)]">Seven nights, <br />the Engadin way</h2>
            <Ornament className="mt-7" />
            <p className="editorial mt-8 text-[1.35rem] leading-relaxed text-cream/80">
              A week that looks after itself — breakfast and a five-course dinner every day, evenings out at some of the
              region&rsquo;s finest restaurants, and everything in between arranged for you.
            </p>
            <div className="mt-10 flex items-end gap-4">
              <span className="eyebrow pb-2 text-[0.6rem] text-cream/60">From</span>
              <span className="display foil text-6xl">CHF 1,370</span>
              <span className="editorial pb-2 text-lg text-cream/60">per person / week</span>
            </div>
            <div className="mt-10">
              <Button href="/contact?type=room&room=package">Request the package</Button>
            </div>
          </Reveal>
          <Reveal delay={150} className="border border-gold/30 p-10 md:p-12">
            <ul className="space-y-6">
              {[
                "Breakfast buffet and five-course dinner daily",
                "Fine meals in exquisite restaurants of the region",
                "Hotel shuttle to the valley station",
                "Vouchers for museums and free entry to the indoor pool",
                "Hotel ski pass for CHF 47 per person/day from the 2nd night",
                "Free use of the Alpine Spa",
              ].map((t) => (
                <li key={t} className="flex gap-5">
                  <span className="mt-2.5 h-2 w-2 shrink-0 rotate-45 border border-gold-light" />
                  <span className="editorial text-xl text-cream/90">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-linen scroll-mt-20 py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading eyebrow="Included & on request" title="Thoughtful services" />
          <div className="mt-16 grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 md:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s} delay={i * 60} className="bg-linen px-6 py-10 text-center">
                <span className="display foil text-2xl">{String(i + 1).padStart(2, "0")}</span>
                <p className="editorial mt-3 text-xl">{s}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
