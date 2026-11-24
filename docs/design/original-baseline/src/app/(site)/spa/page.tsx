import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, PageHero, Photo, SectionHeading } from "@/components/ui";
import { images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Alpine Spa & Activities",
  description: "Private hourly spa sessions with whirlpool, steam bath, sauna and infrared cabin — free for hotel guests. Skiing, hiking, biking and the Engadin lakes on the doorstep.",
};

const facilities = [
  { t: "Whirlpool", s: "Warm water, cool mountain air." },
  { t: "Steam bath", s: "Gentle heat to loosen ski-tired legs." },
  { t: "Sauna", s: "Classic dry heat in Nordic wood." },
  { t: "Adventure shower", s: "Rain, mist and a bracing cold burst." },
  { t: "Infrared cabin", s: "Deep, even warmth — easy on the body." },
];

const activities = [
  { season: "Winter", items: ["Skiing on Corviglia, Corvatsch & Diavolezza", "Hotel ski pass CHF 47/day from the 2nd night", "Cross-country on the Engadin trails", "Walks on the frozen lake"], img: images.winter },
  { season: "Summer", items: ["Hiking from the doorstep towards Maloja", "E-bikes & bicycles from the hotel", "Sailing and kitesurfing on the lakes", "Museums with package vouchers"], img: images.lakeSummer },
];

export default function SpaPage() {
  return (
    <>
      <PageHero
        eyebrow="Alpine Spa · Renovated 2019"
        title={<>Heat, steam <span className="foil">&amp; silence</span></>}
        lead="Book the spa by the hour — never more than eight guests — and let the mountain leave your shoulders."
        image={images.spaSauna}
        engraving="pine"
      />

      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-start gap-16 px-6 md:px-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow text-gold-deep">How it works</span>
            <h2 className="display mt-6 text-[clamp(2rem,4vw,3.2rem)]">Private by design</h2>
            <Ornament className="mt-7" />
            <p className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
              Our spa was completely renovated in 2019 as part of a CHF 3 million investment. Sessions are reserved at reception
              on the hour, for one hour, with a maximum of eight guests — so it always feels like yours.
            </p>
            <div className="cloth mt-10 p-8 text-cream">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  ["15–21h", "Daily"],
                  ["60 min", "Per slot"],
                  ["Free", "Hotel guests"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="display foil text-2xl">{n}</p>
                    <p className="eyebrow mt-2 text-[0.55rem] text-cream/60">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10">
              <Button href="/contact?type=spa" variant="dark">Reserve a spa slot</Button>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal delay={100} className="grid grid-cols-2 gap-4">
              <Photo src={images.spaModern} alt="The sauna" className="col-span-2 aspect-[16/9]" />
              <Photo src={images.spaSteam} alt="Sauna stones" className="aspect-square" />
              <Photo src={images.spaSauna} alt="Wood interior" className="aspect-square" />
            </Reveal>
            <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
              {facilities.map((f, i) => (
                <Reveal as="li" key={f.t} delay={i * 60} className="flex items-baseline justify-between gap-6 py-6">
                  <span className="flex items-baseline gap-6">
                    <span className="display foil text-xl">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-xl tracking-[0.1em]">{f.t}</span>
                  </span>
                  <span className="editorial text-right text-lg text-ink/60">{f.s}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="activities" className="cloth relative scroll-mt-20 overflow-hidden py-28 text-cream md:py-36">
        <Engraving name="ibex" className="absolute -left-10 top-20 h-[520px] w-[360px] opacity-[0.08]" />
        <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading
            tone="light"
            eyebrow="Activities & Leisure"
            title="The Engadin at your door"
            lead="Two seasons, one extraordinary valley — and the station five minutes away."
          />
          <div className="mt-20 grid gap-10 md:grid-cols-2">
            {activities.map((a, i) => (
              <Reveal key={a.season} delay={i * 120}>
                <article className="border border-gold/30 p-3">
                  <Photo src={a.img} alt={a.season} className="aspect-[16/10]" />
                  <div className="p-8 md:p-10">
                    <h3 className="display foil text-4xl">{a.season}</h3>
                    <ul className="mt-6 space-y-4">
                      {a.items.map((it) => (
                        <li key={it} className="flex gap-4">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-light" />
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
    </>
  );
}
