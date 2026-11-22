import { NextResponse } from "next/server";
import { GOLF7_VZE, guideShopReturnOrigin } from "../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { configuredShopMode, createPaypalGuideOrder } from "../../../lib/guidePaypal";
import { guestTokenHashFromCookie, guestVisitorHash, hashGuestToken,
  newGuestToken, setGuestCookie } from "../../../lib/guideGuest";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  if (configuredShopMode() === "off")
    return NextResponse.json({ error: "Shop noch nicht freigeschaltet." }, { status: 503, headers });

  // Gast-Cookie und PayPal-Redirect müssen auf demselben Host bleiben.
  const redirectOrigin = guideShopReturnOrigin(process.env);
  const requestOrigin = new URL(request.url).origin;
  if (requestOrigin !== redirectOrigin || (request.headers.get("origin") &&
      request.headers.get("origin") !== requestOrigin)) {
    return NextResponse.json({ error: "Bitte die offizielle PayPal-Testseite direkt öffnen." },
      { status: 403, headers });
  }

  let body: { productId?: string; termsAccepted?: boolean; immediateDeliveryConsent?: boolean; withdrawalAcknowledged?: boolean };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Ungültige Daten." }, { status: 400, headers });
  }
  if (body?.productId !== GOLF7_VZE.id || body.termsAccepted !== true ||
      body.immediateDeliveryConsent !== true || body.withdrawalAcknowledged !== true) {
    return NextResponse.json({ error: "Artikel und Einwilligungen fehlen." }, { status: 400, headers });
  }

  try {
    const sql = await ensureGuideShopSchema();
    const [document] = await sql`SELECT product_id FROM td_guide_documents
      WHERE product_id=${GOLF7_VZE.id} AND NOT withdrawn AND (sha256=${GOLF7_VZE.expectedSha256} OR assigned_filename IS NOT NULL)`;
    if (!document) return NextResponse.json({ error: "PDF noch nicht für den Test bereitgestellt." },
      { status: 503, headers });

    const oldGuestHash = await guestTokenHashFromCookie();
    if (oldGuestHash) {
      const [existing] = await sql`SELECT id FROM td_guide_guest_orders WHERE
        guest_token_hash=${oldGuestHash} AND product_id=${GOLF7_VZE.id} AND status='paid'
        AND paid_at > now() - interval '30 days' LIMIT 1`;
      if (existing) return NextResponse.json({ error: "Die Anleitung ist bereits bezahlt und direkt herunterladbar." },
        { status: 409, headers });
    }
    const visitorHash = guestVisitorHash(request);
    if (visitorHash) {
      const [rate] = await sql`SELECT count(*)::int AS attempts FROM td_guide_guest_orders
        WHERE visitor_hash=${visitorHash} AND created_at > now() - interval '1 hour'`;
      if (Number(rate?.attempts ?? 0) >= 5) return NextResponse.json({
        error: "Zu viele Bestellversuche. Bitte später erneut versuchen."
      }, { status: 429, headers });
    }

    const guestToken = newGuestToken();
    const guestHash = hashGuestToken(guestToken);
    if (!guestHash) throw new Error("Ungültige Gastkennung.");
    const [row] = await sql`INSERT INTO td_guide_guest_orders
      (guest_token_hash, visitor_hash, product_id, amount_cents, currency, status,
       terms_accepted, immediate_delivery_consent, withdrawal_acknowledged)
      VALUES (${guestHash}, ${visitorHash}, ${GOLF7_VZE.id}, ${GOLF7_VZE.priceCents},
        ${GOLF7_VZE.currency}, 'pending', true, true, true) RETURNING id`;
    const id = String(row.id);
    try {
      const pay = await createPaypalGuideOrder(id);
      await sql`UPDATE td_guide_guest_orders SET paypal_order_id=${pay.paypalOrderId}
        WHERE id=${id}::uuid AND guest_token_hash=${guestHash} AND status='pending'`;
      const response = NextResponse.json({ approveUrl: pay.approveUrl },
        { status: 201, headers });
      setGuestCookie(response, guestToken);
      return response;
    } catch {
      await sql`UPDATE td_guide_guest_orders SET status='failed'
        WHERE id=${id}::uuid AND status='pending'`;
      return NextResponse.json({ error: "PayPal-Checkout konnte nicht gestartet werden." },
        { status: 502, headers });
    }
  } catch {
    return NextResponse.json({ error: "Bestellung konnte nicht vorbereitet werden." },
      { status: 500, headers });
  }
}
