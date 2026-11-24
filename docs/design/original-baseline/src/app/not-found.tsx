import Link from "next/link";
import { Engraving, Ornament } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="cloth flex min-h-screen flex-col items-center justify-center px-6 text-center text-cream">
      <Engraving name="ibex" className="h-48 w-36" />
      <p className="display foil mt-8 text-7xl">404</p>
      <h1 className="display mt-4 text-2xl tracking-[0.14em]">Lost in the Engadin</h1>
      <Ornament className="mx-auto mt-6" />
      <p className="editorial mt-6 max-w-md text-xl text-cream/75">This path leads nowhere — but the lake is always a short walk away.</p>
      <Link href="/" className="foil-bg eyebrow mt-10 px-8 py-4 text-[0.66rem] text-ink">Return to the Waldhaus →</Link>
    </div>
  );
}
