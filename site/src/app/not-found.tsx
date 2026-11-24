import Link from "next/link";
import { Lozenge } from "@/components/craft";
import { Lines } from "@/components/motion/lines";
import { Button, Engraving, Ornament } from "@/components/ui";
import { chapters } from "@/lib/site";

/*
 * 404 (cloth). An intro, CSS only, that ends visible: the ibex crests in, the title rises, the
 * ornament draws, the lead and the way back follow, then one pass of light crosses the colossal
 * foil "404" that sinks into the bottom edge (ref 7).
 *
 * The colossal sits in flow as the last row of the page, so the composition never overlaps it,
 * and its size also answers to the viewport height, so on a laptop the whole plate fits the
 * first screen with the numerals cropped by its bottom edge. It is composed from the .colossal
 * and .foil roles rather than <Colossal> because it needs data-sheen (one intro sheen instead of
 * living foil) and a box that hugs the numerals, so the gradient spans the digits.
 */
export default function NotFound() {
  return (
    <main className="cloth relative flex min-h-svh flex-col items-center overflow-clip px-6 pt-[clamp(2.5rem,7svh,5rem)] text-center text-cream">
      {/* not-found.tsx cannot export metadata; React 19 hoists this <title> into <head> */}
      <title>Page not found · Waldhaus am See, St. Moritz</title>
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <Engraving
          name="ibex"
          highlight
          inkOpacity={0.6}
          detail="emblem"
          className="h-48 w-36 animate-[crest_var(--dur-draw)_var(--ease-settle)_var(--intro-frame)_both] motion-reduce:animate-none"
        />

        <h1 className="display mt-8 text-2xl tracking-[0.14em]">
          <span className="sr-only">Error 404, page not found: </span>
          <Lines mode="intro">Lost in the Engadin</Lines>
        </h1>
        {/* ink draws between the title and the lead (the intro keeps the section grammar's order) */}
        <div className="draw-on-mount mt-6 [&_:is(.orn-rule,.orn-mark)]:[animation-delay:calc((var(--intro-title)+var(--intro-lead))/2)]!">
          <Ornament />
        </div>
        <p className="editorial intro-lead mt-6 max-w-md text-xl text-cream/75">
          This path leads nowhere — but the lake is always a short walk away.
        </p>

        <div className="intro-bar mt-10 flex flex-col items-center">
          {/* the five chapters of the house, as a way back */}
          <nav aria-label="Chapters">
            <ol className="flex flex-wrap items-center justify-center gap-x-6 border-y border-[var(--rule)] px-2 py-1 md:gap-x-5">
              {chapters.map((c, i) => (
                <li key={c.href} className="flex items-center md:gap-5">
                  {i > 0 && <Lozenge size="xs" fill="solid" className="hidden text-gold/60 md:inline-block" />}
                  <Link href={c.href} className="inline-flex items-baseline gap-2.5 py-2.5">
                    <span aria-hidden className="caption">
                      {c.numeral}
                    </span>
                    <span className="editorial link-underline text-xl text-cream/85">{c.label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <Button href="/" className="mt-10 px-8 py-4">
            Return to the Waldhaus
          </Button>
        </div>
      </div>

      {/* the colossal: a third of the viewport high at most, its foot cropped by the page edge */}
      <span
        aria-hidden
        data-sheen
        className="colossal foil intro-sheen mt-8 -mb-[0.16em] text-[length:min(var(--text-colossal),34svh)]"
      >
        404
      </span>
    </main>
  );
}
