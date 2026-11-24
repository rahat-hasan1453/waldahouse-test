import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Colossal, Lozenge } from "@/components/craft";
import { HoverPreview, PreviewImage } from "@/components/motion/hover-preview";
import { Lines } from "@/components/motion/lines";
import { Reveal } from "@/components/reveal";
import { Button, Engraving, PageHero, Photo, SectionHeading } from "@/components/ui";
import { msg } from "@/lib/i18n/msg";
import { T } from "@/lib/i18n/provider";
import { chapters, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Alpine Spa & Activities",
  description: "Private hourly spa sessions with whirlpool, steam bath, sauna and infrared cabin — free for hotel guests. Skiing, hiking, biking and the Engadin lakes on the doorstep.",
};

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart; .tempo-calm slows it). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

const chapter = chapters.find((c) => c.href === "/spa")?.numeral ?? "IV";

/** Spa-page copy, from the Blocks "spa" module. */
const sp = (k: string) => <T m="spa" k={k} />;

/* five facilities (spa:facilities.<i>.*) and three figures (spa:stats.<i>.*) */
const facilities = [0, 1, 2, 3, 4];
/* hover preview per facility, in list order: whirlpool, steam bath, sauna, adventure shower, infrared cabin */
const facilityImages = [images.spaWhirlpool, images.spaSteamBath, images.spaSaunaWood, images.spaAdventureShower, images.spaInfrared];
const stats = [0, 1, 2];

/* each season has four items: spa:activities.<id>.items.<i> */
const activities = [
  { id: "winter", img: images.winter },
  { id: "summer", img: images.lakeSummer },
];

export default function SpaPage() {
  return (
    /* the slowest page on the site: every reveal, line and stagger is retuned by .tempo-calm */
    <div className="tempo-calm">
      <PageHero
        chapter={chapter}
        eyebrow={sp("hero.eyebrow")}
        title={
          <>
            {sp("hero.titleA")}{" "}
            <span className="foil" data-sheen>
              {sp("hero.titleFoil")}
            </span>
          </>
        }
        lead={sp("hero.lead")}
        image={images.spaWhirlpoolPanorama}
        engraving="gentian"
      />

      {/* Private by design: an outlined 8, cropped by the page edge, keeps the promise in view */}
      <section className="paper relative overflow-clip py-28 md:py-36">
        <Colossal text="8" tone="outline" bleed="left" className="-left-[0.14em] top-10 md:top-20" />
        <p aria-hidden className="caption absolute left-4 top-24 hidden items-center gap-3 rotate-180 [writing-mode:vertical-rl] md:flex">
          <span className="rule-accent h-8 w-px shrink-0" />
          {sp("private.side")}
        </p>

        <div className="relative mx-auto grid max-w-[1320px] items-start gap-16 px-6 md:px-10 lg:grid-cols-12">
          <Reveal variant="sequence" className="lg:col-span-5">
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
              {sp("private.eyebrow")}
            </span>
            <h2 data-seq="title" className="display mt-6 text-[clamp(2rem,4vw,3.2rem)]">
              <Lines>{sp("private.title")}</Lines>
            </h2>
            <p data-seq="lead" className="editorial mt-8 text-[1.35rem] leading-relaxed text-ink/80">
              {sp("private.lead")}
            </p>

            {/* the cloth stat box: flat metal figures, perforated like the stubs of a ticket */}
            <div data-seq="lead" style={at(1)} className="cloth mt-10 p-8 text-cream">
              <div className="relative">
                <dl className="grid grid-cols-3 text-center">
                  {stats.map((i) => (
                    <div key={i} className="flex flex-col-reverse items-center px-1">
                      <dt className="eyebrow mt-2 text-[0.55rem] text-cream-muted">{sp(`stats.${i}.label`)}</dt>
                      <dd className="display figure metal text-2xl">{sp(`stats.${i}.value`)}</dd>
                    </div>
                  ))}
                </dl>
                <span aria-hidden className="perforation-y absolute inset-y-0 left-1/3 w-[3px] -translate-x-1/2" />
                <span aria-hidden className="perforation-y absolute inset-y-0 left-2/3 w-[3px] -translate-x-1/2" />
              </div>
            </div>

            <div data-seq="actions" className="mt-10">
              <Button href="#" variant="outline-dark">
                {sp("private.cta")}
              </Button>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            {/* the collage: plates reveal one after another; not links, so they never zoom */}
            <Reveal variant="sequence" className="grid grid-cols-2 gap-4">
              <Photo src={images.spaWhirlpool} alt={msg("spa", "private.altSauna")} plate="I" className="col-span-2 mb-7 aspect-[16/9]" />
              <Photo src={images.spaSaunaWood} alt={msg("spa", "private.altStones")} plate="II" delay={200} className="aspect-square" />
              <Photo src={images.spaRelax} alt={msg("spa", "private.altWood")} delay={400} className="aspect-square" />
            </Reveal>

            <HoverPreview className="mt-12">
            <Reveal as="ul" variant="sequence" className="divide-y divide-rule-ink border-y border-rule-ink">
              {facilities.map((i) => (
                <li key={i} data-seq="lead" data-preview={facilityImages[i]} style={at(i)}>
                  {/* padding lives on the inner row: the reveal sequence owns the li's transitions */}
                  <div className="preview-row flex items-baseline gap-6 py-6 [li[data-active]_&]:py-8">
                    <span className="flex items-baseline gap-6">
                      <span className="display figure text-xl text-gold-ink">{pad(i + 1)}</span>
                      <span className="display text-xl tracking-[0.1em]">{sp(`facilities.${i}.title`)}</span>
                    </span>
                    <PreviewImage src={facilityImages[i]} />
                    <span className="editorial text-right text-lg text-ink/60">{sp(`facilities.${i}.text`)}</span>
                  </div>
                </li>
              ))}
            </Reveal>
            </HoverPreview>
          </div>
        </div>
      </section>

      {/* Activities: two seasons, one valley */}
      <section id="activities" className="cloth gilt-edge relative scroll-mt-20 overflow-clip py-28 text-cream md:py-36">
        <Engraving name="ibex" className="absolute -left-10 top-20 h-[520px] w-[360px] opacity-[0.1]" />
        <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
          <SectionHeading
            tone="light"
            eyebrow={sp("activities.eyebrow")}
            title={sp("activities.title")}
            lead={sp("activities.lead")}
          />
          <div className="mt-20 grid gap-10 md:grid-cols-2">
            {activities.map((a, i) => (
              <Reveal key={a.id} variant="sequence" delay={i * 120}>
                <article className="border border-gold/30 p-3">
                  <Photo src={a.img} alt={msg("spa", `activities.${a.id}.alt`)} className="aspect-[16/10]" />
                  <div className="p-8 md:p-10">
                    <h3 data-seq="title" className="display metal text-4xl">
                      <Lines>{sp(`activities.${a.id}.season`)}</Lines>
                    </h3>
                    <ul className="mt-6 space-y-4">
                      {[0, 1, 2, 3].map((j) => (
                        <li key={j} data-seq="lead" style={at(j)} className="flex gap-4">
                          <Lozenge size="xs" fill="solid" className="mt-2.5 text-gold-light" />
                          <span className="editorial text-xl text-cream/85">{sp(`activities.${a.id}.items.${j}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
