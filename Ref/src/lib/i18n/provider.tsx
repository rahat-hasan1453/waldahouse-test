"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { languages, lookup, modules, type Dictionary, type Lang, type ModuleName, type Vars } from "./dictionaries";

const STORAGE_KEY = "wh-lang";

/*
 * The visitor's choice lives in localStorage (kept in memory too, for when storage is blocked).
 * Read through useSyncExternalStore: the server snapshot is English, so hydration always matches.
 */
let memoryLang: Lang = "EN";
const langListeners = new Set<() => void>();
function readLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && languages.some((l) => l.code === saved)) return saved as Lang;
  } catch {}
  return memoryLang;
}
function writeLang(next: Lang) {
  memoryLang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  langListeners.forEach((fn) => fn());
}
function subscribeLang(fn: () => void) {
  langListeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    langListeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

type Translate = (m: ModuleName, k: string, vars?: Vars) => string;

type LanguageContext = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** true while a non-English dictionary is on its way from Blocks */
  loading: boolean;
  t: Translate;
};

const Ctx = createContext<LanguageContext>({
  lang: "EN",
  setLang: () => {},
  loading: false,
  t: (m, k, vars) => lookup(undefined, m, k, vars),
});

/** Which module carries each route's meta title (home: common; unknown routes, e.g. the 404, set their own). */
const titleModule = (path: string): ModuleName | null => {
  const first = path.split("/")[1] ?? "";
  if (first === "") return "common";
  return (modules as string[]).includes(first) && first !== "common" ? (first as ModuleName) : null;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lang = useSyncExternalStore(subscribeLang, readLang, () => "EN" as Lang);
  const [loaded, setLoaded] = useState<Partial<Record<Lang, Partial<Record<ModuleName, Dictionary>>>>>({});
  const loading = lang !== "EN" && !loaded[lang];

  // fetch the active language from Blocks Localization (via /api/i18n, which reads it with the SDK) once
  useEffect(() => {
    if (lang === "EN" || loaded[lang]) return;
    let cancelled = false;
    fetch(`/api/i18n/${lang.toLowerCase()}`)
      .then((res) => (res.ok ? (res.json() as Promise<Partial<Record<ModuleName, Dictionary>>>) : Promise.reject(new Error(`HTTP ${res.status}`))))
      .catch((err) => {
        console.error(`[i18n] could not load ${lang}`, err);
        return {};
      })
      .then((dicts) => {
        if (cancelled) return;
        setLoaded((prev) => ({ ...prev, [lang]: dicts }));
      });
    return () => {
      cancelled = true;
    };
  }, [lang, loaded]);

  const dicts = lang === "EN" ? undefined : loaded[lang];
  const t = useCallback<Translate>((m, k, vars) => lookup(dicts, m, k, vars), [dicts]);

  // keep <html lang> and the tab title in step with the chosen language; English keeps the page's own metadata title
  const englishTitle = useRef<{ path: string; title: string } | null>(null);
  useEffect(() => {
    document.documentElement.lang = languages.find((l) => l.code === lang)!.html;
    if (lang === "EN") {
      if (englishTitle.current?.path === pathname) document.title = englishTitle.current.title;
      return;
    }
    if (!dicts) return;
    const m = titleModule(pathname);
    if (!m) return;
    if (englishTitle.current?.path !== pathname) englishTitle.current = { path: pathname, title: document.title };
    // a room page is titled by its room (common:rooms.<slug>.name), as its English metadata is
    const room = pathname.match(/^\/stay\/([\w-]+)/)?.[1];
    const roomKey = room ? `rooms.${room}.name` : "";
    const title = room && t("common", roomKey) !== roomKey ? t("common", roomKey) : t(m, "meta.title");
    document.title = m === "common" ? title : t("common", "meta.titleTemplate").replace("%s", title);
  }, [lang, dicts, pathname, t]);

  const setLang = useCallback((next: Lang) => writeLang(next), []);

  const value = useMemo(() => ({ lang, setLang, loading, t }), [lang, setLang, loading, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLanguage = () => useContext(Ctx);

/** The Intl locale for dates in the visitor's language ("en-GB" or "de-CH"). */
export const useIntlLocale = () => {
  const { lang } = useContext(Ctx);
  return languages.find((l) => l.code === lang)!.intl;
};

/** `const t = useT(); t("common", "header.reserve")` */
export const useT = () => useContext(Ctx).t;

/** Server-renderable text node: `<T m="home" k="hero.titleA" />`. */
export function T({ m, k, vars }: { m: ModuleName; k: string; vars?: Vars }) {
  return <>{useContext(Ctx).t(m, k, vars)}</>;
}
