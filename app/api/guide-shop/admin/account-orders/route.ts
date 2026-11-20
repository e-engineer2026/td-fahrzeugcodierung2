import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const rows = await sql`SELECT id, buyer_email, created_at, paypal_started_at FROM td_guide_orders
      WHERE product_id=${GOLF7_VZE.id} AND status='pending' AND buyer_email IS NOT NULL
      ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json({ orders: rows.map(row => ({ id: row.id,
      email: row.buyer_email, createdAt: row.created_at,
      paypalStartedAt: row.paypal_started_at ?? null,
      reference: `TDG7-${String(row.id).slice(0, 8).toUpperCase()}` })) }, { headers });
  } catch { return NextResponse.json({ error: "Bestellungen nicht verfügbar." }, { status: 500, headers }); }
}

export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { orderId?: unknown; transactionId?: unknown; paymentVerified?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  const id = typeof body.orderId === "string" && /^[a-f\d-]{36}$/i.test(body.orderId) ? body.orderId : "";
  const transaction = typeof body.transactionId === "string" ? body.transactionId.trim().toUpperCase() : "";
  if (!id || !/^[A-Z0-9-]{8,64}$/.test(transaction) || body.paymentVerified !== true)
    return NextResponse.json({ error: "Bestellung und geprüfte PayPal-Transaktion erforderlich." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [document] = await sql`SELECT product_id FROM td_guide_documents
      WHERE product_id=${GOLF7_VZE.id} AND sha256=${GOLF7_VZE.expectedSha256}`;
    if (!document) return NextResponse.json({ error: "PDF fehlt oder Prüfsumme stimmt nicht." }, { status: 503, headers });
    const [guestGrant] = await sql`SELECT id FROM td_guide_manual_grants
      WHERE paypal_transaction_id=${transaction} LIMIT 1`;
    if (guestGrant) return NextResponse.json({ error: "Diese Transaktion wurde bereits für einen Gastzugang verwendet." }, { status: 409, headers });
    // Unique index on the transaction ID prevents using the same payment twice.
    const [order] = await sql`UPDATE td_guide_orders SET status='paid', paid_at=now(),
      paypal_transaction_id=${transaction} WHERE id=${id}::uuid AND product_id=${GOLF7_VZE.id}
      AND amount_cents=${GOLF7_VZE.priceCents} AND currency=${GOLF7_VZE.currency}
      AND status='pending' AND buyer_email IS NOT NULL RETURNING buyer_email`;
    if (!order) return NextResponse.json({ error: "Offene Bestellung nicht gefunden." }, { status: 409, headers });
    return NextResponse.json({ released: true, email: order.buyer_email }, { headers });
  } catch (error) {
    if (/duplicate key|unique constraint|23505/i.test(String(error)))
      return NextResponse.json({ error: "Diese PayPal-Transaktion wurde bereits verwendet." }, { status: 409, headers });
    return NextResponse.json({ error: "Freigabe fehlgeschlagen." }, { status: 500, headers });
  }
}

export async function DELETE(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { transactionId?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  const transaction = typeof body.transactionId === "string" ? body.transactionId.trim().toUpperCase() : "";
  if (!/^[A-Z0-9-]{8,64}$/.test(transaction))
    return NextResponse.json({ error: "Transaktionsnummer fehlt." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [order] = await sql`UPDATE td_guide_orders SET status='refunded'
      WHERE paypal_transaction_id=${transaction} AND product_id=${GOLF7_VZE.id}
      AND status='paid' RETURNING id`;
    return order ? NextResponse.json({ revoked: true }, { headers }) :
      NextResponse.json({ error: "Aktive Freigabe nicht gefunden." }, { status: 404, headers });
  } catch { return NextResponse.json({ error: "Sperrung fehlgeschlagen." }, { status: 500, headers }); }
}
