import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

type MailInput = {
  messageId?: unknown;
  sender?: unknown;
  subject?: unknown;
  messageAt?: unknown;
  plainBody?: unknown;
};

function isPayPalSender(value: string): boolean {
  const candidate = (value.match(/<([^<>]+)>/)?.[1] ?? value).trim().toLowerCase();
  const domain = candidate.split("@")[1] ?? "";
  return /^(?:[a-z0-9-]+\.)*paypal\.(?:com|de)$/.test(domain);
}

function isReceivedPaymentSubject(subject: string): boolean {
  return /(zahlung erhalten|zahlung von|hat ihnen .{0,60}gesendet|geld erhalten|received a payment|payment received|you(?:'|’)ve received|sent you money|has sent you money)/i.test(subject);
}

function findTransactionId(body: string): string | null {
  const matches = [...body.matchAll(/(?:Transaktions(?:nummer|code|-?ID)|Transaction\s*(?:ID|number))\s*[:#\-]?\s*([a-z0-9-]{8,64})/gi)]
    .map((m) => m[1].toUpperCase());
  return matches.length > 0 && new Set(matches).size === 1 ? matches[0] : null;
}

function hasTargetAmount(body: string): boolean {
  return /(?:13[.,]99\s*(?:EUR|€)|(?:EUR|€)\s*13[.,]99)/i.test(body);
}

/** Gmail-Hinweise sind niemals ein verifizierter PayPal-Zahlungsnachweis. */
export async function POST(request: Request) {
  const rawToken = request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1];
  if (!rawToken) return NextResponse.json({ error: "Nicht berechtigt." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [config] = await sql`SELECT secret_hash FROM td_guide_gmail_config WHERE id='primary'`;
    const expected = typeof config?.secret_hash === "string" && /^[a-f0-9]{64}$/.test(config.secret_hash)
      ? Buffer.from(config.secret_hash, "hex") : Buffer.alloc(32);
    const supplied = createHash("sha256").update(rawToken).digest();
    if (!timingSafeEqual(supplied, expected) || !config) {
      return NextResponse.json({ error: "Nicht berechtigt." }, { status: 401, headers });
    }
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 90000) {
      return NextResponse.json({ error: "Daten zu groß." }, { status: 413, headers });
    }
    let data: { messages?: MailInput[] };
    try { data = JSON.parse(raw); } catch {
      return NextResponse.json({ error: "Ungültige JSON-Daten." }, { status: 400, headers });
    }
    if (!Array.isArray(data.messages) || data.messages.length > 15) {
      return NextResponse.json({ error: "Ungültige Nachrichtenzahl." }, { status: 400, headers });
    }
    let imported = 0;
    let ignored = 0;
    const now = Date.now();
    for (const m of data.messages) {
      const id = typeof m?.messageId === "string" ? m.messageId.trim() : "";
      const sender = typeof m?.sender === "string" ? m.sender.slice(0, 300) : "";
      const subject = typeof m?.subject === "string" ? m.subject.slice(0, 300) : "";
      const body = typeof m?.plainBody === "string" ? m.plainBody.slice(0, 15000) : "";
      const mailTime = typeof m?.messageAt === "string" ? Date.parse(m.messageAt) : NaN;
      if (!/^[a-zA-Z0-9_-]{8,120}$/.test(id) || !isPayPalSender(sender) ||
          !isReceivedPaymentSubject(subject) || !Number.isFinite(mailTime) ||
          mailTime < now - 14 * 86400000 || mailTime > now + 3600000) {
        ignored++;
        continue;
      }
      // Es werden nur abgeleitete Metadaten gespeichert, niemals der Mailtext.
      const transaction = findTransactionId(body);
      const amountCents = hasTargetAmount(body) ? 1399 : null;
      const currency = amountCents === 1399 ? "EUR" : null;
      const [inserted] = await sql`INSERT INTO td_guide_gmail_receipts
        (message_id, sender, subject, message_at, transaction_id, amount_cents, currency)
        VALUES (${id}, ${sender}, ${subject}, ${new Date(mailTime).toISOString()},
        ${transaction}, ${amountCents}, ${currency})
        ON CONFLICT (message_id) DO NOTHING RETURNING message_id`;
      if (inserted) imported++;
    }
    await sql`UPDATE td_guide_gmail_config SET last_received_at=now() WHERE id='primary'`;
    return NextResponse.json({ received: data.messages.length, imported, ignored }, { headers });
  } catch {
    return NextResponse.json({ error: "Import momentan nicht verfügbar." }, { status: 500, headers });
  }
}
