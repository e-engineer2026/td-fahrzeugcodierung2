import { NextResponse } from "next/server";
import { GOLF7_VZE, validateCompletedCapture } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { configuredShopMode, capturePaypalGuideOrder } from "../../../../lib/guidePaypal";
import { guestTokenHashFromCookie } from "../../../../lib/guideGuest";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  if (configuredShopMode() === "off")
    return NextResponse.json({ error: "Checkout nicht verfügbar." }, { status: 503, headers });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  const guestHash = await guestTokenHashFromCookie();
  if (!guestHash)
    return NextResponse.json({ error: "Gastbestellung nicht gefunden. Bitte denselben Browser verwenden." },
      { status: 403, headers });

  let body: { paypalOrderId?: string };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Ungültige Daten." }, { status: 400, headers });
  }
  const paypalId = body?.paypalOrderId;
  if (typeof paypalId !== "string" || !/^[A-Z0-9-]{6,64}$/i.test(paypalId))
    return NextResponse.json({ error: "Ungültige PayPal-Bestellnummer." }, { status: 400, headers });

  try {
    const sql = await ensureGuideShopSchema();
    const [row] = await sql`SELECT id, amount_cents, currency, status FROM td_guide_guest_orders
      WHERE guest_token_hash=${guestHash} AND paypal_order_id=${paypalId}
        AND product_id=${GOLF7_VZE.id} LIMIT 1`;
    if (!row) return NextResponse.json({ error: "Keine zu diesem Browser gehörende Bestellung." },
      { status: 403, headers });
    if (row.status === "paid")
      return NextResponse.json({ paid: true, downloadUrl: "/api/guide-shop/download/golf7-vze" },
        { headers });
    if (row.status !== "pending" || row.amount_cents !== GOLF7_VZE.priceCents ||
        row.currency !== GOLF7_VZE.currency)
      return NextResponse.json({ error: "Bestellstatus ungültig." }, { status: 409, headers });

    const localId = String(row.id);
    const response = await capturePaypalGuideOrder(paypalId, localId);
    const verified = validateCompletedCapture(response, localId, paypalId);
    if (!verified)
      return NextResponse.json({ error: "PayPal hat die Zahlung noch nicht vollständig bestätigt." },
        { status: 422, headers });
    // PayPal-confirmed capture and claim are persisted atomically.
    // A previously used capture ID cannot pay a second order.
    const update = await sql`WITH eligible AS (
      SELECT id FROM td_guide_guest_orders
      WHERE id=${localId}::uuid AND guest_token_hash=${guestHash} AND status='pending'
      FOR UPDATE
    ), claimed AS (
      INSERT INTO td_guide_payment_claims (transaction_id, claim_kind, owner_reference)
      SELECT ${verified.captureId}, 'guest', ${localId} FROM eligible
      ON CONFLICT (transaction_id) DO NOTHING RETURNING transaction_id
    )
    UPDATE td_guide_guest_orders SET status='paid', paypal_capture_id=${verified.captureId}, paid_at=now()
    WHERE id=${localId}::uuid AND guest_token_hash=${guestHash} AND status='pending'
      AND EXISTS (SELECT 1 FROM claimed)
    RETURNING id`;
    if (!update.length) {
      const [paid] = await sql`SELECT id FROM td_guide_guest_orders WHERE
        id=${localId}::uuid AND guest_token_hash=${guestHash} AND status='paid'`;
      if (!paid) return NextResponse.json({ error: "Bestellstatus wurde geändert." },
        { status: 409, headers });
    }
    return NextResponse.json({ paid: true, downloadUrl: "/api/guide-shop/download/golf7-vze" },
      { headers });
  } catch {
    return NextResponse.json({
      error: "Zahlung konnte nicht bestätigt werden. Bitte keine zweite Bestellung auslösen."
    }, { status: 502, headers });
  }
}
