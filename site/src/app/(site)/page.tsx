import Link from "next/link";
import type { CSSProperties } from "react";
import { BookingBar } from "@/components/booking-bar";
import { EngravedArrow, Frame, LabelPlate, Lozenge, RailThread } from "@/components/craft";
import { Guilloche } from "@/components/guilloche";
import { Lockup } from "@/components/identity";
import { Counter } from "@/components/motion/counter";
import { Lines } from "@/components/motion/lines";
import { RailControls } from "@/components/rail-controls";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, Photo, Seal, SectionHeading } from "@/components/ui";
import { figures, images, rooms, seasonal, timeline } from "@/lib/site";

/* The New Year's Eve card shows until seasonal.nye.until (a Zurich calendar day); the page regenerates daily. */
export const revalidate = 86400;

const zurichDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" });

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

/* Where the booking ticket meets the plate frame (lg+): the frame's bottom rule runs through the ticket's notches. */
const heroVars = { "--bar-rule": "calc(var(--frame-inset) + 3.5rem)" } as CSSProperties;

/* Aligns full-bleed rails with the 1440 container's content edge (cqw is the section's width, so a classic scrollbar never offsets it). */
const railGutter = "px-6 md:px-10 xl:px-[max(2.5rem,calc((100cqw_-_var(--container-wide))/2_+_2.5rem))]";
const railGutterX = "mx-6 md:mx-10 xl:mx-[max(2.5rem,calc((100cqw_-_var(--container-wide))/2_+_2.5rem))]";

const usps = [
  { k: "I", t: "Directly on the lake", s: "The only hotel on the shore, with an unobstructed view towards Maloja." },
  { k: "II", t: "5 minutes from the station", s: "A quiet setting — yet a short walk, or free shuttle, from the train." },
  { k: "III", t: "Best 3-Star Hotel", s: "Switzerland's best in its class — honoured multiple times." },
  { k: "IV", t: "Open 365 days", s: "Winter and summer, every single day of the year." },
];

/**
 * USP divider: a hairline with lozenge terminals that draws from the top when the ribbon arrives.
 * Hidden only under html.js inside an unrevealed Reveal; token durations collapse under reduced motion.
 */
function UspRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-y-8 right-0 w-3 translate-x-1/2 flex-col items-center py-0.5 text-gold [clip-path:inset(0)] transition-[clip-path] duration-(--dur-draw) ease-settle delay-[calc(var(--reveal-delay,0ms)_+_var(--i,0)_*_var(--stagger))] [.js_.reveal:not(.is-visible)_&]:[clip-path:inset(0_0_100%_0)] ${className}`}
    >
      <Lozenge size="xs" fill="solid" />
      <span className="w-px flex-1 bg-rule-ink" />
      <Lozenge size="xs" fill="solid" />
    </span>
  );
}

/** A printed double rule (1px + 0.5px): thick outside, thin inside. */
function DoubleRule({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden className={`flex gap-[calc(var(--frame-gap)/2)] ${flip ? "flex-col-reverse" : "flex-col"}`}>
      <span className="h-(--hairline) bg-rule-gold" />
      <span className="h-(--hairline-fine) bg-rule-gold-strong" />
    </div>
  );
}

export default function Home() {
  /* one calendar day for the whole render: the NYE card and the booking ticket agree */
  const today = zurichDay.format(new Date());
  const nye = today < seasonal.nye.until;

  return (
    <>
      {/* ——— HERO: the frontispiece (CSS intro, no Reveal) ——— */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-cream" style={heroVars}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.heroLake} alt="Lake St. Moritz with the Engadin mountains" className="animate-slow-zoom absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
        <Frame inset="var(--hero-frame-inset)" style={{ bottom: "var(--bar-rule)" }} corners="fleuron" draw="intro" className="hidden lg:block" />

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 pb-10 pt-40 md:px-10 lg:pt-28 lg:pb-(--bar-rule)">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="eyebrow intro-eyebrow flex items-center gap-4 text-gold-light">
                <span className="h-px w-12 bg-gold-light/70" /> St. Moritz · Engadin · Switzerland
              </span>
              <h1 className="display mt-8 text-[clamp(3rem,9vw,8.5rem)]">
                <Lines mode="intro">
                  On the lake.
                  <br />
                  <span className="foil" data-sheen>
                    Since 1885.
                  </span>
                </Lines>
              </h1>
              <p className="editorial intro-lead mt-8 max-w-xl text-[clamp(1.3rem,2vw,1.7rem)] leading-snug text-cream/85">
                The only hotel directly on Lake St. Moritz — a family house of stone pine, candlelight and the world&rsquo;s
                largest whisky collection.
              </p>
            </div>
            <div className="intro-seal hidden justify-end lg:col-span-4 lg:flex">
              <Link href="/whisky-wine" className="block w-48" aria-label="Devil's Place whisky bar">
                <Seal top="Guinness World Record" bottom="Devil's Place · Since 1999" center={figures.whiskies} sub="Whiskies" />
              </Link>
            </div>
          </div>
          {/* the ticket sits centred on the plate frame's bottom rule at lg+ */}
          <div className="intro-bar mt-14 lg:mt-8 lg:translate-y-1/2 lg:[@media(max-height:960px)]:translate-y-0">
            <BookingBar today={today} />
          </div>
        </div>

        {/* the plate caption, set beneath the plate's rule as in a printed book */}
        <p
          aria-hidden
          className="caption intro-fade absolute bottom-3 right-6 hidden text-gold-light md:right-10 md:block lg:bottom-[calc(var(--frame-inset)*0.75)] lg:right-(--frame-inset)"
        >
          Pl. I — Lake St. Moritz with the Engadin mountains
        </p>
      </section>

      {/* ——— USP RIBBON ——— */}
      <section className="paper border-b border-ink/10">
        <Reveal variant="sequence" className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
          {usps.map((u, i) => (
            <div key={u.k} className="relative px-6 py-12 text-center md:px-10" style={at(i * 1.5)}>
              <div data-seq="title">
                <span className="display metal text-3xl">{u.k}</span>
                <p className="display mt-4 text-[0.95rem] tracking-[0.12em]">{u.t}</p>
                <p className="editorial mt-3 text-lg leading-snug text-ink/65">{u.s}</p>
              </div>
              {/* dividers sit between columns only: 2 columns on mobile, 4 from md */}
              {i === 0 || i === 2 ? <UspRule className="flex" /> : i === 1 ? <UspRule className="hidden md:flex" /> : null}
            </div>
          ))}
        </Reveal>
      </section>

      {/* ——— WELCOME ——— */}
      <section className="paper relative overflow-hidden py-28 md:py-40">
        <Engraving name="pine" color="var(--color-pine)" className="absolute -left-24 top-10 h-[420px] w-[420px] opacity-[0.12]" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal variant="sequence" className="relative">
            <figure className="w-[85%]">
              <Photo src={images.lakeSummer} alt="Summer on Lake St. Moritz" curtain="up" className="aspect-[4/5] w-full" />
              {/* Pl. II runs up the left margin, beneath the house marginalia; clear of the mounted inset */}
              <figcaption
                data-seq="lead"
                className="absolute bottom-0 hidden rotate-180 items-center gap-3 [writing-mode:vertical-rl] md:-left-8 md:flex"
              >
                <span className="caption">Pl. II — Summer on Lake St. Moritz</span>
                <span aria-hidden className="h-8 w-px bg-rule-ink" />
              </figcaption>
            </figure>
            {/* the mounted inset floats forward over the still main plate */}
            <div className="drift-y absolute -bottom-12 right-0 w-[48%]">
              <Photo src={images.roomView} alt="A lake-view room" mount delay={250} className="aspect-[3/4]" />
            </div>
            <span data-seq="eyebrow" className="eyebrow absolute -left-2 top-8 origin-top-left -rotate-90 text-gold-deep md:-left-8">
              Est. 1885 · Via Dim Lej 6
            </span>
          </Reveal>

          <Reveal variant="sequence" delay={150}>
            <span data-seq="eyebrow" className="eyebrow block text-gold-deep">
              Welcome to the Waldhaus
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.8rem)]">
              <Lines>
                A house with <br />
                its own character
              </Lines>
            </h2>
            <Ornament variant="short" className="mt-7" />
            <div data-seq="lead" className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
              <p className="initial">
                For more than a century the Waldhaus has stood where the forest meets the water. In 1985 Claudio Bernasconi
                made it his life&rsquo;s work; today his son Sandro welcomes guests with the same warmth — and the same
                stubborn devotion to doing things properly.
              </p>
              <p>
                Every one of our rooms is different: in layout, in orientation, in style. What they share is the Engadin — warm
                stone pine, crisp mountain air, and that view.
              </p>
            </div>
            <div data-seq="actions" className="mt-10 flex flex-wrap items-center gap-8">
              <Button href="/heritage" variant="outline-dark">
                Our story
              </Button>
              <span className="flex items-center gap-4">
                <span aria-hidden className="rule-accent h-px w-8 shrink-0" />
                <span className="editorial text-2xl text-gold-deep">— Sandro Bernasconi, Host</span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— DEVIL'S PLACE: the hero asset, the page's single richest view ——— */}
      <section className="cloth gilt-edge @container relative overflow-clip py-28 text-cream md:py-40">
        <Engraving
          name="thistle"
          highlight
          drift
          inkOpacity={0.12}
          highlightOpacity={0.5}
          className="absolute -right-20 top-1/2 h-[900px] w-[600px] -translate-y-1/2"
        />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <Reveal variant="sequence" className="lg:col-span-7">
              <div data-seq="eyebrow">
                <Lockup brand="devils" layout="horizontal" tone="light" />
              </div>
              {/* the numeral counts once, bleeding off the viewport's left edge at lg+ */}
              <p className="display mt-8 text-[clamp(6rem,19vw,17rem)] leading-[0.85] tracking-[0.02em]">
                <Counter
                  value="2,500"
                  sheen
                  className="foil foil-emboss lg:ml-[calc(-1*max(2.5rem,(100cqw_-_var(--container-wide))/2_+_2.5rem)_-_0.04em)]"
                />
              </p>
              {/* the heading waits for the count to land */}
              <div className="[--reveal-delay:calc(var(--dur-count)*0.4)] motion-reduce:[--reveal-delay:0ms]">
                <h2 data-seq="title" className="display mt-4 text-[clamp(1.6rem,3.4vw,2.9rem)]">
                  <Lines>
                    whiskies under one roof.
                    <br />
                    <span className="text-gold-light">A world record since 1999.</span>
                  </Lines>
                </h2>
                <p data-seq="lead" className="editorial mt-8 max-w-2xl text-[1.4rem] leading-relaxed text-cream/80">
                  From an honest Johnnie Walker to a Macallan 1878; from Islay to Sri Lanka, Uruguay, Japan and New Zealand.
                  The name? The church once demonised all distilled water — so we named the bar after the devil himself.
                </p>
                <div data-seq="lead" style={at(1)} className="mt-12 max-w-2xl">
                  <DoubleRule />
                  <div className="grid grid-cols-3">
                    {[
                      { n: "1996", l: "First Guinness entry" },
                      { n: "30", l: "Years holding the record" },
                      { n: "16:00", l: "Doors open daily" },
                    ].map((s, i) => (
                      <div key={s.l} className={`py-6 ${i > 0 ? "border-l border-gold/25 pl-6" : ""}`}>
                        <p className="display text-3xl text-gold-light">{s.n}</p>
                        <p className="eyebrow mt-2 text-[0.55rem] text-cream-muted">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <DoubleRule flip />
                </div>
                <div data-seq="actions" className="mt-12 flex flex-wrap gap-4">
                  <Button href="/whisky-wine">Enter Devil&rsquo;s Place</Button>
                  <Button href="/contact?type=whisky" variant="outline-light">
                    Visit the whisky shop
                  </Button>
                </div>
              </div>
            </Reveal>
            <div className="relative lg:col-span-5">
              <Reveal variant="sequence" delay={200}>
                <Photo src={images.whiskyShelf} alt="Whisky bottles on the bar shelves" className="aspect-[3/4] w-full" />
              </Reveal>
              <Reveal delay={400} className="absolute -bottom-10 -left-6 w-[62%] md:-left-16">
                <LabelPlate className="velvet p-8">
                  <figure>
                    <span aria-hidden className="display metal text-5xl leading-none">
                      &ldquo;
                    </span>
                    <blockquote className="editorial -mt-2 text-xl leading-snug text-cream/90">
                      It has held the Guinness World Record for the world&rsquo;s largest commercial selection of whiskies — for 30 years.
                    </blockquote>
                    <figcaption className="eyebrow mt-5 text-[0.58rem] text-gold-light">Forbes · January 2026</figcaption>
                  </figure>
                </LabelPlate>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ——— STAY ——— */}
      <section className="rail-scope @container bg-linen py-28 md:py-36">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              eyebrow="Stay"
              title={<>Rooms &amp; Suites</>}
              lead="Around fifty rooms, no two alike — each renovated with care, each with the Engadin at the window."
            />
            <div className="flex shrink-0 items-center gap-6">
              <RailControls targetId="rooms-rail" label="Browse rooms and suites" />
              <Button href="/stay" variant="outline-dark">
                All rooms &amp; prices
              </Button>
            </div>
          </div>
        </div>
        <div id="rooms-rail" className={`rail mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 ${railGutter}`}>
          {rooms.map((r, i) => (
            <Reveal key={r.slug} delay={i * 80} className="w-[82vw] shrink-0 snap-start sm:w-[420px]">
              <Link href={`/stay/${r.slug}`} className="group block">
                <div className="relative">
                  <Photo src={r.image} alt={r.name} curtain="none" className="aspect-[4/5]" />
                  <Frame inset="0.75rem" corners="fleuron" draw="hover" className="surface-ink" />
                  <span className="caption absolute left-9 top-9 bg-linen/90 px-3 py-2 text-ink">{r.size}</span>
                </div>
                <div className="mt-6 flex items-start justify-between gap-4 border-b border-ink/15 pb-6">
                  <div>
                    <span className="caption block">No. {pad(i + 1)}</span>
                    <h3 className="display mt-2 text-xl tracking-[0.08em] transition-colors duration-(--dur-hover) group-hover:text-gold-ink">{r.name}</h3>
                    <p className="editorial mt-2 text-lg leading-snug text-ink/65">{r.short}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="eyebrow block text-[0.55rem] text-ink-muted">From</span>
                    <span className="display text-xl text-gold-ink">CHF {r.from}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <RailThread className={`mt-4 ${railGutterX}`} />
      </section>

      {/* ——— EAT & DRINK ——— */}
      <section className="velvet gilt-edge relative overflow-hidden py-28 text-cream md:py-36">
        <Engraving name="grapes" className="absolute -left-16 bottom-0 h-[600px] w-[420px] opacity-[0.08]" />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
          <SectionHeading
            tone="light"
            eyebrow="Eat & Drink"
            title="Candlelight, fondue & rare vintages"
            lead="Home-style cooking with a five-course dinner every evening, a natural Alpine cellar, and a lounge that glows as the lake goes dark."
          />
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              { t: "The Restaurant", s: "Châteaubriand from the grill with homemade Béarnaise, fondues, and a daily five-course menu.", img: images.dineCandle, href: "/dine" },
              { t: "Cave Waldhaus", s: `${figures.wines} wines and ${figures.bottlesInCellar} bottles from ${figures.countries} countries, resting in a natural Alpine cellar.`, img: images.cellarArch, href: "/whisky-wine#cave" },
              { t: "Lake View Lounge", s: "Coffee and afternoon tea by day; cocktails and conversation by night.", img: images.dineTable, href: "/dine#lounge" },
            ].map((c, i) => (
              <Reveal key={c.t} variant="sequence" delay={i * 160}>
                <Link href={c.href} className="img-zoom group relative block aspect-[3/4] overflow-hidden">
                  {/* the curtain lifts in the section's own burgundy */}
                  <div className="absolute inset-0">
                    <Photo src={c.img} alt={c.t} className="h-full w-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-burgundy/30 to-transparent" />
                  <Frame inset="0.75rem" corners="fleuron" draw="hover" />
                  <div data-seq="lead" className="absolute inset-x-0 bottom-0 p-8">
                    <span className="eyebrow text-[0.58rem] text-gold-light">0{i + 1}</span>
                    <h3 className="display mt-3 text-2xl">{c.t}</h3>
                    <p className="editorial mt-3 text-lg leading-snug text-cream/80">{c.s}</p>
                    <span className="eyebrow mt-5 inline-flex items-center gap-3 text-[0.6rem] text-gold-light">
                      Discover
                      <EngravedArrow />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SPA ——— */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
          <Reveal variant="sequence" className="order-2 lg:order-1">
            <span data-seq="eyebrow" className="eyebrow block text-gold-deep">
              Alpine Spa
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
              <Lines>Warmth after the mountain</Lines>
            </h2>
            <Ornament variant="short" className="mt-7" />
            <p data-seq="lead" className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
              Renovated in 2019: whirlpool, steam bath, sauna, adventure shower and infrared cabin. Reserved privately by the
              hour — never more than eight guests — and free of charge for everyone staying with us.
            </p>
            <dl data-seq="lead" style={at(1)} className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/15 pt-8">
              {[
                ["15–21h", "Open daily"],
                ["8", "Guests max."],
                ["Free", "For hotel guests"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="display text-2xl text-pine">{n}</dt>
                  <dd className="eyebrow mt-2 text-[0.55rem] text-ink-muted">{l}</dd>
                </div>
              ))}
            </dl>
            <div data-seq="actions" className="mt-10">
              <Button href="/spa" variant="dark">
                Explore the spa
              </Button>
            </div>
          </Reveal>
          {/* the collage opens plate by plate: sauna, then the right column */}
          <Reveal variant="sequence" delay={150} className="order-1 grid grid-cols-5 gap-4 lg:order-2">
            <Photo src={images.spaSauna} alt="The sauna" plate="III" className="col-span-3 aspect-[3/4]" />
            <div className="col-span-2 flex flex-col gap-4 pt-16">
              <Photo src={images.spaSteam} alt="Steam and stones" delay={200} className="aspect-[3/4]" />
              <Photo src={images.winter} alt="Winter in St. Moritz" delay={400} className="aspect-square" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— HERITAGE STRIP: the lake engraving is this view's hero ——— */}
      <section className="gilt-edge relative overflow-hidden bg-ink py-28 text-cream md:py-36">
        {/* a little wider than the section, so the drift never shows an edge */}
        <Engraving name="lake" fit="cover" align="bottom" highlight drift inkOpacity={0.18} className="absolute -left-[4%] bottom-0 h-[70%] w-[108%]" />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
          <SectionHeading tone="light" eyebrow="Heritage" title="Four generations of the lake" />
          <div className="mt-20 grid gap-px bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
            {timeline
              .filter((t) => ["1885", "1985", "1999", "2019"].includes(t.year))
              .map((t, i) => (
                <Reveal key={t.year} delay={i * 100} className="surface-ink bg-ink/90 p-10">
                  <span className="display metal text-6xl">{t.year}</span>
                  <p className="display mt-6 text-base tracking-[0.12em]">{t.title}</p>
                  <p className="editorial mt-3 text-lg leading-snug text-cream/65">{t.text}</p>
                </Reveal>
              ))}
          </div>
          <div className="mt-14 text-center">
            <Button href="/heritage" variant="outline-light">
              The full story
            </Button>
          </div>
        </div>
      </section>

      {/* ——— SEASONAL: the invitation (hidden once the season has passed) ——— */}
      {nye && (
        <section className="paper py-28">
          <div className="mx-auto max-w-[1320px] px-6 md:px-10">
            <Reveal variant="sequence" className="velvet relative grid overflow-hidden text-cream md:grid-cols-2">
              <Photo src={images.dineRomance} alt="Gala dinner table" className="aspect-[4/3] md:aspect-auto" />
              <div className="relative px-10 pb-10 pt-14 md:p-16">
                <div className="guilloche absolute inset-x-0 top-0 h-4" />
                <Guilloche variant="rosette" className="absolute -right-1/4 top-1/2 aspect-square w-[85%] -translate-y-1/2 text-gold-light opacity-[0.06]" />
                <Frame inset="calc(var(--frame-inset) + 1rem) var(--frame-inset) var(--frame-inset)" inner="dotted" corners="fleuron" draw="reveal" />
                <div className="relative">
                  {/* "Seasonal · 31 December", set as a label (ref 1): small caps against a foil numeral */}
                  <div data-seq="eyebrow" className="pb-1">
                    <span className="eyebrow block text-gold-light">Seasonal</span>
                    <p className="mt-5 flex items-baseline gap-4">
                      <span className="figure foil text-numeral-xl">31</span>
                      <span aria-hidden className="rule-accent h-px w-10 shrink-0" />
                      <span className="eyebrow text-gold-light">December</span>
                    </p>
                  </div>
                  <h3 data-seq="title" className="display mt-6 text-[clamp(2rem,3.5vw,3rem)]">
                    <Lines>New Year&rsquo;s Eve Gala</Lines>
                  </h3>
                  <Ornament className="mt-6" />
                  <p data-seq="lead" className="editorial mt-6 text-xl leading-relaxed text-cream/80">
                    A long, candlelit evening of caviar and white Alba truffle with the frozen lake outside the window. Open to hotel
                    guests and visitors alike — seats are limited.
                  </p>
                  <div data-seq="actions" className="mt-10">
                    <Button href="/contact?type=table">Reserve a table</Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ——— FINAL CTA: the ibex crests, then the lines rise, then the buttons ——— */}
      <section className="gilt-edge relative overflow-hidden bg-ink py-40 text-center text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.winterCouple} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/80" />
        <Reveal variant="sequence" className="relative mx-auto max-w-3xl px-6">
          <Engraving name="ibex" highlight detail="emblem" className="crest mx-auto h-40 w-32" />
          <div className="[--reveal-delay:calc(var(--dur-draw)*0.5)]">
            <h2 data-seq="title" className="display mt-8 text-[clamp(2.4rem,6vw,5rem)]">
              <Lines>
                Your window <br />
                on the lake awaits
              </Lines>
            </h2>
            <p data-seq="lead" className="editorial mx-auto mt-6 max-w-xl text-2xl text-cream/80">
              Book directly with the family for the best rate, a free station shuttle and our personal attention.
            </p>
            <div data-seq="actions" className="mt-12 flex flex-wrap justify-center gap-4">
              <Button href="/contact?type=room">Reserve your stay</Button>
              <Button href="/stay#package" variant="outline-light">
                The weekly package
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
