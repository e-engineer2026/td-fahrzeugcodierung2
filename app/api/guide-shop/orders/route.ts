import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { configuredShopMode, createPaypalGuideOrder } from "../../../lib/guidePaypal";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  if (configuredShopMode() === "off") return NextResponse.json({ error: "Shop noch nicht freigeschaltet." }, { status: 503, headers });
  let body: { productId?: string; termsAccepted?: boolean; immediateDeliveryConsent?: boolean; withdrawalAcknowledged?: boolean };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ungültige Daten." }, { status: 400, headers }); }
  if (body?.productId !== GOLF7_VZE.id || body.termsAccepted !== true ||
      body.immediateDeliveryConsent !== true || body.withdrawalAcknowledged !== true) {
    return NextResponse.json({ error: "Artikel und Einwilligungen fehlen." }, { status: 400, headers });
  }
  try {
    const sql = await ensureGuideShopSchema();
    const [doc] = await sql`SELECT product_id FROM td_guide_documents WHERE product_id = ${GOLF7_VZE.id}`;
    if (!doc) return NextResponse.json({ error: "PDF noch nicht bereitgestellt." }, { status: 503, headers });
    const [rate] = await sql`SELECT count(*)::int AS attempts FROM td_guide_orders
      WHERE clerk_user_id = ${userId} AND created_at > now() - interval '1 hour'`;
    if (Number(rate?.attempts ?? 0) >= 5)
      return NextResponse.json({ error: "Zu viele Bestellversuche. Bitte später erneut versuchen." }, { status: 429, headers });
    const [paid] = await sql`SELECT id FROM td_guide_orders WHERE clerk_user_id = ${userId}
      AND product_id = ${GOLF7_VZE.id} AND status = 'paid' LIMIT 1`;
    if (paid) return NextResponse.json({ error: "Schon gekauft; im Konto herunterladen." }, { status: 409, headers });
    const [row] = await sql`INSERT INTO td_guide_orders
      (clerk_user_id, product_id, amount_cents, currency, status,
       immediate_delivery_consent, withdrawal_acknowledged, terms_accepted)
      VALUES (${userId}, ${GOLF7_VZE.id}, ${GOLF7_VZE.priceCents}, ${GOLF7_VZE.currency},
        'pending', true, true, true) RETURNING id`;
    const orderId = String(row.id);
    try {
      const payment = await createPaypalGuideOrder(orderId);
      await sql`UPDATE td_guide_orders SET paypal_order_id = ${payment.paypalOrderId}
        WHERE id = ${orderId}::uuid AND clerk_user_id = ${userId} AND status = 'pending'`;
      return NextResponse.json({ approveUrl: payment.approveUrl }, { status: 201, headers });
    } catch {
      await sql`UPDATE td_guide_orders SET status = 'failed'
        WHERE id = ${orderId}::uuid AND status = 'pending'`;
      return NextResponse.json({ error: "PayPal-Checkout konnte nicht gestartet werden." },
        { status: 502, headers });
    }
  } catch {
    return NextResponse.json({ error: "Bestellung konnte nicht vorbereitet werden." },
      { status: 500, headers });
  }
}
