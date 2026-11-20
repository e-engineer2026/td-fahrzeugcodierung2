import { randomBytes, createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [config] = await sql`SELECT created_at, last_received_at FROM td_guide_gmail_config WHERE id='primary'`;
    const entries = await sql`SELECT message_id, subject, message_at, transaction_id, amount_cents, currency
      FROM td_guide_gmail_receipts ORDER BY message_at DESC LIMIT 40`;
    return NextResponse.json({
      configured: Boolean(config),
      lastReceivedAt: config?.last_received_at ?? null,
      receipts: entries.map((item) => ({
        messageId: item.message_id,
        subject: item.subject,
        messageAt: item.message_at,
        transactionId: item.transaction_id ?? null,
        amountCents: item.amount_cents ?? null,
        currency: item.currency ?? null,
      })),
    }, { headers });
  } catch {
    return NextResponse.json({ error: "Gmail-Eingänge konnten nicht geladen werden." }, { status: 500, headers });
  }
}

/** Rotiert den Schlüssel. Er erscheint genau einmal und wird in der Datenbank nur gehasht gespeichert. */
export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  try {
    const secret = randomBytes(32).toString("base64url");
    const hash = createHash("sha256").update(secret).digest("hex");
    const sql = await ensureGuideShopSchema();
    await sql`INSERT INTO td_guide_gmail_config (id, secret_hash) VALUES ('primary', ${hash})
      ON CONFLICT (id) DO UPDATE SET secret_hash=EXCLUDED.secret_hash, created_at=now(), last_received_at=NULL`;
    return NextResponse.json({ secret }, { headers });
  } catch {
    return NextResponse.json({ error: "Verbindungsschlüssel konnte nicht erstellt werden." }, { status: 500, headers });
  }
}
