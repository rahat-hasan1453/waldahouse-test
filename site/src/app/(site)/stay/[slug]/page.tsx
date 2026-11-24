import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Frame, Leaders, Lozenge } from "@/components/craft";
import { Guilloche } from "@/components/guilloche";
import { Reveal } from "@/components/reveal";
import { Button, Ornament, PageHero, Photo } from "@/components/ui";
import { chapters, rooms, toRoman } from "@/lib/site";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}
export async function generateMetadata({ params }: PageProps<"/stay/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  return { title: room ? room.name : "Room", description: room?.short };
}

/** Stagger index for the sequence grammar (children arrive --i × --stagger apart). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");
/** Stay is the house's first chapter. */
const chapter = chapters.find((c) => c.href === "/stay")?.numeral ?? "I";

export default async function RoomPage({ params }: PageProps<"/stay/[slug]">) {
  const { slug } = await params;
  const index = rooms.findIndex((r) => r.slug === slug);
  if (index < 0) notFound();
  const room = rooms[index];
  const others = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <>
      <PageHero chapter={chapter} eyebrow={`Stay · ${room.view}`} title={room.name} lead={room.short} image={room.image} caption={room.name} />

      <section className="paper py-24 md:py-32">
        <div className="mx-auto grid max-w-[1320px] gap-16 px-6 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="editorial space-y-6 text-[1.4rem] leading-relaxed text-ink/80">
                {room.description.map((p, i) => (
                  <p key={p} className={i === 0 ? "initial" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal variant="sequence" className="mt-14">
              <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
                Amenities & services
              </span>
              <Ornament variant="short" className="mt-4" />
              <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {room.features.map((f, i) => (
                  <li key={f} data-seq="lead" style={at(i)} className="relative flex items-center gap-4 pb-4">
                    <Lozenge size="xs" fill="solid" className="text-gold-deep" />
                    <span className="editorial text-xl">{f}</span>
                    {/* a dotted row rule, from the label vocabulary */}
                    <span aria-hidden className="perforation-x absolute inset-x-0 bottom-0 h-[3px]" />
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Gallery: three plates; captions hang below, so rows leave room for them */}
            <Reveal variant="sequence" className="mt-16 grid gap-x-4 gap-y-14 sm:grid-cols-2">
              {room.gallery.map((g, i) => (
                <Photo
                  key={g + i}
                  src={g}
                  alt={`${room.name} — image ${i + 1}`}
                  plate={toRoman(i + 1)}
                  caption={room.name}
                  delay={i * 200}
                  className={i === 0 ? "aspect-[16/9] sm:col-span-2" : "aspect-square"}
                />
              ))}
            </Reveal>
          </div>

          {/* The rate card, as a ticket: the body, a torn perforation, then the stub */}
          <aside className="lg:col-span-5">
            <div data-reserve-sentinel className="sticky top-28 text-cream">
              <div className="ticket cloth relative" style={{ "--tear": "100%" } as CSSProperties}>
                <div className="relative flex min-h-12 items-center justify-center gap-4 border-b border-rule-gold px-8 py-3">
                  <Guilloche variant="wave" className="absolute inset-0 h-full w-full text-gold-light opacity-[0.14]" />
                  <Lozenge size="xs" fill="outline" className="relative text-gold-light" />
                  <span className="caption relative text-center">
                    No. {pad(index + 1)} · {room.name}
                  </span>
                  <Lozenge size="xs" fill="outline" className="relative text-gold-light" />
                </div>

                <div className="px-10 pb-10 pt-9">
                  <span className="eyebrow block text-[0.6rem] text-gold-light">From</span>
                  {/* the page's only foil; foil-emboss keeps it inline-block, so the gradient spans just the figures */}
                  <p className="display foil foil-emboss mt-2 text-6xl">CHF {room.from}</p>
                  <p className="editorial mt-1 text-lg text-cream-muted">per room / night, breakfast buffet included</p>
                  <dl className="mt-8 space-y-5 border-t border-rule-gold pt-8">
                    {[
                      ["Size", room.size],
                      ["View", room.view],
                      ["Occupancy", room.guests],
                    ].map(([k, v]) => (
                      /* a dl row: the dotted leader sits inside the dt, so the dl keeps valid dt/dd pairs */
                      <Leaders
                        key={k}
                        as="dl"
                        label={k}
                        value={v}
                        labelClassName="eyebrow text-[0.58rem] text-cream-muted"
                        valueClassName="editorial max-w-[62%] text-right text-lg"
                      />
                    ))}
                  </dl>
                </div>
              </div>

              <div className="ticket cloth relative px-10 pb-10 pt-9" style={{ "--tear": "0%" } as CSSProperties}>
                <span aria-hidden className="perforation-x absolute inset-x-5 top-0 h-[3px]" />
                <div className="flex flex-col gap-3">
                  <Button href={`/contact?type=room&room=${room.slug}`} className="justify-center">
                    Request this room
                  </Button>
                  <Button href="/stay#package" variant="outline-light" className="justify-center">
                    Weekly package
                  </Button>
                </div>
                <p className="editorial mt-6 text-center text-base text-cream-muted">Best rate when you book directly with the family.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-linen py-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <Reveal variant="sequence">
            <span data-seq="eyebrow" className="eyebrow inline-block text-gold-deep">
              You may also like
            </span>
            <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
              {others.map((r, i) => (
                <Link key={r.slug} href={`/stay/${r.slug}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4">
                  <div className="relative col-span-2">
                    <Photo src={r.image} alt={r.name} style={at(i)} className="aspect-[4/3]" />
                    <Frame inset="0.75rem" corners="fleuron" draw="hover" className="surface-ink" />
                  </div>
                  <span className="caption col-span-2 mt-5">No. {pad(rooms.indexOf(r) + 1)}</span>
                  {/* a direct child of the link, so its foil underline draws on hover and focus */}
                  <h3 className="display link-underline link-foil mt-2 justify-self-start pb-1 text-lg tracking-[0.08em]">{r.name}</h3>
                  <span className="display figure text-gold-ink">CHF {r.from}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
