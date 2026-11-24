import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, Ornament, PageHero, Photo, SectionHeading } from "@/components/ui";
import { hours, images } from "@/lib/site";

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

export default function DinePage() {
  return (
    <>
      <PageHero
        eyebrow="Dine · Restaurant & Lounge"
        title={<>The table <span className="foil">by the lake</span></>}
        lead="Honest, home-style cooking — the classics done properly, and a new five-course menu every evening."
        image={images.dineCandle}
        engraving="grapes"
      />

      {/* Restaurant */}
      <section className="paper py-28 md:py-36">
        <div className="mx-auto grid max-w-[1320px] items-start gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <span className="eyebrow text-gold-deep">The Restaurant</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)]">Classics, done properly</h2>
            <Ornament className="mt-7" />
            <div className="editorial mt-8 space-y-5 text-[1.35rem] leading-relaxed text-ink/80">
              <p>
                Our kitchen is proudly home-style: a classic Châteaubriand from the grill with homemade Sauce Béarnaise, a
                generous choice of fondues, and changing dishes from the chef.
              </p>
              <p>
                Since 2019 a wider window front brings the lake right to your table. Hotel guests enjoy a five-course dinner
                daily (four courses in the off-season) — and the same menu is open to visitors.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contact?type=table" variant="dark">Reserve a table</Button>
              <a href="tel:+41818366000" className="eyebrow inline-flex items-center px-2 text-[0.66rem] text-gold-deep link-underline">
                or call +41 81 836 60 00
              </a>
            </div>
            <Photo src={images.dineSetting} alt="Table setting" className="mt-16 aspect-[16/10]" />
          </Reveal>

          {/* Menu card */}
          <Reveal delay={150} className="relative bg-linen p-3 shadow-[0_30px_80px_-30px_rgba(10,28,23,0.35)]">
            <div className="relative border border-gold/50 px-8 py-14 text-center md:px-14">
              <div className="absolute inset-2 border border-gold/25" />
              <Engraving name="pine" color="var(--color-gold-deep)" className="mx-auto h-24 w-24" />
              <span className="eyebrow mt-6 block text-gold-deep">This evening</span>
              <h3 className="display mt-4 text-3xl">Five-course menu</h3>
              <Ornament className="mx-auto mt-6" />
              <ol className="mt-10 space-y-8">
                {menu.map((m) => (
                  <li key={m.course}>
                    <span className="display foil text-lg">{m.course}</span>
                    <p className="display mt-2 text-lg tracking-[0.1em]">{m.dish}</p>
                    <p className="editorial mt-1 text-lg text-ink/60">{m.note}</p>
                  </li>
                ))}
              </ol>
              <p className="editorial mt-12 text-base text-ink/50">A sample menu — our chef changes it daily.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stübli */}
      <section className="velvet relative overflow-hidden py-28 text-cream md:py-36">
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
          <Reveal className="grid grid-cols-2 gap-4">
            <Photo src={images.dineRomance} alt="Stüvetta" className="aspect-[3/4]" />
            <Photo src={images.cellarStone} alt="Fonduestübli" className="mt-16 aspect-[3/4]" />
          </Reveal>
          <Reveal delay={150}>
            <span className="eyebrow text-gold-light">Stüvetta & Fonduestübli</span>
            <h2 className="display mt-6 text-[clamp(2rem,4vw,3.2rem)]">Small rooms, <br />big evenings</h2>
            <Ornament className="mt-7" />
            <p className="editorial mt-8 text-[1.35rem] leading-relaxed text-cream/80">
              Two intimate, wood-panelled Stübli — ideal for a family dinner, a birthday, a fondue with friends, or a focused
              seminar away from the office.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Lounge + Terrace */}
      <section className="bg-linen py-28 md:py-36">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading eyebrow="Day into night" title="Lounge & Terrace" lead="Where the day slows down — and the evening begins." />
          <div className="mt-20 grid gap-10 md:grid-cols-2">
            {[
              { id: "lounge", t: "Lake View Lounge", time: hours.find((h) => h.label === "Lake View Lounge")?.time, s: "By day: coffee, afternoon tea and sweet treats. By evening, a relaxed meeting place for cocktails as the lights come on across the water.", img: images.dineTable },
              { id: "terrace", t: "The Waldhaus Terrace", time: "11:00 – 18:00, weather permitting", s: "Sun, lake and mountain air. Lunch, a glass of Swiss white, or simply an hour doing nothing at all.", img: images.lakeFlowers },
            ].map((c, i) => (
              <Reveal key={c.id} delay={i * 120}>
                <article id={c.id} className="scroll-mt-28">
                  <Photo src={c.img} alt={c.t} className="aspect-[4/3]" />
                  <div className="mt-8 flex items-baseline justify-between gap-6 border-b border-ink/15 pb-5">
                    <h3 className="display text-2xl">{c.t}</h3>
                    <span className="eyebrow text-[0.58rem] text-gold-deep">{c.time}</span>
                  </div>
                  <p className="editorial mt-5 text-xl leading-relaxed text-ink/75">{c.s}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="cloth relative scroll-mt-20 overflow-hidden py-28 text-cream md:py-36">
        <Engraving name="lake" className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-[0.1]" style={{ maskSize: "cover", WebkitMaskSize: "cover" }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
          <Reveal>
            <span className="eyebrow text-gold-light">Weddings · Banquets · Celebrations</span>
            <h2 className="display mt-6 text-[clamp(2.2rem,5vw,4.2rem)]">Celebrate with the lake as your witness</h2>
            <Ornament className="mx-auto mt-7" />
            <p className="editorial mx-auto mt-8 max-w-2xl text-[1.4rem] leading-relaxed text-cream/80">
              Weddings and banquets framed by Lake St. Moritz and the Engadin peaks — each one planned individually with our
              family, from the first aperitif to the last dram in Devil&rsquo;s Place.
            </p>
            <div className="mt-12">
              <Button href="/contact?type=event">Plan your event</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
