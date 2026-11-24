"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useIntlLocale, useT } from "@/lib/i18n/provider";

/* Plain calendar days as ISO strings (YYYY-MM-DD), computed in UTC so no timezone can shift them. */
export function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
export function nightsBetween(a: string, b: string) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5);
}
const monthStart = (iso: string) => `${iso.slice(0, 7)}-01`;
function addMonths(iso: string, n: number) {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 10);
}
export const utc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const formats = {
  month: { timeZone: "UTC", month: "long", year: "numeric" },
  full: { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" },
  short: { timeZone: "UTC", day: "numeric", month: "short" },
  long: { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;
const formatters = new Map<string, Intl.DateTimeFormat>();
/** Cached date formatters per locale ("en-GB", "de-CH"). */
export function dateFmt(locale: string, kind: keyof typeof formats) {
  const id = `${locale}:${kind}`;
  let f = formatters.get(id);
  if (!f) formatters.set(id, (f = new Intl.DateTimeFormat(locale, formats[kind])));
  return f;
}
export const fullDate = (iso: string, locale = "en-GB") => dateFmt(locale, "full").format(utc(iso));
const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6]; // Swiss weeks start on Monday (common: calendar.weekdays.0 = Monday)
const MAX_MONTHS_AHEAD = 18;

/** The days shown for one month, Monday-first, padded with nulls. */
function monthGrid(first: string) {
  const d = utc(first);
  const lead = (d.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let i = 0; i < days; i++) cells.push(addDays(first, i));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export type Phase = "arrival" | "departure";

/**
 * The stay calendar: one popover for the whole stay (arrival → departure), in the ticket's
 * dress: ink ground, gold hairlines, foil for the chosen days, a gold wash across the nights.
 * Two months side by side from md, one on phones. A modal-less dialog: arrow keys move by day,
 * PageUp/PageDown by month, Home/End to the week's ends, Enter picks, Escape closes.
 */
export function StayCalendar({
  arrival,
  departure,
  today,
  phase,
  onPhase,
  onChange,
  onClose,
}: {
  arrival: string;
  departure: string;
  today: string;
  phase: Phase;
  onPhase: (p: Phase) => void;
  onChange: (range: { arrival: string; departure: string }) => void;
  onClose: (reason: "done" | "dismiss") => void;
}) {
  const t = useT();
  const locale = useIntlLocale();
  const [view, setView] = useState(() => monthStart(phase === "arrival" ? arrival : departure));
  const [focusDay, setFocusDay] = useState(phase === "arrival" ? arrival : departure);
  const [hover, setHover] = useState<string | null>(null);
  // opens above the ticket; where the space above is short (under the header), it opens below
  const [below, setBelow] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    const anchor = el?.parentElement;
    if (!el || !anchor) return;
    const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    const room = anchor.getBoundingClientRect().top - header - 16;
    if (room < el.offsetHeight) setBelow(true);
  }, []);
  useEffect(() => {
    if (below) root.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [below]);
  const firstMonth = monthStart(today);
  const lastMonth = addMonths(firstMonth, MAX_MONTHS_AHEAD);
  const maxDay = addDays(addMonths(lastMonth, 1), -1);

  // focus follows the roving day
  useEffect(() => {
    root.current?.querySelector<HTMLButtonElement>(`[data-day="${focusDay}"]`)?.focus({ preventScroll: true });
  }, [focusDay, view]);

  // a click outside the calendar (and outside the ticket's date cells) dismisses it
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (root.current?.contains(t)) return;
      if ((t as Element).closest?.("[data-stay-trigger]")) return;
      onClose("dismiss");
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [onClose]);

  const disabled = (iso: string) => iso < today || iso > maxDay;

  function pick(iso: string) {
    if (disabled(iso)) return;
    if (phase === "arrival" || iso <= arrival) {
      // a new arrival; keep the stay's length where it still fits, else one night
      const keep = Math.max(1, nightsBetween(arrival, departure));
      const dep = phase === "arrival" && iso < departure ? departure : addDays(iso, keep);
      onChange({ arrival: iso, departure: dep > iso ? dep : addDays(iso, 1) });
      onPhase("departure");
      setFocusDay(iso);
      return;
    }
    onChange({ arrival, departure: iso });
    onClose("done");
  }

  function moveFocus(to: string) {
    const clamped = to < today ? today : to > maxDay ? maxDay : to;
    setFocusDay(clamped);
    const m = monthStart(clamped);
    // keep the focused day inside the visible pair of months
    if (m < view) setView(m);
    else if (m > addMonths(view, 1)) setView(addMonths(m, -1));
  }

  function onKey(e: ReactKeyboardEvent) {
    const wd = (utc(focusDay).getUTCDay() + 6) % 7;
    const map: Record<string, () => void> = {
      ArrowLeft: () => moveFocus(addDays(focusDay, -1)),
      ArrowRight: () => moveFocus(addDays(focusDay, 1)),
      ArrowUp: () => moveFocus(addDays(focusDay, -7)),
      ArrowDown: () => moveFocus(addDays(focusDay, 7)),
      PageUp: () => moveFocus(addDays(focusDay, -30)),
      PageDown: () => moveFocus(addDays(focusDay, 30)),
      Home: () => moveFocus(addDays(focusDay, -wd)),
      End: () => moveFocus(addDays(focusDay, 6 - wd)),
      Escape: () => onClose("dismiss"),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  }

  // the range drawn: the chosen stay, or while choosing a departure, the stay the pointer proposes
  const end = phase === "departure" && hover && hover > arrival ? hover : departure;
  const nights = nightsBetween(arrival, end);

  const months = [view, addMonths(view, 1)];
  const canPrev = view > firstMonth;
  const canNext = addMonths(view, 1) < lastMonth;

  const navBtn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold-light transition-[border-color,opacity] duration-(--dur-hover) hover:border-gold-light disabled:pointer-events-none disabled:opacity-25";

  return (
    <div
      ref={root}
      role="dialog"
      aria-label={t("common", phase === "arrival" ? "calendar.chooseArrival" : "calendar.chooseDeparture")}
      onKeyDown={onKey}
      className={`stay-calendar surface-ink absolute left-0 right-0 z-30 ${below ? "top-full mt-3" : "bottom-full mb-3"} border border-gold/30 bg-ink p-5 text-cream shadow-[0_24px_60px_-20px_var(--color-ink)] md:right-auto md:w-[min(44rem,100%)] md:p-7`}
    >
      {/* the step we are on, echoing the ticket's cells */}
      <div className="flex items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div className="flex items-center gap-6">
          {(["arrival", "departure"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                onPhase(p);
                const day = p === "arrival" ? arrival : departure;
                setFocusDay(day);
                if (monthStart(day) < view || monthStart(day) > addMonths(view, 1)) setView(monthStart(day));
              }}
              className={`caption border-b pb-1 transition-colors duration-(--dur-hover) ${phase === p ? "border-gold-light text-gold-light" : "border-transparent text-cream-muted hover:text-cream"}`}
              aria-pressed={phase === p}
            >
              {t("common", p === "arrival" ? "booking.arrival" : "booking.departure")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className={navBtn} aria-label={t("common", "calendar.prevMonth")} disabled={!canPrev} onClick={() => setView(addMonths(view, -1))}>
            <svg aria-hidden viewBox="0 0 8 14" className="h-3.5 w-2"><path d="M7 1 1 7l6 6" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className={navBtn} aria-label={t("common", "calendar.nextMonth")} disabled={!canNext} onClick={() => setView(addMonths(view, 1))}>
            <svg aria-hidden viewBox="0 0 8 14" className="h-3.5 w-2"><path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-10 md:grid-cols-2">
        {months.map((m, mi) => (
          <div key={m} className={mi === 1 ? "hidden md:block" : ""}>
            <p className="display text-center text-base tracking-[0.14em] text-cream" aria-live={mi === 0 ? "polite" : undefined}>
              {dateFmt(locale, "month").format(utc(m))}
            </p>
            <div role="grid" aria-label={dateFmt(locale, "month").format(utc(m))} className="mt-4">
              <div role="row" className="grid grid-cols-7">
                {WEEKDAYS.map((w) => (
                  <span key={w} role="columnheader" className="caption pb-2 text-center text-cream-muted">
                    {t("common", `calendar.weekdays.${w}`)}
                  </span>
                ))}
              </div>
              {Array.from({ length: monthGrid(m).length / 7 }, (_, r) => (
                <div role="row" key={r} className="grid grid-cols-7">
                  {monthGrid(m)
                    .slice(r * 7, r * 7 + 7)
                    .map((iso, c) => {
                      if (!iso) return <span key={`e${c}`} role="gridcell" />;
                      const isStart = iso === arrival;
                      const isEnd = iso === end;
                      const inRange = iso > arrival && iso < end;
                      const off = disabled(iso);
                      const isToday = iso === today;
                      return (
                        <span
                          key={iso}
                          role="gridcell"
                          className={`relative flex h-11 items-center justify-center ${inRange ? "bg-gold/[0.14]" : ""} ${isStart && end > arrival ? "bg-gradient-to-r from-transparent from-50% to-gold/[0.14] to-50%" : ""} ${isEnd && end > arrival ? "bg-gradient-to-l from-transparent from-50% to-gold/[0.14] to-50%" : ""}`}
                        >
                          <button
                            type="button"
                            data-day={iso}
                            tabIndex={iso === focusDay ? 0 : -1}
                            aria-label={`${fullDate(iso, locale)}${isStart ? t("common", "calendar.arrivalMark") : ""}${isEnd ? t("common", "calendar.departureMark") : ""}${isToday ? t("common", "calendar.todayMark") : ""}`}
                            aria-pressed={isStart || isEnd}
                            aria-disabled={off || undefined}
                            onClick={() => pick(iso)}
                            onPointerEnter={() => setHover(iso)}
                            onPointerLeave={() => setHover(null)}
                            onFocus={() => setFocusDay(iso)}
                            className={`relative flex h-10 w-10 items-center justify-center rounded-full font-sans text-[0.95rem] tabular-nums outline-none transition-[background-color,color,box-shadow] duration-(--dur-quick) focus-visible:ring-1 focus-visible:ring-gold-light ${
                              isStart || isEnd
                                ? "foil-bg font-medium text-ink"
                                : off
                                  ? "cursor-default text-cream/25 line-through decoration-cream/20"
                                  : "text-cream hover:ring-1 hover:ring-gold-light/60"
                            }`}
                          >
                            {Number(iso.slice(8))}
                            {isToday && !(isStart || isEnd) && <span aria-hidden className="absolute bottom-1 h-1 w-1 rounded-full bg-gold-light" />}
                          </button>
                        </span>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* the stay, summed up */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gold/20 pt-5">
        <p className="editorial text-lg text-cream">
          {dateFmt(locale, "short").format(utc(arrival))} <span className="text-gold-light">→</span> {dateFmt(locale, "short").format(utc(end))}
          <span className="caption ml-3 text-gold-light">
            {t("common", nights === 1 ? "booking.night" : "booking.nights", { n: nights })}
          </span>
        </p>
        <button
          type="button"
          onClick={() => onClose("done")}
          className="eyebrow inline-flex items-center gap-3 border border-gold/40 px-5 py-3 text-[0.62rem] text-cream transition-colors duration-(--dur-hover) hover:border-gold-light hover:text-gold-light"
        >
          {t("common", "calendar.done")}
        </button>
      </div>
    </div>
  );
}
