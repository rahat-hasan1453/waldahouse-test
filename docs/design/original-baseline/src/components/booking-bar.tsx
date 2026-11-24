"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function BookingBar() {
  const router = useRouter();
  const today = new Date();
  const [arrival, setArrival] = useState(iso(new Date(today.getTime() + 7 * 864e5)));
  const [departure, setDeparture] = useState(iso(new Date(today.getTime() + 10 * 864e5)));
  const [guests, setGuests] = useState("2");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({ type: "room", arrival, departure, guests });
    router.push(`/contact?${q.toString()}`);
  }

  const label = "eyebrow text-[0.56rem] text-gold-light/90";
  const input =
    "editorial mt-1 w-full bg-transparent text-xl text-cream outline-none [color-scheme:dark]";

  return (
    <form
      onSubmit={submit}
      className="grid w-full grid-cols-2 border border-gold/30 bg-ink/55 backdrop-blur-md md:grid-cols-[1fr_1fr_0.7fr_auto]"
    >
      <label className="border-b border-r border-gold/20 px-6 py-4 md:border-b-0">
        <span className={label}>Arrival</span>
        <input type="date" value={arrival} min={iso(today)} onChange={(e) => setArrival(e.target.value)} className={input} />
      </label>
      <label className="border-b border-gold/20 px-6 py-4 md:border-b-0 md:border-r">
        <span className={label}>Departure</span>
        <input type="date" value={departure} min={arrival} onChange={(e) => setDeparture(e.target.value)} className={input} />
      </label>
      <label className="border-r border-gold/20 px-6 py-4">
        <span className={label}>Guests</span>
        <select value={guests} onChange={(e) => setGuests(e.target.value)} className={`${input} appearance-none`}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} className="bg-ink">
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>
      <button className="foil-bg eyebrow px-8 py-4 text-[0.66rem] text-ink transition hover:brightness-110">
        Check availability
      </button>
    </form>
  );
}
