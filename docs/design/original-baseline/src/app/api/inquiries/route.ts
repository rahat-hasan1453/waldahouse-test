import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";

const TYPES = new Set(["room", "table", "event", "spa", "whisky"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max: number) {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const type = str(body.type, 32);
  const name = str(body.name, 160);
  const email = str(body.email, 200);
  if (!type || !TYPES.has(type)) return NextResponse.json({ error: "Please choose an enquiry type." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  const arrival = str(body.arrival, 10);
  const departure = str(body.departure, 10);
  if (arrival && !DATE_RE.test(arrival)) return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  if (departure && !DATE_RE.test(departure)) return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  if (arrival && departure && departure <= arrival)
    return NextResponse.json({ error: "Departure must be after arrival." }, { status: 400 });

  const guestsRaw = Number(body.guests);
  const guests = Number.isFinite(guestsRaw) && guestsRaw > 0 ? Math.min(Math.round(guestsRaw), 500) : null;

  try {
    const [row] = await db
      .insert(inquiries)
      .values({
        type,
        name,
        email,
        phone: str(body.phone, 60),
        arrival,
        departure,
        guests,
        roomSlug: str(body.roomSlug, 80),
        message: str(body.message, 4000),
      })
      .returning({ id: inquiries.id });
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (err) {
    console.error("inquiry insert failed", err);
    return NextResponse.json({ error: "We couldn't save your request. Please call us." }, { status: 500 });
  }
}
