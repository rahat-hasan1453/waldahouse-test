import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, PageHero, Photo, Seal } from "@/components/ui";
import { awards, figures, hotel, images, timeline } from "@/lib/site";

export const metadata: Metadata = {
  title: "Facts & History",
  description: "Since 1885 on Lake St. Moritz. The Bernasconi family story, our investments and the facts behind the Waldhaus.",
};

export default function HeritagePage() {
  return (
    <>
      <PageHero
        eyebrow="Heritage · Facts & History"
        title={<>An institution <span className="foil">since 1885</span></>}
        lead="One lake, one house, one family — and a tradition that has quietly grown for well over a century."
        image={images.aerial}
        engraving="ibex"
      />

      {/* Family */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative">
            <Photo src={images.autumn} alt="The Engadin in autumn" className="aspect-[4/5]" />
            <div className="absolute -bottom-10 -right-4 w-40 md:-right-10 md:w-48">
              <div className="rounded-full bg-cream p-2 shadow-xl">
                <Seal top="Waldhaus am See" bottom="St. Moritz" center="1885" sub="Established" tone="ink" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span className="eyebrow text-gold-deep">The Bernasconi family</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">From father to son</h2>
            <Ornament className="mt-7" />
            <div className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
              <p>
                The Waldhaus first opened its doors in 1885, on the one stretch of shore where the forest runs down to the lake.
                A century later it was acquired by Claudio Bernasconi — a hotelier with a collector&rsquo;s eye and a host&rsquo;s
                heart, who built the whisky collection that made the house famous.
              </p>
              <p>
                Today his son Sandro runs the hotel. The rooms have been renewed, the spa rebuilt, the windows widened — but the
                welcome is exactly as it was.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="cloth relative scroll-mt-20 overflow-hidden py-28 text-cream md:py-36">
        <Engraving name="lake" className="absolute inset-x-0 top-0 h-80 w-full opacity-[0.1]" style={{ maskSize: "cover", WebkitMaskSize: "cover" }} />
        <div className="relative mx-auto max-w-5xl px-6 md:px-10">
          <div className="text-center">
            <span className="eyebrow text-gold-light">Timeline</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">Milestones on the lake</h2>
            <Ornament className="mx-auto mt-7" />
          </div>
          <ol className="relative mt-20">
            <span className="absolute left-4 top-0 h-full w-px bg-gold/30 md:left-1/2" />
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 60} className={`relative mb-14 pl-14 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-16" : "md:pr-16 md:text-right"}`}>
                <span className={`absolute left-[11px] top-3 h-3 w-3 rotate-45 border border-gold-light bg-forest md:left-auto ${i % 2 ? "md:-left-[6px]" : "md:-right-[6px]"}`} />
                <span className="display foil text-5xl">{t.year}</span>
                <p className="display mt-4 text-lg tracking-[0.12em]">{t.title}</p>
                <p className="editorial mt-3 text-xl leading-relaxed text-cream/70">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Facts */}
      <section className="bg-linen py-28 md:py-36">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="text-center">
            <span className="eyebrow text-gold-deep">At a glance</span>
            <h2 className="display mt-6 text-[clamp(2rem,4vw,3.2rem)]">The facts</h2>
            <Ornament className="mx-auto mt-7" />
          </div>
          <div className="mt-16 grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 md:grid-cols-4">
            {[
              [String(hotel.founded), "Year founded"],
              [figures.rooms, "Rooms & suites"],
              [figures.whiskies, "Whiskies"],
              [figures.wines, "Wines"],
              ["365", "Days open a year"],
              ["5 min", "Walk to the station"],
              ["CHF 5.2m", "Invested since 2013"],
              [hotel.stars, "Classification"],
            ].map(([n, l], i) => (
              <Reveal key={l} delay={i * 50} className="bg-linen px-6 py-12 text-center">
                <p className="display foil text-4xl">{n}</p>
                <p className="eyebrow mt-3 text-[0.58rem] text-ink/55">{l}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-24 grid gap-10 md:grid-cols-5">
            {awards.map((a, i) => (
              <Reveal key={a.title} delay={i * 80} className="text-center">
                <div className="mx-auto w-36">
                  <Seal top={a.title.split(" ").slice(0, 2).join(" ")} bottom="Waldhaus am See" center="✦" tone="ink" />
                </div>
                <p className="display mt-6 text-sm tracking-[0.12em]">{a.title}</p>
                <p className="editorial mt-2 text-lg text-ink/60">{a.sub}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Button href="/contact" variant="dark">Media & press enquiries</Button>
          </div>
        </div>
      </section>
    </>
  );
}
