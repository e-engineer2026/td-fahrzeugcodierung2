import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

async function ensureTable() {
  const sql = database();
  await sql`CREATE TABLE IF NOT EXISTS saved_vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id text NOT NULL,
    brand varchar(50) NOT NULL,
    model varchar(120) NOT NULL,
    year smallint NOT NULL,
    codings jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  return sql;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  try {
    const sql = await ensureTable();
    const vehicles = await sql`
      SELECT id, brand, model, year, codings, created_at
      FROM saved_vehicles WHERE clerk_user_id = ${userId}
      ORDER BY created_at DESC`;
    return NextResponse.json({ vehicles }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Gespeicherte Fahrzeuge konnten nicht geladen werden." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Ungültige Fahrzeugdaten." }, { status: 400 });
  const data = body as { brand?: unknown; model?: unknown; year?: unknown; codings?: unknown };
  const brand = typeof data.brand === "string" ? data.brand.trim().slice(0, 50) : "";
  const model = typeof data.model === "string" ? data.model.trim().slice(0, 120) : "";
  const year = Number(data.year);
  const codings = Array.isArray(data.codings) ? data.codings.filter((item): item is string => typeof item === "string").slice(0, 100).map((item) => item.slice(0, 240)) : null;
  if (!brand || !model || !Number.isInteger(year) || year < 1980 || year > new Date().getFullYear() + 1 || !codings) {
    return NextResponse.json({ error: "Bitte Fahrzeug und Baujahr vollständig auswählen." }, { status: 400 });
  }
  try {
    const sql = await ensureTable();
    const [vehicle] = await sql`
      INSERT INTO saved_vehicles (clerk_user_id, brand, model, year, codings)
      VALUES (${userId}, ${brand}, ${model}, ${year}, ${JSON.stringify(codings)}::jsonb)
      RETURNING id, brand, model, year, codings, created_at`;
    return NextResponse.json({ vehicle }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Fahrzeug konnte nicht gespeichert werden." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Ungültige Fahrzeug-ID." }, { status: 400 });
  try {
    const sql = await ensureTable();
    await sql`DELETE FROM saved_vehicles WHERE id = ${id}::uuid AND clerk_user_id = ${userId}`;
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Fahrzeug konnte nicht gelöscht werden." }, { status: 500 });
  }
}
