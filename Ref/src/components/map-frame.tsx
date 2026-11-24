"use client";

import type { ComponentProps } from "react";
import { useT } from "@/lib/i18n/provider";

/** The contact map's iframe, titled in the visitor's language. */
export function MapFrame(props: Omit<ComponentProps<"iframe">, "title">) {
  return <iframe title={useT()("contact", "map.title")} {...props} />;
}
