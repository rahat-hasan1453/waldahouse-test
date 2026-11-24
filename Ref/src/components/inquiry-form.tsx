"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { useIntlLocale, useT } from "@/lib/i18n/provider";
import { hotel, inquiryTypes, rooms, type InquiryType } from "@/lib/site";
import { EngravedArrow, Lozenge, WaxSeal } from "./craft";
import { Tilt } from "./motion/tilt";
import { Lockup } from "./identity";
import { dateFmt, utc } from "./stay-calendar";

type Defaults = {
  type?: string;
  room?: string;
  arrival?: string;
  departure?: string;
  guests?: string;
};

/* title and hint come from contact:form.types.<type>.*; the date fields are labelled from contact:form.* */
const dates: Record<InquiryType, ["arrival", "departure"] | ["date"] | ["preferredDate"]> = {
  room: ["arrival", "departure"],
  table: ["date"],
  event: ["preferredDate"],
  spa: ["date"],
  whisky: ["preferredDate"],
};

const TAB_NUMERALS = ["i", "ii", "iii", "iv", "v"];
const vt = (name: string) => ({ viewTransitionName: name }) as CSSProperties;

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => unknown };

/** The reservation letter: a letterhead, index tabs, and a wax seal when it is sent. */
export function InquiryForm({ defaults, letterDate }: { defaults: Defaults; letterDate?: string }) {
  const tr = useT();
  const locale = useIntlLocale();
  const initialType = (inquiryTypes.find((t) => t.value === defaults.type)?.value ?? "room") as InquiryType;
  const [type, setType] = useState<InquiryType>(initialType);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const thanks = useRef<HTMLHeadingElement>(null);
  const c = { title: tr("contact", `form.types.${type}.title`), hint: tr("contact", `form.types.${type}.hint`), dates: dates[type].map((d) => tr("contact", `form.${d}`)) };

  useEffect(() => {
    if (state === "done") thanks.current?.focus();
  }, [state]);

  function choose(t: InquiryType) {
    if (t === type) return;
    const doc = document as ViewTransitionDoc;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !calm) doc.startViewTransition(() => flushSync(() => setType(t)));
    else setType(t);
  }

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = inquiryTypes.length - 1;
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const j = (next + inquiryTypes.length) % inquiryTypes.length;
    choose(inquiryTypes[j].value);
    tabs.current[j]?.focus();
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError(false);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, type }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error);
      setState("done");
    } catch {
      setState("error");
      setError(true);
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="flex min-h-[520px] flex-col items-center justify-center text-center">
        <Tilt className="h-24 w-24 rounded-full">
          <WaxSeal className="h-full w-full" />
        </Tilt>
        <h3 ref={thanks} tabIndex={-1} className="display mt-6 text-3xl">
          {tr("contact", "form.thanksTitle")}
        </h3>
        <p className="editorial mt-6 max-w-md text-xl leading-relaxed text-ink/75">
          {tr("contact", "form.thanksText", { phone: hotel.phone })}
        </p>
        <button type="button" onClick={() => setState("idle")} className="eyebrow link-underline mt-10 py-3 text-[0.62rem] text-gold-deep">
          {tr("contact", "form.another")}
        </button>
      </div>
    );
  }

  const label = "eyebrow block text-[0.58rem] text-ink-muted";

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* letterhead */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--rule)] pb-6">
        <Lockup brand="waldhaus" layout="horizontal" tone="dark" />
        {letterDate && <p className="editorial text-lg text-ink/70">{tr("contact", "form.letterPlace", { date: dateFmt(locale, "long").format(utc(letterDate)) })}</p>}
      </div>

      <div role="radiogroup" aria-label={tr("contact", "form.typeGroup")} className="flex flex-wrap gap-2">
        {inquiryTypes.map((t, i) => {
          const on = type === t.value;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              key={t.value}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              onClick={() => choose(t.value)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`eyebrow inline-flex min-h-[var(--hit)] items-center gap-2.5 border px-4 py-2.5 text-[0.56rem] transition-[color,background-color,border-color] duration-(--dur-hover) ${
                on ? "border-forest bg-forest text-cream" : "border-ink/20 text-ink/65 hover:border-gold-deep hover:text-gold-ink"
              }`}
            >
              <span aria-hidden className={`caption ${on ? "text-gold-light" : ""}`}>
                {TAB_NUMERALS[i]}
              </span>
              {tr("contact", `form.types.${t.value}.tab`)}
              {on && <Lozenge size="xs" fill="foil" />}
            </button>
          );
        })}
      </div>

      <div style={vt("inquiry-title")}>
        <h3 className="display text-[clamp(1.8rem,3vw,2.4rem)]">{c.title}</h3>
        <p className="editorial mt-2 text-lg text-ink/60">{c.hint}</p>
      </div>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <label className="sm:col-span-2" style={vt("field-name")}>
          <span className={label}>{tr("contact", "form.name")}</span>
          <input name="name" required maxLength={160} autoComplete="name" className="field" placeholder={tr("contact", "form.namePlaceholder")} />
        </label>
        <label style={vt("field-email")}>
          <span className={label}>{tr("contact", "form.email")}</span>
          <input name="email" type="email" required autoComplete="email" className="field" placeholder={tr("contact", "form.emailPlaceholder")} />
        </label>
        <label style={vt("field-phone")}>
          <span className={label}>{tr("contact", "form.phone")}</span>
          <input name="phone" autoComplete="tel" className="field" placeholder="+41 …" />
        </label>

        {c.dates && (
          <label style={vt("field-arrival")}>
            <span className={label}>{c.dates[0]}</span>
            <input name="arrival" type="date" defaultValue={defaults.arrival} className="field" />
          </label>
        )}
        {c.dates && c.dates.length > 1 ? (
          <label style={vt("field-departure")}>
            <span className={label}>{c.dates[1]}</span>
            <input name="departure" type="date" defaultValue={defaults.departure} className="field" />
          </label>
        ) : (
          c.dates && (
            <label style={vt("field-guests")}>
              <span className={label}>{tr("contact", "form.guests")}</span>
              <input name="guests" type="number" min={1} max={200} defaultValue={defaults.guests ?? "2"} className="field" />
            </label>
          )
        )}

        {type === "room" && (
          <>
            <label style={vt("field-room")}>
              <span className={label}>{tr("contact", "form.room")}</span>
              <select name="roomSlug" defaultValue={defaults.room ?? ""} className="field">
                <option value="">{tr("contact", "form.noPreference")}</option>
                {rooms.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {tr("contact", "form.roomOption", { name: tr("common", `rooms.${r.slug}.name`), price: r.from })}
                  </option>
                ))}
                <option value="package">{tr("contact", "form.packageOption")}</option>
              </select>
            </label>
            <label style={vt("field-guests")}>
              <span className={label}>{tr("contact", "form.guests")}</span>
              <input name="guests" type="number" min={1} max={12} defaultValue={defaults.guests ?? "2"} className="field" />
            </label>
          </>
        )}

        <label className="sm:col-span-2" style={vt("field-message")}>
          <span className={label}>{tr("contact", "form.message")}</span>
          <textarea
            name="message"
            rows={4}
            maxLength={4000}
            className="field resize-none"
            placeholder={tr("contact", "form.messagePlaceholder")}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="editorial text-lg text-claret">
          {tr("contact", "form.error")}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 pt-8">
        <p className="editorial text-base text-ink-muted">{tr("contact", "form.note")}</p>
        <button
          type="submit"
          disabled={state === "loading"}
          aria-busy={state === "loading" || undefined}
          className="eyebrow btn btn-foil foil-bg px-8 py-4 text-[0.66rem] disabled:opacity-80"
        >
          {state === "loading" ? tr("contact", "form.sending") : tr("contact", "form.send")}
          <EngravedArrow />
        </button>
      </div>
    </form>
  );
}
