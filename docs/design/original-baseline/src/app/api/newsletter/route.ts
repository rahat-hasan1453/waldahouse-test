import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletter } from "@/db/schema";

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  try {
    await db.insert(newsletter).values({ email }).onConflictDoNothing();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter insert failed", err);
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 500 });
  }
}
