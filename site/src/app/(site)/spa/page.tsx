import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Colossal, Lozenge } from "@/components/craft";
import { Lines } from "@/components/motion/lines";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, PageHero, Photo, SectionHeading } from "@/components/ui";
import { chapters, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Alpine Spa & Activities",
  description: "Private hourly spa sessions with whirlpool, steam bath, sauna and infrared cabin — free for hotel guests. Skiing, hiking, biking and the Engadin lakes on the doorstep.",
};

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart; .tempo-calm slows it). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

const chapter = chapters.find((c) => c.href === "/spa")?.numeral ?? "IV";

const facilities = [
  { t: "Whirlpool", s: "Warm water, cool mountain air." },
  { t: "Steam bath", s: "Gentle heat to loosen ski-tired legs." },
  { t: "Sauna", s: "Classic dry heat in Nordic wood." },
  { t: "Adventure shower", s: "Rain, mist and a bracing cold burst." },
  { t: "Infrared cabin", s: "Deep, even warmth — easy on the body." },
];

const stats = [
  ["15–21h", "Daily"],
  ["60 min", "Per slot"],
  ["Free", "Hotel guests"],
] as const;

/* alts are the ones these photographs already carry on the home page */
const activities = [
  { season: "Winter", items: ["Skiing on Corviglia, Corvatsch & Diavolezza", "Hotel ski pass CHF 47/day from the 2nd night", "Cross-country on the Engadin trails", "Walks on the frozen lake"], img: images.winter, alt: "Winter in St. Moritz" },
  { season: "Summer", items: ["Hiking from the doorstep towards Maloja", "E-bikes & bicycles from the hotel", "Sailing and kitesurfing on the lakes", "Museums with package vouchers"], img: images.lakeSummer, alt: "Summer on Lake St. Moritz" },
];

export default function SpaPage() {
  return (
    /* the slowest page on the site: every reveal, line and stagger is retuned by .tempo-calm */
    <div className="tempo-calm">
      <PageHero
        chapter={chapter}
        eyebrow="Alpine Spa · Renovated 2019"
        title={
          <>
            Heat, steam{" "}
            <span className="foil" data-sheen>
              &amp; silence
            </span>
          </>
        }
        lead="Book the spa by the hour — never more than eight guests — and let the mountain leave your shoulders."
        image={images.spaSauna}
        engraving="gentian"
      />

      {/* Private by design: an outlined 8, cropped by the page edge, keeps the promise in view */}
      <section className="paper relative overflow-clip py-28 md:py-36">
        <Colossal text="8" tone="outline" bleed="left" className="-left-[0.14em] top-10 md:top-20" />
        <p aria-hidden className="caption absolute left-4 top-24 hidden items-center gap-3 rotate-180 [writing-mode:vertical-rl] md:flex">
          <span className="rule-accent h-8 w-px shrink-0" />
          Never more than eight guests
        </p>

        <div className="relative mx-auto grid max-w-[1320px] items-start gap-16 px-6 md:px-10 lg:grid-cols-12">
          <Reveal variant="sequence" className="lg:col-span-5">
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
              How it works
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2rem,4vw,3.2rem)]">
              <Lines>Private by design</Lines>
            </h2>
            <Ornament variant="short" className="mt-7" />
            <p data-seq="lead" className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
              Our spa was completely renovated in 2019 as part of a CHF 3 million investment. Sessions are reserved at reception
              on the hour, for one hour, with a maximum of eight guests — so it always feels like yours.
            </p>

            {/* the cloth stat box: flat metal figures, perforated like the stubs of a ticket */}
            <div data-seq="lead" style={at(1)} className="cloth mt-10 p-8 text-cream">
              <div className="relative">
                <dl className="grid grid-cols-3 text-center">
                  {stats.map(([n, l]) => (
                    <div key={l} className="flex flex-col-reverse items-center px-1">
                      <dt className="eyebrow mt-2 text-[0.55rem] text-cream-muted">{l}</dt>
                      <dd className="display figure metal text-2xl">{n}</dd>
                    </div>
                  ))}
                </dl>
                <span aria-hidden className="perforation-y absolute inset-y-0 left-1/3 w-[3px] -translate-x-1/2" />
                <span aria-hidden className="perforation-y absolute inset-y-0 left-2/3 w-[3px] -translate-x-1/2" />
              </div>
            </div>

            <div data-seq="actions" className="mt-10">
              <Button href="/contact?type=spa" variant="dark">
                Reserve a spa slot
              </Button>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            {/* the collage: plates reveal one after another; not links, so they never zoom */}
            <Reveal variant="sequence" className="grid grid-cols-2 gap-4">
              <Photo src={images.spaModern} alt="The sauna" plate="I" className="col-span-2 mb-7 aspect-[16/9]" />
              <Photo src={images.spaSteam} alt="Sauna stones" plate="II" delay={200} className="aspect-square" />
              <Photo src={images.spaSauna} alt="Wood interior" delay={400} className="aspect-square" />
            </Reveal>

            <Reveal as="ul" variant="sequence" className="mt-12 divide-y divide-rule-ink border-y border-rule-ink">
              {facilities.map((f, i) => (
                <li key={f.t} data-seq="lead" style={at(i)} className="flex items-baseline justify-between gap-6 py-6">
                  <span className="flex items-baseline gap-6">
                    <span className="display figure text-xl text-gold-ink">{pad(i + 1)}</span>
                    <span className="display text-xl tracking-[0.1em]">{f.t}</span>
                  </span>
                  <span className="editorial text-right text-lg text-ink/60">{f.s}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Activities: two seasons, one valley */}
      <section id="activities" className="cloth gilt-edge relative scroll-mt-20 overflow-clip py-28 text-cream md:py-36">
        <Engraving name="ibex" className="absolute -left-10 top-20 h-[520px] w-[360px] opacity-[0.1]" />
        <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading
            tone="light"
            eyebrow="Activities & Leisure"
            title="The Engadin at your door"
            lead="Two seasons, one extraordinary valley — and the station five minutes away."
          />
          <div className="mt-20 grid gap-10 md:grid-cols-2">
            {activities.map((a, i) => (
              <Reveal key={a.season} variant="sequence" delay={i * 120}>
                <article className="border border-gold/30 p-3">
                  <Photo src={a.img} alt={a.alt} className="aspect-[16/10]" />
                  <div className="p-8 md:p-10">
                    <h3 data-seq="title" className="display metal text-4xl">
                      <Lines>{a.season}</Lines>
                    </h3>
                    <ul className="mt-6 space-y-4">
                      {a.items.map((it, j) => (
                        <li key={it} data-seq="lead" style={at(j)} className="flex gap-4">
                          <Lozenge size="xs" fill="solid" className="mt-2.5 text-gold-light" />
                          <span className="editorial text-xl text-cream/85">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
