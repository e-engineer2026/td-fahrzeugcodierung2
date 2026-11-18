import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GOLF7_VZE, validateCompletedCapture } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { configuredShopMode, capturePaypalGuideOrder } from "../../../../lib/guidePaypal";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  if (configuredShopMode() === "off") return NextResponse.json({ error: "Checkout nicht verfügbar." }, { status: 503, headers });
  let body: { paypalOrderId?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ungültige Daten." }, { status: 400, headers }); }
  const paypalOrderId = body?.paypalOrderId;
  if (typeof paypalOrderId !== "string" || !/^[A-Z0-9-]{6,64}$/i.test(paypalOrderId))
    return NextResponse.json({ error: "Ungültige Bestellnummer." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [entry] = await sql`SELECT id, amount_cents, currency, status FROM td_guide_orders
      WHERE clerk_user_id = ${userId} AND paypal_order_id = ${paypalOrderId}
        AND product_id = ${GOLF7_VZE.id} LIMIT 1`;
    if (!entry) return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404, headers });
    if (entry.status === "paid") return NextResponse.json({ paid: true }, { headers });
    if (entry.status !== "pending" || entry.amount_cents !== GOLF7_VZE.priceCents ||
      entry.currency !== GOLF7_VZE.currency) return NextResponse.json({ error: "Bestellstatus ungültig." }, { status: 409, headers });
    const localId = String(entry.id);
    const captured = await capturePaypalGuideOrder(paypalOrderId, localId);
    const verified = validateCompletedCapture(captured, localId, paypalOrderId);
    if (!verified) return NextResponse.json({ error: "Zahlung nicht vollständig bestätigt." }, { status: 422, headers });
    const updated = await sql`UPDATE td_guide_orders SET status='paid',
      paypal_capture_id=${verified.captureId}, paid_at=now()
      WHERE id=${localId}::uuid AND clerk_user_id=${userId} AND status='pending' RETURNING id`;
    if (updated.length !== 1) return NextResponse.json({ error: "Bestellstatus hat sich geändert." }, { status: 409, headers });
    return NextResponse.json({ paid: true }, { headers });
  } catch {
    return NextResponse.json({ error: "Zahlungsprüfung fehlgeschlagen. Nicht erneut bezahlen." }, { status: 502, headers });
  }
}
