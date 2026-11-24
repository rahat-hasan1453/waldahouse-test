"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/provider";
import { Emblem } from "./identity";

/** The Waldhaus emblem (square double rule, W-peaks over the lake line). Kept for existing imports. */
export function Monogram({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return <Emblem brand="waldhaus" className={className} style={color === "currentColor" ? undefined : { color }} />;
}

/**
 * The house logo: the original Waldhaus am See artwork (ref 13, the same file the home hero shows),
 * white on transparent, so it sits on the header's ink ground. 839 × 507, drawn at the header's height.
 */
export function Logo() {
  const t = useT();
  return (
    <Link href="/" className="group flex items-center" aria-label={t("common", "header.home")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/waldhaus-logo.png" alt="" width={839} height={507} className="h-12 w-auto md:h-14" />
    </Link>
  );
}
