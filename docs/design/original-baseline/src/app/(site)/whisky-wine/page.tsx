import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, Photo, Seal, SectionHeading } from "@/components/ui";
import { figures, images } from "@/lib/site";

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

export default function WhiskyWinePage() {
  return (
    <>
      {/* Hero */}
      <section className="cloth relative flex min-h-[100svh] items-center overflow-hidden text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.whiskyWall} alt="" className="animate-slow-zoom absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/85 to-forest/40" />
        <Engraving name="thistle" className="absolute right-0 top-0 hidden h-full w-[45%] opacity-[0.18] lg:block" />
        <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-16 px-6 pb-20 pt-40 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <span className="eyebrow text-gold-light">Devil&rsquo;s Place · Est. in the Waldhaus</span>
            </Reveal>
            <Reveal delay={150}>
              <h1 className="display mt-8 text-[clamp(3rem,8vw,7.5rem)]">
                The world&rsquo;s <br />
                <span className="foil">largest</span> <br />
                whisky bar
              </h1>
            </Reveal>
            <Reveal delay={300}>
              <p className="editorial mt-8 max-w-xl text-[clamp(1.3rem,2vw,1.6rem)] leading-snug text-cream/85">
                {figures.whiskies} bottlings. Two Guinness World Records. Thirty years of pouring, collecting and telling stories
                at the edge of Lake St. Moritz.
              </p>
            </Reveal>
            <Reveal delay={450} className="mt-12 flex flex-wrap gap-4">
              <Button href="/contact?type=table">Reserve a seat at the bar</Button>
              <Button href="#shop" variant="outline-light">The whisky shop</Button>
            </Reveal>
          </div>
          <Reveal delay={300} className="flex justify-center lg:col-span-4">
            <div className="w-64 md:w-80">
              <Seal top="Guinness World Record" bottom="1996 · 1999 · Today" center="No. 1" sub="Whisky selection" spin />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <Photo src={images.whiskyGlass} alt="A dram of whisky" className="aspect-[4/5]" />
          </Reveal>
          <Reveal delay={150}>
            <span className="eyebrow text-gold-deep">Why &ldquo;Devil&rsquo;s Place&rdquo;?</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">Named for the devil, poured for the angels</h2>
            <Ornament className="mt-7" />
            <div className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
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
            <div className="mt-12 grid grid-cols-3 border-y border-ink/15">
              {[
                ["1,000", "Bottles · 1996"],
                [figures.whiskies, "Bottlings · 1999"],
                ["1878", "Oldest Macallan"],
              ].map(([n, l], i) => (
                <div key={l} className={`py-6 ${i ? "border-l border-ink/15 pl-5" : ""}`}>
                  <p className="display text-3xl text-gold-deep">{n}</p>
                  <p className="eyebrow mt-2 text-[0.55rem] text-ink/55">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Regions */}
      <section className="cloth relative overflow-hidden py-28 text-cream md:py-32">
        <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading tone="light" eyebrow="The collection" title="From Islay to the other side of the world" />
          <div className="mt-16 grid gap-px bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((r, i) => (
              <Reveal key={r.r} delay={i * 100} className="bg-forest p-10">
                <span className="display foil text-4xl">{String(i + 1).padStart(2, "0")}</span>
                <p className="display mt-6 text-xl tracking-[0.1em]">{r.r}</p>
                <p className="editorial mt-3 text-lg text-cream/65">{r.n}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cigar + Shop */}
      <section className="velvet py-28 text-cream md:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 md:px-10 lg:grid-cols-2">
          <Reveal>
            <article id="cigar" className="scroll-mt-28 border border-gold/30 p-3">
              <Photo src={images.whiskyPair} alt="Cigar lounge" className="aspect-[16/10]" />
              <div className="p-8 md:p-10">
                <span className="eyebrow text-gold-light">Cigar Lounge · 16:00 – 00:30</span>
                <h3 className="display mt-5 text-3xl">The walk-in humidor</h3>
                <p className="editorial mt-5 text-xl leading-relaxed text-cream/80">
                  Adjoining the bar, our Cigar Lounge keeps a very large selection in its walk-in humidor — choose at leisure,
                  then settle in with a dram.
                </p>
              </div>
            </article>
          </Reveal>
          <Reveal delay={150}>
            <article id="shop" className="scroll-mt-28 border border-gold/30 p-3">
              <Photo src={images.whiskyJapanese} alt="Whisky shop" className="aspect-[16/10]" />
              <div className="p-8 md:p-10">
                <span className="eyebrow text-gold-light">Whisky Shop · On request</span>
                <h3 className="display mt-5 text-3xl">Take a bottle home</h3>
                <p className="editorial mt-5 text-xl leading-relaxed text-cream/80">
                  More than a thousand whiskies available to buy directly, including our own bottlings. The shop opens on
                  request — or browse online with our partner World of Whisky.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href="/contact?type=whisky">Book a shop visit</Button>
                  <Button href="https://www.world-of-whisky.ch" variant="outline-light">World of Whisky</Button>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* Cave Waldhaus */}
      <section id="cave" className="paper relative scroll-mt-20 overflow-hidden py-28 md:py-36">
        <Engraving name="grapes" color="var(--color-wine)" className="absolute -right-20 top-10 h-[640px] w-[440px] opacity-[0.1]" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow text-claret">Cave Waldhaus · The wine cellar</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">A hidden gem in the Alpine rock</h2>
            <Ornament className="mt-7" />
            <p className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
              {figures.bottlesInCellar} bottles from more than twenty countries rest in our natural Alpine cellar. The wine list
              runs to over {figures.wines.replace("+", "")} labels — recognised repeatedly by Wine Spectator with the Grand Award
              and Best of Award of Excellence.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/15 pt-8">
              {[
                [figures.wines, "Wines listed"],
                [figures.bottlesInCellar, "Bottles"],
                [figures.countries, "Countries"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="display text-2xl text-claret">{n}</dt>
                  <dd className="eyebrow mt-2 text-[0.55rem] text-ink/55">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <Button href="/contact?type=table" variant="dark">Dine with a sommelier&rsquo;s pairing</Button>
            </div>
          </Reveal>
          <Reveal delay={150} className="grid grid-cols-2 gap-4 lg:col-span-7">
            <Photo src={images.cellarArch} alt="Arched wine cellar" className="row-span-2 aspect-[3/5]" />
            <Photo src={images.cellarRack} alt="Wine racks" className="aspect-square" />
            <Photo src={images.cellarBottles} alt="Wine bottles" className="aspect-square" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
