"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { useIntlLocale, useT } from "@/lib/i18n/provider";
import { EngravedArrow } from "./craft";
import { Guilloche } from "./guilloche";
import { addDays, dateFmt, fullDate, nightsBetween, StayCalendar, type Phase } from "./stay-calendar";

/* Dates are plain calendar days in Zurich: the same on the server and in the browser. */
const zurichDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" });

function parts(iso: string, locale: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(date.getTime())) return { day: "—", month: "", weekday: "" };
  // the day and month are read from the short form, so German drops its ordinal dot ("7. Okt." → 7 / Okt.)
  const short = dateFmt(locale, "short").formatToParts(date);
  const weekday = new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "long" }).format(date);
  return { day: short.find((p) => p.type === "day")?.value ?? "", month: short.find((p) => p.type === "month")?.value ?? "", weekday };
}

/** A date cell of the ticket: a button that opens the stay calendar on its own step. */
function DateCell({
  label,
  value,
  active,
  expanded,
  onOpen,
  buttonRef,
}: {
  label: string;
  value: string;
  active: boolean;
  expanded: boolean;
  onOpen: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const t = useT();
  const locale = useIntlLocale();
  const p = parts(value, locale);
  return (
    <div className={`cell block min-h-[var(--hit)] px-6 py-4 transition-colors duration-(--dur-hover) ${active ? "bg-gold/[0.07]" : ""}`}>
      <span aria-hidden className="caption text-gold-light">{label}</span>
      <span aria-hidden className="mt-1.5 flex items-baseline gap-2.5">
        <span className="figure text-numeral text-cream">{p.day}</span>
        <span className="flex flex-col">
          <span className="eyebrow text-gold-light">{p.month}</span>
          <span className="editorial text-lg leading-tight text-cream-muted">{p.weekday}</span>
        </span>
      </span>
      <button
        ref={buttonRef}
        type="button"
        data-stay-trigger
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-label={t("common", "booking.changeDates", { label, date: fullDate(value, locale) })}
        onClick={onOpen}
        className="absolute inset-0 h-full w-full cursor-pointer outline-none"
      />
    </div>
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
  const t = useT();
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

  // the stay calendar: which step is open (null = closed); focus returns to the cell that opened it
  const [phase, setPhase] = useState<Phase | null>(null);
  const arrivalBtn = useRef<HTMLButtonElement>(null);
  const departureBtn = useRef<HTMLButtonElement>(null);
  const openedFrom = useRef<Phase>("arrival");
  const open = (p: Phase) => {
    openedFrom.current = p;
    setPhase((cur) => (cur === p ? null : p));
  };
  const close = useCallback(() => {
    setPhase(null);
    (openedFrom.current === "arrival" ? arrivalBtn : departureBtn).current?.focus({ preventScroll: true });
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Reservation page is decommissioned; booking submissions paused until new system is integrated
    // const q = new URLSearchParams({ type: "room", arrival, departure, guests });
    // startTransition(() => router.push(`/contact?${q.toString()}`));
  }

  const nightsLabel = t("common", nights === 1 ? "booking.night" : "booking.nights", { n: nights });

  return (
    <div className="ticket-stage relative" data-open={phase ? "" : undefined}>
      {phase && (
        <StayCalendar
          arrival={arrival}
          departure={departure}
          today={today}
          phase={phase}
          onPhase={setPhase}
          onChange={(r) => setPicked(r)}
          onClose={close}
        />
      )}
    <form
      onSubmit={submit}
      data-reserve-sentinel
      aria-label={t("common", "booking.form")}
      className="ticket ticket-lean surface-ink relative grid w-full grid-cols-2 grid-rows-[1fr_1fr] border border-gold/30 bg-ink md:grid-cols-[1fr_1fr_0.7fr_auto] md:grid-rows-1"
    >
      <Guilloche variant="wave" className="absolute inset-0 h-full w-full text-gold-light opacity-[0.04]" />
      <div className="relative">
        <DateCell label={t("common", "booking.arrival")} value={arrival} active={phase === "arrival"} expanded={phase !== null} onOpen={() => open("arrival")} buttonRef={arrivalBtn} />
        <span aria-hidden className="perforation-y absolute inset-y-3 right-0 w-[3px]" />
        <span aria-hidden className="caption absolute right-0 top-1/2 z-[1] hidden -translate-y-1/2 translate-x-1/2 rotate-90 whitespace-nowrap bg-ink px-2 py-0.5 text-gold-light md:block">
          {nightsLabel}
        </span>
      </div>
      <div className="relative">
        <DateCell label={t("common", "booking.departure")} value={departure} active={phase === "departure"} expanded={phase !== null} onOpen={() => open("departure")} buttonRef={departureBtn} />
        <span aria-hidden className="editorial absolute bottom-4 right-6 hidden text-base text-cream-muted sm:block md:hidden">{nightsLabel}</span>
        <span aria-hidden className="perforation-y absolute inset-y-3 right-0 hidden w-[3px] md:block" />
      </div>
      <span aria-hidden className="perforation-x absolute inset-x-3 top-1/2 h-[3px] md:hidden" />
      <label className="cell relative block min-h-[var(--hit)] px-6 py-4">
        <span className="caption text-gold-light">{t("common", "booking.guests")}</span>
        <span className="relative mt-1.5 flex items-center">
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="editorial w-full cursor-pointer appearance-none bg-transparent pr-6 text-xl text-cream focus-visible:outline-transparent [color-scheme:dark]"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n} className="bg-ink">
                {t("common", n === 1 ? "booking.guest" : "booking.guestsN", { n })}
              </option>
            ))}
          </select>
          <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-0 h-2 w-3 text-gold-light">
            <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
        <span aria-hidden className="perforation-y absolute inset-y-3 right-0 hidden w-[3px] md:block" />
      </label>
      <button type="submit" aria-busy={pending || undefined} className="eyebrow btn btn-foil foil-bg relative justify-center px-8 py-4 text-center text-[0.66rem] text-ink max-lg:flex-col max-lg:gap-2 max-lg:px-4">
        {pending ? t("common", "booking.pending") : t("common", "booking.check")}
        <EngravedArrow />
      </button>
    </form>
    </div>
  );
}
