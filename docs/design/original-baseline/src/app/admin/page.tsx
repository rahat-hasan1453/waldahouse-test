import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, newsletter } from "@/db/schema";
import { Logo } from "@/components/logo";
import { inquiryTypes, rooms } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Enquiries", robots: { index: false, follow: false } };

const STATUSES = ["new", "replied", "confirmed", "declined"] as const;

async function setStatus(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || !(STATUSES as readonly string[]).includes(status)) return;
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  revalidatePath("/admin");
}

const statusStyle: Record<string, string> = {
  new: "bg-gold/20 text-gold-deep border-gold/40",
  replied: "bg-sage/30 text-pine border-sage",
  confirmed: "bg-forest text-cream border-forest",
  declined: "bg-wine/10 text-claret border-wine/30",
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const sp = await searchParams;
  const key = typeof sp.key === "string" ? sp.key : "";
  const filter = typeof sp.type === "string" ? sp.type : "";

  if (process.env.ADMIN_KEY && key !== process.env.ADMIN_KEY) {
    return (
      <div className="cloth flex min-h-screen items-center justify-center p-6 text-cream">
        <form className="w-full max-w-sm border border-gold/30 p-10 text-center">
          <Logo />
          <p className="editorial mt-8 text-lg text-cream/70">Staff access</p>
          <input name="key" type="password" placeholder="Access key" className="mt-4 w-full border-b border-cream/30 bg-transparent py-3 text-cream outline-none" />
          <button className="foil-bg eyebrow mt-8 w-full py-3 text-[0.62rem] text-ink">Enter</button>
        </form>
      </div>
    );
  }

  const where = filter ? eq(inquiries.type, filter) : undefined;
  const [rows, [{ total }], [{ subs }]] = await Promise.all([
    db.select().from(inquiries).where(where).orderBy(desc(inquiries.createdAt)).limit(200),
    db.select({ total: count() }).from(inquiries),
    db.select({ subs: count() }).from(newsletter),
  ]);
  const newCount = rows.filter((r) => r.status === "new").length;
  const q = (t: string) => {
    const p = new URLSearchParams();
    if (key) p.set("key", key);
    if (t) p.set("type", t);
    const s = p.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  return (
    <div className="paper min-h-screen">
      <header className="bg-ink">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Logo />
          <Link href="/" className="eyebrow text-[0.6rem] text-gold-light">View website →</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-14">
        <span className="eyebrow text-gold-deep">Front desk</span>
        <h1 className="display mt-4 text-4xl">Enquiries</h1>

        <div className="mt-10 grid grid-cols-3 gap-px border border-ink/10 bg-ink/10">
          {[
            [String(total), "Total enquiries"],
            [String(newCount), "Awaiting reply (shown)"],
            [String(subs), "Newsletter subscribers"],
          ].map(([n, l]) => (
            <div key={l} className="bg-linen p-6">
              <p className="display foil text-4xl">{n}</p>
              <p className="eyebrow mt-2 text-[0.55rem] text-ink/55">{l}</p>
            </div>
          ))}
        </div>

        <nav className="mt-10 flex flex-wrap gap-2">
          {[{ value: "", label: "All" }, ...inquiryTypes].map((t) => (
            <Link
              key={t.value}
              href={q(t.value)}
              className={`eyebrow border px-4 py-2 text-[0.56rem] ${filter === t.value ? "border-forest bg-forest text-cream" : "border-ink/20 text-ink/70"}`}
            >
              {t.label.split(" · ")[0]}
            </Link>
          ))}
        </nav>

        {rows.length === 0 ? (
          <p className="editorial mt-16 text-center text-2xl text-ink/50">No enquiries yet.</p>
        ) : (
          <ul className="mt-8 space-y-4">
            {rows.map((r) => (
              <li key={r.id} className="grid gap-6 border border-ink/10 bg-linen p-6 md:grid-cols-12">
                <div className="md:col-span-3">
                  <span className="eyebrow text-[0.55rem] text-gold-deep">
                    #{r.id} · {inquiryTypes.find((t) => t.value === r.type)?.label ?? r.type}
                  </span>
                  <p className="display mt-2 text-lg tracking-[0.06em]">{r.name}</p>
                  <a href={`mailto:${r.email}`} className="block text-sm text-pine underline">{r.email}</a>
                  {r.phone && <p className="text-sm text-ink/60">{r.phone}</p>}
                </div>
                <div className="editorial text-lg text-ink/75 md:col-span-3">
                  {r.arrival && <p>{r.arrival}{r.departure ? ` → ${r.departure}` : ""}</p>}
                  {r.guests && <p>{r.guests} guest{r.guests > 1 ? "s" : ""}</p>}
                  {r.roomSlug && <p>{rooms.find((x) => x.slug === r.roomSlug)?.name ?? r.roomSlug}</p>}
                  <p className="text-sm not-italic text-ink/45">{r.createdAt.toLocaleString("en-GB")}</p>
                </div>
                <p className="editorial text-lg text-ink/70 md:col-span-4">{r.message || "—"}</p>
                <form action={setStatus} className="flex flex-col items-start gap-2 md:col-span-2 md:items-end">
                  <input type="hidden" name="id" value={r.id} />
                  <span className={`eyebrow border px-3 py-1.5 text-[0.52rem] ${statusStyle[r.status] ?? ""}`}>{r.status}</span>
                  <div className="flex flex-wrap gap-1 md:justify-end">
                    {STATUSES.filter((s) => s !== r.status).map((s) => (
                      <button key={s} name="status" value={s} className="eyebrow text-[0.5rem] text-ink/50 underline-offset-2 hover:text-gold-deep hover:underline">
                        {s}
                      </button>
                    ))}
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
