"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, useTransition } from "react";
import { EngravedArrow } from "./craft";
import { Guilloche } from "./guilloche";

/* Dates are plain calendar days in Zurich: the same on the server and in the browser. */
const zurichDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" });

function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
function nightsBetween(a: string, b: string) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5);
}
const partFmt = {
  day: new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric" }),
  month: new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", month: "short" }),
  weekday: new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long" }),
};
function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(date.getTime())) return { day: "—", month: "", weekday: "" };
  return { day: partFmt.day.format(date), month: partFmt.month.format(date), weekday: partFmt.weekday.format(date) };
}

function DateCell({ label, value, min, onChange, className = "" }: { label: string; value: string; min: string; onChange: (v: string) => void; className?: string }) {
  const p = parts(value);
  return (
    <label className={`cell block min-h-[var(--hit)] cursor-pointer px-6 py-4 ${className}`}>
      <span className="caption text-gold-light">{label}</span>
      <span aria-hidden className="mt-1.5 flex items-baseline gap-2.5">
        <span className="figure text-numeral text-cream">{p.day}</span>
        <span className="flex flex-col">
          <span className="eyebrow text-gold-light">{p.month}</span>
          <span className="editorial text-lg leading-tight text-cream-muted">{p.weekday}</span>
        </span>
      </span>
      <input
        type="date"
        value={value}
        min={min}
        required
        onChange={(e) => e.target.value && onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker();
          } catch {
            /* not supported: the native control still works */
          }
        }}
        className="cell-input [color-scheme:dark]"
      />
    </label>
  );
}

const zurichToday = () => zurichDay.format(new Date());
const noSubscribe = () => () => {};

/**
 * The booking ticket: notched ends, perforated cells, a guilloche field. Pushes to /contact.
 * `today` is the server's Zurich day (the page may be cached, e.g. ISR): it hydrates as-is, then
 * the browser's own day takes over, so a page rendered on an earlier day never mismatches.
 */
export function BookingBar({ today: serverToday }: { today?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const today = useSyncExternalStore(noSubscribe, zurichToday, () => serverToday ?? zurichToday());
  // only the guest's own picks are stored; the defaults follow today (a week out, three nights)
  const [picked, setPicked] = useState<{ arrival?: string; departure?: string }>({});
  const [guests, setGuests] = useState("2");
  const arrival = picked.arrival ?? addDays(today, 7);
  const chosenDeparture = picked.departure ?? addDays(today, 10);
  const departure = chosenDeparture > arrival ? chosenDeparture : addDays(arrival, 1);
  const nights = Math.max(1, nightsBetween(arrival, departure));

  function changeArrival(v: string) {
    // a departure on or before the new arrival moves to the day after it
    setPicked((p) => ({ arrival: v, departure: departure <= v ? addDays(v, 1) : p.departure }));
  }
  function changeDeparture(v: string) {
    setPicked((p) => ({ ...p, departure: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({ type: "room", arrival, departure, guests });
    startTransition(() => router.push(`/contact?${q.toString()}`));
  }

  const nightsLabel = `${nights} ${nights === 1 ? "night" : "nights"}`;

  return (
    <form
      onSubmit={submit}
      data-reserve-sentinel
      aria-label="Check availability"
      className="ticket surface-ink relative grid w-full grid-cols-2 grid-rows-[1fr_1fr] border border-gold/30 bg-ink md:grid-cols-[1fr_1fr_0.7fr_auto] md:grid-rows-1"
    >
      <Guilloche variant="wave" className="absolute inset-0 h-full w-full text-gold-light opacity-[0.04]" />
      <div className="relative">
        <DateCell label="Arrival" value={arrival} min={today} onChange={changeArrival} />
        <span aria-hidden className="perforation-y absolute inset-y-3 right-0 w-[3px]" />
        <span aria-hidden className="caption absolute right-0 top-1/2 z-[1] hidden -translate-y-1/2 translate-x-1/2 rotate-90 whitespace-nowrap bg-ink px-2 py-0.5 text-gold-light md:block">
          {nightsLabel}
        </span>
      </div>
      <div className="relative">
        <DateCell label="Departure" value={departure} min={addDays(arrival, 1)} onChange={changeDeparture} />
        <span aria-hidden className="editorial absolute bottom-4 right-6 hidden text-base text-cream-muted sm:block md:hidden">{nightsLabel}</span>
        <span aria-hidden className="perforation-y absolute inset-y-3 right-0 hidden w-[3px] md:block" />
      </div>
      <span aria-hidden className="perforation-x absolute inset-x-3 top-1/2 h-[3px] md:hidden" />
      <label className="cell relative block min-h-[var(--hit)] px-6 py-4">
        <span className="caption text-gold-light">Guests</span>
        <span className="relative mt-1.5 flex items-center">
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="editorial w-full cursor-pointer appearance-none bg-transparent pr-6 text-xl text-cream focus-visible:outline-transparent [color-scheme:dark]"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n} className="bg-ink">
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
          <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-0 h-2 w-3 text-gold-light">
            <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
        <span aria-hidden className="perforation-y absolute inset-y-3 right-0 hidden w-[3px] md:block" />
      </label>
      <button type="submit" aria-busy={pending || undefined} className="eyebrow btn btn-foil foil-bg relative justify-center px-8 py-4 text-center text-[0.66rem] text-ink max-md:flex-col max-md:gap-2 max-md:px-4">
        {pending ? "One moment…" : "Check availability"}
        <EngravedArrow />
      </button>
    </form>
  );
}
