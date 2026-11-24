import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { EngravedArrow, Frame } from "@/components/craft";
import { Guilloche } from "@/components/guilloche";
import { Lockup } from "@/components/identity";
import { Lines } from "@/components/motion/lines";
import { Reveal } from "@/components/reveal";
import { Button, buttonClasses, Engraving, Ornament, PageHero, Photo, SectionHeading } from "@/components/ui";
import { chapters, hotel, hours, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Restaurant, Lounge & Terrace",
  description: "Home-style cooking on Lake St. Moritz: Châteaubriand, fondues and a daily five-course menu. Lake View Lounge, Terrace and private Stübli for celebrations.",
};

const menu = [
  { course: "I", dish: "Engadin air-dried beef", note: "Bündnerfleisch, mountain cheese, pickled chanterelles" },
  { course: "II", dish: "Consommé of the day", note: "Clear, slow and warming" },
  { course: "III", dish: "Salad from the market", note: "Alpine herbs, nut vinaigrette" },
  { course: "IV", dish: "Châteaubriand from the grill", note: "Homemade Sauce Béarnaise, seasonal vegetables" },
  { course: "V", dish: "Something sweet", note: "The pâtissier's changing creation" },
];

/* The terrace's "weather permitting" is set as a footnote under its hours, as on a printed card. */
const venues = [
  {
    id: "lounge",
    t: "Lake View Lounge",
    time: hours.find((h) => h.label === "Lake View Lounge")?.time,
    s: "By day: coffee, afternoon tea and sweet treats. By evening, a relaxed meeting place for cocktails as the lights come on across the water.",
    img: images.dineTable,
  },
  {
    id: "terrace",
    t: "The Waldhaus Terrace",
    time: "11:00 – 18:00",
    note: "weather permitting",
    s: "Sun, lake and mountain air. Lunch, a glass of Swiss white, or simply an hour doing nothing at all.",
    img: images.lakeFlowers,
  },
];

const chapter = chapters.find((c) => c.href === "/dine")?.numeral ?? "II";

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/* Dots on the medallion's inner ring, spaced to the leader rhythm and closing evenly at the seam. */
const MEDALLION_DOT_R = 45.5;
const MEDALLION_DOTS = 60;
const medallionDotGap = ((2 * Math.PI * MEDALLION_DOT_R) / MEDALLION_DOTS).toFixed(3);

/** The menu card's crest: a linen roundel (gold ring that draws, a ring of true dots) holding a vignette. */
function Medallion({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto h-32 w-32">
      <svg aria-hidden focusable="false" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r="49" style={{ fill: "var(--surface)" }} />
        <circle className="draw-ring" pathLength={1} cx="50" cy="50" r="49" fill="none" style={{ stroke: "var(--rule-accent)" }} strokeWidth="0.8" />
        <circle
          cx="50"
          cy="50"
          r={MEDALLION_DOT_R}
          fill="none"
          style={{ stroke: "var(--rule-strong)" }}
          strokeWidth="1.1"
          strokeDasharray={`0 ${medallionDotGap}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-[11%] overflow-hidden rounded-full">{children}</div>
    </div>
  );
}

export default function DinePage() {
  return (
    <>
      <PageHero
        chapter={chapter}
        eyebrow="Dine · Restaurant & Lounge"
        title={
          <>
            The table{" "}
            <span className="foil" data-sheen>
              by the lake
            </span>
          </>
        }
        lead="Honest, home-style cooking — the classics done properly, and a new five-course menu every evening."
        image={images.dineCandle}
        engraving="grapes"
        caption="The Restaurant"
      />

      {/* Restaurant (paper): the copy on the left, the menu card (the page's hero object) held beside it */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-start gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal variant="sequence">
              <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
                The Restaurant
              </span>
              <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">
                <Lines>Classics, done properly</Lines>
              </h2>
              <Ornament variant="short" className="mt-7" />
              <div data-seq="lead" className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
                <p>
                  Our kitchen is proudly home-style: a classic Châteaubriand from the grill with homemade Sauce Béarnaise, a
                  generous choice of fondues, and changing dishes from the chef.
                </p>
                <p>
                  Since 2019 a wider window front brings the lake right to your table. Hotel guests enjoy a five-course dinner
                  daily (four courses in the off-season) — and the same menu is open to visitors.
                </p>
              </div>
              <div data-seq="actions" className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button href="/contact?type=table" variant="dark">
                  Reserve a table
                </Button>
                <a href={hotel.phoneHref} className={`${buttonClasses("quiet-dark")} text-[0.66rem]`}>
                  <span className="link-underline pb-0.5">or call {hotel.phone}</span>
                  <EngravedArrow />
                </a>
              </div>
            </Reveal>

            {/* its own Reveal, so the curtain lifts when the plate itself arrives */}
            <Reveal variant="sequence" className="mt-16 pb-8">
              <Photo src={images.dineSetting} alt="Table setting" plate="I" className="aspect-[16/10]" />
            </Reveal>
          </div>

          {/* Menu card: linen stock, a triple rule (gold, fine gold, true dots) that draws, a guilloche head band */}
          <Reveal variant="sequence" delay={150} className="relative self-start bg-linen p-3 shadow-plate lg:sticky lg:top-28">
            <div className="relative px-8 py-14 text-center md:px-14">
              {/* outer rule gold/50 with fleurons; inner rule at --frame-gap retuned to gold/25 */}
              <Frame corners="fleuron" inner="solid" draw="reveal" style={{ "--rule": "var(--color-rule-gold)" } as CSSProperties} />
              {/* the innermost dotted rule: a second frame with no outer rule of its own, drawn a beat later */}
              <Frame
                inset="var(--frame-gap)"
                outer="none"
                corners="none"
                inner="dotted"
                draw="reveal"
                style={{ "--frame-at": "calc(var(--reveal-delay, 0ms) + var(--stagger) * 3)" } as CSSProperties}
              />
              <div
                aria-hidden
                className="absolute inset-x-[calc(var(--frame-gap)*3)] top-[calc(var(--frame-gap)*3)] h-28 text-gold-deep opacity-[0.12] [mask-image:linear-gradient(to_bottom,black_20%,transparent)]"
              >
                <Guilloche variant="wave" className="h-full w-full" />
              </div>

              <div data-seq="media">
                <Medallion>
                  <Engraving name="pine" color="var(--color-gold-deep)" detail="emblem" className="h-full w-full" />
                </Medallion>
              </div>
              <span data-seq="eyebrow" className="eyebrow mt-6 inline-block text-gold-deep">
                This evening
              </span>
              <h3 data-seq="title" className="display mt-4 text-3xl">
                <Lines>Five-course menu</Lines>
              </h3>
              <Ornament className="mx-auto mt-6" />

              {/* the courses arrive one at a time, 180ms apart (2 × --stagger), as the list itself comes into view */}
              <Reveal variant="sequence" className="mt-10">
                <ol className="space-y-8">
                  {menu.map((m, i) => (
                    <li key={m.course} data-seq="lead" style={at(i * 2)}>
                      <span className="inline-flex items-center gap-3">
                        <span aria-hidden className="rule-accent h-px w-5" />
                        <span className="display figure text-lg text-gold-ink">{m.course}</span>
                        <span aria-hidden className="rule-accent h-px w-5" />
                      </span>
                      <p className="display mt-2 text-lg tracking-[0.1em]">{m.dish}</p>
                      <p className="editorial mt-1 text-lg text-ink/60">{m.note}</p>
                    </li>
                  ))}
                </ol>
                <p data-seq="lead" style={at(menu.length * 2)} className="editorial mt-12 text-base text-ink-muted">
                  A sample menu — our chef changes it daily.
                </p>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stübli (velvet): the lockup names the rooms; the second plate floats forward as you scroll */}
      <section className="velvet gilt-edge relative overflow-hidden py-28 text-cream md:py-36">
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
          <Reveal variant="sequence" className="grid grid-cols-2 gap-4 pb-8">
            <Photo src={images.dineRomance} alt="Stüvetta" plate="II" className="aspect-[3/4]" />
            <div className="drift-y mt-16">
              <Photo src={images.cellarStone} alt="Fonduestübli" plate="III" delay={200} className="aspect-[3/4]" />
            </div>
          </Reveal>
          <Reveal variant="sequence" delay={150}>
            <span data-seq="eyebrow" className="inline-flex">
              <Lockup brand="stubli" layout="stacked" descriptor="Stüvetta & Fonduestübli" tone="light" />
            </span>
            <h2 data-seq="title" className="display mt-8 text-[clamp(2rem,4vw,3.2rem)]">
              <Lines>
                Small rooms, <br />
                big evenings
              </Lines>
            </h2>
            <Ornament variant="short" className="mt-7" />
            <p data-seq="lead" className="editorial mt-8 text-[1.35rem] leading-relaxed text-cream/80">
              Two intimate, wood-panelled Stübli — ideal for a family dinner, a birthday, a fondue with friends, or a focused
              seminar away from the office.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Lounge + Terrace (linen): each header is a leaders row, title · · · · hours */}
      <section className="bg-linen py-28 md:py-36">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading eyebrow="Day into night" title="Lounge & Terrace" lead="Where the day slows down — and the evening begins." />
          <div className="mt-20 grid gap-10 md:grid-cols-2">
            {venues.map((c, i) => (
              <Reveal key={c.id} variant="sequence" delay={i * 120}>
                <article id={c.id} className="@container scroll-mt-28">
                  <Photo src={c.img} alt={c.t} className="aspect-[4/3]" />
                  {/* a leaders row once the column is wide enough to hold it on one line; stacked below that */}
                  <div data-seq="lead" className="leaders mt-8 flex-col items-start gap-2 @xl:flex-row @xl:items-baseline @xl:gap-3">
                    <h3 className="display text-2xl">{c.t}</h3>
                    <span aria-hidden className="leaders-fill hidden @xl:block" />
                    <span className="flex shrink-0 flex-col items-start @xl:items-end">
                      <span className="eyebrow whitespace-nowrap text-[0.58rem] text-gold-deep">{c.time}</span>
                      {c.note && <span className="caption mt-2 text-ink-muted">{c.note}</span>}
                    </span>
                  </div>
                  <span aria-hidden className="perforation-x mt-5 block @xl:hidden" />
                  <p data-seq="lead" style={at(1)} className="editorial mt-5 text-xl leading-relaxed text-ink/75">
                    {c.s}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Events (cloth): the invitation, a framed printed object over the engraved lake */}
      <section id="events" className="cloth gilt-edge relative scroll-mt-20 overflow-hidden py-28 text-cream md:py-36">
        <Engraving name="lake" fit="cover" align="bottom" highlight inkOpacity={0.14} className="absolute inset-x-0 bottom-0 h-1/2 w-full" />
        <div className="relative mx-auto max-w-4xl px-6 md:px-10">
          <Reveal variant="sequence" className="relative px-6 py-16 text-center sm:px-12 md:px-16 md:py-20">
            <Frame inner="dotted" corners="fleuron" draw="reveal" />
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-light">
              Weddings · Banquets · Celebrations
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2.2rem,5vw,4.2rem)]">
              <Lines>Celebrate with the lake as your witness</Lines>
            </h2>
            <Ornament className="mx-auto mt-7" />
            <p data-seq="lead" className="editorial mx-auto mt-8 max-w-2xl text-[1.4rem] leading-relaxed text-cream/80">
              Weddings and banquets framed by Lake St. Moritz and the Engadin peaks — each one planned individually with our
              family, from the first aperitif to the last dram in Devil&rsquo;s Place.
            </p>
            <div data-seq="actions" className="mt-12">
              <Button href="/contact?type=event">Plan your event</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
