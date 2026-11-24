"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/provider";
import { EngravedArrow } from "./craft";

export function NewsletterForm() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState<"" | "thanks" | "error">("");

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
      if (!res.ok) throw new Error(data.error);
      setState("done");
      setMsg("thanks");
      setEmail("");
    } catch {
      setState("error");
      setMsg("error");
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="underline-draw flex items-end gap-3 border-b border-cream/25 focus-within:border-gold-light">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("common", "newsletter.placeholder")}
          aria-label={t("common", "newsletter.label")}
          autoComplete="email"
          className="editorial w-full bg-transparent py-3 text-lg text-cream placeholder:text-cream-muted outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-busy={state === "loading" || undefined}
          className="eyebrow group inline-flex shrink-0 items-center gap-3 pb-3.5 text-[0.62rem] text-gold-light transition-colors duration-(--dur-quick) hover:text-cream disabled:opacity-50"
        >
          {state === "loading" ? "…" : t("common", "newsletter.subscribe")}
          <EngravedArrow />
        </button>
      </div>
      <p role="status" className={`editorial mt-3 min-h-[1.5rem] text-base ${state === "error" ? "text-error-on-dark" : "text-sage"}`}>
        {msg && t("common", `newsletter.${msg}`)}
      </p>
    </form>
  );
}
