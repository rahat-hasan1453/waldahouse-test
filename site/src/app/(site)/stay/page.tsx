import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Colossal, Frame, LabelPlate, Lozenge } from "@/components/craft";
import { Lines } from "@/components/motion/lines";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, PageHero, Photo, SectionHeading } from "@/components/ui";
import { chapters, images, rooms, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: "Single rooms, lake-view doubles and 3.5-room suites on the shore of Lake St. Moritz. Transparent prices from CHF 100.",
};

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");
/** Stay is the house's first chapter. */
const chapter = chapters.find((c) => c.href === "/stay")?.numeral ?? "I";

const inclusions = [
  "Breakfast buffet and five-course dinner daily",
  "Fine meals in exquisite restaurants of the region",
  "Hotel shuttle to the valley station",
  "Vouchers for museums and free entry to the indoor pool",
  "Hotel ski pass for CHF 47 per person/day from the 2nd night",
  "Free use of the Alpine Spa",
];

export default function StayPage() {
  return (
    <>
      <PageHero
        chapter={chapter}
        eyebrow="Stay · Rooms & Suites"
        title={
          <>
            Every room,{" "}
            <span className="foil" data-sheen>
              its own character
            </span>
          </>
        }
        lead="Around fifty rooms in warm Swiss stone pine — renovated with care, priced transparently, and never quite the same twice."
        image={images.roomView}
        engraving="pine"
        caption="A lake-view room"
      />

      {/* Rooms: each article is its own view, with one foil numeral */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto max-w-[1320px] space-y-28 px-6 md:space-y-36 md:px-10">
          {rooms.map((r, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={r.slug} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                <Reveal variant="sequence" className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <Link href={`/stay/${r.slug}`} className="relative block">
                    {/* the curtain opens away from the text */}
                    <Photo src={r.image} alt={r.name} curtain={flip ? "right" : "left"} className="aspect-[16/11]" />
                    <Frame inset="0.75rem" corners="fleuron" draw="hover" className="surface-ink" />
                    <span
                      aria-hidden
                      data-seq="lead"
                      className="display foil foil-emboss absolute -top-8 left-6 z-(--z-raised) text-7xl md:text-8xl"
                    >
                      {pad(i + 1)}
                    </span>
                  </Link>
                </Reveal>

                <Reveal variant="sequence" className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
                    {r.view}
                  </span>
                  <h2 data-seq="title" className="display mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)]">
                    <Lines>{r.name}</Lines>
                  </h2>
                  <Ornament variant="short" className="mt-6" />
                  <p data-seq="lead" className="editorial mt-6 text-[1.3rem] leading-relaxed text-ink/80">
                    {r.description[0]}
                  </p>
                  <div data-seq="lead" style={at(1)} className="relative mt-8">
                    <dl className="grid grid-cols-3 border-y border-rule-ink">
                      {[
                        ["Size", r.size],
                        ["Guests", r.guests],
                        ["From", `CHF ${r.from}`],
                      ].map(([k, v], j) => (
                        <div key={k} className={`py-5 ${j ? "pl-5" : ""}`}>
                          <dt className="eyebrow text-[0.55rem] text-ink-muted">{k}</dt>
                          <dd className={`mt-2 ${k === "From" ? "display figure text-xl text-gold-ink" : "editorial text-lg"}`}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    {/* perforated dividers, like the stubs of a ticket */}
                    <span aria-hidden className="perforation-y absolute inset-y-3 left-1/3 w-[3px] -translate-x-1/2" />
                    <span aria-hidden className="perforation-y absolute inset-y-3 left-2/3 w-[3px] -translate-x-1/2" />
                  </div>
                  <div data-seq="actions" className="mt-8 flex flex-wrap gap-4">
                    <Button href={`/contact?type=room&room=${r.slug}`} variant="dark">
                      Request this room
                    </Button>
                    <Button href={`/stay/${r.slug}`} variant="outline-dark">
                      Details
                    </Button>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      {/* Package: VII debossed into the cloth, the price the only foil */}
      <section id="package" className="cloth gilt-edge relative scroll-mt-20 overflow-clip py-28 text-cream md:py-36">
        <Colossal text="VII" tone="deboss" bleed="left" className="top-1/2 -translate-y-1/2" />
        <Engraving name="ibex" drift className="absolute -right-10 top-10 h-[560px] w-[380px] opacity-[0.12]" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
          <Reveal variant="sequence">
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-light">
              The Weekly Package · Saturday to Saturday
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.8rem)]">
              <Lines>
                Seven nights, <br />
                the Engadin way
              </Lines>
            </h2>
            <Ornament variant="short" className="mt-7" />
            <p data-seq="lead" className="editorial mt-8 text-[1.35rem] leading-relaxed text-cream/80">
              A week that looks after itself — breakfast and a five-course dinner every day, evenings out at some of the
              region&rsquo;s finest restaurants, and everything in between arranged for you.
            </p>
            <div data-seq="lead" style={at(1)} className="mt-10 flex flex-wrap items-end gap-x-4 gap-y-2">
              <span className="eyebrow pb-2 text-[0.6rem] text-cream-muted">From</span>
              <span className="display foil foil-emboss text-6xl">CHF 1,370</span>
              <span className="editorial pb-2 text-lg text-cream-muted">per person / week</span>
            </div>
            <div data-seq="actions" className="mt-10">
              <Button href="/contact?type=room&room=package">Request the package</Button>
            </div>
          </Reveal>

          <Reveal variant="sequence">
            <LabelPlate field className="bg-ink/25 p-10 md:p-12">
              <ul className="space-y-6">
                {inclusions.map((t, j) => (
                  <li key={t} data-seq="lead" style={at(j)} className="flex gap-5">
                    <Lozenge size="sm" fill="outline" className="mt-2.5 text-gold-light" />
                    <span className="editorial text-xl text-cream/90">{t}</span>
                  </li>
                ))}
              </ul>
            </LabelPlate>
          </Reveal>
        </div>
      </section>

      {/* Services: quiet, flat-metal numerals */}
      <section id="services" className="bg-linen scroll-mt-20 py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading eyebrow="Included & on request" title="Thoughtful services" />
          <Reveal variant="sequence" className="mt-16 grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 md:grid-cols-4">
            {services.map((s, i) => (
              <div key={s} className="bg-linen px-6 py-10 text-center">
                <div data-seq="lead" style={at(i)}>
                  <span className="display figure metal text-2xl">{pad(i + 1)}</span>
                  <p className="editorial mt-3 text-xl">{s}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
