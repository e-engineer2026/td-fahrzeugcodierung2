import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { newGuestToken, hashGuestToken } from "../../../../lib/guideGuestToken";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };
const baseUrl = "https://td-fahrzeugcodierung.de/codieranleitungen/golf7-vze/freigabe";

function isSameOrigin(request: Request): boolean {
  return request.headers.get("origin") === new URL(request.url).origin;
}
function transactionId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim().toUpperCase();
  return /^[A-Z0-9-]{8,64}$/.test(clean) ? clean : null;
}

/** Die Zahlungsverifikation erfolgt durch den Admin im echten PayPal-Konto,
 * nicht durch den Browser oder einen vermeintlichen PayPal.Me-Redirect. */
export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Administratorberechtigung." }, { status: 403, headers });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Ungueltige Herkunft." }, { status: 403, headers });

  let data: { recipientEmail?: unknown; transactionId?: unknown; paymentVerified?: unknown };
  try { data = await request.json(); } catch {
    return NextResponse.json({ error: "Ungueltige Eingaben." }, { status: 400, headers });
  }
  const email = typeof data?.recipientEmail === "string" ? data.recipientEmail.trim().toLowerCase() : "";
  const reference = transactionId(data?.transactionId);
  if (!reference || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data?.paymentVerified !== true)
    return NextResponse.json({ error: "Transaktionsnummer, Empfaenger-E-Mail und bestaetigte Zahlungspruefung erforderlich." }, { status: 400, headers });

  try {
    const sql = await ensureGuideShopSchema();
    const [document] = await sql`SELECT product_id FROM td_guide_documents
      WHERE product_id=${GOLF7_VZE.id} AND sha256=${GOLF7_VZE.expectedSha256}`;
    if (!document) return NextResponse.json({ error: "PDF-Dokument fehlt oder Pruefsumme stimmt nicht." }, { status: 503, headers });
    const claimToken = newGuestToken();
    const claimHash = hashGuestToken(claimToken);
    if (!claimHash) throw new Error("Token konnte nicht erstellt werden.");
    // Die eindeutige PayPal-Transaktionsnummer blockiert Mehrfachfreigaben.
    const existing = await sql`SELECT id FROM td_guide_manual_grants
      WHERE paypal_transaction_id=${reference} LIMIT 1`;
    if (existing.length) return NextResponse.json({ error: "Diese PayPal-Transaktion wurde bereits bearbeitet." }, { status: 409, headers });
    const [accountOrder] = await sql`SELECT id FROM td_guide_orders
      WHERE paypal_transaction_id=${reference} LIMIT 1`;
    if (accountOrder) return NextResponse.json({ error: "Diese PayPal-Transaktion wurde bereits einem Kundenkonto zugeordnet." }, { status: 409, headers });
    await sql`INSERT INTO td_guide_manual_grants
      (product_id, recipient_email, paypal_transaction_id, claim_token_hash, status, expires_at)
      VALUES (${GOLF7_VZE.id}, ${email}, ${reference}, ${claimHash}, 'issued',
        now() + interval '7 days')`;
    // Hash-Fragment: Das Einmal-Token wird nicht als URL-Pfad/Query zum Server uebertragen.
    return NextResponse.json({
      link: baseUrl + "#token=" + claimToken,
      recipientEmail: email,
      expiresInDays: 7,
      paymentVerifiedByAdmin: true,
    }, { status: 201, headers });
  } catch (error) {
    const detail = String(error);
    if (/duplicate key|unique constraint|23505/i.test(detail))
      return NextResponse.json({ error: "Diese PayPal-Transaktion ist bereits freigegeben." }, { status: 409, headers });
    return NextResponse.json({ error: "Freigabe konnte nicht erstellt werden." }, { status: 500, headers });
  }
}

/** Bei Erstattung/Chargeback den Einmallink und bereits beanspruchten Download sperren. */
export async function DELETE(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Administratorberechtigung." }, { status: 403, headers });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Ungueltige Herkunft." }, { status: 403, headers });

  let data: { transactionId?: unknown };
  try { data = await request.json(); } catch {
    return NextResponse.json({ error: "Ungueltige Eingaben." }, { status: 400, headers });
  }
  const reference = transactionId(data?.transactionId);
  if (!reference) return NextResponse.json({ error: "Gueltige PayPal-Transaktionsnummer fehlt." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [result] = await sql`WITH revoked AS (
      UPDATE td_guide_manual_grants SET status='revoked'
      WHERE paypal_transaction_id=${reference} AND status IN ('issued', 'redeemed')
      RETURNING guest_order_id
    ), blocked AS (
      UPDATE td_guide_guest_orders SET status='refunded'
      WHERE id IN (SELECT guest_order_id FROM revoked) AND status='paid'
      RETURNING id
    )
    SELECT (SELECT count(*)::int FROM revoked) AS revoked,
      (SELECT count(*)::int FROM blocked) AS blocked`;
    if (!result || Number(result.revoked) !== 1)
      return NextResponse.json({ error: "Keine aktive Freigabe fuer diese Transaktion gefunden." }, { status: 404, headers });
    return NextResponse.json({ revoked: true, downloadBlocked: Number(result.blocked) > 0 }, { headers });
  } catch {
    return NextResponse.json({ error: "Freigabe konnte nicht gesperrt werden." }, { status: 500, headers });
  }
}
