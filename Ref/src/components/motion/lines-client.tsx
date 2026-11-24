"use client";

import type { CSSProperties } from "react";
import type { ModuleName, Vars } from "@/lib/i18n/dictionaries";
import { useT } from "@/lib/i18n/provider";

/**
 * The translated counterpart of a plain string inside <Lines>: the string is only known in the
 * browser (it follows the visitor's language), so the per-word masks are made here, on the same line.
 */
export function TWords({ m, k, vars, line }: { m: ModuleName; k: string; vars?: Vars; line: number }) {
  const text = useT()(m, k, vars);
  return (
    <>
      {text.split(/(\s+)/).map((part, i) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return " ";
        return (
          <span key={i} className="line-mask">
            <span className="line-inner" style={{ "--line": line } as CSSProperties}>
              {part}
            </span>
          </span>
        );
      })}
    </>
  );
}
