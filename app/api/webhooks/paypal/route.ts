import { NextResponse } from "next/server";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { configuredShopMode, verifyPayPalWebhook } from "../../../lib/guidePaypal";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (configuredShopMode() === "off")
    return NextResponse.json({ error: "PayPal nicht konfiguriert." }, { status: 503 });
  let event: {
    event_type?: string;
    resource?: { id?: string; supplementary_data?: { related_ids?: { capture_id?: string } } };
  };
  try { event = await request.json(); } catch {
    return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 });
  }
  try {
    if (!await verifyPayPalWebhook(request.headers, event))
      return NextResponse.json({ error: "Ungültige Signatur." }, { status: 403 });
    const revoke = event.event_type === "PAYMENT.CAPTURE.REFUNDED" ||
      event.event_type === "PAYMENT.CAPTURE.REVERSED" ||
      event.event_type === "CUSTOMER.DISPUTE.CREATED";
    const captureId = event.resource?.supplementary_data?.related_ids?.capture_id ??
      (event.event_type === "PAYMENT.CAPTURE.REVERSED" ? event.resource?.id : undefined);
    if (revoke && captureId && /^[A-Z0-9-]{6,64}$/i.test(captureId)) {
      const sql = await ensureGuideShopSchema();
      const status = event.event_type === "CUSTOMER.DISPUTE.CREATED" ? "disputed" : "refunded";
      await sql`UPDATE td_guide_orders SET status=${status}
        WHERE paypal_capture_id=${captureId} AND status='paid'`;
      await sql`UPDATE td_guide_guest_orders SET status=${status}
        WHERE paypal_capture_id=${captureId} AND status='paid'`;
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook-Verarbeitung fehlgeschlagen." }, { status: 500 });
  }
}
