"use client";

import { useEffect } from "react";
import type { ModuleName } from "@/lib/i18n/dictionaries";
import { useT } from "@/lib/i18n/provider";

/**
 * A <title> in the visitor's language. React 19 hoists it into <head>, but the root layout's
 * metadata title comes first there, so the tab title is also set once the page is live.
 */
export function DocTitle({ m, k }: { m: ModuleName; k: string }) {
  const text = useT()(m, k);
  useEffect(() => {
    document.title = text;
  }, [text]);
  return <title>{text}</title>;
}
