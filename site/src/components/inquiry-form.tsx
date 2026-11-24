"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { inquiryTypes, rooms, type InquiryType } from "@/lib/site";
import { EngravedArrow, Lozenge, WaxSeal } from "./craft";
import { Lockup } from "./identity";
import { Ornament } from "./ui";

type Defaults = {
  type?: string;
  room?: string;
  arrival?: string;
  departure?: string;
  guests?: string;
};

const copy: Record<InquiryType, { title: string; hint: string; dates: [string, string] | [string] | null }> = {
  room: { title: "Request your stay", hint: "We reply personally within one working day with availability and our best direct rate.", dates: ["Arrival", "Departure"] },
  table: { title: "Reserve a table", hint: "Restaurant, Stübli or a seat at Devil's Place — tell us when and how many.", dates: ["Date"] },
  event: { title: "Plan a celebration", hint: "Weddings, banquets, seminars — share a few details and we'll be in touch.", dates: ["Preferred date"] },
  spa: { title: "Reserve the Alpine Spa", hint: "Private hourly slots between 15:00 and 21:00, up to 8 guests.", dates: ["Date"] },
  whisky: { title: "Visit the whisky shop", hint: "The shop opens on request — let us know when you'd like to browse.", dates: ["Preferred date"] },
};

const TAB_NUMERALS = ["i", "ii", "iii", "iv", "v"];
const vt = (name: string) => ({ viewTransitionName: name }) as CSSProperties;

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => unknown };

/** The reservation letter: a letterhead, index tabs, and a wax seal when it is sent. */
export function InquiryForm({ defaults, letterDate }: { defaults: Defaults; letterDate?: string }) {
  const initialType = (inquiryTypes.find((t) => t.value === defaults.type)?.value ?? "room") as InquiryType;
  const [type, setType] = useState<InquiryType>(initialType);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const thanks = useRef<HTMLHeadingElement>(null);
  const c = copy[type];

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
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, type }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not send your request");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not send your request");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="flex min-h-[520px] flex-col items-center justify-center text-center">
        <WaxSeal className="h-24 w-24" />
        <h3 ref={thanks} tabIndex={-1} className="display mt-6 text-3xl">
          Thank you
        </h3>
        <span className="draw-on-mount">
          <Ornament className="mx-auto mt-6" />
        </span>
        <p className="editorial mt-6 max-w-md text-xl leading-relaxed text-ink/75">
          Your request has reached the family. We&rsquo;ll reply personally — usually within a day. For anything urgent, please call +41 81 836 60
          00.
        </p>
        <button type="button" onClick={() => setState("idle")} className="eyebrow link-underline mt-10 py-3 text-[0.62rem] text-gold-deep">
          Send another request
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
        {letterDate && <p className="editorial text-lg text-ink/70">St. Moritz, {letterDate}</p>}
      </div>

      <div role="radiogroup" aria-label="Type of request" className="flex flex-wrap gap-2">
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
              {t.label.split(" · ")[0]}
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
          <span className={label}>Full name *</span>
          <input name="name" required maxLength={160} autoComplete="name" className="field" placeholder="Your name" />
        </label>
        <label style={vt("field-email")}>
          <span className={label}>Email *</span>
          <input name="email" type="email" required autoComplete="email" className="field" placeholder="you@example.com" />
        </label>
        <label style={vt("field-phone")}>
          <span className={label}>Phone</span>
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
              <span className={label}>Guests</span>
              <input name="guests" type="number" min={1} max={200} defaultValue={defaults.guests ?? "2"} className="field" />
            </label>
          )
        )}

        {type === "room" && (
          <>
            <label style={vt("field-room")}>
              <span className={label}>Room</span>
              <select name="roomSlug" defaultValue={defaults.room ?? ""} className="field">
                <option value="">No preference</option>
                {rooms.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name} — from CHF {r.from}
                  </option>
                ))}
                <option value="package">Weekly package — from CHF 1,370 p.p.</option>
              </select>
            </label>
            <label style={vt("field-guests")}>
              <span className={label}>Guests</span>
              <input name="guests" type="number" min={1} max={12} defaultValue={defaults.guests ?? "2"} className="field" />
            </label>
          </>
        )}

        <label className="sm:col-span-2" style={vt("field-message")}>
          <span className={label}>Message</span>
          <textarea
            name="message"
            rows={4}
            maxLength={4000}
            className="field resize-none"
            placeholder="Anything we should know — occasions, dietary wishes, a favourite dram…"
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="editorial text-lg text-claret">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 pt-8">
        <p className="editorial text-base text-ink-muted">No payment now · Personal reply from the family</p>
        <button
          type="submit"
          disabled={state === "loading"}
          aria-busy={state === "loading" || undefined}
          className="eyebrow btn btn-foil foil-bg px-8 py-4 text-[0.66rem] disabled:opacity-80"
        >
          {state === "loading" ? "Sending…" : "Send request"}
          <EngravedArrow />
        </button>
      </div>
    </form>
  );
}
