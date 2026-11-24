import Link from "next/link";
import { BookingBar } from "@/components/booking-bar";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, Photo, Seal, SectionHeading } from "@/components/ui";
import { figures, images, rooms, timeline } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* ——— HERO ——— */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.heroLake} alt="Lake St. Moritz with the Engadin mountains" className="animate-slow-zoom absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 pb-10 pt-40 md:px-10">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal>
                <span className="eyebrow flex items-center gap-4 text-gold-light">
                  <span className="h-px w-12 bg-gold-light/70" /> St. Moritz · Engadin · Switzerland
                </span>
              </Reveal>
              <Reveal delay={150}>
                <h1 className="display mt-8 text-[clamp(3rem,9vw,8.5rem)]">
                  On the lake.
                  <br />
                  <span className="foil">Since 1885.</span>
                </h1>
              </Reveal>
              <Reveal delay={300}>
                <p className="editorial mt-8 max-w-xl text-[clamp(1.3rem,2vw,1.7rem)] leading-snug text-cream/85">
                  The only hotel directly on Lake St. Moritz — a family house of stone pine, candlelight and the world&rsquo;s
                  largest whisky collection.
                </p>
              </Reveal>
            </div>
            <Reveal delay={450} className="hidden justify-end lg:col-span-4 lg:flex">
              <Link href="/whisky-wine" className="block w-48 transition-transform duration-700 hover:scale-105" aria-label="Devil's Place whisky bar">
                <Seal top="Guinness World Record" bottom="Devil's Place · Since 1999" center={figures.whiskies} sub="Whiskies" spin />
              </Link>
            </Reveal>
          </div>
          <Reveal delay={600} className="mt-14">
            <BookingBar />
          </Reveal>
        </div>
      </section>

      {/* ——— USP RIBBON ——— */}
      <section className="paper border-b border-ink/10">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
          {[
            { k: "I", t: "Directly on the lake", s: "The only hotel on the shore, with an unobstructed view towards Maloja." },
            { k: "II", t: "5 minutes from the station", s: "A quiet setting — yet a short walk, or free shuttle, from the train." },
            { k: "III", t: "Best 3-Star Hotel", s: "Switzerland's best in its class — honoured multiple times." },
            { k: "IV", t: "Open 365 days", s: "Winter and summer, every single day of the year." },
          ].map((u, i) => (
            <Reveal key={u.k} delay={i * 100} className="border-ink/10 px-6 py-12 text-center md:px-10 [&:not(:last-child)]:border-r">
              <span className="display foil text-3xl">{u.k}</span>
              <p className="display mt-4 text-[0.95rem] tracking-[0.12em]">{u.t}</p>
              <p className="editorial mt-3 text-lg leading-snug text-ink/65">{u.s}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— WELCOME ——— */}
      <section className="paper relative overflow-hidden py-28 md:py-40">
        <Engraving name="pine" color="var(--color-pine)" className="absolute -left-24 top-10 h-[420px] w-[420px] opacity-[0.12]" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative">
            <Photo src={images.lakeSummer} alt="Summer on Lake St. Moritz" className="aspect-[4/5] w-[85%]" />
            <div className="absolute -bottom-12 right-0 w-[48%] border-[10px] border-cream shadow-2xl">
              <Photo src={images.roomView} alt="A lake-view room" className="aspect-[3/4]" />
            </div>
            <span className="eyebrow absolute -left-2 top-8 origin-top-left -rotate-90 text-gold-deep md:-left-8">Est. 1885 · Via Dim Lej 6</span>
          </Reveal>
          <Reveal delay={150}>
            <span className="eyebrow text-gold-deep">Welcome to the Waldhaus</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.8rem)]">
              A house with <br />its own character
            </h2>
            <Ornament className="mt-7" />
            <div className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
              <p>
                For more than a century the Waldhaus has stood where the forest meets the water. In 1985 Claudio Bernasconi
                made it his life&rsquo;s work; today his son Sandro welcomes guests with the same warmth — and the same
                stubborn devotion to doing things properly.
              </p>
              <p>
                Every one of our rooms is different: in layout, in orientation, in style. What they share is the Engadin — warm
                stone pine, crisp mountain air, and that view.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Button href="/heritage" variant="outline-dark">Our story</Button>
              <span className="editorial text-2xl text-gold-deep">— Sandro Bernasconi, Host</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— DEVIL'S PLACE — the hero asset ——— */}
      <section className="cloth relative overflow-hidden py-28 text-cream md:py-40">
        <Engraving name="thistle" className="absolute -right-20 top-1/2 h-[900px] w-[600px] -translate-y-1/2 opacity-[0.09]" />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="eyebrow text-gold-light">Devil&rsquo;s Place · Whisky Bar</span>
              </Reveal>
              <Reveal delay={100}>
                <p className="display foil mt-8 text-[clamp(6rem,19vw,17rem)] leading-[0.85] tracking-[0.02em]">2,500</p>
              </Reveal>
              <Reveal delay={200}>
                <h2 className="display mt-4 text-[clamp(1.6rem,3.4vw,2.9rem)]">
                  whiskies under one roof.
                  <br />
                  <span className="text-gold-light">A world record since 1999.</span>
                </h2>
              </Reveal>
              <Reveal delay={300}>
                <p className="editorial mt-8 max-w-2xl text-[1.4rem] leading-relaxed text-cream/80">
                  From an honest Johnnie Walker to a Macallan 1878; from Islay to Sri Lanka, Uruguay, Japan and New Zealand.
                  The name? The church once demonised all distilled water — so we named the bar after the devil himself.
                </p>
              </Reveal>
              <Reveal delay={400}>
                <div className="mt-12 grid max-w-2xl grid-cols-3 border-y border-gold/25">
                  {[
                    { n: "1996", l: "First Guinness entry" },
                    { n: "30", l: "Years holding the record" },
                    { n: "16:00", l: "Doors open daily" },
                  ].map((s, i) => (
                    <div key={s.l} className={`py-6 ${i > 0 ? "border-l border-gold/25 pl-6" : ""}`}>
                      <p className="display text-3xl text-gold-light">{s.n}</p>
                      <p className="eyebrow mt-2 text-[0.55rem] text-cream/60">{s.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={500} className="mt-12 flex flex-wrap gap-4">
                <Button href="/whisky-wine">Enter Devil&rsquo;s Place</Button>
                <Button href="/contact?type=whisky" variant="outline-light">Visit the whisky shop</Button>
              </Reveal>
            </div>
            <div className="relative lg:col-span-5">
              <Reveal delay={200}>
                <Photo src={images.whiskyShelf} alt="Whisky bottles on the bar shelves" className="aspect-[3/4] w-full" />
              </Reveal>
              <Reveal delay={400} className="absolute -bottom-10 -left-6 w-[62%] md:-left-16">
                <figure className="velvet border border-gold/30 p-8">
                  <span className="display foil text-5xl leading-none">&ldquo;</span>
                  <blockquote className="editorial -mt-2 text-xl leading-snug text-cream/90">
                    It has held the Guinness World Record for the world&rsquo;s largest commercial selection of whiskies — for 30 years.
                  </blockquote>
                  <figcaption className="eyebrow mt-5 text-[0.58rem] text-gold-light">Forbes · January 2026</figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ——— STAY ——— */}
      <section className="bg-linen py-28 md:py-36">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              eyebrow="Stay"
              title={<>Rooms &amp; Suites</>}
              lead="Around fifty rooms, no two alike — each renovated with care, each with the Engadin at the window."
            />
            <Button href="/stay" variant="outline-dark" className="shrink-0">All rooms &amp; prices</Button>
          </div>
        </div>
        <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:thin] md:px-10 xl:px-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]">
          {rooms.map((r, i) => (
            <Reveal key={r.slug} delay={i * 80} className="w-[82vw] shrink-0 snap-start sm:w-[420px]">
              <Link href={`/stay/${r.slug}`} className="group block">
                <div className="relative">
                  <Photo src={r.image} alt={r.name} className="aspect-[4/5]" />
                  <span className="eyebrow absolute left-5 top-5 bg-linen/90 px-3 py-2 text-[0.55rem] text-ink">{r.size}</span>
                </div>
                <div className="mt-6 flex items-start justify-between gap-4 border-b border-ink/15 pb-6">
                  <div>
                    <h3 className="display text-xl tracking-[0.08em] transition-colors group-hover:text-gold-deep">{r.name}</h3>
                    <p className="editorial mt-2 text-lg leading-snug text-ink/65">{r.short}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="eyebrow block text-[0.55rem] text-ink/50">From</span>
                    <span className="display text-xl text-gold-deep">CHF {r.from}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— EAT & DRINK ——— */}
      <section className="velvet relative overflow-hidden py-28 text-cream md:py-36">
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
              <Reveal key={c.t} delay={i * 120}>
                <Link href={c.href} className="img-zoom group relative block aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.t} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-burgundy/30 to-transparent" />
                  <div className="absolute inset-3 border border-gold/0 transition-all duration-700 group-hover:border-gold/50" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <span className="eyebrow text-[0.58rem] text-gold-light">0{i + 1}</span>
                    <h3 className="display mt-3 text-2xl">{c.t}</h3>
                    <p className="editorial mt-3 text-lg leading-snug text-cream/80">{c.s}</p>
                    <span className="eyebrow mt-5 inline-block text-[0.6rem] text-gold-light">Discover →</span>
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
          <Reveal className="order-2 lg:order-1">
            <span className="eyebrow text-gold-deep">Alpine Spa</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">Warmth after the mountain</h2>
            <Ornament className="mt-7" />
            <p className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
              Renovated in 2019: whirlpool, steam bath, sauna, adventure shower and infrared cabin. Reserved privately by the
              hour — never more than eight guests — and free of charge for everyone staying with us.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/15 pt-8">
              {[
                ["15–21h", "Open daily"],
                ["8", "Guests max."],
                ["Free", "For hotel guests"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="display text-2xl text-pine">{n}</dt>
                  <dd className="eyebrow mt-2 text-[0.55rem] text-ink/55">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <Button href="/spa" variant="dark">Explore the spa</Button>
            </div>
          </Reveal>
          <Reveal delay={150} className="order-1 grid grid-cols-5 gap-4 lg:order-2">
            <Photo src={images.spaSauna} alt="The sauna" className="col-span-3 aspect-[3/4]" />
            <div className="col-span-2 flex flex-col gap-4 pt-16">
              <Photo src={images.spaSteam} alt="Steam and stones" className="aspect-[3/4]" />
              <Photo src={images.winter} alt="Winter in St. Moritz" className="aspect-square" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— HERITAGE STRIP ——— */}
      <section className="relative overflow-hidden bg-ink py-28 text-cream md:py-36">
        <Engraving name="lake" className="absolute inset-x-0 bottom-0 h-[70%] w-full opacity-[0.14]" style={{ maskSize: "cover", WebkitMaskSize: "cover", maskPosition: "bottom", WebkitMaskPosition: "bottom" }} />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
          <SectionHeading tone="light" eyebrow="Heritage" title="Four generations of the lake" />
          <div className="mt-20 grid gap-px bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.filter((t) => ["1885", "1985", "1999", "2019"].includes(t.year)).map((t, i) => (
              <Reveal key={t.year} delay={i * 100} className="bg-ink/90 p-10">
                <span className="display foil text-6xl">{t.year}</span>
                <p className="display mt-6 text-base tracking-[0.12em]">{t.title}</p>
                <p className="editorial mt-3 text-lg leading-snug text-cream/65">{t.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Button href="/heritage" variant="outline-light">The full story</Button>
          </div>
        </div>
      </section>

      {/* ——— SEASONAL ——— */}
      <section className="paper py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <Reveal className="velvet relative grid overflow-hidden text-cream md:grid-cols-2">
            <Photo src={images.dineRomance} alt="Gala dinner table" className="aspect-[4/3] md:aspect-auto" />
            <div className="relative p-10 md:p-16">
              <div className="guilloche absolute inset-x-0 top-0 h-4" />
              <span className="eyebrow text-gold-light">Seasonal · 31 December</span>
              <h3 className="display mt-6 text-[clamp(2rem,3.5vw,3rem)]">New Year&rsquo;s Eve Gala</h3>
              <Ornament className="mt-6" />
              <p className="editorial mt-6 text-xl leading-relaxed text-cream/80">
                A long, candlelit evening of caviar and white Alba truffle with the frozen lake outside the window. Open to hotel
                guests and visitors alike — seats are limited.
              </p>
              <div className="mt-10">
                <Button href="/contact?type=table">Reserve a table</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— FINAL CTA ——— */}
      <section className="relative overflow-hidden bg-ink py-40 text-center text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.winterCouple} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/80" />
        <Reveal className="relative mx-auto max-w-3xl px-6">
          <Engraving name="ibex" className="mx-auto h-40 w-32" />
          <h2 className="display mt-8 text-[clamp(2.4rem,6vw,5rem)]">Your window <br />on the lake awaits</h2>
          <p className="editorial mx-auto mt-6 max-w-xl text-2xl text-cream/80">
            Book directly with the family for the best rate, a free station shuttle and our personal attention.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button href="/contact?type=room">Reserve your stay</Button>
            <Button href="/stay#package" variant="outline-light">The weekly package</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
