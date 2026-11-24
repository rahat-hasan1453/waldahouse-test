import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { Button, Ornament, PageHero, Photo } from "@/components/ui";
import { rooms } from "@/lib/site";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stay/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  return { title: room ? room.name : "Room", description: room?.short };
}

export default async function RoomPage({ params }: PageProps<"/stay/[slug]">) {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  if (!room) notFound();
  const others = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={`Stay · ${room.view}`} title={room.name} lead={room.short} image={room.image} />

      <section className="paper py-24 md:py-32">
        <div className="mx-auto grid max-w-[1320px] gap-16 px-6 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="editorial space-y-6 text-[1.4rem] leading-relaxed text-ink/80">
                {room.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100} className="mt-14">
              <span className="eyebrow text-gold-deep">Amenities & services</span>
              <Ornament className="mt-4" />
              <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {room.features.map((f) => (
                  <li key={f} className="flex items-center gap-4 border-b border-ink/10 pb-4">
                    <span className="h-1.5 w-1.5 rotate-45 bg-gold-deep" />
                    <span className="editorial text-xl">{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={150} className="mt-16 grid grid-cols-2 gap-4">
              {room.gallery.map((g, i) => (
                <Photo key={g + i} src={g} alt={`${room.name} — image ${i + 1}`} className={i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"} />
              ))}
            </Reveal>
          </div>

          <aside className="lg:col-span-5">
            <div className="cloth sticky top-28 p-10 text-cream">
              <span className="eyebrow text-[0.6rem] text-gold-light">From</span>
              <p className="display foil mt-2 text-6xl">CHF {room.from}</p>
              <p className="editorial mt-1 text-lg text-cream/60">per room / night, breakfast buffet included</p>
              <dl className="mt-8 space-y-4 border-t border-gold/25 pt-8">
                {[
                  ["Size", room.size],
                  ["View", room.view],
                  ["Occupancy", room.guests],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-cream/10 pb-4">
                    <dt className="eyebrow text-[0.58rem] text-cream/60">{k}</dt>
                    <dd className="editorial text-right text-lg">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex flex-col gap-3">
                <Button href={`/contact?type=room&room=${room.slug}`} className="justify-center">Request this room</Button>
                <Button href="/stay#package" variant="outline-light" className="justify-center">Weekly package</Button>
              </div>
              <p className="editorial mt-6 text-center text-base text-cream/55">Best rate when you book directly with the family.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-linen py-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <span className="eyebrow text-gold-deep">You may also like</span>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {others.map((r) => (
              <Link key={r.slug} href={`/stay/${r.slug}`} className="group">
                <Photo src={r.image} alt={r.name} className="aspect-[4/3]" />
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="display text-lg tracking-[0.08em] group-hover:text-gold-deep">{r.name}</h3>
                  <span className="display text-gold-deep">CHF {r.from}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
