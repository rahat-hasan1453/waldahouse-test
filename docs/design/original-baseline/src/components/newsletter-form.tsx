"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState("done");
      setMsg("Thank you — our letters from the lake will find you.");
      setEmail("");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex items-end gap-3 border-b border-cream/25 focus-within:border-gold-light">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="editorial w-full bg-transparent py-3 text-lg text-cream outline-none placeholder:text-cream/40"
        />
        <button disabled={state === "loading"} className="eyebrow shrink-0 pb-3.5 text-[0.62rem] text-gold-light hover:text-cream disabled:opacity-50">
          {state === "loading" ? "…" : "Subscribe →"}
        </button>
      </div>
      {msg && <p className={`editorial mt-3 text-base ${state === "error" ? "text-red-300" : "text-sage"}`}>{msg}</p>}
    </form>
  );
}
