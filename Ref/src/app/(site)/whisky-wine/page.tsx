import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Chapter, FactBadge, FactBadgeGroup, Frame, LabelPlate } from "@/components/craft";
import { Lockup } from "@/components/identity";
import { Lines } from "@/components/motion/lines";
import { Tilt } from "@/components/motion/tilt";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Photo, Seal, SectionHeading } from "@/components/ui";
import type { Vars } from "@/lib/i18n/dictionaries";
import { msg } from "@/lib/i18n/msg";
import { T } from "@/lib/i18n/provider";
import { chapters, figures, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Devil's Place Whisky Bar & Cave Waldhaus",
  description:
    "Devil's Place in St. Moritz — Guinness World Record holder since 1999 for the world's largest whisky selection, with 2,500+ whiskies, a cigar lounge and 1,300+ fine wines in Cave Waldhaus.",
};

/** Whisky & Wine copy, from the Blocks "whisky-wine" module. */
const w = (k: string, vars?: Vars) => <T m="whisky-wine" k={k} vars={vars} />;

/* four regions: whisky-wine:regions.items.<i>.* */
const regions = [0, 1, 2, 3];

const storyFacts = [
  [w("story.facts.bottles"), "story.facts.bottlesLabel"],
  [figures.whiskies, "story.facts.bottlingsLabel"],
  [w("story.facts.oldest"), "story.facts.oldestLabel"],
] as const;

const cellarFacts = [
  [figures.wines, "cave.winesLabel"],
  [figures.bottlesInCellar, "cave.bottlesLabel"],
  [figures.countries, "cave.countriesLabel"],
] as const;

/** This page's place in the house book (III · Whisky & Wine), read from the nav. */
const chapter = chapters.find((c) => c.href === "/whisky-wine");

/** Arrival offset of n × --stagger (collapses to 0 under reduced motion). */
const after = (n: number) => ({ "--reveal-delay": `calc(var(--stagger) * ${n})` }) as CSSProperties;
/** Stagger index for curtains and data-seq children. */
const at = (n: number) => ({ "--i": n }) as CSSProperties;

/*
 * Fact badges (ref 3). At md+ the three sit in one row, 8px apart (FactBadgeGroup). Below md they form
 * a cluster, two over one, 8px apart, so a phone never stacks three rings in a column. They never overlap.
 * Sizes use --badge-mid wherever a full md row would not fit its column.
 */
const cluster = "max-md:grid max-md:grid-cols-[repeat(2,max-content)] max-md:gap-2";
const clusterAt = ["", "", "max-md:col-span-2 max-md:justify-self-center"];
/** Phones: the pair (8px apart) always fits between the 1.5rem gutters, down to 320px. */
const phoneBadge = "max-md:[--badge-size:min(var(--badge-mid),calc(50vw_-_1.75rem))]";
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
      <section className="velvet relative flex min-h-[100svh] items-center overflow-hidden text-cream">
        {/* background layers: photo, burgundy gradient and (below xl) the thistle engraving */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.whiskyWall} alt="" className="candlelight animate-slow-zoom absolute inset-0 h-full w-full object-cover opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy via-burgundy/85 to-burgundy/40" />
          <Engraving
            name="thistle"
            highlight
            drift
            inkOpacity={0.18}
            highlightOpacity={0.6}
            className="absolute right-0 top-0 hidden h-full w-[45%] lg:block xl:hidden"
          />
        </div>
        <Frame inset="var(--hero-frame-inset)" corners="none" inner="solid" draw="intro" className="hidden lg:block" />

        <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-16 px-6 pb-20 pt-40 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {chapter && (
              <span className="intro-eyebrow inline-flex">
                <Chapter numeral={chapter.numeral} label={<T m="common" k={chapter.key} />} labelClassName="text-gold-light" />
              </span>
            )}
            <h1 className="display mt-8 text-[clamp(3rem,8vw,7.5rem)]">
              <Lines mode="intro">
                {w("hero.titleA")} <br />
                <span className="foil" data-sheen>
                  {w("hero.titleFoil")}
                </span>{" "}
                <br />
                {w("hero.titleB")}
              </Lines>
            </h1>
            <p className="editorial intro-lead mt-8 max-w-xl text-[clamp(1.3rem,2vw,1.6rem)] leading-snug text-cream/85">
              {w("hero.lead", { whiskies: figures.whiskies })}
            </p>
            <div data-reserve-sentinel className="intro-bar mt-12 flex flex-wrap gap-4">
              <Button href="#">{w("hero.reserve")}</Button>
              <Button href="#shop" variant="outline-light">
                {w("hero.shop")}
              </Button>
            </div>
          </div>

          {/*
            The label pair: the house lockup and the record seal, seen at first look.
            Below xl they stack; from xl they sit side by side, centred on each other, their lower edge on the
            buttons' lower edge, and the thistle rises from the gap between them.
          */}
          <div className="flex flex-col items-center lg:col-span-4 xl:items-end xl:self-end">
            <div className="relative isolate flex flex-col items-center gap-12 xl:w-max xl:flex-row xl:gap-10">
              {/* xl: the thistle's stem (centre of its 420×900 plate) stands in the gap; no drift, so it stays there */}
              <Engraving
                name="thistle"
                highlight
                inkOpacity={0.18}
                highlightOpacity={0.6}
                className="absolute -bottom-20 left-[calc(100%-250px)] -z-20 hidden aspect-[420/900] h-[92svh] -translate-x-1/2 xl:block"
              />
              {/*
                One continuous, translucent backdrop behind the pair (a tapered body and a disc, blurred together so
                no edge shows; 55%, so the engraving reads through). Stacked: narrow at the emblem, widening down to
                the seal. Side by side: narrow at the lockup, widening across to the seal.
              */}
              <span aria-hidden className="pointer-events-none absolute -bottom-6 -top-14 left-1/2 -z-10 w-80 -translate-x-1/2 blur-[30px] md:w-[23rem] xl:hidden">
                <span className="absolute inset-x-0 top-0 bottom-40 bg-[color-mix(in_oklab,var(--color-burgundy)_55%,transparent)] [clip-path:polygon(30%_0,70%_0,100%_100%,0_100%)] md:bottom-[11.5rem]" />
                <span className="absolute inset-x-0 bottom-0 aspect-square rounded-full bg-[color-mix(in_oklab,var(--color-burgundy)_55%,transparent)]" />
              </span>
              <span aria-hidden className="pointer-events-none absolute -inset-9 -z-10 hidden blur-[30px] xl:block">
                <span className="absolute inset-y-0 left-0 right-[calc(115px+2.25rem)] bg-[color-mix(in_oklab,var(--color-burgundy)_55%,transparent)] [clip-path:polygon(0_30%,100%_0,100%_100%,0_70%)]" />
                <span className="absolute right-0 top-1/2 aspect-square w-[calc(230px+4.5rem)] -translate-y-1/2 rounded-full bg-[color-mix(in_oklab,var(--color-burgundy)_55%,transparent)]" />
              </span>
              <div className="intro-fade xl:w-52 xl:shrink-0">
                <Lockup brand="devils" layout="stacked" descriptor={msg("whisky-wine", "hero.lockupDescriptor")} tone="light" />
              </div>
              <div className="intro-seal w-64 md:w-80 xl:w-[230px] xl:shrink-0">
                {/* leans toward the cursor, like the 1885 seal on Heritage */}
                <Tilt className="rounded-full">
                  <Seal top={w("hero.sealTop")} bottom={w("hero.sealBottom")} center={w("hero.sealCenter")} sub={w("hero.sealSub")} />
                </Tilt>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story: a plate, then the record told as three label badges */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal variant="sequence">
            <Photo src={images.whiskyPour} alt={msg("whisky-wine", "story.alt")} plate="I" className="aspect-[4/5]" />
          </Reveal>
          <div>
            <Reveal variant="sequence" style={after(2)}>
              <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
                {w("story.eyebrow")}
              </span>
              <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
                <Lines>{w("story.title")}</Lines>
              </h2>
              <div data-seq="lead" className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
                <p>{w("story.p1")}</p>
                <p>{w("story.p2")}</p>
              </div>
            </Reveal>
            <Reveal variant="sequence" className="mt-12">
              <FactBadgeGroup className={cluster}>
                {storyFacts.map(([n, l], i) => (
                  <FactBadge
                    key={l}
                    value={<span className="display text-3xl text-gold-deep">{n}</span>}
                    unit={w(l)}
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
          <SectionHeading tone="light" eyebrow={w("regions.eyebrow")} title={w("regions.title")} />
          <div className="mt-16 grid gap-px bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((i) => (
              <Reveal key={i} style={after(i)} className="bg-forest p-10">
                <span className="display metal text-4xl">{String(i + 1).padStart(2, "0")}</span>
                <p className="display mt-6 text-xl tracking-[0.1em]">{w(`regions.items.${i}.region`)}</p>
                <p className="editorial mt-3 text-lg text-cream/65">{w(`regions.items.${i}.note`)}</p>
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
              <Photo src={images.devilsLounge} alt={msg("whisky-wine", "cigar.alt")} className="aspect-[16/10]" />
              {/* the band wraps the seam between photograph and text */}
              <div data-seq="eyebrow" className="relative z-(--z-raised) -mt-5 flex px-5 md:px-10">
                <LabelPlate shape="band" className="px-7">
                  <span className="eyebrow text-center text-gold-light">
                    {w("cigar.band")}
                    <span className="max-sm:hidden"> · </span>
                    <br className="sm:hidden" />
                    16:00 – 00:30
                  </span>
                </LabelPlate>
              </div>
              <div className="px-8 pb-8 md:px-10 md:pb-10">
                <h3 data-seq="title" className="display mt-6 text-3xl">
                  <Lines>{w("cigar.title")}</Lines>
                </h3>
                <p data-seq="lead" className="editorial mt-5 text-xl leading-relaxed text-cream/80">
                  {w("cigar.lead")}
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal id="shop" variant="sequence" style={after(2)} className="scroll-mt-28">
            <LabelPlate as="article" field className="h-full bg-wine/25 p-6">
              <Photo src={images.whiskyJapanese} alt={msg("whisky-wine", "shop.alt")} className="aspect-[16/10]" />
              <div className="px-5 pb-5 pt-8 md:px-7 md:pb-7 md:pt-10">
                <span data-seq="eyebrow" className="eyebrow inline-block text-gold-light">
                  {w("shop.eyebrow")}
                </span>
                <h3 data-seq="title" className="display mt-5 text-3xl">
                  <Lines>{w("shop.title")}</Lines>
                </h3>
                <p data-seq="lead" className="editorial mt-5 text-xl leading-relaxed text-cream/80">
                  {w("shop.lead")}
                </p>
                <div data-seq="actions" className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Button href="#">{w("shop.cta")}</Button>
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
                <Lockup brand="cave" layout="stacked" tone="dark" />
              </span>
              <h2 data-seq="title" className="display mt-8 text-[clamp(2.2rem,4.5vw,3.6rem)]">
                <Lines>{w("cave.title")}</Lines>
              </h2>
              <p data-seq="lead" className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
                {w("cave.lead", { bottles: figures.bottlesInCellar, wines: figures.wines.replace("+", "") })}
              </p>
            </Reveal>
            <Reveal variant="sequence" className="mt-10">
              <FactBadgeGroup className={cluster}>
                {cellarFacts.map(([n, l], i) => (
                  <FactBadge
                    key={l}
                    accent="claret"
                    value={<span className="display text-2xl text-claret">{n}</span>}
                    unit={w(l)}
                    className={`${clusterAt[i]} ${cellarBadge}`}
                    style={after(i * 2)}
                  />
                ))}
              </FactBadgeGroup>
              <div data-seq="actions" className="mt-10">
                <Button href="#" variant="dark">
                  {w("cave.cta")}
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal variant="sequence" style={{ ...after(2), ...claretCaptions }} className="grid grid-cols-2 gap-x-4 gap-y-12 lg:col-span-7">
            <Photo src={images.cellarArch} alt={msg("whisky-wine", "cave.altArch")} plate="II" curtain="down" style={at(0)} className="row-span-2 h-full" />
            <Photo src={images.cellarRack} alt={msg("whisky-wine", "cave.altRack")} plate="III" curtain="down" style={at(2)} className="aspect-square" />
            <Photo src={images.cellarBottles} alt={msg("whisky-wine", "cave.altBottles")} plate="IV" curtain="down" style={at(4)} className="aspect-square" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
