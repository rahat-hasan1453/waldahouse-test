import Link from "next/link";
import Script from "next/script";
import type { CSSProperties } from "react";
import { AmbientVideo } from "@/components/ambient-video";
import { BookingBar } from "@/components/booking-bar";
import { HeroVideo } from "@/components/hero-video";
import { EngravedArrow, Frame, LabelPlate, Lozenge } from "@/components/craft";
import { Guilloche } from "@/components/guilloche";
import { Lockup } from "@/components/identity";
import { Counter } from "@/components/motion/counter";
import { Lines } from "@/components/motion/lines";
import { RailControls } from "@/components/rail-controls";
import { RoomGallery } from "@/components/room-gallery";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Photo, SectionHeading } from "@/components/ui";
import { Img } from "@/components/img";
import type { Vars } from "@/lib/i18n/dictionaries";
import { msg } from "@/lib/i18n/msg";
import { T } from "@/lib/i18n/provider";
import { figures, images, rooms, seasonal, timeline } from "@/lib/site";

/* The New Year's Eve card shows until seasonal.nye.until (a Zurich calendar day); the page regenerates daily. */
export const revalidate = 86400;

const zurichDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" });

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** Home-page copy, from the Blocks "home" module (English bundled, other languages loaded). */
const h = (k: string, vars?: Vars) => <T m="home" k={k} vars={vars} />;

/* the four promises: numerals here, words in home:usps.<i>.* */
const usps = ["I", "II", "III", "IV"];

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


export default function Home() {
  /* one calendar day for the whole render: the NYE card and the booking ticket agree */
  const today = zurichDay.format(new Date());
  const nye = today < seasonal.nye.until;

  return (
    <>
      {/* ——— HERO: a centred frontispiece over the film of the house on the lake (CSS intro, no Reveal) ——— */}
      <section id="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-cream">
        {/* the full drone flight around the house at half speed (3 min), streamed; a 2 s crossfade is baked in at the end, so the loop is seamless */}
        <HeroVideo
          sources={{ webm: "/video/hero-drone-full-1080.webm", mp4: "/video/hero-drone-full-1080.mp4", mobile: "/video/hero-drone-full-720.mp4" }}
          poster="/video/hero-drone-full-poster.jpg"
        />
        {/* the grade: an even veil, a darker centre behind the type, and the header and ticket edges */}
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_52%_at_50%_46%,color-mix(in_srgb,var(--color-ink)_62%,transparent),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 to-transparent" />

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center px-6 pb-8 pt-32 md:px-10 md:pb-10 [@media(max-height:820px)]:pt-26">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {/* the house logo, fitted inside a 200×200 box (it is wider than tall, so 200 × 121) */}
            <Img
              src="/brand/waldhaus-logo.png"
              alt={msg("home", "hero.logoAlt")}
              width={839}
              height={507}
              className="intro-eyebrow mb-8 h-auto max-h-[200px] w-[200px] object-contain [@media(max-height:820px)]:mb-5"
            />
            {/* tracked caps carry trailing space; the left pad re-centres them optically */}
            <span className="eyebrow intro-eyebrow flex items-center gap-4 text-gold-light">
              <span aria-hidden className="hidden h-px w-10 bg-gold-light/70 sm:block" />
              <span className="pl-[0.38em]">{h("hero.location")}</span>
              <span aria-hidden className="hidden h-px w-10 bg-gold-light/70 sm:block" />
            </span>
            <h1 className="display mt-8 pl-[0.06em] text-[clamp(2.75rem,7.6vw,7.25rem)] [@media(max-height:820px)]:mt-6">
              <Lines mode="intro">
                {h("hero.titleA")}
                <br />
                <span className="foil" data-sheen>
                  {h("hero.titleFoil")}
                </span>
              </Lines>
            </h1>
          </div>

          {/* the ticket, docked bottom centre */}
          <div className="intro-bar relative mt-12 w-full max-w-[1120px] [@media(max-height:820px)]:mt-8">
            <BookingBar today={today} />
          </div>
        </div>
      </section>

      {/* ——— USP RIBBON ——— */}
      <section className="paper border-b border-ink/10">
        <Reveal variant="sequence" className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
          {usps.map((numeral, i) => (
            <div key={numeral} className="relative px-6 py-12 text-center md:px-10" style={at(i * 1.5)}>
              <div data-seq="title">
                <span className="display metal text-3xl">{numeral}</span>
                <p className="display mt-4 text-[0.95rem] tracking-[0.12em]">{h(`usps.${i}.title`)}</p>
                <p className="editorial mt-3 text-lg leading-snug text-ink/65">{h(`usps.${i}.text`)}</p>
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
              <Photo src={images.welcomeAutumn} alt={msg("home", "welcome.photoAlt")} curtain="up" className="push-in aspect-[4/5] w-full" />
              {/* Pl. II runs up the left margin, beneath the house marginalia; clear of the mounted inset */}
              <figcaption
                data-seq="lead"
                className="absolute bottom-0 hidden rotate-180 items-center gap-3 [writing-mode:vertical-rl] md:-left-8 md:flex"
              >
                <span className="caption">{h("welcome.plate")}</span>
                <span aria-hidden className="h-8 w-px bg-rule-ink" />
              </figcaption>
            </figure>
            {/* the mounted inset floats forward over the still main plate */}
            <div className="drift-y absolute -bottom-12 right-0 w-[48%]">
              <Photo src={images.balconyLake} alt={msg("home", "welcome.insetAlt")} mount delay={250} className="aspect-[3/4]" />
            </div>
            <span data-seq="eyebrow" className="eyebrow absolute -left-2 top-8 origin-top-left -rotate-90 text-gold-deep md:-left-8">
              {h("welcome.margin")}
            </span>
          </Reveal>

          <Reveal variant="sequence" delay={150}>
            <span data-seq="eyebrow" className="eyebrow block text-gold-deep">
              {h("welcome.eyebrow")}
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.8rem)]">
              <Lines>
                {h("welcome.titleA")} <br />
                {h("welcome.titleB")}
              </Lines>
            </h2>
            <div data-seq="lead" className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
              <p className="initial">{h("welcome.p1")}</p>
              <p>{h("welcome.p2")}</p>
            </div>
            <div data-seq="actions" className="mt-10 flex flex-wrap items-center gap-8">
              <Button href="/heritage" variant="outline-dark">
                {h("welcome.story")}
              </Button>
              <span className="flex items-center gap-4">
                <span className="editorial text-2xl text-gold-deep">{h("welcome.signature")}</span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— DEVIL'S PLACE: the hero asset, the page's single richest view ——— */}
      <section className="cloth gilt-edge @container relative overflow-clip py-28 text-cream md:py-40">
        <Engraving
          name="pomegranate"
          color="var(--color-gold-light)"
          highlight
          drift
          inkOpacity={0.2}
          highlightOpacity={0.5}
          className="absolute -right-4 bottom-10 h-[560px] w-[376px]"
        />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <Reveal variant="sequence" className="lg:col-span-7">
              <div data-seq="eyebrow">
                <Lockup brand="devils" layout="horizontal" tone="light" />
              </div>
              {/* the numeral counts once, set on the text's left edge and sized to fit its column */}
              <p className="display mt-8 text-[clamp(6rem,16vw,15rem)] leading-[0.85] tracking-[0.02em]">
                <Counter
                  value="2,500"
                  sheen
                  className="foil foil-emboss ml-[-0.04em]"
                />
              </p>
              {/* the heading waits for the count to land */}
              <div className="[--reveal-delay:calc(var(--dur-count)*0.4)] motion-reduce:[--reveal-delay:0ms]">
                <h2 data-seq="title" className="display mt-4 text-[clamp(1.6rem,3.4vw,2.9rem)]">
                  <Lines>
                    {h("devils.titleA")}
                    <br />
                    <span className="text-gold-light">{h("devils.titleB")}</span>
                  </Lines>
                </h2>
                <p data-seq="lead" className="editorial mt-8 max-w-2xl text-[1.4rem] leading-relaxed text-cream/80">
                  {h("devils.lead")}
                </p>
                <div data-seq="lead" style={at(1)} className="mt-12 max-w-2xl">
                  <div className="grid grid-cols-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={`py-6 ${i > 0 ? "border-l border-gold/25 pl-6" : ""}`}>
                        <p className="display text-3xl text-gold-light">{h(`devils.stats.${i}.value`)}</p>
                        <p className="eyebrow mt-2 text-[0.55rem] text-cream-muted">{h(`devils.stats.${i}.label`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div data-seq="actions" className="mt-12 flex flex-wrap gap-4">
                  <Button href="/whisky-wine">{h("devils.enter")}</Button>
                  <Button href="#" variant="outline-light">
                    {h("devils.shop")}
                  </Button>
                </div>
              </div>
            </Reveal>
            <div className="relative lg:col-span-5">
              <Reveal variant="sequence" delay={200}>
                <AmbientVideo src={["/video/devils-place.mp4", "/video/devils-place-2.mp4"]} className="aspect-[3/4] w-full" />
              </Reveal>
              {/* spans the whole film plus a little each side, and rides up over the film's lower edge.
                  In flow (not absolute), so it always meets the film whatever the column height.
                  The right overhang shrinks where the page gutter is only 40px. */}
              <Reveal delay={400} className="relative z-10 -mx-3 -mt-16 md:-mx-6 md:-mt-24 lg:-mt-28 lg:-mr-5 lg:-ml-10 2xl:-mr-10">
                <LabelPlate className="velvet p-8">
                  <figure>
                    <span aria-hidden className="display metal text-5xl leading-none">
                      &ldquo;
                    </span>
                    <blockquote className="editorial -mt-2 text-xl leading-snug text-cream/90">{h("devils.quote")}</blockquote>
                    <figcaption className="eyebrow mt-5 text-[0.58rem] text-gold-light">{h("devils.quoteSource")}</figcaption>
                  </figure>
                </LabelPlate>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ——— STAY ——— */}
      <section className="@container bg-linen py-28 md:py-36">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              ornament="none"
              eyebrow={h("stay.eyebrow")}
              title={h("stay.title")}
              lead={h("stay.lead")}
            />
            <div className="flex shrink-0 items-center gap-6">
              <RailControls targetId="rooms-rail" label={msg("home", "stay.browse")} />
              <Button href="/stay" variant="outline-dark">
                {h("stay.all")}
              </Button>
            </div>
          </div>
        </div>
        <RoomGallery id="rooms-rail" rooms={rooms.map(({ slug, name, short, from, size, image }) => ({ slug, name, short, from, size, image }))} />
      </section>

      {/* ——— EAT & DRINK ——— */}
      <section className="velvet gilt-edge relative overflow-hidden py-28 text-cream md:py-36">
        <Engraving name="grapes" className="absolute -left-16 bottom-0 h-[600px] w-[420px] opacity-[0.08]" />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
          <SectionHeading
            tone="light"
            eyebrow={h("dine.eyebrow")}
            title={h("dine.title")}
            lead={h("dine.lead")}
          />
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              { k: "dine.restaurant", img: images.dineCandle, href: "/dine" },
              { k: "dine.cave", vars: { wines: figures.wines, bottles: figures.bottlesInCellar, countries: figures.countries }, img: images.cellarArch, href: "/whisky-wine#cave" },
              { k: "dine.lounge", img: images.loungePiano, href: "/dine#lounge" },
            ].map((c, i) => (
              <Reveal key={c.k} variant="sequence" delay={i * 160}>
                <Link href={c.href} className="img-zoom group relative block aspect-[3/4] overflow-hidden">
                  {/* the curtain lifts in the section's own burgundy */}
                  <div className="absolute inset-0">
                    <Photo src={c.img} alt={msg("home", `${c.k}.title`)} className="h-full w-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-burgundy/30 to-transparent" />
                  <Frame inset="0.75rem" corners="none" draw="hover" />
                  <div data-seq="lead" className="absolute inset-x-0 bottom-0 p-8">
                    <span className="eyebrow text-[0.58rem] text-gold-light">0{i + 1}</span>
                    <h3 className="display mt-3 text-2xl">{h(`${c.k}.title`)}</h3>
                    <p className="editorial mt-3 text-lg leading-snug text-cream/80">{h(`${c.k}.text`, c.vars)}</p>
                    <span className="eyebrow mt-5 inline-flex items-center gap-3 text-[0.6rem] text-gold-light">
                      {h("dine.discover")}
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
              {h("spa.eyebrow")}
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
              <Lines>{h("spa.title")}</Lines>
            </h2>
            <p data-seq="lead" className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
              {h("spa.lead")}
            </p>
            <dl data-seq="lead" style={at(1)} className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/15 pt-8">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <dt className="display text-2xl text-pine">{h(`spa.stats.${i}.value`)}</dt>
                  <dd className="eyebrow mt-2 text-[0.55rem] text-ink-muted">{h(`spa.stats.${i}.label`)}</dd>
                </div>
              ))}
            </dl>
            <div data-seq="actions" className="mt-10">
              <Button href="/spa" variant="dark">
                {h("spa.cta")}
              </Button>
            </div>
          </Reveal>
          {/* the collage opens plate by plate: sauna, then the right column */}
          <Reveal variant="sequence" delay={150} className="order-1 grid grid-cols-5 gap-4 lg:order-2">
            <Photo src={images.spaWhirlpool} alt={msg("home", "spa.altSauna")} plate="III" className="col-span-3 aspect-[3/4]" />
            <div className="col-span-2 flex flex-col gap-4 pt-16">
              <Photo src={images.spaSteamBath} alt={msg("home", "spa.altSteam")} delay={200} className="aspect-[3/4]" />
              <Photo src={images.winterSunLake} alt={msg("home", "spa.altWinter")} delay={400} className="aspect-square" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— HERITAGE STRIP: the lake engraving is this view's hero ——— */}
      <section className="gilt-edge relative overflow-hidden bg-ink py-28 text-cream md:py-36">
        {/* a little wider than the section, so the drift never shows an edge */}
        <Engraving name="lake" fit="cover" align="bottom" highlight drift waterline={false} inkOpacity={0.18} className="absolute -left-[4%] bottom-0 h-[70%] w-[108%]" />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
          <SectionHeading tone="light" eyebrow={h("heritage.eyebrow")} title={h("heritage.title")} ornament="none" />
          <div className="mt-20 grid gap-px bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
            {timeline
              .filter((t) => ["1885", "1985", "1999", "2019"].includes(t.year))
              .map((t, i) => (
                <Reveal key={t.year} delay={i * 100} className="surface-ink bg-ink/90 p-10">
                  <span className="display metal text-6xl">{t.year}</span>
                  <p className="display mt-6 text-base tracking-[0.12em]">
                    <T m="common" k={`timeline.${t.year}.title`} />
                  </p>
                  <p className="editorial mt-3 text-lg leading-snug text-cream/65">
                    <T m="common" k={`timeline.${t.year}.text`} />
                  </p>
                </Reveal>
              ))}
          </div>
          <div className="mt-14 text-center">
            <Button href="/heritage" variant="outline-light">
              {h("heritage.cta")}
            </Button>
          </div>
        </div>
      </section>

      {/* ——— SEASONAL: the invitation (hidden once the season has passed) ——— */}
      {nye && (
        <section className="paper py-28">
          <div className="mx-auto max-w-[1320px] px-6 md:px-10">
            <Reveal variant="sequence" className="velvet relative grid overflow-hidden text-cream md:grid-cols-2">
              <Photo src={images.dineRomance} alt={msg("home", "nye.alt")} className="aspect-[4/3] md:aspect-auto" />
              <div className="relative px-10 pb-10 pt-14 md:p-16">
                <div className="guilloche absolute inset-x-0 top-0 h-4" />
                <Guilloche variant="rosette" className="absolute -right-1/4 top-1/2 aspect-square w-[85%] -translate-y-1/2 text-gold-light opacity-[0.06]" />
                <Frame inset="calc(var(--frame-inset) + 1rem) var(--frame-inset) var(--frame-inset)" inner="dotted" corners="none" draw="reveal" />
                <div className="relative">
                  {/* "Seasonal · 31 December", set as a label (ref 1): small caps against a foil numeral */}
                  <div data-seq="eyebrow" className="pb-1">
                    <span className="eyebrow block text-gold-light">{h("nye.eyebrow")}</span>
                    <p className="mt-5 flex items-baseline gap-4">
                      <span className="figure foil text-numeral-xl">{h("nye.day")}</span>
                      <span aria-hidden className="rule-accent h-px w-10 shrink-0" />
                      <span className="eyebrow text-gold-light">{h("nye.month")}</span>
                    </p>
                  </div>
                  <h3 data-seq="title" className="display mt-6 text-[clamp(2rem,3.5vw,3rem)]">
                    <Lines>{h("nye.title")}</Lines>
                  </h3>
                  <p data-seq="lead" className="editorial mt-6 text-xl leading-relaxed text-cream/80">
                    {h("nye.lead")}
                  </p>
                  <div data-seq="actions" className="mt-10">
                    <Button href="#">{h("nye.cta")}</Button>
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
        <img src={images.lakeDusk} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/80" />
        <Reveal variant="sequence" className="relative mx-auto max-w-3xl px-6">
          <Engraving name="ibex" highlight detail="emblem" className="crest mx-auto h-40 w-32" />
          <div className="[--reveal-delay:calc(var(--dur-draw)*0.5)]">
            <h2 data-seq="title" className="display mt-8 text-[clamp(2.4rem,6vw,5rem)]">
              <Lines>
                {h("final.titleA")} <br />
                {h("final.titleB")}
              </Lines>
            </h2>
            <p data-seq="lead" className="editorial mx-auto mt-6 max-w-xl text-2xl text-cream/80">
              {h("final.lead")}
            </p>
            <div data-seq="actions" className="mt-12 flex flex-wrap justify-center gap-4">
              <Button href="#">{h("final.reserve")}</Button>
              <Button href="/stay#package" variant="outline-light">
                {h("final.package")}
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SELISE Blocks chat widget (home page only), loaded when the browser is idle */}
      <Script
        src="https://gpt2.seliseblocks.com/embed.js"
        data-widget-id="bbb1c26addd14870919d5974ccab5ed8"
        data-project-key="D131af0901e624699947cc659557b247a"
        strategy="lazyOnload"
      />
    </>
  );
}
