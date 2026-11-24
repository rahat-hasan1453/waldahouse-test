/**
 * Translations live in SELISE Blocks Localization (one module per chapter).
 * The English dictionaries are bundled from `blocks/localization/*.en-US.json`
 * (pulled with `blocks localization pull`), so first paint and crawlers get
 * English; German is loaded from Blocks at runtime.
 */
import common from "../../../blocks/localization/common.en-US.json";
import contact from "../../../blocks/localization/contact.en-US.json";
import dine from "../../../blocks/localization/dine.en-US.json";
import heritage from "../../../blocks/localization/heritage.en-US.json";
import home from "../../../blocks/localization/home.en-US.json";
import spa from "../../../blocks/localization/spa.en-US.json";
import stay from "../../../blocks/localization/stay.en-US.json";
import whiskyWine from "../../../blocks/localization/whisky-wine.en-US.json";

export type Dictionary = Record<string, string>;

export const english = {
  common,
  home,
  stay,
  dine,
  "whisky-wine": whiskyWine,
  spa,
  heritage,
  contact,
} satisfies Record<string, Dictionary>;

export type ModuleName = keyof typeof english;

export const modules = Object.keys(english) as ModuleName[];

export const languages = [
  { code: "EN", culture: "en-US", html: "en", intl: "en-GB" },
  { code: "DE", culture: "de-DE", html: "de", intl: "de-CH" },
] as const;

export type Lang = (typeof languages)[number]["code"];

/** Placeholder values: plain text, or another key (translated in the same language), e.g. `{ view: { m: "common", k: "rooms.single.view" } }`. */
export type Vars = Record<string, string | number | { m: ModuleName; k: string }>;

/** Looks a key up in the active dictionaries, falling back to English, then to the key itself; fills `{name}` placeholders. */
export function lookup(loaded: Partial<Record<ModuleName, Dictionary>> | undefined, m: ModuleName, k: string, vars?: Vars): string {
  const text = loaded?.[m]?.[k] ?? (english[m] as Dictionary)[k];
  if (text === undefined) {
    if (process.env.NODE_ENV !== "production") console.warn(`[i18n] missing key ${m}:${k}`);
    return k;
  }
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => {
    const v = vars[name];
    if (v === undefined) return match;
    return typeof v === "object" ? lookup(loaded, v.m, v.k) : String(v);
  });
}
