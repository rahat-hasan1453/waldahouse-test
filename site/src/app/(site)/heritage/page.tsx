import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Distinctions, Lozenge } from "@/components/craft";
import { Counter } from "@/components/motion/counter";
import { Lines } from "@/components/motion/lines";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, PageHero, Photo, Seal } from "@/components/ui";
import { chapters, figures, hotel, images, timeline } from "@/lib/site";

export const metadata: Metadata = {
  title: "Facts & History",
  description: "Since 1885 on Lake St. Moritz. The Bernasconi family story, our investments and the facts behind the Waldhaus.",
};

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

const chapter = chapters.find((c) => c.href === "/heritage")?.numeral ?? "V";

/*
 * Timeline entries slide in from their own side of the spine (right of it on mobile). The hidden
 * state exists only under html.js inside an unrevealed <Reveal>; the distance is the reveal token
 * (28px × 6/7 = 24px), so it collapses to nothing under reduced motion.
 */
const slide =
  "transition-[opacity,translate] duration-(--dur-reveal) ease-(--ease-settle) delay-[var(--reveal-delay,0ms)] [.js_.reveal:not(.is-visible)>&]:opacity-0 [.js_.reveal:not(.is-visible)>&]:translate-x-[calc(var(--slide-from)*var(--reveal-distance)*6/7)]";

/* one foil (the year the house opened), three counts that land together, the rest in flat metal */
const facts: { value: string; label: string; kind: "foil" | "count" | "metal" }[] = [
  { value: String(hotel.founded), label: "Year founded", kind: "foil" },
  { value: figures.rooms, label: "Rooms & suites", kind: "metal" },
  { value: figures.whiskies, label: "Whiskies", kind: "count" },
  { value: figures.wines, label: "Wines", kind: "count" },
  { value: "365", label: "Days open a year", kind: "count" },
  { value: "5 min", label: "Walk to the station", kind: "metal" },
  { value: "CHF 5.2m", label: "Invested since 2013", kind: "metal" },
  { value: hotel.stars, label: "Classification", kind: "metal" },
];

function factValue({ value, kind }: (typeof facts)[number]): ReactNode {
  if (kind === "foil") return <span className="foil foil-emboss">{value}</span>;
  // the three counts start from the ledger's own arrival (not each on its own), so they land together
  if (kind === "count") return <Counter value={value} trigger="reveal" className="[--count-delay:var(--seq-lead)]" />;
  return value;
}

export default function HeritagePage() {
  return (
    <>
      {/* The frontispiece: 1885 in colossal foil, cropped by the page (ref 7) */}
      <PageHero
        variant="type"
        chapter={chapter}
        colossal={String(hotel.founded)}
        eyebrow="Heritage · Facts & History"
        title={
          <>
            An institution <span className="metal">since 1885</span>
          </>
        }
        lead="One lake, one house, one family — and a tradition that has quietly grown for well over a century."
        image={images.aerial}
      />

      {/* Family: the founding year pressed into the paper, over the corner of the plate */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal variant="sequence" className="relative">
            <Photo
              src={images.autumn}
              alt="The Engadin in autumn"
              plate="I"
              className="aspect-[4/5] [&_figcaption]:hidden [&_figcaption]:justify-start sm:[&_figcaption]:flex"
            />
            {/* a blind emboss on a roundel of the same paper: no disc colour of its own, no shadow */}
            <div className="absolute -bottom-10 -right-4 w-40 md:-right-10 md:w-48">
              <div className="paper rounded-full">
                <Seal variant="emboss" top="Waldhaus am See" bottom="St. Moritz" center="1885" sub="Established" />
              </div>
            </div>
          </Reveal>

          <Reveal variant="sequence">
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
              The Bernasconi family
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
              <Lines>From father to son</Lines>
            </h2>
            <Ornament variant="short" className="mt-7" />
            <div className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
              <p data-seq="lead" className="initial">
                The Waldhaus first opened its doors in 1885, on the one stretch of shore where the forest runs down to the lake.
                A century later it was acquired by Claudio Bernasconi — a hotelier with a collector&rsquo;s eye and a host&rsquo;s
                heart, who built the whisky collection that made the house famous.
              </p>
              <p data-seq="lead" style={at(1)}>
                Today his son Sandro runs the hotel. The rooms have been renewed, the spa rebuilt, the windows widened — but the
                welcome is exactly as it was.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline: the spine draws as you read; each node ignites as the thread reaches it */}
      <section id="timeline" className="cloth gilt-edge relative scroll-mt-20 overflow-clip py-28 text-cream md:py-36">
        <Engraving name="lake" fit="cover" className="absolute inset-x-0 top-0 h-80 w-full opacity-[0.12]" />
        <div className="relative mx-auto max-w-5xl px-6 md:px-10">
          <Reveal variant="sequence" className="text-center">
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-light">
              Timeline
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
              <Lines>Milestones on the lake</Lines>
            </h2>
            <Ornament className="mx-auto mt-7" />
          </Reveal>

          <div className="spine relative mt-20">
            <span aria-hidden className="absolute left-4 top-0 h-full w-px bg-gold/30 md:left-1/2" />
            <span aria-hidden className="spine-fill absolute left-4 top-0 h-full w-px md:left-1/2" />
            <ol>
              {timeline.map((t, i) => {
                const right = i % 2 === 1;
                return (
                  <Reveal
                    as="li"
                    variant="sequence"
                    key={t.year}
                    className={`relative mb-14 pl-14 md:w-1/2 md:pl-0 ${right ? "md:ml-auto md:pl-16" : "md:pr-16 md:text-right"}`}
                  >
                    <Lozenge size="md" className={`spine-node absolute left-[11px] top-3 text-gold-light ${right ? "md:-left-[6px]" : "md:left-auto md:-right-[6px]"}`} />
                    <div className={`${slide} [--slide-from:1] ${right ? "" : "md:[--slide-from:-1]"}`}>
                      <span className="display figure metal text-5xl">{t.year}</span>
                      <p className="display mt-4 text-lg tracking-[0.12em]">{t.title}</p>
                      <p className="editorial mt-3 text-xl leading-relaxed text-cream/70">{t.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Facts: the ledger of the house */}
      <section className="bg-linen py-28 md:py-36">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <Reveal variant="sequence" className="text-center">
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
              At a glance
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2rem,4vw,3.2rem)]">
              <Lines>The facts</Lines>
            </h2>
            <Ornament className="mx-auto mt-7" />
          </Reveal>

          <Reveal as="dl" variant="sequence" className="mt-16 grid grid-cols-2 gap-px border border-rule-ink bg-rule-ink md:grid-cols-4">
            {facts.map((f, i) => (
              /* the cell keeps its ground (the hairline lattice stays drawn); only its type arrives */
              <div key={f.label} className="flex flex-col-reverse items-center bg-linen px-6 py-12 text-center">
                <dt data-seq="lead" style={at(i)} className="eyebrow mt-3 text-[0.58rem] text-ink-muted">
                  {f.label}
                </dt>
                <dd data-seq="lead" style={at(i)} className={`display text-4xl ${f.kind === "foil" ? "" : "figure metal"}`}>
                  {factValue(f)}
                </dd>
              </div>
            ))}
          </Reveal>

          {/* the distinctions, typeset as a roll */}
          <Reveal className="mx-auto mt-24 max-w-4xl">
            <Distinctions variant="roll" />
          </Reveal>

          <Reveal className="mt-16 text-center">
            <Button href="/contact" variant="dark">
              Media & press enquiries
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
