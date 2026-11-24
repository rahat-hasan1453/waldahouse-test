"use client";

import { useState } from "react";
import { inquiryTypes, rooms, type InquiryType } from "@/lib/site";
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

export function InquiryForm({ defaults }: { defaults: Defaults }) {
  const initialType = (inquiryTypes.find((t) => t.value === defaults.type)?.value ?? "room") as InquiryType;
  const [type, setType] = useState<InquiryType>(initialType);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const c = copy[type];

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
      <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
        <span className="display foil text-6xl">✦</span>
        <h3 className="display mt-6 text-3xl">Thank you</h3>
        <Ornament className="mx-auto mt-6" />
        <p className="editorial mt-6 max-w-md text-xl leading-relaxed text-ink/75">
          Your request has reached the family. We&rsquo;ll reply personally — usually within a day. For anything urgent, please
          call +41 81 836 60 00.
        </p>
        <button onClick={() => setState("idle")} className="eyebrow mt-10 text-[0.62rem] text-gold-deep link-underline">
          Send another request
        </button>
      </div>
    );
  }

  const label = "eyebrow block text-[0.58rem] text-ink/55";

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {inquiryTypes.map((t) => (
          <button
            type="button"
            key={t.value}
            onClick={() => setType(t.value)}
            className={`eyebrow border px-4 py-2.5 text-[0.56rem] transition-all ${
              type === t.value ? "border-forest bg-forest text-cream" : "border-ink/20 text-ink/65 hover:border-gold-deep hover:text-gold-deep"
            }`}
          >
            {t.label.split(" · ")[0]}
          </button>
        ))}
      </div>

      <div>
        <h3 className="display text-[clamp(1.8rem,3vw,2.4rem)]">{c.title}</h3>
        <p className="editorial mt-2 text-lg text-ink/60">{c.hint}</p>
      </div>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className={label}>Full name *</span>
          <input name="name" required maxLength={160} className="field" placeholder="Your name" />
        </label>
        <label>
          <span className={label}>Email *</span>
          <input name="email" type="email" required className="field" placeholder="you@example.com" />
        </label>
        <label>
          <span className={label}>Phone</span>
          <input name="phone" className="field" placeholder="+41 …" />
        </label>

        {c.dates && (
          <label>
            <span className={label}>{c.dates[0]}</span>
            <input name="arrival" type="date" defaultValue={defaults.arrival} className="field" />
          </label>
        )}
        {c.dates && c.dates.length > 1 ? (
          <label>
            <span className={label}>{c.dates[1]}</span>
            <input name="departure" type="date" defaultValue={defaults.departure} className="field" />
          </label>
        ) : (
          c.dates && (
            <label>
              <span className={label}>Guests</span>
              <input name="guests" type="number" min={1} max={200} defaultValue={defaults.guests ?? "2"} className="field" />
            </label>
          )
        )}

        {type === "room" && (
          <>
            <label>
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
            <label>
              <span className={label}>Guests</span>
              <input name="guests" type="number" min={1} max={12} defaultValue={defaults.guests ?? "2"} className="field" />
            </label>
          </>
        )}

        <label className="sm:col-span-2">
          <span className={label}>Message</span>
          <textarea name="message" rows={4} maxLength={4000} className="field resize-none" placeholder="Anything we should know — occasions, dietary wishes, a favourite dram…" />
        </label>
      </div>

      {error && <p className="editorial text-lg text-claret">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 pt-8">
        <p className="editorial text-base text-ink/55">No payment now · Personal reply from the family</p>
        <button
          disabled={state === "loading"}
          className="foil-bg eyebrow inline-flex items-center gap-3 px-8 py-4 text-[0.66rem] text-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {state === "loading" ? "Sending…" : "Send request"} <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
