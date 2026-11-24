import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Distinctions, Lozenge } from "@/components/craft";
import { Counter } from "@/components/motion/counter";
import { Lines } from "@/components/motion/lines";
import { Tilt } from "@/components/motion/tilt";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, PageHero, Photo, Seal } from "@/components/ui";
import { msg } from "@/lib/i18n/msg";
import { T } from "@/lib/i18n/provider";
import { chapters, figures, hotel, images, timeline } from "@/lib/site";

export const metadata: Metadata = {
  title: "Facts & History",
  description: "Since 1885 on Lake St. Moritz. The Bernasconi family story, our investments and the facts behind the Waldhaus.",
};

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

const chapter = chapters.find((c) => c.href === "/heritage")?.numeral ?? "V";

/** Heritage-page copy, from the Blocks "heritage" module. */
const he = (k: string) => <T m="heritage" k={k} />;
/** timeline entries live in common:timeline.<year|today>.* */
const tl = (year: string, k: string) => <T m="common" k={`timeline.${year === "Today" ? "today" : year}.${k}`} />;

/*
 * Timeline entries slide in from their own side of the spine (right of it on mobile). The hidden
 * state exists only under html.js inside an unrevealed <Reveal>; the distance is the reveal token
 * (28px × 6/7 = 24px), so it collapses to nothing under reduced motion.
 */
const slide =
  "transition-[opacity,translate] duration-(--dur-reveal) ease-(--ease-settle) delay-[var(--reveal-delay,0ms)] [.js_.reveal:not(.is-visible)>&]:opacity-0 [.js_.reveal:not(.is-visible)>&]:translate-x-[calc(var(--slide-from)*var(--reveal-distance)*6/7)]";

/* one foil (the year the house opened), three counts that land together, the rest in flat metal */
/* labels are heritage:facts.<label>; worded values are keys too */
const facts: { value: ReactNode; label: string; kind: "foil" | "count" | "metal" }[] = [
  { value: String(hotel.founded), label: "founded", kind: "foil" },
  { value: figures.rooms, label: "rooms", kind: "metal" },
  { value: figures.whiskies, label: "whiskies", kind: "count" },
  { value: figures.wines, label: "wines", kind: "count" },
  { value: "365", label: "days", kind: "count" },
  { value: he("facts.walkValue"), label: "walk", kind: "metal" },
  { value: he("facts.investedValue"), label: "invested", kind: "metal" },
  { value: <T m="common" k="hotel.stars" />, label: "classification", kind: "metal" },
];

function factValue({ value, kind }: (typeof facts)[number]): ReactNode {
  if (kind === "foil") return <span className="foil foil-emboss">{value}</span>;
  // the three counts start from the ledger's own arrival (not each on its own), so they land together
  if (kind === "count") return <Counter value={value as string} trigger="reveal" className="[--count-delay:var(--seq-lead)]" />;
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
        eyebrow={he("hero.eyebrow")}
        title={
          <>
            {he("hero.titleA")} <span className="metal">{he("hero.titleMetal")}</span>
          </>
        }
        lead={he("hero.lead")}
        image={images.houseFacade}
      />

      {/* Family: the founding year pressed into the paper, over the corner of the plate */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal variant="sequence" className="relative">
            <Photo
              src={images.houseAutumn}
              alt={msg("heritage", "family.alt")}
              plate="I"
              className="aspect-[4/5] [&_figcaption]:hidden [&_figcaption]:justify-start sm:[&_figcaption]:flex"
            />
            {/* the 1885 seal, drawn in ink so it reads on paper; it leans toward the cursor */}
            <div className="absolute -bottom-10 -right-4 w-40 md:-right-10 md:w-48">
              <Tilt className="paper rounded-full shadow-[0_14px_30px_-14px_rgb(10_28_23/0.35)]">
                <Seal tone="ink" top="Waldhaus am See" bottom="St. Moritz" center="1885" sub={he("family.sealSub")} />
              </Tilt>
            </div>
          </Reveal>

          <Reveal variant="sequence">
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
              {he("family.eyebrow")}
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
              <Lines>{he("family.title")}</Lines>
            </h2>
            <div className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
              <p data-seq="lead" className="initial">
                {he("family.p1")}
              </p>
              <p data-seq="lead" style={at(1)}>
                {he("family.p2")}
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
              {he("timeline.eyebrow")}
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
              <Lines>{he("timeline.title")}</Lines>
            </h2>
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
                      <span className="display figure metal text-5xl">{t.year === "Today" ? tl(t.year, "year") : t.year}</span>
                      <p className="display mt-4 text-lg tracking-[0.12em]">{tl(t.year, "title")}</p>
                      <p className="editorial mt-3 text-xl leading-relaxed text-cream/70">{tl(t.year, "text")}</p>
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
              {he("facts.eyebrow")}
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2rem,4vw,3.2rem)]">
              <Lines>{he("facts.title")}</Lines>
            </h2>
          </Reveal>

          <Reveal as="dl" variant="sequence" className="mt-16 grid grid-cols-2 gap-px border border-rule-ink bg-rule-ink md:grid-cols-4">
            {facts.map((f, i) => (
              /* the cell keeps its ground (the hairline lattice stays drawn); only its type arrives */
              <div key={f.label} className="flex flex-col-reverse items-center bg-linen px-6 py-12 text-center">
                <dt data-seq="lead" style={at(i)} className="eyebrow mt-3 text-[0.58rem] text-ink-muted">
                  {he(`facts.${f.label}`)}
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
            <Button href="#" variant="dark">
              {he("facts.press")}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
