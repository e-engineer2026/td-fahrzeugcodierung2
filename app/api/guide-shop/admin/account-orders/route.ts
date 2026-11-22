import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { guideOrderProductFromId, orderReference } from "../../../../lib/vzeShopProducts";
import { findMqbGuideProduct } from "../../../../lib/mqbGuideProducts";
import { readMqbGuideDocument } from "../../../../lib/mqbGuideDocument";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const rows = await sql`SELECT id, product_id, buyer_email, created_at, paypal_started_at, amount_cents, currency
      FROM td_guide_orders
      WHERE status='pending' AND buyer_email IS NOT NULL
      ORDER BY created_at DESC LIMIT 100`;
    const orders = rows.flatMap(row => {
      const product = guideOrderProductFromId(String(row.product_id));
      if (!product) return [];
      return [{
        id: row.id, productId: product.id, productName: product.model,
        amountCents: row.amount_cents, currency: row.currency,
        email: row.buyer_email, createdAt: row.created_at,
        paypalStartedAt: row.paypal_started_at ?? null,
        reference: orderReference(String(row.id), product),
      }];
    });
    return NextResponse.json({ orders }, { headers });
  } catch { return NextResponse.json({ error: "Bestellungen nicht verfügbar." }, { status: 500, headers }); }
}

/** PDF access only after real PayPal transaction was independently checked by authorized admin. */
export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { orderId?: unknown; transactionId?: unknown; paymentVerified?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  const id = typeof body.orderId === "string" && /^[a-f\d-]{36}$/i.test(body.orderId) ? body.orderId : "";
  const transaction = typeof body.transactionId === "string" ? body.transactionId.trim().toUpperCase() : "";
  if (!id || !/^[A-Z0-9-]{8,64}$/.test(transaction) || body.paymentVerified !== true)
    return NextResponse.json({ error: "Bestellung und im PayPal-Konto geprüfte Transaktion erforderlich." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [pending] = await sql`SELECT product_id, amount_cents, currency
      FROM td_guide_orders WHERE id=${id}::uuid AND status='pending' AND buyer_email IS NOT NULL`;
    const product = pending ? guideOrderProductFromId(String(pending.product_id)) : null;
    if (!product || Number(pending.amount_cents) !== product.priceCents || pending.currency !== "EUR")
      return NextResponse.json({ error: "Ungültige offene Produktbestellung." }, { status: 409, headers });
    const mqb = findMqbGuideProduct(product.id);
    const [document] = await sql`SELECT product_id FROM td_guide_documents
      WHERE product_id=${product.id} AND (sha256=${product.sha256} OR assigned_filename IS NOT NULL)`;
    if (!document && !(mqb && readMqbGuideDocument(mqb))) return NextResponse.json({ error: "PDF fehlt oder Prüfsumme stimmt nicht." }, { status: 503, headers });
    const [guestGrant] = await sql`SELECT id FROM td_guide_manual_grants
      WHERE paypal_transaction_id=${transaction} LIMIT 1`;
    if (guestGrant) return NextResponse.json({ error: "Diese Transaktion wurde bereits für einen Gastzugang verwendet." }, { status: 409, headers });
    const [order] = await sql`UPDATE td_guide_orders SET status='paid', paid_at=now(),
      paypal_transaction_id=${transaction}
      WHERE id=${id}::uuid AND product_id=${product.id} AND amount_cents=${product.priceCents}
        AND currency='EUR' AND status='pending' AND buyer_email IS NOT NULL
      RETURNING buyer_email`;
    if (!order) return NextResponse.json({ error: "Offene Bestellung nicht gefunden." }, { status: 409, headers });
    return NextResponse.json({ released: true, email: order.buyer_email, model: product.model }, { headers });
  } catch (error) {
    if (/duplicate key|unique constraint|23505/i.test(String(error)))
      return NextResponse.json({ error: "Diese PayPal-Transaktion wurde bereits verwendet." }, { status: 409, headers });
    return NextResponse.json({ error: "Freigabe fehlgeschlagen." }, { status: 500, headers });
  }
}

/** Remove an open order from the list without erasing payment or customer records. */
export async function PATCH(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { orderId?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  const id = typeof body.orderId === "string" && /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(body.orderId) ? body.orderId : "";
  if (!id) return NextResponse.json({ error: "Ungültige Bestellung." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [order] = await sql`UPDATE td_guide_orders SET status='failed'
      WHERE id=${id}::uuid AND status='pending' AND buyer_email IS NOT NULL
        AND paypal_transaction_id IS NULL AND paypal_capture_id IS NULL AND paid_at IS NULL
      RETURNING id`;
    return order ? NextResponse.json({ removed: true }, { headers }) :
      NextResponse.json({ error: "Bestellung ist nicht mehr offen oder wurde bereits verarbeitet. Bitte aktualisieren." }, { status: 409, headers });
  } catch { return NextResponse.json({ error: "Bestellung konnte nicht entfernt werden." }, { status: 500, headers }); }
}

export async function DELETE(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { transactionId?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  const transaction = typeof body.transactionId === "string" ? body.transactionId.trim().toUpperCase() : "";
  if (!/^[A-Z0-9-]{8,64}$/.test(transaction))
    return NextResponse.json({ error: "Transaktionsnummer fehlt." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [order] = await sql`UPDATE td_guide_orders SET status='refunded'
      WHERE paypal_transaction_id=${transaction} AND status='paid' RETURNING id`;
    return order ? NextResponse.json({ revoked: true }, { headers }) :
      NextResponse.json({ error: "Aktive Freigabe nicht gefunden." }, { status: 404, headers });
  } catch { return NextResponse.json({ error: "Sperrung fehlgeschlagen." }, { status: 500, headers }); }
}
