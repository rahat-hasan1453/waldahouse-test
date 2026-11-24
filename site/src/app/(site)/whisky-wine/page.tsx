import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Chapter, FactBadge, FactBadgeGroup, Frame, LabelPlate } from "@/components/craft";
import { Lockup } from "@/components/identity";
import { Lines } from "@/components/motion/lines";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, Photo, Seal, SectionHeading } from "@/components/ui";
import { chapters, figures, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Devil's Place Whisky Bar & Cave Waldhaus",
  description:
    "Devil's Place in St. Moritz — Guinness World Record holder since 1999 for the world's largest whisky selection, with 2,500+ whiskies, a cigar lounge and 1,300+ fine wines in Cave Waldhaus.",
};

const regions = [
  { r: "Scotland", n: "Speyside · Islay · Highlands · Campbeltown" },
  { r: "Japan", n: "Single malts & blended rarities" },
  { r: "Ireland & USA", n: "Pot still, bourbon & rye" },
  { r: "The unexpected", n: "Sri Lanka · Uruguay · China · New Zealand" },
];

const storyFacts = [
  ["1,000", "Bottles · 1996"],
  [figures.whiskies, "Bottlings · 1999"],
  ["1878", "Oldest Macallan"],
] as const;

const cellarFacts = [
  [figures.wines, "Wines listed"],
  [figures.bottlesInCellar, "Bottles"],
  [figures.countries, "Countries"],
] as const;

/** This page's place in the house book (III · Whisky & Wine), read from the nav. */
const chapter = chapters.find((c) => c.href === "/whisky-wine");

/** Arrival offset of n × --stagger (collapses to 0 under reduced motion). */
const after = (n: number) => ({ "--reveal-delay": `calc(var(--stagger) * ${n})` }) as CSSProperties;
/** Stagger index for curtains and data-seq children. */
const at = (n: number) => ({ "--i": n }) as CSSProperties;

/*
 * Fact badges (ref 3). At md+ the three overlap in one row (FactBadgeGroup). Below md they nest as
 * a cluster, two over one, so a phone never stacks three rings in a column.
 * Sizes use --badge-mid wherever a full md row would not fit its column.
 */
const cluster = "max-md:grid max-md:grid-cols-[repeat(2,max-content)] max-md:gap-0";
const clusterAt = ["", "max-md:-ml-4", "max-md:col-span-2 max-md:-mt-9 max-md:justify-self-center"];
/** Phones: the pair (overlapping 1rem) always fits between the 1.5rem gutters, down to 320px. */
const phoneBadge = "max-md:[--badge-size:min(var(--badge-mid),calc(50vw_-_1rem))]";
/** Story (half column, text-3xl values): mid below xl, md from xl. */
const storyBadge = `${phoneBadge} md:max-xl:[--badge-size:var(--badge-mid)]`;
/** Cave (five-twelfths column, text-2xl values): mid, sm where lg–xl squeezes the column. */
const cellarBadge = `${phoneBadge} md:max-lg:[--badge-size:var(--badge-mid)] lg:max-xl:[--badge-size:var(--badge-sm)] xl:[--badge-size:var(--badge-mid)]`;
/** The Cave plates are captioned in the cellar's claret, like its lockup and badges. */
const claretCaptions = { "--accent-ink": "var(--color-claret)" } as CSSProperties;

export default function WhiskyWinePage() {
  return (
    <>
      {/* Hero: the whisky wall glows in like eyes adjusting to a dim bar; "largest" is the one foil */}
      <section className="cloth relative flex min-h-[100svh] items-center overflow-hidden text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.whiskyWall} alt="" className="candlelight animate-slow-zoom absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/85 to-forest/40" />
        <Engraving
          name="thistle"
          highlight
          drift
          inkOpacity={0.18}
          highlightOpacity={0.6}
          className="absolute right-0 top-0 hidden h-full w-[45%] lg:block"
        />
        <Frame inset="var(--hero-frame-inset)" corners="fleuron" inner="solid" draw="intro" className="hidden lg:block" />

        <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-16 px-6 pb-20 pt-40 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {chapter && (
              <span className="intro-eyebrow inline-flex">
                <Chapter numeral={chapter.numeral} label={chapter.label} labelClassName="text-gold-light" />
              </span>
            )}
            <h1 className="display mt-8 text-[clamp(3rem,8vw,7.5rem)]">
              <Lines mode="intro">
                The world&rsquo;s <br />
                <span className="foil" data-sheen>
                  largest
                </span>{" "}
                <br />
                whisky bar
              </Lines>
            </h1>
            <p className="editorial intro-lead mt-8 max-w-xl text-[clamp(1.3rem,2vw,1.6rem)] leading-snug text-cream/85">
              {figures.whiskies} bottlings. Two Guinness World Records. Thirty years of pouring, collecting and telling stories
              at the edge of Lake St. Moritz.
            </p>
            <div data-reserve-sentinel className="intro-bar mt-12 flex flex-wrap gap-4">
              <Button href="/contact?type=table">Reserve a seat at the bar</Button>
              <Button href="#shop" variant="outline-light">
                The whisky shop
              </Button>
            </div>
          </div>

          {/* The label stack: the house lockup over the record seal (ref 8 over ref 3) */}
          <div className="flex flex-col items-center gap-12 lg:col-span-4">
            <div className="intro-fade">
              <Lockup brand="devils" layout="stacked" descriptor="Est. in the Waldhaus" tone="light" />
            </div>
            <div className="intro-seal w-64 md:w-80">
              <Seal top="Guinness World Record" bottom="1996 · 1999 · Today" center="No. 1" sub="Whisky selection" />
            </div>
          </div>
        </div>
      </section>

      {/* Story: a plate, then the record told as three label badges */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal variant="sequence">
            <Photo src={images.whiskyGlass} alt="A dram of whisky" plate="I" className="aspect-[4/5]" />
          </Reveal>
          <div>
            <Reveal variant="sequence" style={after(2)}>
              <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
                Why &ldquo;Devil&rsquo;s Place&rdquo;?
              </span>
              <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
                <Lines>Named for the devil, poured for the angels</Lines>
              </h2>
              <Ornament variant="short" className="mt-7" />
              <div data-seq="lead" className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
                <p>
                  The church once demonised all distilled water. We took the hint — and named the bar after its most famous
                  critic&rsquo;s adversary.
                </p>
                <p>
                  In 1996 Devil&rsquo;s Place entered the Guinness Book of Records with 1,000 bottles. By 1999 it had grown past
                  2,500 — a record it has held ever since. Every year we travel to Scotland to buy casks for our own in-house
                  bottlings, available nowhere else.
                </p>
              </div>
            </Reveal>
            <Reveal variant="sequence" className="mt-12">
              <FactBadgeGroup className={cluster}>
                {storyFacts.map(([n, l], i) => (
                  <FactBadge
                    key={l}
                    value={<span className="display text-3xl text-gold-deep">{n}</span>}
                    unit={l}
                    className={`${clusterAt[i]} ${storyBadge}`}
                    style={after(i * 2)}
                  />
                ))}
              </FactBadgeGroup>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Regions: deliberately quiet; the numerals are flat metal */}
      <section className="cloth gilt-edge relative overflow-hidden py-28 text-cream md:py-32">
        <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading tone="light" eyebrow="The collection" title="From Islay to the other side of the world" />
          <div className="mt-16 grid gap-px bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((r, i) => (
              <Reveal key={r.r} style={after(i)} className="bg-forest p-10">
                <span className="display metal text-4xl">{String(i + 1).padStart(2, "0")}</span>
                <p className="display mt-6 text-xl tracking-[0.1em]">{r.r}</p>
                <p className="editorial mt-3 text-lg text-cream/65">{r.n}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cigar Lounge (a framed card wearing a cigar band) and the Shop (a label plate) */}
      <section className="velvet py-28 text-cream md:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 md:px-10 lg:grid-cols-2">
          <Reveal variant="sequence">
            <article id="cigar" className="flex h-full scroll-mt-28 flex-col border border-gold/30 p-3">
              <Photo src={images.whiskyPair} alt="Cigar lounge" className="aspect-[16/10]" />
              {/* the band wraps the seam between photograph and text */}
              <div data-seq="eyebrow" className="relative z-(--z-raised) -mt-5 flex px-5 md:px-10">
                <LabelPlate shape="band" className="px-7">
                  <span className="eyebrow text-center text-gold-light">
                    Cigar Lounge<span className="max-sm:hidden"> · </span>
                    <br className="sm:hidden" />
                    16:00 – 00:30
                  </span>
                </LabelPlate>
              </div>
              <div className="px-8 pb-8 md:px-10 md:pb-10">
                <h3 data-seq="title" className="display mt-6 text-3xl">
                  <Lines>The walk-in humidor</Lines>
                </h3>
                <p data-seq="lead" className="editorial mt-5 text-xl leading-relaxed text-cream/80">
                  Adjoining the bar, our Cigar Lounge keeps a very large selection in its walk-in humidor — choose at leisure,
                  then settle in with a dram.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal id="shop" variant="sequence" style={after(2)} className="scroll-mt-28">
            <LabelPlate as="article" field className="h-full bg-wine/25 p-6">
              <Photo src={images.whiskyJapanese} alt="Whisky shop" className="aspect-[16/10]" />
              <div className="px-5 pb-5 pt-8 md:px-7 md:pb-7 md:pt-10">
                <span data-seq="eyebrow" className="eyebrow inline-block text-gold-light">
                  Whisky Shop · On request
                </span>
                <h3 data-seq="title" className="display mt-5 text-3xl">
                  <Lines>Take a bottle home</Lines>
                </h3>
                <p data-seq="lead" className="editorial mt-5 text-xl leading-relaxed text-cream/80">
                  More than a thousand whiskies available to buy directly, including our own bottlings. The shop opens on
                  request — or browse online with our partner World of Whisky.
                </p>
                <div data-seq="actions" className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Button href="/contact?type=whisky">Book a shop visit</Button>
                  <Button href="https://www.world-of-whisky.ch" variant="quiet-light">
                    World of Whisky
                  </Button>
                </div>
              </div>
            </LabelPlate>
          </Reveal>
        </div>
      </section>

      {/* Cave Waldhaus: paper with the claret accent; plates descend arch → rack → bottles */}
      <section id="cave" className="paper relative scroll-mt-20 overflow-hidden py-28 md:py-36">
        <Engraving name="grapes" color="var(--color-wine)" drift className="absolute -right-20 top-10 h-[640px] w-[440px] opacity-[0.1]" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal variant="sequence">
              <span data-seq="eyebrow" className="inline-block">
                <Lockup brand="cave" layout="stacked" descriptor="The wine cellar" tone="dark" />
              </span>
              <h2 data-seq="title" className="display mt-8 text-[clamp(2.2rem,4.5vw,3.6rem)]">
                <Lines>A hidden gem in the Alpine rock</Lines>
              </h2>
              <Ornament variant="short" className="mt-7" />
              <p data-seq="lead" className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
                {figures.bottlesInCellar} bottles from more than twenty countries rest in our natural Alpine cellar. The wine list
                runs to over {figures.wines.replace("+", "")} labels — recognised repeatedly by Wine Spectator with the Grand Award
                and Best of Award of Excellence.
              </p>
            </Reveal>
            <Reveal variant="sequence" className="mt-10">
              <FactBadgeGroup className={cluster}>
                {cellarFacts.map(([n, l], i) => (
                  <FactBadge
                    key={l}
                    accent="claret"
                    value={<span className="display text-2xl text-claret">{n}</span>}
                    unit={l}
                    className={`${clusterAt[i]} ${cellarBadge}`}
                    style={after(i * 2)}
                  />
                ))}
              </FactBadgeGroup>
              <div data-seq="actions" className="mt-10">
                <Button href="/contact?type=table" variant="dark">
                  Dine with a sommelier&rsquo;s pairing
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal variant="sequence" style={{ ...after(2), ...claretCaptions }} className="grid grid-cols-2 gap-x-4 gap-y-12 lg:col-span-7">
            <Photo src={images.cellarArch} alt="Arched wine cellar" plate="II" curtain="down" style={at(0)} className="row-span-2 h-full" />
            <Photo src={images.cellarRack} alt="Wine racks" plate="III" curtain="down" style={at(2)} className="aspect-square" />
            <Photo src={images.cellarBottles} alt="Wine bottles" plate="IV" curtain="down" style={at(4)} className="aspect-square" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
