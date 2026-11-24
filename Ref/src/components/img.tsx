"use client";

import type { ComponentProps } from "react";
import { useT } from "@/lib/i18n/provider";
import type { Msg } from "@/lib/i18n/msg";

/** An <img> whose alt text follows the visitor's language. */
export function Img({ alt, ...props }: Omit<ComponentProps<"img">, "alt"> & { alt: Msg }) {
  const t = useT();
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={typeof alt === "string" ? alt : t(alt.m, alt.k, alt.vars)} {...props} />;
}
