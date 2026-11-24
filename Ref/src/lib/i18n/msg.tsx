import { isValidElement, type ReactNode } from "react";
import type { ModuleName, Vars } from "./dictionaries";
import { T } from "./provider";

/** A translatable value that can travel as a prop, e.g. an image's alt text: `msg("home", "spa.altSauna")`. */
export type MsgKey = { m: ModuleName; k: string; vars?: Vars };
export type Msg = string | MsgKey;

export const msg = (m: ModuleName, k: string, vars?: Vars): MsgKey => ({ m, k, vars });

export const isMsgKey = (v: unknown): v is MsgKey =>
  typeof v === "object" && v !== null && !isValidElement(v) && "m" in v && "k" in v;

/** Renders a Msg (or any node) as text: a key becomes a <T>. */
export function text(v: Msg | ReactNode): ReactNode {
  return isMsgKey(v) ? <T m={v.m} k={v.k} vars={v.vars} /> : v;
}
